import assert from "assert";
import { 
  TestHelpers,
  SBCDepositContract_DepositEventEntity
} from "generated";
const { MockDb, SBCDepositContract } = TestHelpers;

describe("SBCDepositContract contract DepositEvent event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for SBCDepositContract contract DepositEvent event
  const event = SBCDepositContract.DepositEvent.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  // Processing the event
  const mockDbUpdated = SBCDepositContract.DepositEvent.processEvent({
    event,
    mockDb,
  });

  it("SBCDepositContract_DepositEventEntity is created correctly", () => {
    // Getting the actual entity from the mock database
    let actualSBCDepositContractDepositEventEntity = mockDbUpdated.entities.SBCDepositContract_DepositEvent.get(
      `${event.transactionHash}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedSBCDepositContractDepositEventEntity: SBCDepositContract_DepositEventEntity = {
      id: `${event.transactionHash}_${event.logIndex}`,
      pubkey: event.params.pubkey,
      withdrawal_credentials: event.params.withdrawal_credentials,
      amount: event.params.amount,
      signature: event.params.signature,
      index: event.params.index,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualSBCDepositContractDepositEventEntity, expectedSBCDepositContractDepositEventEntity, "Actual SBCDepositContractDepositEventEntity should be the same as the expectedSBCDepositContractDepositEventEntity");
  });
});
