import { useCallback, useState } from "react";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { ContractNetwork } from "@/utils/contracts";
import dappnodeIncentiveABI from "@/utils/abis/dappnodeIncentive";
import { DEPOSIT_TOKEN_AMOUNT_OLD, MAX_BATCH_DEPOSIT } from "@/utils/constants";
import { GET_DEPOSIT_EVENTS } from "@/utils/deposit";
import { DepositDataJson } from "@/types/deposit";
import { useClient } from "urql";

export type DappnodeUser = [
  safe: string,
  status: number,
  expectedDepositCount: number, // uint16
  totalStakeAmount: bigint // uint256
];

function useDappnodeDeposit(contractConfig: ContractNetwork, address: `0x${string}`, chainId: number) {
  const [deposits, setDeposits] = useState<DepositDataJson[]>([]);
  const [isBatch, setIsBatch] = useState(false);
  const [filename, setFilename] = useState("");
  
  const client = useClient();

  const { data: user }: { data: DappnodeUser | undefined } = useReadContract({
    abi: dappnodeIncentiveABI,
    address: contractConfig?.addresses.dappnodeIncentive,
    functionName: "users",
    args: [address],
  });

  const { data: depositHash, writeContractAsync, isPending, isError } = useWriteContract();
  const { isSuccess: depositSuccess } = useWaitForTransactionReceipt({
    hash: depositHash,
  });

  const dappnodeValidate = useCallback(
    async (deposits: DepositDataJson[]) => {
      let newDeposits = [];
      let _isBatch = false;
      if (contractConfig && user) {
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

        if (!deposits.every) {
          throw Error(
            "Oops, something went wrong while parsing your json file. Please check the file and try again."
          );
        }

        if (
          deposits.length === 0 ||
          !deposits.every((d) => checkJsonStructure(d))
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
                
        if (!deposits.every((d) => `0x`+d.withdrawal_credentials.substring(24).toLocaleLowerCase() === user[0].toLowerCase())) {
          throw Error(
            "Atleast one of the provided keys does not match your safe address as withdrawal credentials."
          );
        }
        if (deposits.length !== user[2]) {
          throw Error(
            `Wrong number of keys. Expected claiming (${user[2]}) validator deposits to your safe.`
          );
        }

        const pksFromFile = deposits.map((d) => `0x${d.pubkey}`);
        const { data } = await client.query(GET_DEPOSIT_EVENTS, {
          pubkeys: pksFromFile,
          chainId: chainId,
        });
        
        const existingDeposits = data.SBCDepositContract_DepositEvent.map((d: { pubkey: string }) => d.pubkey);

        for (const deposit of deposits) {
          if (!existingDeposits.includes(`0x${deposit.pubkey}`)) {
            console.log('new deposit', deposit.pubkey);
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

        const wc = newDeposits[0].withdrawal_credentials;

        // batch processing necessary for both single deposit and batch deposit for same withdrawal_credentials
        _isBatch = newDeposits.every((d) => d.withdrawal_credentials === wc);

        // check if withdrawal credential start with 0x00
        _isBatch = !wc.startsWith("00");

        if (_isBatch && newDeposits.length > MAX_BATCH_DEPOSIT) {
          throw Error(
            "Number of validators exceeds the maximum batch size of 128. Please upload a file with 128 or fewer validators."
          );
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
      }

      return { deposits: newDeposits, _isBatch };
    },
    [client, chainId, contractConfig, user]
  );

  const setDappnodeDepositData = useCallback(
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
        const { deposits, _isBatch } = await dappnodeValidate(
          data
        );
        setDeposits(deposits);
        setIsBatch(_isBatch);
      } else {
        setDeposits([]);
        setIsBatch(false);
      }
    },
    [dappnodeValidate]
  );

  const dappnodeDeposit = useCallback(async () => {
    if (contractConfig) {
      try {
        let data:{
            pubkeys: string
            signatures: string
            deposit_data_roots: string[]
        } = {pubkeys:'',signatures:'',deposit_data_roots:[]};

        deposits.forEach((deposit, i) => {
          if (i === 0) {
            data.pubkeys += deposit.pubkey.startsWith('0x') ? deposit.pubkey : `0x${deposit.pubkey}`;
            data.signatures += deposit.signature.startsWith('0x') ? deposit.signature : `0x${deposit.signature}`;
          } else {
            data.pubkeys += deposit.pubkey.startsWith('0x') ? deposit.pubkey.slice(2) : deposit.pubkey;
            data.signatures += deposit.signature.startsWith('0x') ? deposit.signature.slice(2) : deposit.signature;
          }
          
          data.deposit_data_roots.push(deposit.deposit_data_root.startsWith('0x') ? deposit.deposit_data_root : `0x${deposit.deposit_data_root}`);
        });

        contractConfig.addresses.dappnodeIncentive &&
        await  writeContractAsync({
            abi: dappnodeIncentiveABI,
            address: contractConfig.addresses.dappnodeIncentive,
            functionName: "submitPendingDeposits",
            args: [data.pubkeys, data.signatures, data.deposit_data_roots],
          });
      } catch (err) {
        console.error(err);
      }
    }
  }, [contractConfig, deposits, writeContractAsync]);

  return {
    depositSuccess,
    depositHash,
    depositData: { deposits, filename, isBatch },
    user,
    setDappnodeDepositData,
    dappnodeDeposit,
    claimStatusPending: isPending,
    claimStatusError: isError,
  };
}

export default useDappnodeDeposit;
