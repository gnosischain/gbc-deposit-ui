import { Address } from "viem";
import { GetPublicClientReturnType } from "wagmi/actions";
import claimRegistryABI from "./abis/claimRegistry";
import depositABI from "./abis/deposit";

const BLOCK_RANGE_SIZE = 1000000;

export async function fetchRegister(claimRegistryAddress: Address, userAddress: Address, fromBlock: bigint, client: GetPublicClientReturnType) {
  if (!client) return [];
  const toBlock = await client.getBlockNumber();
  let startBlock = BigInt(fromBlock);
  const endBlock = BigInt(toBlock);

  let allEvents = [];

  while (startBlock <= endBlock) {
    const nextBlock = fromBlock + BigInt(BLOCK_RANGE_SIZE) > endBlock ? endBlock : startBlock + BigInt(BLOCK_RANGE_SIZE);

    console.log(`Fetching from block ${startBlock} to ${nextBlock}`);

    const events = await client.getContractEvents({
      abi: claimRegistryABI,
      address: claimRegistryAddress,
      eventName: "Register",
      args: {
        user: userAddress,
      },
      fromBlock: startBlock,
      toBlock: nextBlock,
    });

    allEvents.push(...events);
    startBlock = nextBlock + BigInt(1);
  }

  return allEvents;
}

export async function fetchUnregister(claimRegistryAddress: Address, userAddress: Address, fromBlock: bigint, client: GetPublicClientReturnType) {
  if (!client) return [];
  const toBlock = await client.getBlockNumber();
  let startBlock = BigInt(fromBlock);
  const endBlock = BigInt(toBlock);

  let allEvents = [];

  while (startBlock <= endBlock) {
    const nextBlock = fromBlock + BigInt(BLOCK_RANGE_SIZE) > endBlock ? endBlock : startBlock + BigInt(BLOCK_RANGE_SIZE);

    console.log(`Fetching from block ${startBlock} to ${nextBlock}`);

    const events = await client.getContractEvents({
      abi: claimRegistryABI,
      address: claimRegistryAddress,
      eventName: "Unregister",
      args: {
        user: userAddress,
      },
      fromBlock: startBlock,
      toBlock: nextBlock,
    });

    allEvents.push(...events);
    startBlock = nextBlock + BigInt(1);
  }

  return allEvents;
}

export async function fetchDeposit(depositAddress: Address, fromBlock: bigint, client: GetPublicClientReturnType) {
    if (!client) return [];
    const toBlock = await client.getBlockNumber();
    let startBlock = BigInt(fromBlock);
    const endBlock = BigInt(toBlock);
  
    let allEvents = [];
  
    while (startBlock <= endBlock) {
      const nextBlock = startBlock + BigInt(BLOCK_RANGE_SIZE) > endBlock ? endBlock : startBlock + BigInt(BLOCK_RANGE_SIZE);
  
      console.log(`Fetching from block ${fromBlock} to ${nextBlock}`);
  
      const events = await client.getContractEvents({
        abi: depositABI,
        address: depositAddress,
        eventName: "DepositEvent",
        fromBlock: startBlock,
        toBlock: nextBlock,
      });
  
      allEvents.push(...events);
      startBlock = nextBlock + BigInt(1);
    }
  
    return allEvents;
  }
