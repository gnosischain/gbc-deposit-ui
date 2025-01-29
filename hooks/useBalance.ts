import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import ERC677ABI from "@/utils/abis/erc677";
import { useQueryClient } from "@tanstack/react-query";
import { ContractNetwork } from "@/utils/contracts";
import depositABI from "@/utils/abis/deposit";
import { useCallback, useEffect } from "react";

function useBalance(contractConfig: ContractNetwork, address: `0x${string}`) {
  const queryClient = useQueryClient();
  const { data: claimHash, writeContract } = useWriteContract();
  const { isSuccess: claimSuccess } = useWaitForTransactionReceipt({
    hash: claimHash,
  });
  const { data: balance, queryKey } = useReadContract({
    abi: ERC677ABI,
    address: contractConfig?.addresses.token,
    functionName: "balanceOf",
    args: [address],
  });

  const { data: claimBalance, queryKey: claimQueryKey } = useReadContract({
    abi: depositABI,
    address: contractConfig?.addresses.deposit,
    functionName: "withdrawableAmount",
    args: [address],
  });

  const claim = useCallback(async () => {
    writeContract({
      address: contractConfig.addresses.deposit,
      abi: depositABI,
      functionName: "claimWithdrawal",
      args: [address],
    });
  }, [address, contractConfig, writeContract]);

  const refetchBalance = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  const refetchClaimBalance = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: claimQueryKey });
  }, [queryClient, claimQueryKey]);
  
  useEffect(() => {
    if (claimSuccess) {
      refetchBalance();
      refetchClaimBalance();
    }
  }, [claimSuccess, refetchBalance, refetchClaimBalance]);

  return { balance, claimBalance, refetchBalance, refetchClaimBalance, claim, claimSuccess, claimHash };
}

export default useBalance;
