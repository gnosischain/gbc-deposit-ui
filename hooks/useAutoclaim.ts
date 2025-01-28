import { useCallback } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { ContractNetwork }  from "@/utils/contracts";
import claimRegistryABI from "@/utils/abis/claimRegistry";
import { parseUnits } from "viem";
import { SECOND_IN_DAY } from "@/utils/constants";

function useAutoclaim(
  contractConfig: ContractNetwork | undefined,
  address: `0x${string}` | undefined,
  chainId: number
) {
  const account = useAccount();
  const { data: autoclaimHash, writeContract } = useWriteContract();
  const { isSuccess: autoclaimSuccess } = useWaitForTransactionReceipt({
    hash: autoclaimHash,
  });

  const { data: userConfig } = useReadContract(
    contractConfig?.addresses?.claimRegistry && account.address
      ? {
          address: contractConfig.addresses.claimRegistry,
          abi: claimRegistryABI,
          functionName: 'configs',
          args: [account.address as `0x${string}`],
        }
      : undefined
  );

  const register = useCallback(
    async (days: number, amount: number) => {
      if (contractConfig) {
        const timeStamp = BigInt(days * SECOND_IN_DAY);
        writeContract({ address: contractConfig.addresses.claimRegistry, abi: claimRegistryABI, functionName: "register", args: [address || "0x0", timeStamp, parseUnits(amount.toString(), 18)] });
      }
    },
    [address, contractConfig, writeContract]
  );

  const updateConfig = useCallback(
    async (days: number, amount: number) => {
      if (contractConfig) {
        const timeStamp = BigInt(days * SECOND_IN_DAY);
        writeContract({ address: contractConfig.addresses.claimRegistry, abi: claimRegistryABI, functionName: "updateConfig", args: [address || "0x0", timeStamp, parseUnits(amount.toString(), 18)] });
      }
    },
    [address, contractConfig, writeContract]
  );

  const unregister = useCallback(async () => {
    if (contractConfig) {
      writeContract({
        address: contractConfig.addresses.claimRegistry,
        abi: claimRegistryABI,
        functionName: 'unregister',
        args: [address || '0x0'],
      });
    }
  }, [address, contractConfig, writeContract]);

  return {
    register,
    updateConfig,
    unregister,
    isRegister: userConfig?.[4] === 1 ? true : false,
    autoclaimSuccess,
    autoclaimHash,
    chainId,
  };
}

export default useAutoclaim;
