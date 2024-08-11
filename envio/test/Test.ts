import assert from "assert";
import { 
  TestHelpers,
  ClaimRegistryUpgradeable_ClaimBatchEntity
} from "generated";
const { MockDb, ClaimRegistryUpgradeable } = TestHelpers;

describe("ClaimRegistryUpgradeable contract ClaimBatch event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for ClaimRegistryUpgradeable contract ClaimBatch event
  const event = ClaimRegistryUpgradeable.ClaimBatch.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  // Processing the event
  const mockDbUpdated = ClaimRegistryUpgradeable.ClaimBatch.processEvent({
    event,
    mockDb,
  });

  it("ClaimRegistryUpgradeable_ClaimBatchEntity is created correctly", () => {
    // Getting the actual entity from the mock database
    let actualClaimRegistryUpgradeableClaimBatchEntity = mockDbUpdated.entities.ClaimRegistryUpgradeable_ClaimBatch.get(
      `${event.transactionHash}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedClaimRegistryUpgradeableClaimBatchEntity: ClaimRegistryUpgradeable_ClaimBatchEntity = {
      id: `${event.transactionHash}_${event.logIndex}`,
      caller: event.params.caller,
      withdrawalAddresses: event.params.withdrawalAddresses,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualClaimRegistryUpgradeableClaimBatchEntity, expectedClaimRegistryUpgradeableClaimBatchEntity, "Actual ClaimRegistryUpgradeableClaimBatchEntity should be the same as the expectedClaimRegistryUpgradeableClaimBatchEntity");
  });
});
