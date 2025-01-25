export const MAX_BATCH_DEPOSIT = 128;
export const DEPOSIT_TOKEN_AMOUNT_OLD = 32000000000;
export const SECOND_IN_DAY = 86400;

export enum CredentialType {
    BLS = "00",
    Withdrawal = "01",
    Compound = "02",
}

export const getCredentialType = (withdrawalCredential: string): CredentialType | undefined => {
    if (withdrawalCredential.startsWith(CredentialType.BLS)) {
      return CredentialType.BLS;
    }
    if (withdrawalCredential.startsWith(CredentialType.Withdrawal)) {
      return CredentialType.Withdrawal;
    }
    if (withdrawalCredential.startsWith(CredentialType.Compound)) {
      return CredentialType.Compound;
    }
    return undefined;
  };
  

