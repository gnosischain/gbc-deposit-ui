import { useCallback, useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import CONTRACTS from "@/utils/contracts";
import ERC677ABI from "@/utils/abis/erc677";
import { formatUnits, parseUnits } from "viem";
import { loadCachedDeposits } from "@/utils/deposit";
import { getPublicClient } from "wagmi/actions";
import { config } from "@/wagmi";
import { fetchDeposit } from "@/utils/fetchEvents";

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

function useDeposit() {
  const [deposits, setDeposits] = useState<DepositDataJson[]>([]);
  const [hasDuplicates, setHasDuplicates] = useState(false);
  const [isBatch, setIsBatch] = useState(false);
  const [filename, setFilename] = useState("");
  const account = useAccount();

  const chainId = account?.chainId || 100;
  const contractConfig = CONTRACTS[chainId];
  const client = getPublicClient(config, { chainId: chainId as 100 | 10200 });
  const { data: balance } = useReadContract({
    abi: ERC677ABI,
    address: contractConfig?.addresses.token,
    functionName: "balanceOf",
    args: [account.address || "0x0"],
  });
  const { data: hash, writeContract } = useWriteContract();
  const { isSuccess: depositSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  console.log(balance);

  if (!contractConfig) {
    throw Error(`No contract configuration found for chain ID ${chainId}`);
  }

  const validate = useCallback(
    async (deposits: DepositDataJson[], balance: bigint) => {
      const checkJsonStructure = (depositDataJson: DepositDataJson) => {
        return depositDataJson.pubkey && depositDataJson.withdrawal_credentials && depositDataJson.amount && depositDataJson.signature && depositDataJson.deposit_message_root && depositDataJson.deposit_data_root && depositDataJson.fork_version;
      };

      if (!deposits.every) {
        throw Error("Oops, something went wrong while parsing your json file. Please check the file and try again.");
      }

      if (deposits.length === 0 || !deposits.every((d) => checkJsonStructure(d))) {
        throw Error("This is not a valid file. Please try again.");
      }

      if (!deposits.every((d) => d.fork_version === contractConfig.forkVersion)) {
        throw Error("This JSON file isn't for the right network (" + deposits[0].fork_version + "). Upload a file generated for you current network: " + account.chainId);
      }

      const { deposits: existingDeposits, lastBlock: fromBlock } = await loadCachedDeposits(chainId, contractConfig.depositStartBlockNumber);

      const events = await fetchDeposit(contractConfig.addresses.deposit, fromBlock, client);

      let pks = events.map((e) => e.topics[1]);
      pks = pks.concat(existingDeposits);
      console.log(`Found ${pks.length} existing deposits`);
      const newDeposits = [];
      for (const deposit of deposits) {
        if (!pks.some((pk) => pk === "0x" + deposit.pubkey)) {
          newDeposits.push(deposit);
        }
      }
      const hasDuplicates = newDeposits.length !== deposits.length;

      if (newDeposits.length === 0) {
        throw Error("Deposits have already been made to all validators in this file.");
      }

      const wc = newDeposits[0].withdrawal_credentials;

      // batch processing necessary for both single deposit and batch deposit for same withdrawal_credentials
      const isBatch = newDeposits.every((d) => d.withdrawal_credentials === wc);

      if (isBatch && newDeposits.length > 128) {
        throw Error("Number of validators exceeds the maximum batch size of 128. Please upload a file with 128 or fewer validators.");
      }

      if (!newDeposits.every((d) => BigInt(d.amount) === BigInt(32000000000))) {
        throw Error("Amount should be exactly 32 tokens for deposits.");
      }

      const pubKeys = newDeposits.map((d) => d.pubkey);
      if (pubKeys.some((pubkey, index) => pubKeys.indexOf(pubkey) !== index)) {
        throw Error("Duplicated public keys.");
      }

      const totalDepositAmountBN = depositAmountBN * BigInt(newDeposits.length);

      console.log(balance, contractConfig.addresses.token, account.address, account.chainId);
      if (balance === undefined) {
        throw Error("Balance not loaded.");
      }

      if (balance < totalDepositAmountBN) {
        throw Error(`
        Unsufficient balance. ${Number(formatUnits(totalDepositAmountBN, 18))} GNO is required.
      `);
      }

      return { deposits: newDeposits, hasDuplicates, isBatch };
    },
    [account, contractConfig, balance]
  );

  const setDepositData = useCallback(
    async (fileData: string, filename: string) => {
      setFilename(filename);
      if (fileData) {
        let data: DepositDataJson[] = [];
        try {
          data = JSON.parse(fileData);
        } catch (error) {
          throw Error("Oops, something went wrong while parsing your json file. Please check the file and try again.");
        }
        if (balance) {
          const { deposits, hasDuplicates, isBatch } = await validate(data, balance);
        }
        setDeposits(deposits);
        setHasDuplicates(hasDuplicates);
        setIsBatch(isBatch);
      } else {
        setDeposits([]);
        setHasDuplicates(false);
        setIsBatch(false);
      }
    },
    [validate, balance]
  );

  const deposit = useCallback(async () => {
    if (isBatch) {
      try {
        const totalDepositAmountBN = depositAmountBN * BigInt(deposits.length);
        console.log(`Sending deposit transaction for ${deposits.length} deposits`);
        let data = "";
        data += deposits[0].withdrawal_credentials;
        deposits.forEach((deposit) => {
          data += deposit.pubkey;
          data += deposit.signature;
          data += deposit.deposit_data_root;
        });
        writeContract({ address: contractConfig.addresses.token, abi: ERC677ABI, functionName: "transferAndCall", args: [contractConfig.addresses.deposit, totalDepositAmountBN, `0x${data}`] });
      } catch (err) {
        console.log(err);
      }
    } else {
      //too much complexity by handling multiple withdrawal credential in one batch?
      console.log("sending deposit transaction");
      await Promise.all(
        deposits.map(async (deposit) => {
          let data = "0x";
          data += deposit.withdrawal_credentials;
          data += deposit.pubkey;
          data += deposit.signature;
          data += deposit.deposit_data_root;

          try {
            writeContract({ address: contractConfig.addresses.token, abi: ERC677ABI, functionName: "transferAndCall", args: [contractConfig.addresses.deposit, depositAmountBN, `0x${data}`] });
          } catch (error) {
            console.log(error);
          }
        })
      );
    }
  }, [account, deposits, isBatch]);

  return { deposit, depositSuccess, depositData: { deposits, filename, hasDuplicates, isBatch }, setDepositData, balance };
}

export default useDeposit;