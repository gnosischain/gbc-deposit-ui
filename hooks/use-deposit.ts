import { useCallback, useState, useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { ContractNetwork } from "@/utils/contracts";
import ERC677ABI from "@/utils/abis/erc677";
import { formatUnits, parseUnits } from "viem";
import useBalance from "./use-balance";
import { useApolloClient } from '@apollo/client';
import { CredentialType, DEPOSIT_TOKEN_AMOUNT_OLD, getCredentialType, MAX_BATCH_DEPOSIT } from "@/utils/constants";
import { DepositDataJson, generateDepositData, GET_DEPOSIT_EVENTS } from "@/utils/deposit";

const depositAmountBN = parseUnits("1", 18);

function useDeposit(contractConfig: ContractNetwork | undefined, address: `0x${string}` | undefined, chainId: number) {
  const [deposits, setDeposits] = useState<DepositDataJson[]>([]);
  const [credentialType, setCredentialType] = useState<CredentialType>();
  const [filename, setFilename] = useState("");
  const [totalDepositAmountBN, setTotalDepositAmountBN] = useState(BigInt(0));
  const { balance, refetchBalance } = useBalance(contractConfig, address);
  const { data: depositHash, error, writeContract } = useWriteContract();
  const { isSuccess: depositSuccess } = useWaitForTransactionReceipt({
    hash: depositHash,
  });

  const apolloClient = useApolloClient();

  const validate = useCallback(
    async (deposits: DepositDataJson[], balance: bigint) => {
      let _credentialType: CredentialType | undefined;

      if (!contractConfig) throw Error("Invalid network configuration.");

      const isValidJson = deposits.every((d) =>
        ["pubkey", "withdrawal_credentials", "amount", "signature", "deposit_message_root", "deposit_data_root", "fork_version"].every((key) => key in d)
      );
      if (!isValidJson) throw Error("Invalid JSON structure.");

      if (!deposits.every((d) => d.fork_version === contractConfig.forkVersion)) {
        throw Error(`File is for the wrong network. Expected: ${chainId}`);
      }

      const pubkeys = deposits.map((d) => `0x${d.pubkey}`);
      const { data } = await apolloClient.query({
        query: GET_DEPOSIT_EVENTS,
        variables: {
          pubkeys: pubkeys,
          chainId: chainId,
        },
      });

      const existingDeposits = new Set(
        data.SBCDepositContract_DepositEvent.map((d: { pubkey: string }) => d.pubkey)
      );

      const validDeposits = deposits.filter((d) => !existingDeposits.has(d.pubkey));

      if (validDeposits.length === 0) throw Error("Deposits have already been made to all validators in this file.");

      if (validDeposits.length !== deposits.length) {
        throw Error(
          "Some of the deposits have already been made to the validators in this file."
        );
      }

      const uniquePubkeys = new Set(validDeposits.map((d) => d.pubkey));
      if (uniquePubkeys.size !== validDeposits.length) {
        throw Error("Duplicated public keys detected in the deposit file.");
      }

      _credentialType = getCredentialType(deposits[0].withdrawal_credentials);
      if (!_credentialType) {
        console.log(deposits[0].withdrawal_credentials);
        throw Error("Invalid withdrawal credential type.");
      }

      if (!validDeposits.every((d) => d.withdrawal_credentials.startsWith(_credentialType))) {
        throw Error(`All validators in the file must have the same withdrawal credentials of type ${_credentialType}`);
      }

      if (validDeposits.length > MAX_BATCH_DEPOSIT) {
        throw Error("Number of validators exceeds the maximum batch size of 128. Please upload a file with 128 or fewer validators.");
      }

      if ((_credentialType === "00" || _credentialType === "01") && !validDeposits.every((d) => BigInt(d.amount) === BigInt(DEPOSIT_TOKEN_AMOUNT_OLD))) {
        throw Error("Amount should be exactly 32 tokens for deposits.");
      }

      const _totalDepositAmountBN = validDeposits.reduce((sum, d) => sum + BigInt(d.amount), BigInt(0)) / BigInt(DEPOSIT_TOKEN_AMOUNT_OLD);

      if (balance < _totalDepositAmountBN) {
        throw Error(`Unsufficient balance. ${Number(formatUnits(_totalDepositAmountBN, 18))} GNO is required.
      `);
      }

      return { deposits: validDeposits, _credentialType, _totalDepositAmountBN };
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
        if (balance === undefined) {
          throw Error("Balance not loaded correctly.");
        }
        const { deposits, _credentialType, _totalDepositAmountBN } = await validate(
          data,
          balance
        );
        setDeposits(deposits);
        setCredentialType(_credentialType);
        setTotalDepositAmountBN(_totalDepositAmountBN);
      }
    },
    [validate, balance]
  );

  const deposit = useCallback(async () => {
    if (contractConfig) {
      const data = generateDepositData(deposits, credentialType === "01");
      //TODO: add back promise all in case of 0x00
      writeContract({
        address: contractConfig.addresses.token,
        abi: ERC677ABI,
        functionName: "transferAndCall",
        args: [
          contractConfig.addresses.deposit,
          credentialType === '02' || credentialType === "01" ? totalDepositAmountBN : depositAmountBN,
          `0x${data}`,
        ],
      });

      refetchBalance();
    }
  }, [contractConfig, credentialType, deposits, refetchBalance, totalDepositAmountBN, writeContract]);

  useEffect(() => {
    if (depositSuccess) {
      refetchBalance();
    }
  }, [depositSuccess, refetchBalance]);

  return {
    deposit,
    depositSuccess,
    depositHash,
    depositData: { deposits, filename, credentialType, totalDepositAmountBN },
    setDepositData,
  };
}

export default useDeposit;
