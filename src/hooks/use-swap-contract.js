import { useState, useEffect } from 'react'
import { Contract } from 'ethers'

import getProvider from '../utils/provider';

import swapperABI from '../abis/swapper'

function useSwapContract () {
  const [contract, setContract] = useState()

  useEffect(() => {
    const provider = getProvider();
    const contract = new Contract(process.env.REACT_APP_SWAP_CONTRACT_ADDRESS, swapperABI, provider)
    setContract(contract)
  }, [])

  return contract
}

export default useSwapContract
