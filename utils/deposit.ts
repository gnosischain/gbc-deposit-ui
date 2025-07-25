// NOTE: Ideally this should use { assert: { type: 'json' } },
// but this would require significant changes in the build process

import { BatchDepositData, DepositDataJson } from "@/types/deposit";
import { CredentialType } from "@/types/validators";
import { parseGwei } from "viem";

export const generateDepositData = (deposits: DepositDataJson[]): BatchDepositData => {
  console.log(deposits);
  const pubkeys = `0x${deposits.map(d => d.pubkey).join("")}` as `0x${string}`;
  const withdrawal_credentials = `0x${deposits[0].withdrawal_credentials}` as `0x${string}`;
  const signatures = `0x${deposits.map(d => d.signature).join("")}` as `0x${string}`;
  const deposit_data_roots = deposits.map(d => `0x${d.deposit_data_root}` as `0x${string}`);
  const amounts = deposits.map(d => parseGwei(d.amount.toString()) / 32n);

  return {
    pubkeys,
    withdrawal_credentials,
    signatures,
    deposit_data_roots,
    amounts
  };
};

export const getCredentialType = (withdrawalCredential: string): CredentialType | undefined => {
  
  if (withdrawalCredential.startsWith("00")) {
    return 0;
  }
  if (withdrawalCredential.startsWith("01")) {
    return 1;
  }
  if (withdrawalCredential.startsWith("02")) {
    return 2;
  }
  return undefined;
};

export const GET_DEPOSIT_EVENTS = `
query MyQuery($pubkeys: [String!], $chainId: Int!) {
  SBCDepositContract_DepositEvent(
    where: { 
      pubkey: { 
        _in: $pubkeys
      },
      chainId: {_eq: $chainId}
    }
  ) {
    id
    amount
    db_write_timestamp
    index
    withdrawal_credentials
    pubkey
  }
}
`;
