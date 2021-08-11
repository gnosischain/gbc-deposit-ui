import { useState, useEffect } from 'react'
import { Contract, getDefaultProvider, providers } from 'ethers'

import ERC20ABI from '../abis/erc20'

function useTokenContract (wallet, tokenAddress) {
  const [contract, setContract] = useState()

  useEffect(() => {
    const provider = wallet
      ? wallet.provider
      : window.ethereum
        ? new providers.Web3Provider(window.ethereum)
        : getDefaultProvider()
    const contract = new Contract(process.env.REACT_APP_HEZ_TOKEN_ADDRESS, ERC20ABI, provider)

    setContract(contract)
  }, [wallet, tokenAddress])

  return contract
}

export default useTokenContract
