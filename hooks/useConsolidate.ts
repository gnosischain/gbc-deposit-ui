import { ContractNetwork } from "@/utils/contracts";
import { useCallback } from "react";
import { useSendTransaction } from "wagmi";
import { concat, parseEther } from "viem";
import { useCreateWalletClient } from "./useCreateWalletClient";

export type Validator = {
  publickey: `0x${string}`;
  valid_signature: boolean;
  validatorindex: number;
  withdrawal_credentials: `0x${string}`;
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

export async function fetchChiadoValidators(address: string): Promise<Validator[]> {
  try {
    const response = await fetch("https://rpc-gbc.chiadochain.net/eth/v1/beacon/states/finalized/validators?status=active");
    if (!response.ok) {
      throw new Error(`Failed to fetch Chiado Validators - status: ${response.status}`);
    }

    const data = await response.json();
    return data.data.filter((v: any) => v.validator.withdrawal_credentials.includes(address.toLowerCase().slice(2))).map((v: any) => {
      const { pubkey, ...rest } = v.validator;
      return { ...rest, publickey: pubkey };
    }) || [];
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

export function useConsolidateValidatorsEIP7702(contractConfig: ContractNetwork | undefined) {
  const walletClient = useCreateWalletClient();

  const consolidateValidators = useCallback(
    async (selectedPubkeys: `0x{string}`[], target: string) => {

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
        console.error("Error consolidating validators:", err);
      } finally {
      }
    },
    [contractConfig, walletClient]
  );

  return { consolidateValidators };
}

