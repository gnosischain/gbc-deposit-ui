import { useState, useEffect } from 'react'
import { Contract, getDefaultProvider, providers } from 'ethers'

import ERC20ABI from '../abis/erc20'

function useTokenContract (wallet, address) {
  const [contract, setContract] = useState()

  useEffect(() => {
    if (address) {
      const provider = wallet
        ? wallet.provider.getSigner()
        : window.ethereum
          ? new providers.Web3Provider(window.ethereum)
          : getDefaultProvider()
      const contract = new Contract(address, ERC20ABI, provider)

      setContract(contract)
    }
  }, [wallet, address])

  return contract
}

export default useTokenContract
