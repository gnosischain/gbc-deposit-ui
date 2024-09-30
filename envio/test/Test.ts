import assert from "assert";
import { 
  TestHelpers,
  SBCDepositContract_DepositEvent
} from "generated";
const { MockDb, SBCDepositContract } = TestHelpers;

describe("SBCDepositContract contract DepositEvent event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for SBCDepositContract contract DepositEvent event
  const event = SBCDepositContract.DepositEvent.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("SBCDepositContract_DepositEvent is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await SBCDepositContract.DepositEvent.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualSBCDepositContractDepositEvent = mockDbUpdated.entities.SBCDepositContract_DepositEvent.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedSBCDepositContractDepositEvent: SBCDepositContract_DepositEvent = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      pubkey: event.params.pubkey,
      withdrawal_credentials: event.params.withdrawal_credentials,
      amount: event.params.amount,
      signature: event.params.signature,
      index: event.params.index,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualSBCDepositContractDepositEvent, expectedSBCDepositContractDepositEvent, "Actual SBCDepositContractDepositEvent should be the same as the expectedSBCDepositContractDepositEvent");
  });
});
