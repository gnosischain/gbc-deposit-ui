import { useReadContract } from "wagmi";
import ERC677ABI from "@/utils/abis/erc677";
import { useQueryClient } from "@tanstack/react-query";
import { ContractNetwork } from "@/utils/contracts";
import depositABI from "@/utils/abis/deposit";

function useBalance(contractConfig: ContractNetwork | undefined, address: `0x${string}` | undefined) {
  const queryClient = useQueryClient();
  const { data: balance, queryKey } = useReadContract({
    abi: ERC677ABI,
    address: contractConfig?.addresses.token,
    functionName: "balanceOf",
    args: [address || "0x0"],
  });

  const { data: claimBalance, queryKey: claimQueryKey } = useReadContract({
    abi: depositABI,
    address: contractConfig?.addresses.deposit,
    functionName: "withdrawableAmount",
    args: [address || "0x0"],
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
