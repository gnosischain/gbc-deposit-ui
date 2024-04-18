import { useCallback, useState } from "react";
import { useAccount } from "wagmi";
import CONTRACTS from "@/utils/contracts";

type DepositDataJson = {
  pubkey: string;
  withdrawal_credentials: string;
  amount: bigint;
  signature: string;
  deposit_message_root: string;
  deposit_data_root: string;
  fork_version: string;
};

export type FileDepositData = {
  fileName: string;
  data: DepositDataJson[];
};

type ValidatorStatus = {
  activation_eligibility_epoch: number;
  activation_epoch: number;
  balance: number;
  effective_balance: number;
  exit_epoch: number;
  last_attestation_slot: number;
  name: string;
  pubkey: string;
  slashed: boolean;
  status: string;
  validator_index: number;
  withdrawable_epoch: number;
  withdrawal_credentials: string;
};

function useValidators() {
  const [statuses, setStatuses] = useState<ValidatorStatus[] | null>(null);
  const account = useAccount();
  const chainId = account?.chainId || 100;
  const contractConfig = CONTRACTS[chainId];

  if (!contractConfig) {
    throw Error(`No contract configuration found for chain ID ${chainId}`);
  }

  const fetchStatuses = useCallback(async (beaconExplorerUrl: string, pubkeys: string[]): Promise<ValidatorStatus[]> => {
    const chunkSize = 64;
    const chunks = [];
    for (let i = 0; i < pubkeys.length; i += chunkSize) {
      chunks.push(pubkeys.slice(i, i + chunkSize));
    }
    const data = await Promise.all(
      chunks.map(async (chunk) =>
        fetch(`${beaconExplorerUrl}/api/v1/validator/${chunk.join(",")}`).then((response) => {
          if (!response.ok) {
            throw new Error(`Fail to fetch from ${beaconExplorerUrl} status: ${response.status}`);
          }
          return response.json();
        })
      )
    );

    return data.flatMap((d) => d.data || []);
  }, []);

  const validateStatus = useCallback(
    async (files: FileDepositData[]) => {
      const pubkeys = files.flatMap((file) =>
        file.data.map((deposit) => ({
          pubkey: deposit.pubkey,
          fileName: file.fileName,
        }))
      );

      try {
        const fetchedStatuses = await fetchStatuses(
          contractConfig.beaconExplorerUrl,
          pubkeys.map((item) => item.pubkey)
        );

        if (fetchedStatuses.length === 0) {
          setStatuses(null);
          return;
        }

        setStatuses(fetchedStatuses);
      } catch (error: unknown) {
        setStatuses(null);
        throw Error("Failed to fetch or process validator statuses.");
      }
    },
    [fetchStatuses, contractConfig.beaconExplorerUrl]
  );

  return { validateStatus, statuses };
}

export default useValidators;
