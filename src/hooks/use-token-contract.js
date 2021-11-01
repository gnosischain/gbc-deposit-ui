import { useState, useEffect } from 'react'
import { Contract, providers } from 'ethers'

import ERC20ABI from '../abis/erc20'

function useTokenContract (address, provider) {
  const [contract, setContract] = useState()

  useEffect(() => {
    if (address && provider) {
      const isSigner = !(provider instanceof providers.StaticJsonRpcProvider);
      const contract = new Contract(address, ERC20ABI, isSigner ? provider.getSigner(0) : provider)
      setContract(contract)
    }
  }, [address, provider])

  return contract
}

export default useTokenContract
