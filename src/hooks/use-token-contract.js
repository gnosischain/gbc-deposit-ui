import { useState, useEffect } from 'react'
import { Contract } from 'ethers'

import getProvider from '../utils/provider';

import ERC20ABI from '../abis/erc20'

function useTokenContract (address) {
  const [contract, setContract] = useState()

  useEffect(() => {
    if (address) {
      const provider = getProvider();
      const contract = new Contract(address, ERC20ABI, provider)

      setContract(contract)
    }
  }, [address])

  return contract
}

export default useTokenContract
