import { useCallback } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import CONTRACTS from "@/utils/contracts";
import depositABI from "@/utils/abis/deposit";

function useClaimBalance() {
  const account = useAccount();

  const chainId = process.env.NODE_ENV === 'test' ? 31337 : account?.chainId || 100;
  const contractConfig = CONTRACTS[chainId];
  const { data: claimBalance } = useReadContract({
    abi: depositABI,
    address: contractConfig?.addresses.deposit,
    functionName: "withdrawableAmount",
    args: [account.address || "0x0"],
  });
  const { data: claimHash, writeContract } = useWriteContract();
  const { isSuccess: claimSuccess } = useWaitForTransactionReceipt({
    hash: claimHash,
  });

  const claim = useCallback(async () => {
    if (contractConfig) {
      writeContract({ address: contractConfig.addresses.deposit, abi: depositABI, functionName: "claimWithdrawal", args: [account.address || "0x0"] });
    }
  }, [account]);

  return { claim, claimBalance, claimSuccess, claimHash };
}

export default useClaimBalance;
