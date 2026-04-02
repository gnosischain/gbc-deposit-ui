/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  SBCDepositContract,
  SBCDepositContract_DepositEvent,
  ConsolidationContract,
  ConsolidationContract_ConsolidationRequested,
  Validator,
} from "generated";

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
    };
    context.Validator.set(validator);
  }
});

ConsolidationContract.ConsolidationRequested.handler(async ({ event, context }) => {
  const entity: ConsolidationContract_ConsolidationRequested = {
    id: `${event.chainId}_${event.transaction.hash}_${event.logIndex}`,
    chainId: event.chainId,
    sender: event.params.sender,
    source_pubkey: event.params.source_pubkey,
    target_pubkey: event.params.target_pubkey,
    blockNumber: event.block.number,
    transactionHash: event.transaction.hash,
  };

  context.ConsolidationContract_ConsolidationRequested.set(entity);

  const targetValidatorId = `${event.chainId}_${event.params.target_pubkey}`;
  const existingTarget = await context.Validator.get(targetValidatorId);
  if (!existingTarget) {
    const targetValidator: Validator = {
      id: targetValidatorId,
      chainId: event.chainId,
      pubkey: event.params.target_pubkey,
    };
    context.Validator.set(targetValidator);
  }
});
