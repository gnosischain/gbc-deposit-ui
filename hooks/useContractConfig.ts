import { useAccount } from "wagmi";
import CONTRACTS from "@/utils/contracts";
import { isTestEnv } from "@/wagmi";

const useContractConfig = () => {
  const account = useAccount();
  const chainId = isTestEnv ? 31337 : account?.chainId;
  const contractConfig = chainId ? CONTRACTS[chainId] : undefined;
  const isWrongNetwork = !contractConfig;

  return { chainId, account, contractConfig, isWrongNetwork };
};

export default useContractConfig;
