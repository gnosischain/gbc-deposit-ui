import { useState, useEffect } from 'react'
import { Contract } from 'ethers'

import swapperABI from '../abis/swapper'

function useSwapContract (wallet) {
  const [contract, setContract] = useState()

  useEffect(() => {
    if (wallet?.provider && wallet?.chainId === process.env.REACT_APP_NETWORK_ID) {
      const contractAddress = process.env.REACT_APP_WRAPPER_CONTRACT_ADDRESS;
      const contract = new Contract(contractAddress, swapperABI, wallet.provider.getSigner(0))
      setContract(contract)
    }
  }, [wallet])

  return contract
}

export default useSwapContract
