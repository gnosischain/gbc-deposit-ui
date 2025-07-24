export interface DepositDataJson {
    pubkey: string;
    withdrawal_credentials: string;
    amount: bigint;
    signature: string;
    deposit_message_root: string;
    deposit_data_root: string;
    fork_version: string;
}


export interface BatchDepositData {
    pubkeys: `0x${string}`;
    withdrawal_credentials: `0x${string}`;
    signatures: `0x${string}`;
    deposit_data_roots: `0x${string}`[];
    amounts: bigint[];
  }
