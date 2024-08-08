import { useAccount } from "wagmi";
import CONTRACTS from "@/utils/contracts";

const useContractConfig = () => {
  const account = useAccount();
  const chainId = process.env.NEXT_PUBLIC_TEST_ENV === "test" ? 31337 : account?.chainId || 100;
  const contractConfig = CONTRACTS[chainId];
  const isWrongNetwork = !contractConfig;

  return { chainId, account, contractConfig, isWrongNetwork };
};

export default useContractConfig;
