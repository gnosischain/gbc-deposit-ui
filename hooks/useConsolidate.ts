import { ContractNetwork } from "@/utils/contracts";
import { useCallback } from "react";
import { useSendTransaction } from "wagmi";
import { concat, parseEther, parseGwei } from "viem";

export type Validator = {
  publickey: `0x${string}`;
  valid_signature: boolean;
  validatorindex: number;
};


export async function fetchValidators(beaconExplorerUrl: string, address: string): Promise<Validator[]> {
  try {
    const response = await fetch(`${beaconExplorerUrl}/api/v1/validator/eth1/${address}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch from ${beaconExplorerUrl} - status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching validator statuses:", error);
    throw error;
  }
}

export function useConsolidateValidators(contractConfig: ContractNetwork, address: `0x${string}`) {
  const { data: hash, sendTransaction } = useSendTransaction();

  const consolidateValidators = useCallback(
    async (selectedPubkeys: `0x${string}`[], target: `0x${string}`) => {

      try {
        const data = concat([
          selectedPubkeys[0],
          target,
        ]);
        console.log(selectedPubkeys[0], target, data);
        sendTransaction({
          to: contractConfig.addresses.consolidate,
          data,
          value: parseEther('0.1'),
        });

      } catch (err) {
        console.error("Error consolidating validators:", err);
      }
    },
    [contractConfig.addresses.consolidate, sendTransaction]
  );

  return { consolidateValidators };
}

