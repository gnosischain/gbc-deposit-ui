// NOTE: Ideally this should use { assert: { type: 'json' } },
// but this would require significant changes in the build process

import { Address } from "viem";

type DepositData = {
  lastBlock: bigint;
  deposits: Address[];
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