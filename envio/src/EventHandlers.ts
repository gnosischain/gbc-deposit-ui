/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  SBCDepositContract,
  SBCDepositContract_DepositEvent,
} from "generated";

SBCDepositContract.DepositEvent.handler(async ({ event, context }) => {
  const entity: SBCDepositContract_DepositEvent = {
    chainId: event.chainId,
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pubkey: event.params.pubkey,
    withdrawal_credentials: event.params.withdrawal_credentials,
    amount: event.params.amount,
    signature: event.params.signature,
    index: event.params.index,
  };

  context.SBCDepositContract_DepositEvent.set(entity);
});

