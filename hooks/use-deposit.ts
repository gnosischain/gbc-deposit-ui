import { useCallback, useState, useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { ContractNetwork } from "@/utils/contracts";
import ERC677ABI from "@/utils/abis/erc677";
import { formatUnits, parseUnits } from "viem";
import { loadCachedDeposits } from "@/utils/deposit";
import { getPublicClient } from "wagmi/actions";
import { config } from "@/wagmi";
import { fetchDeposit } from "@/utils/fetchEvents";
import useBalance from "./use-balance";
import { DEPOSIT_TOKEN_AMOUNT_OLD, MAX_BATCH_DEPOSIT } from "@/utils/constants";

const depositAmountBN = parseUnits("1", 18);

type DepositDataJson = {
  pubkey: string;
  withdrawal_credentials: string;
  amount: bigint;
  signature: string;
  deposit_message_root: string;
  deposit_data_root: string;
  fork_version: string;
};

function useDeposit(contractConfig: ContractNetwork | undefined, address: `0x${string}` | undefined, chainId: number) {
  const [deposits, setDeposits] = useState<DepositDataJson[]>([]);
  const [hasDuplicates, setHasDuplicates] = useState(false);
  const [isBatch, setIsBatch] = useState(false);
  const [filename, setFilename] = useState("");
  const { balance, refetchBalance } = useBalance(contractConfig, address);
  const client = getPublicClient(config, {
    chainId: chainId as 100 | 10200 | 31337,
  });
  const isWrongNetwork = contractConfig === undefined;
  const { data: depositHash, writeContract } = useWriteContract();
  const { isSuccess: depositSuccess } = useWaitForTransactionReceipt({
    hash: depositHash,
  });

  const validate = useCallback(
    async (deposits: DepositDataJson[], balance: bigint) => {
      let newDeposits = [];
      let hasDuplicates = false;
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

        const { deposits: existingDeposits, lastBlock: fromBlock } =
          await loadCachedDeposits(
            chainId === 31337 ? 10200 : chainId,
            contractConfig.depositStartBlockNumber
          );

        const events = await fetchDeposit(
          contractConfig.addresses.deposit,
          fromBlock,
          client
        );

        let pks = events.map((e) => e.args.pubkey);
        pks = pks.concat(existingDeposits);
        console.log(pks);
        console.log(`Found ${pks.length} existing deposits`);

        for (const deposit of deposits) {
          if (!pks.includes(`0x${deposit.pubkey}`)) {
            console.log("new deposit", deposit.pubkey);
            newDeposits.push(deposit);
          }
        }
        hasDuplicates = newDeposits.length !== deposits.length;

        if (newDeposits.length === 0) {
          throw Error(
            "Deposits have already been made to all validators in this file."
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
      }

      return { deposits: newDeposits, hasDuplicates, _isBatch };
    },
    [address, contractConfig, balance]
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
        const { deposits, hasDuplicates, _isBatch } = await validate(
          data,
          balance || BigInt(0)
        );
        console.log(_isBatch);
        setDeposits(deposits);
        setHasDuplicates(hasDuplicates);
        setIsBatch(_isBatch);
      } else {
        setDeposits([]);
        setHasDuplicates(false);
        setIsBatch(false);
      }
    },
    [validate, balance]
  );

  const deposit = useCallback(async () => {
    if (contractConfig) {
      if (isBatch) {
        try {
          const totalDepositAmountBN =
            depositAmountBN * BigInt(deposits.length);
          console.log(
            `Sending deposit transaction for ${deposits.length} deposits`
          );
          let data = "";
          data += deposits[0].withdrawal_credentials;
          deposits.forEach((deposit) => {
            data += deposit.pubkey;
            data += deposit.signature;
            data += deposit.deposit_data_root;
          });
          writeContract({
            address: contractConfig.addresses.token,
            abi: ERC677ABI,
            functionName: "transferAndCall",
            args: [
              contractConfig.addresses.deposit,
              totalDepositAmountBN,
              `0x${data}`,
            ],
          });
          refetchBalance();
        } catch (err) {
          console.log(err);
        }
      } else {
        console.log("sending deposit transaction");
        await Promise.all(
          deposits.map(async (deposit) => {
            let data = "";
            data += deposit.withdrawal_credentials;
            data += deposit.pubkey;
            data += deposit.signature;
            data += deposit.deposit_data_root;

            try {
              writeContract({
                address: contractConfig.addresses.token,
                abi: ERC677ABI,
                functionName: "transferAndCall",
                args: [
                  contractConfig.addresses.deposit,
                  depositAmountBN,
                  `0x${data}`,
                ],
              });
              refetchBalance();
            } catch (error) {
              console.log(error);
            }
          })
        );
      }
    }
  }, [address, deposits, isBatch, refetchBalance]);

  useEffect(() => {
    if (depositSuccess) {
      refetchBalance();
    }
  }, [depositSuccess, refetchBalance]);

  return {
    deposit,
    depositSuccess,
    depositHash,
    depositData: { deposits, filename, hasDuplicates, isBatch },
    setDepositData,
    isWrongNetwork,
  };
}

export default useDeposit;
