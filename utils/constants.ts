export const MAX_BATCH_DEPOSIT = 128;
export const DEPOSIT_TOKEN_AMOUNT_OLD = 32000000000;
export const SECOND_IN_DAY = 86400;

enum CredentialType {
    BLS = "0x00",
    Withdrawal = "0x01",
    Compound = "0x02",
}

export const getCredentialType = (withdrawalCredential: string): CredentialType | null => {
    if (withdrawalCredential.startsWith(CredentialType.BLS)) {
      return CredentialType.BLS;
    }
    if (withdrawalCredential.startsWith(CredentialType.Withdrawal)) {
      return CredentialType.Withdrawal;
    }
    if (withdrawalCredential.startsWith(CredentialType.Compound)) {
      return CredentialType.Compound;
    }
    return null;
  };
  

