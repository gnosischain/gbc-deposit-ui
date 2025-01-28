import { ContractNetwork } from "@/utils/contracts";
import { useCreateWalletClient } from "./useCreateWalletClient";
import { useCallback, useState } from "react";

export type Validator = {
    publickey: string;
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

export function useConsolidateValidators(contractConfig: ContractNetwork | undefined) {
    const walletClient = useCreateWalletClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
  
    const consolidateValidators = useCallback(
      async (selectedPubkeys: `0x{string}`[], target: string) => {
        setLoading(true);
        setError(null);
  
        try {
          if (!walletClient) {
            throw new Error("Wallet client creation failed");
          }
  
          if (!contractConfig || !contractConfig.addresses.consolidate) {
            throw new Error("Consolidation contract address is not configured");
          }
  
          const authorization = await walletClient.signAuthorization({
            contractAddress: contractConfig.addresses.consolidate,
            account: walletClient.account!,
          });
  
          console.log("Authorization:", authorization);
  
          const hash = await walletClient.sendTransaction({
            to: contractConfig.addresses.consolidate,
            data: selectedPubkeys[0],
            account: walletClient.account!,
            authorizationList: [authorization],
          });
  
          // console.log("Transaction hash:", hash);
        } catch (err) {
          setError(err as Error);
          console.error("Error consolidating validators:", err);
        } finally {
          setLoading(false);
        }
      },
      [contractConfig, walletClient]
    );
  
    return { consolidateValidators, loading, error };
  }

