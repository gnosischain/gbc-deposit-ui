import { useCallback, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import CONTRACTS from "@/utils/contracts";
import depositABI from "@/utils/abis/deposit";
import useBalance from "@/hooks/use-balance";

function useClaimBalance() {
  const account = useAccount();
  const { refetchBalance, refetchClaimBalance } = useBalance();

  const chainId =
    process.env.NEXT_PUBLIC_TEST_ENV === "test"
      ? 31337
      : account?.chainId || 100;
  const contractConfig = CONTRACTS[chainId];
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
        args: [account.address || "0x0"],
      });
    }
  }, [account, contractConfig, writeContract]);

  useEffect(() => {
    if (claimSuccess) {
      refetchBalance();
      refetchClaimBalance();
    }
  }, [claimSuccess, refetchBalance, refetchClaimBalance]);

  return { claim, claimSuccess, claimHash };
}

export default useClaimBalance;
