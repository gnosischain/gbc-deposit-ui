import { useAccount, useReadContract } from "wagmi";
import ERC677ABI from "@/utils/abis/erc677";
import { useQueryClient } from "@tanstack/react-query";
import CONTRACTS from "@/utils/contracts";
import depositABI from "@/utils/abis/deposit";

function useBalance() {
  const account = useAccount();
  const queryClient = useQueryClient();

  const chainId =
    process.env.NEXT_PUBLIC_TEST_ENV === "test"
      ? 31337
      : account?.chainId || 100;
  const contractConfig = CONTRACTS[chainId];
  const { data: balance, queryKey } = useReadContract({
    abi: ERC677ABI,
    address: contractConfig?.addresses.token,
    functionName: "balanceOf",
    args: [account.address || "0x0"],
  });

  const { data: claimBalance, queryKey: claimQueryKey } = useReadContract({
    abi: depositABI,
    address: contractConfig?.addresses.deposit,
    functionName: "withdrawableAmount",
    args: [account.address || "0x0"],
  });

  const refetchBalance = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  const refetchClaimBalance = () => {
    queryClient.invalidateQueries({ queryKey: claimQueryKey });
  };

  return { balance, claimBalance, refetchBalance, refetchClaimBalance, queryKey };
}

export default useBalance;
