import { useState, useEffect } from 'react'
import { Contract, providers } from 'ethers'

import swapperABI from '../abis/swapper'

const contactAddress = process.env.REACT_APP_SWAP_CONTRACT_ADDRESS;

function useSwapContract (provider) {
  const [contract, setContract] = useState()

  useEffect(() => {
    if (provider) {
      const isSigner = !(provider instanceof providers.StaticJsonRpcProvider);
      const contract = new Contract(contactAddress, swapperABI, isSigner ? provider.getSigner(0) : provider)
      setContract(contract)
    }
  }, [provider])

  return contract
}

export default useSwapContract
