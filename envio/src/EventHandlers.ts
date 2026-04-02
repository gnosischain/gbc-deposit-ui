/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  onBlock,
  SBCDepositContract,
  SBCDepositContract_DepositEvent,
  Validator,
} from "generated";
import { HypersyncClient } from "@envio-dev/hypersync-client";

const CONSOLIDATION_ADDRESS = "0x0000BBdDc7CE488642fb579F8B00f3a590007251";

const hypersyncClients: Record<number, HypersyncClient> = {
  100: new HypersyncClient({ url: "https://100.hypersync.xyz", apiToken: process.env.ENVIO_HYPERSYNC_API_KEY! }),
  10200: new HypersyncClient({ url: "https://10200.hypersync.xyz", apiToken: process.env.ENVIO_HYPERSYNC_API_KEY! }),
};

SBCDepositContract.DepositEvent.handler(async ({ event, context }) => {
  const creds = event.params.withdrawal_credentials;
  const withdrawal_address = "0x" + creds.slice(-40);

  const entity: SBCDepositContract_DepositEvent = {
    chainId: event.chainId,
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pubkey: event.params.pubkey,
    withdrawal_credentials: creds,
    withdrawal_address,
    amount: event.params.amount,
    signature: event.params.signature,
    index: event.params.index,
  };

  context.SBCDepositContract_DepositEvent.set(entity);

  const validatorId = `${event.chainId}_${event.params.pubkey}`;
  const existingValidator = await context.Validator.get(validatorId);
  if (!existingValidator) {
    const validator: Validator = {
      id: validatorId,
      chainId: event.chainId,
      pubkey: event.params.pubkey,
      withdrawal_credentials: creds,
      withdrawal_address: withdrawal_address,
    };
    context.Validator.set(validator);
  }
});

async function handleConsolidationBlock(
  chainId: number,
  fromBlock: number,
  toBlock: number,
  context: any
) {
  const res = await hypersyncClients[chainId].get({
    fromBlock,
    toBlock,
    logs: [{ address: [CONSOLIDATION_ADDRESS] }],
    fieldSelection: {
      log: ["BlockNumber", "TransactionHash", "LogIndex", "Data"],
    },
  });

  if (!res.data?.logs || res.data.logs.length === 0) return;

  for (const log of res.data.logs) {
    const decoded = decodeConsolidationLog(log.data ?? "");
    if (!decoded) continue;

    const targetValidatorId = `${chainId}_${decoded.targetPubkey}`;
    const existingTarget = await context.Validator.get(targetValidatorId);
    if (!existingTarget) {
      const withdrawal_address = decoded.sender.toLowerCase();
      const withdrawal_credentials =
        "0x020000000000000000000000" + withdrawal_address.slice(2);
      context.Validator.set({
        id: targetValidatorId,
        chainId,
        pubkey: decoded.targetPubkey,
        withdrawal_address,
        withdrawal_credentials,
      });
    }
  }
}

onBlock(
  { name: "ConsolidationHistorical_100", chain: 100, startBlock: 38530039, endBlock: 45467382, interval: 100 },
  async ({ block, context }) => handleConsolidationBlock(100, block.number, block.number + 100, context)
);
onBlock(
  { name: "ConsolidationRealtime_100", chain: 100, startBlock: 45467382 },
  async ({ block, context }) => handleConsolidationBlock(100, block.number, block.number + 1, context)
);

onBlock(
  { name: "ConsolidationHistorical_10200", chain: 10200, startBlock: 14481034, endBlock: 20555744, interval: 100 },
  async ({ block, context }) => handleConsolidationBlock(10200, block.number, block.number + 100, context)
);
onBlock(
  { name: "ConsolidationRealtime_10200", chain: 10200, startBlock: 20555744 },
  async ({ block, context }) => handleConsolidationBlock(10200, block.number, block.number + 1, context)
);

function decodeConsolidationLog(rawData: string) {
  const hex = rawData.startsWith("0x") ? rawData.slice(2) : rawData;

  if (hex.length < 232) {
    return null;
  }

  return {
    sender: "0x" + hex.slice(0, 40),
    sourcePubkey: "0x" + hex.slice(40, 136),
    targetPubkey: "0x" + hex.slice(136, 232),
  };
}
