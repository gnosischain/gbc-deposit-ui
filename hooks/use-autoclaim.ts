import { useCallback } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import CONTRACTS from "@/utils/contracts";
import claimRegistryABI from "@/utils/abis/claimRegistry";

function useAutoclaim() {
  const account = useAccount();

  const chainId = account?.chainId || 100;
  const contractConfig = CONTRACTS[chainId];
  const { data: hash, isPending, writeContract } = useWriteContract();

  if (!contractConfig) {
    throw Error(`No contract configuration found for chain ID ${chainId}`);
  }

  const register = useCallback(
    async (days: number, amount: number) => {
      const timeStamp = BigInt(days * 86400000);
      writeContract({ address: contractConfig.addresses.claimRegistry, abi: claimRegistryABI, functionName: "register", args: [account.address || "0x0", timeStamp, BigInt(amount)] });
    },
    [account]
  );

  return { register };
}

export default useAutoclaim;
