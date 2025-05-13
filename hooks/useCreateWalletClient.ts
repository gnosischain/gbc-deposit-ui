import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { createWalletClient, custom } from 'viem';
import { eip7702Actions } from 'viem/experimental'

export const useCreateWalletClient = () => {
  const { address, chain } = useAccount();

  return useMemo(() => {
    return window.ethereum
      ? createWalletClient({
          account: address,
          chain,
          transport: custom(window.ethereum!),
        }).extend(eip7702Actions())
      : null;
  }, [address, chain]);
};
