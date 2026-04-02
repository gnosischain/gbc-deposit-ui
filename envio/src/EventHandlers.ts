/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  onBlock,
  SBCDepositContract,
  SBCDepositContract_DepositEvent,
} from "generated";
import { createEffect, S } from "envio";
import { HypersyncClient } from "@envio-dev/hypersync-client";

const CONSOLIDATION_ADDRESS = "0x0000BBdDc7CE488642fb579F8B00f3a590007251";

type DecodedConsolidation = {
  sender: string;
  targetPubkey: string;
  blockNumber: number;
};

const initChain = (
  chainId: number,
  historicalStartBlock: number,
  realtimeStartBlock: number
) => {
  const client = new HypersyncClient({
    url: `https://${chainId}.hypersync.xyz`,
    apiToken: process.env.ENVIO_HYPERSYNC_API_KEY!,
  });

  let pendingBatch: {
    resolvers: {
      fromBlock: number;
      toBlock: number;
      resolve: (logs: DecodedConsolidation[]) => void;
      reject: (e: Error) => void;
    }[];
    scheduled: boolean;
  } | null = null;

  const getConsolidationLogs = createEffect(
    {
      name: `getConsolidationLogs_${chainId}`,
      input: S.tuple((ctx) => ({
        fromBlock: ctx.item(0, S.number),
        toBlock: ctx.item(1, S.number),
      })),
      output: S.array(
        S.schema({
          sender: S.string,
          targetPubkey: S.string,
          blockNumber: S.number,
        })
      ),
      rateLimit: false,
    },
    async ({ input: { fromBlock, toBlock } }) => {
      if (!pendingBatch) {
        pendingBatch = { resolvers: [], scheduled: false };
      }

      const batch = pendingBatch;
      const promise = new Promise<DecodedConsolidation[]>((resolve, reject) => {
        batch.resolvers.push({ fromBlock, toBlock, resolve, reject });
      });

      if (!batch.scheduled) {
        batch.scheduled = true;
        queueMicrotask(async () => {
          const currentBatch = batch;
          pendingBatch = null;

          const minBlock = Math.min(...currentBatch.resolvers.map((r) => r.fromBlock));
          const maxBlock = Math.max(...currentBatch.resolvers.map((r) => r.toBlock));

          try {
            const allLogs: DecodedConsolidation[] = [];
            let nextBlock = minBlock;

            while (nextBlock < maxBlock) {
              const data = await client.get({
                fromBlock: nextBlock,
                toBlock: maxBlock,
                logs: [{ address: [CONSOLIDATION_ADDRESS] }],
                fieldSelection: {
                  log: ["BlockNumber", "Data"],
                },
              });

              for (const log of data.data.logs) {
                if (log.blockNumber === undefined) continue;
                const decoded = decodeConsolidationLog(log.data ?? "");
                if (!decoded) continue;
                allLogs.push({ ...decoded, blockNumber: log.blockNumber });
              }

              nextBlock = data.nextBlock;
            }

            for (const { fromBlock, toBlock, resolve } of currentBatch.resolvers) {
              resolve(allLogs.filter((l) => l.blockNumber >= fromBlock && l.blockNumber < toBlock));
            }
          } catch (error) {
            for (const { reject } of currentBatch.resolvers) {
              reject(error instanceof Error ? error : new Error(String(error)));
            }
          }
        });
      }

      return promise;
    }
  );

  const makeHandler =
    (interval: number): Parameters<typeof onBlock>[1] =>
      async ({ block, context }) => {
        const logs = await context.effect(getConsolidationLogs, {
          fromBlock: block.number,
          toBlock: block.number + interval,
        });


        for (const log of logs) {
          const targetValidatorId = `${chainId}_${log.targetPubkey}`;
          const withdrawal_address = log.sender.toLowerCase();
          const withdrawal_credentials =
            "0x020000000000000000000000" + withdrawal_address.slice(2);
          context.Validator.set({
            id: targetValidatorId,
            chainId,
            pubkey: log.targetPubkey,
            withdrawal_address,
            withdrawal_credentials,
          });
        }
      };

  onBlock(
    {
      name: `ConsolidationHistorical_${chainId}`,
      chain: chainId === 100 ? 100 : 10200,
      startBlock: historicalStartBlock,
      endBlock: realtimeStartBlock,
      interval: 100,
    },
    makeHandler(100)
  );
  onBlock(
    {
      name: `ConsolidationRealtime_${chainId}`,
      chain: chainId === 100 ? 100 : 10200,
      startBlock: realtimeStartBlock,
    },
    makeHandler(1)
  );
};

initChain(100, 38530039, 45467382);
initChain(10200, 14481034, 20555744);

// --- Deposit event handler ---

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
    context.Validator.set({
      id: validatorId,
      chainId: event.chainId,
      pubkey: event.params.pubkey,
      withdrawal_credentials: creds,
      withdrawal_address,
    });
  }
});

// --- Helpers ---

function decodeConsolidationLog(rawData: string) {
  const hex = rawData.startsWith("0x") ? rawData.slice(2) : rawData;

  if (hex.length < 232) {
    return null;
  }

  return {
    sender: "0x" + hex.slice(0, 40),
    targetPubkey: "0x" + hex.slice(136, 232),
  };
}
