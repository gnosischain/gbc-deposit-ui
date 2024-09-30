/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  SBCDepositContractContract,
  SBCDepositContractContract_DepositEventEvent_eventArgs,
  SBCDepositContract_DepositEventEntity,
  SBCDepositContractContract_DepositEventEvent_handlerContext,
} from 'generated';

SBCDepositContractContract.DepositEvent.handler(({ event, context }) => {
  const entity: SBCDepositContract_DepositEventEntity = {
    chainId: event.chainId,
    id: `${event.transactionHash}_${event.logIndex}`,
    pubkey: event.params.pubkey,
    withdrawal_credentials: event.params.withdrawal_credentials,
    amount: event.params.amount,
    signature: event.params.signature,
    index: event.params.index,
  };

  context.SBCDepositContract_DepositEvent.set(entity);
});
