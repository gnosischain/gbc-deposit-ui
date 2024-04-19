import { useCallback, useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import CONTRACTS from "@/utils/contracts";
import claimRegistryABI from "@/utils/abis/claimRegistry";
import { Address } from "viem";
import { GetPublicClientReturnType, getPublicClient } from "wagmi/actions";
import { config } from "@/wagmi";

const BLOCK_RANGE_SIZE = 50000;

function useAutoclaim() {
  const account = useAccount();
  const [isRegister, setIsRegister] = useState(false);
  const chainId = account?.chainId || 100;
  const contractConfig = CONTRACTS[chainId];
  const client = getPublicClient(config, { chainId: chainId as 100 | 10200 });
  const { data: hash, isPending, writeContract } = useWriteContract();

  if (!contractConfig) {
    throw Error(`No contract configuration found for chain ID ${chainId}`);
  }

  useEffect(() => {
    async function fetchEvents() {
      if (contractConfig && account.address && account.address !== "0x0") {
        const registerEvents = await fetchRegister(contractConfig.addresses.claimRegistry, account.address, contractConfig.claimRegistryStartBlockNumber, client);
        const unregisterEvents = await fetchUnregister(contractConfig.addresses.claimRegistry, account.address, contractConfig.claimRegistryStartBlockNumber, client);

        if (registerEvents.length == 0 && unregisterEvents.length == 0) {
          setIsRegister(false);
        } else if (registerEvents && unregisterEvents.length == 0) {
          setIsRegister(true);
        } else {
          const lastRegisterEvent = registerEvents[registerEvents.length - 1].blockNumber;
          const lastUnregisterEvent = unregisterEvents[unregisterEvents.length - 1].blockNumber;

          if (lastRegisterEvent > lastUnregisterEvent) {
            setIsRegister(true);
          } else {
            setIsRegister(false);
          }
        }
      }
    }

    fetchEvents();
  }, [account.address, contractConfig]);

  const register = useCallback(
    async (days: number, amount: number) => {
      const timeStamp = BigInt(days * 86400000);
      writeContract({ address: contractConfig.addresses.claimRegistry, abi: claimRegistryABI, functionName: "register", args: [account.address || "0x0", timeStamp, BigInt(amount)] });
    },
    [account]
  );

  const updateConfig = useCallback(
    async (days: number, amount: number) => {
      const timeStamp = BigInt(days * 86400000);
      writeContract({ address: contractConfig.addresses.claimRegistry, abi: claimRegistryABI, functionName: "updateConfig", args: [account.address || "0x0", timeStamp, BigInt(amount)] });
    },
    [account]
  );

  const unregister = useCallback(async () => {
    writeContract({ address: contractConfig.addresses.claimRegistry, abi: claimRegistryABI, functionName: "unregister", args: [account.address || "0x0"] });
  }, [account]);

  return { register, updateConfig, unregister, isRegister };
}

async function fetchRegister(claimRegistryAddress: Address, userAddress: Address, fromBlock: bigint, client: GetPublicClientReturnType) {
  if (!client) return [];
  const toBlock = await client.getBlockNumber();

  let allEvents = [];

  while (fromBlock <= toBlock) {
    const nextBlock = fromBlock + BigInt(BLOCK_RANGE_SIZE) > toBlock ? toBlock : fromBlock + BigInt(BLOCK_RANGE_SIZE);

    console.log(`Fetching from block ${fromBlock} to ${nextBlock}`);

    const events = await client.getContractEvents({
      abi: claimRegistryABI,
      address: claimRegistryAddress,
      eventName: "Register",
      args: {
        user: userAddress,
      },
      fromBlock: fromBlock,
      toBlock: nextBlock,
    });

    allEvents.push(...events);
    fromBlock = nextBlock + BigInt(1);
  }

  return allEvents;
}

async function fetchUnregister(claimRegistryAddress: Address, userAddress: Address, fromBlock: bigint, client: GetPublicClientReturnType) {
  if (!client) return [];
  const toBlock = await client.getBlockNumber();

  let currentBlock = BigInt(fromBlock);
  let allEvents = [];

  while (currentBlock <= toBlock) {
    const nextBlock = currentBlock + BigInt(BLOCK_RANGE_SIZE) > toBlock ? toBlock : currentBlock + BigInt(BLOCK_RANGE_SIZE);

    console.log(`Fetching from block ${currentBlock} to ${nextBlock}`);

    const events = await client.getContractEvents({
      abi: claimRegistryABI,
      address: claimRegistryAddress,
      eventName: "Unregister",
      args: {
        user: userAddress,
      },
      fromBlock: currentBlock,
      toBlock: nextBlock,
    });

    allEvents.push(...events);
    currentBlock = nextBlock + BigInt(1);
  }

  return allEvents;
}

export default useAutoclaim;
