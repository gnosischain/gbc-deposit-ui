import { useCallback } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import CONTRACTS from "@/utils/contracts";
import depositABI from "@/utils/abis/deposit";

function useClaimBalance() {
  const account = useAccount();

  const chainId = account?.chainId || 100;
  const contractConfig = CONTRACTS[chainId];
  const { data: claimBalance } = useReadContract({
    abi: depositABI,
    address: contractConfig?.addresses.deposit,
    functionName: "withdrawableAmount",
    args: [account.address || "0x0"],
  });
  const { data: hash, writeContract } = useWriteContract();
  const { isSuccess: claimSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  if (!contractConfig) {
    throw Error(`No contract configuration found for chain ID ${chainId}`);
  }

  const claim = useCallback(async() =>{
    writeContract({ address: contractConfig.addresses.deposit, abi: depositABI, functionName: "claimWithdrawal", args: [account.address || "0x0"] });
  }, [account])

  return { claim, claimBalance, claimSuccess };
}

export default useClaimBalance;
