import { useCallback, useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { ContractNetwork } from "@/utils/contracts";
import depositABI from "@/utils/abis/deposit";
import useBalance from "@/hooks/use-balance";

function useClaimBalance(contractConfig: ContractNetwork | undefined, address: `0x${string}` | undefined) {
  const { refetchBalance, refetchClaimBalance } = useBalance(contractConfig, address);

  const { data: claimHash, writeContract } = useWriteContract();
  const { isSuccess: claimSuccess } = useWaitForTransactionReceipt({
    hash: claimHash,
  });

  const claim = useCallback(async () => {
    if (contractConfig) {
      writeContract({
        address: contractConfig.addresses.deposit,
        abi: depositABI,
        functionName: "claimWithdrawal",
        args: [address || "0x0"],
      });
    }
  }, [address, contractConfig, writeContract]);

  useEffect(() => {
    if (claimSuccess) {
      refetchBalance();
      refetchClaimBalance();
    }
  }, [claimSuccess, refetchBalance, refetchClaimBalance]);

  return { claim, claimSuccess, claimHash };
}

export default useClaimBalance;
