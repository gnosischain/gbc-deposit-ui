// NOTE: Ideally this should use { assert: { type: 'json' } },
// but this would require significant changes in the build process

import { Address } from "viem";

type DepositData = {
  lastBlock: bigint;
  deposits: Address[];
};

export type DepositDataJson = {
  pubkey: string;
  withdrawal_credentials: string;
  amount: bigint;
  signature: string;
  deposit_message_root: string;
  deposit_data_root: string;
  fork_version: string;
};

export async function loadCachedDeposits(chainId: number, depositStartBlockNumber: bigint): Promise<DepositData> {
  try {
    const {
      deposits = [],
      lastBlock = depositStartBlockNumber,
    } = await import(`../data/${chainId}/deposits.json`);
    return { deposits, lastBlock };
  } catch (err) {
    console.error(err);
  }

  return {
    lastBlock: depositStartBlockNumber,
    deposits: [],
  };
}

export const generateDepositData = (deposits: DepositDataJson[], isBatch: boolean): string => {
  let data = "";
  if (isBatch) {
    data += deposits[0].withdrawal_credentials;
    deposits.forEach((deposit) => {
      data += deposit.pubkey;
      data += deposit.signature;
      data += deposit.deposit_data_root;
    });
  } else {
    deposits.forEach((deposit) => {
      data += deposit.withdrawal_credentials;
      data += deposit.pubkey;
      data += deposit.signature;
      data += deposit.deposit_data_root;
    });
  }
  return data;
};
