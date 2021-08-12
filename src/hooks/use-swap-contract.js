import { useState, useEffect } from 'react'
import { Contract, getDefaultProvider, providers } from 'ethers'

import swapperABI from '../abis/swapper'

function useSwapContract (wallet) {
  const [contract, setContract] = useState()

  useEffect(() => {
    const provider = wallet
      ? wallet.provider.getSigner()
      : window.ethereum
        ? new providers.Web3Provider(window.ethereum)
        : getDefaultProvider()
    const contract = new Contract(process.env.REACT_APP_SWAP_CONTRACT_ADDRESS, swapperABI, provider)

    setContract(contract)
  }, [wallet])

  return contract
}

export default useSwapContract
