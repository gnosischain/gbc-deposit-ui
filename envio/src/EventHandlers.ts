/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  ClaimRegistryUpgradeableContract,
  ClaimRegistryUpgradeable_ClaimBatchEntity,
  ClaimRegistryUpgradeable_InitializedEntity,
  ClaimRegistryUpgradeable_OwnershipTransferredEntity,
  ClaimRegistryUpgradeable_RegisterEntity,
  ClaimRegistryUpgradeable_UnregisterEntity,
  ClaimRegistryUpgradeable_UpdateConfigEntity,
  ClaimRegistryUpgradeable_UpgradedEntity,
  SBCDepositContractContract,
  SBCDepositContract_DepositEventEntity,
  SBCDepositContract_PausedEntity,
  SBCDepositContract_UnpausedEntity,
} from "generated";

ClaimRegistryUpgradeableContract.ClaimBatch.handler(({ event, context }) => {
  const entity: ClaimRegistryUpgradeable_ClaimBatchEntity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    caller: event.params.caller,
    withdrawalAddresses: event.params.withdrawalAddresses,
  };

  context.ClaimRegistryUpgradeable_ClaimBatch.set(entity);
});

ClaimRegistryUpgradeableContract.Initialized.handler(({ event, context }) => {
  const entity: ClaimRegistryUpgradeable_InitializedEntity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    version: event.params.version,
  };

  context.ClaimRegistryUpgradeable_Initialized.set(entity);
});

ClaimRegistryUpgradeableContract.OwnershipTransferred.handler(({ event, context }) => {
  const entity: ClaimRegistryUpgradeable_OwnershipTransferredEntity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    previousOwner: event.params.previousOwner,
    newOwner: event.params.newOwner,
  };

  context.ClaimRegistryUpgradeable_OwnershipTransferred.set(entity);
});

ClaimRegistryUpgradeableContract.Register.handler(({ event, context }) => {
  const entity: ClaimRegistryUpgradeable_RegisterEntity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    user: event.params.user,
  };

  context.ClaimRegistryUpgradeable_Register.set(entity);
});

ClaimRegistryUpgradeableContract.Unregister.handler(({ event, context }) => {
  const entity: ClaimRegistryUpgradeable_UnregisterEntity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    user: event.params.user,
  };

  context.ClaimRegistryUpgradeable_Unregister.set(entity);
});

ClaimRegistryUpgradeableContract.UpdateConfig.handler(({ event, context }) => {
  const entity: ClaimRegistryUpgradeable_UpdateConfigEntity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    user: event.params.user,
    oldTime: event.params.oldTime,
    newTime: event.params.newTime,
    oldAmount: event.params.oldAmount,
    newAmount: event.params.newAmount,
  };

  context.ClaimRegistryUpgradeable_UpdateConfig.set(entity);
});

ClaimRegistryUpgradeableContract.Upgraded.handler(({ event, context }) => {
  const entity: ClaimRegistryUpgradeable_UpgradedEntity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    implementation: event.params.implementation,
  };

  context.ClaimRegistryUpgradeable_Upgraded.set(entity);
});

SBCDepositContractContract.DepositEvent.handler(({ event, context }) => {
  const entity: SBCDepositContract_DepositEventEntity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    pubkey: event.params.pubkey,
    withdrawal_credentials: event.params.withdrawal_credentials,
    amount: event.params.amount,
    signature: event.params.signature,
    index: event.params.index,
  };

  context.SBCDepositContract_DepositEvent.set(entity);
});

SBCDepositContractContract.Paused.handler(({ event, context }) => {
  const entity: SBCDepositContract_PausedEntity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    account: event.params.account,
  };

  context.SBCDepositContract_Paused.set(entity);
});

SBCDepositContractContract.Unpaused.handler(({ event, context }) => {
  const entity: SBCDepositContract_UnpausedEntity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    account: event.params.account,
  };

  context.SBCDepositContract_Unpaused.set(entity);
});
