import path from "path";
import { readFile, writeFile, mkdir } from "fs/promises";

// Network config and ABI
import CONTRACTS from "../utils/contracts.ts";
import depositABI from "../utils/abis/deposit.ts";
import { getPublicClient } from "wagmi/actions";
import { config } from "../wagmi.ts";
import { Address } from "viem";

// Config
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const BLOCK_RANGE_SIZE = 5000;
const client = getPublicClient(config);

async function fetchAllEvents(depositAddress: Address, fromBlock: bigint, toBlock: bigint) {

  let currentBlock = BigInt(fromBlock);
  const endBlock = BigInt(toBlock);
  let allEvents = [];

  while (currentBlock <= endBlock) {
    const nextBlock = currentBlock + BigInt(BLOCK_RANGE_SIZE) > endBlock ? endBlock : currentBlock + BigInt(BLOCK_RANGE_SIZE);

    console.log(`Fetching from block ${currentBlock} to ${nextBlock}`);

    const events = await client.getContractEvents({
      abi: depositABI,
      address: depositAddress,
      eventName: "DepositEvent",
      fromBlock: currentBlock,
      toBlock: nextBlock,
    });

    allEvents.push(...events);
    currentBlock = nextBlock + BigInt(1);
  }

  return allEvents;
}

async function readCurrentDeposits(filePath: string) {
  try {
    const content = await readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (err: any) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }

  return {};
}

async function updateNetwork(networkId: number) {
  const network = CONTRACTS[networkId];
  if (!network) {
    throw new Error(`Network with ID ${networkId} does not exist`);
  }

  const filePath = path.resolve(__dirname, `../data/${networkId}/deposits.json`);

  let { lastBlock = network.depositStartBlockNumber, deposits = [] } = await readCurrentDeposits(filePath);

  console.log("Fetching existing deposits");
  const fromBlock = lastBlock;
  const toBlock = await client.getBlockNumber();
  const events = await fetchAllEvents(CONTRACTS[networkId]!.addresses.deposit, fromBlock, toBlock);
  let pks = events.map((e) => e.topics[1]);

  deposits = deposits.concat(pks);
  lastBlock = toBlock;

  // Write the new deposits to file
  const newContent = JSON.stringify({ lastBlock, deposits });
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, newContent, "utf8");

  console.log(`Added ${pks.length} new cached pubkeys, new total is ${deposits.length}.`);
}

async function main() {
  for (const networkId of Object.keys(CONTRACTS)) {
    await updateNetwork(Number(networkId));
  }
}

main();
