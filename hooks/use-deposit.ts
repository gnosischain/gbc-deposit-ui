import { useCallback, useState, useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { ContractNetwork } from "@/utils/contracts";
import ERC677ABI from "@/utils/abis/erc677";
import { formatUnits, parseUnits } from "viem";
import useBalance from "./use-balance";
import { gql, useApolloClient } from '@apollo/client';
import { DEPOSIT_TOKEN_AMOUNT_OLD, getCredentialType, MAX_BATCH_DEPOSIT } from "@/utils/constants";
import { DepositDataJson, generateDepositData } from "@/utils/deposit";

const depositAmountBN = parseUnits("1", 18);

const GET_DEPOSIT_EVENTS = gql`
  query MyQuery($pubkeys: [String!], $chainId: Int!) {
    SBCDepositContract_DepositEvent(
      where: { 
        pubkey: { 
          _in: $pubkeys
        },
        chainId: {_eq: $chainId}
      }
    ) {
      id
      amount
      db_write_timestamp
      index
      withdrawal_credentials
      pubkey
    }
  }
`;


function useDeposit(contractConfig: ContractNetwork | undefined, address: `0x${string}` | undefined, chainId: number) {
  const [deposits, setDeposits] = useState<DepositDataJson[]>([]);
  const [isBatch, setIsBatch] = useState(false);
  const [filename, setFilename] = useState("");
  const { balance, refetchBalance } = useBalance(contractConfig, address);
  const isWrongNetwork = contractConfig === undefined;
  const { data: depositHash, error, writeContract } = useWriteContract();
  const { isSuccess: depositSuccess } = useWaitForTransactionReceipt({
    hash: depositHash,
  });

  const apolloClient = useApolloClient();

  const validate = useCallback(
    async (deposits: DepositDataJson[], balance: bigint) => {
      let newDeposits = [];
      let _isBatch = false;
      if (contractConfig) {
        const checkJsonStructure = (depositDataJson: DepositDataJson) => {
          return (
            depositDataJson.pubkey &&
            depositDataJson.withdrawal_credentials &&
            depositDataJson.amount &&
            depositDataJson.signature &&
            depositDataJson.deposit_message_root &&
            depositDataJson.deposit_data_root &&
            depositDataJson.fork_version
          );
        };

        if (
          deposits.length === 0 ||
          !deposits.every(checkJsonStructure)
        ) {
          throw Error("This is not a valid file. Please try again.");
        }

        if (
          !deposits.every((d) => d.fork_version === contractConfig.forkVersion)
        ) {
          throw Error(
            "This JSON file isn't for the right network (" +
            deposits[0].fork_version +
            "). Upload a file generated for you current network: " +
            chainId
          );
        }

        const pksFromFile = deposits.map((d) => `0x${d.pubkey}`);
        const { data } = await apolloClient.query({
          query: GET_DEPOSIT_EVENTS,
          variables: {
            pubkeys: pksFromFile,
            chainId: chainId,
          },
        });

        const existingDeposits = data.SBCDepositContract_DepositEvent.map((d: { pubkey: string }) => d.pubkey);

        for (const deposit of deposits) {
          if (!existingDeposits.includes(`0x${deposit.pubkey}`)) {
            newDeposits.push(deposit);
          }
        }

        if (newDeposits.length === 0) {
          throw Error(
            "Deposits have already been made to all validators in this file."
          );
        }

        if(newDeposits.length !== deposits.length){
          throw Error(
            "Some of the deposits have already been made to the validators in this file."
          );
        }

        const credentialType = getCredentialType(deposits[0].withdrawal_credentials);
        if (!credentialType) {
          throw Error("Invalid withdrawal credential type.");
        }

        if (credentialType === "0x01") {
          // batch processing necessary for both single deposit and batch deposit for same withdrawal_credentials
          _isBatch = newDeposits.every((d) => d.withdrawal_credentials === credentialType);
          if (_isBatch && newDeposits.length > MAX_BATCH_DEPOSIT) {
            throw Error(
              "Number of validators exceeds the maximum batch size of 128. Please upload a file with 128 or fewer validators."
            );
          }
        }

        if (
          !newDeposits.every((d) => BigInt(d.amount) === BigInt(DEPOSIT_TOKEN_AMOUNT_OLD))
        ) {
          throw Error("Amount should be exactly 32 tokens for deposits.");
        }

        const pubKeys = newDeposits.map((d) => d.pubkey);
        if (
          pubKeys.some((pubkey, index) => pubKeys.indexOf(pubkey) !== index)
        ) {
          throw Error("Duplicated public keys.");
        }

        const totalDepositAmountBN =
          depositAmountBN * BigInt(newDeposits.length);

        if (balance === undefined) {
          throw Error("Balance not loaded.");
        }

        if (balance < totalDepositAmountBN) {
          throw Error(`
        Unsufficient balance. ${Number(
            formatUnits(totalDepositAmountBN, 18)
          )} GNO is required.
      `);
        }
      } else {
        throw Error("Wrong network");
      }

      return { deposits: newDeposits, _isBatch };
    },
    [contractConfig, apolloClient, chainId]
  );

  const setDepositData = useCallback(
    async (fileData: string, filename: string) => {
      setFilename(filename);
      if (fileData) {
        let data: DepositDataJson[] = [];
        try {
          data = JSON.parse(fileData);
        } catch (error) {
          throw Error(
            "Oops, something went wrong while parsing your json file. Please check the file and try again."
          );
        }
        const { deposits, _isBatch } = await validate(
          data,
          balance || BigInt(0)
        );
        console.log(_isBatch);
        setDeposits(deposits);
        setIsBatch(_isBatch);
      } else {
        setDeposits([]);
        setIsBatch(false);
      }
    },
    [validate, balance]
  );

  const deposit = useCallback(async () => {
    if (contractConfig) {
      const data = generateDepositData(deposits, isBatch);
      writeContract({
        address: contractConfig.addresses.token,
        abi: ERC677ABI,
        functionName: "transferAndCall",
        args: [
          contractConfig.addresses.deposit,
          isBatch ? depositAmountBN * BigInt(deposits.length) : depositAmountBN,
          `0x${data}`,
        ],
      });

      refetchBalance();
    }
  }, [contractConfig, deposits, isBatch, refetchBalance, writeContract]);

  useEffect(() => {
    if (depositSuccess) {
      refetchBalance();
    }
  }, [depositSuccess, refetchBalance]);

  return {
    deposit,
    depositSuccess,
    depositHash,
    depositData: { deposits, filename, isBatch },
    setDepositData,
    isWrongNetwork,
  };
}

export default useDeposit;
