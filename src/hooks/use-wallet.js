import { useState, useCallback, useEffect } from 'react';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import WalletLink from 'walletlink';
import { providers, utils } from 'ethers';

import coinbaseLogo from '../images/coinbase.png';

const web3Modal = new Web3Modal({
  cacheProvider: false,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        chainId: 100,
        rpc: {
          100: 'https://dai.poa.network'
        }
      },
    },
    'custom-walletlink': {
      display: {
        logo: coinbaseLogo,
        name: 'Coinbase Wallet',
        description: 'Scan with Coinbase Wallet to connect',
      },
      package: WalletLink,
      connector: async (ProviderPackage) => {
        const provider = new ProviderPackage({ appName: 'Poa to Stake' }).makeWeb3Provider({}, 0);
        await provider.enable();
        return provider;
      },
    }
  },
});

async function switchChainInMetaMask(chainId) {
  const name = 'xDai';
  const symbol = 'XDAI';
  const chainName = 'xDai Chain';
  const rpcUrl = 'https://dai.poa.network';
  const blockExplorerUrl = 'https://blockscout.com/poa/xdai';

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: utils.hexValue(Number(chainId)),
        },
      ],
    });
    return true;
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: utils.hexValue(Number(chainId)),
              chainName,
              nativeCurrency: {
                name,
                symbol,
                decimals: 18,
              },
              rpcUrls: [rpcUrl],
              blockExplorerUrls: [blockExplorerUrl],
            },
          ],
        });
        return true;
      } catch (addError) {
        console.log(addError);
      }
    } else {
      console.log(switchError);
    }
    return false;
  }
};

function useWallet() {
  const [wallet, setWallet] = useState();
  const [isMetamask, setIsMetamask] = useState(false);

  const closeConnection = useCallback(async () => {
    const provider = wallet?.provider;
    if (provider && provider.currentProvider && provider.currentProvider.close) {
      await provider.currentProvider.close();
    }
    await web3Modal.clearCachedProvider();
    setWallet();
  }, [wallet]);

  const loadWallet = useCallback(async () => {
    const provider = await web3Modal.requestProvider();
    async function connect() {
      const library = new providers.Web3Provider(provider);
      const network = await library.getNetwork();
      const address = await library.getSigner().getAddress();
      const chainId = network.chainId;
      setIsMetamask(library?.connection?.url === 'metamask');
      setWallet({ provider: library, address, chainId });
    }
    if (provider.on) {
      provider.on('close', closeConnection);
      provider.on('disconnect', closeConnection);
      provider.on('accountsChanged', accounts => accounts.length ? connect() : window.location.reload());
      // provider.on('networkChanged', connect);
      provider.on('chainChanged', connect);
    }
    provider.autoRefreshOnNetworkChange = false;
    await connect();
  }, [closeConnection]);

  return ({
    wallet,
    isMetamask,
    loadWallet,
    switchChainInMetaMask,
  });
};

export default useWallet;
