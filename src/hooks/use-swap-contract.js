import { useState, useEffect } from 'react'
import { Contract } from 'ethers'

import swapperABI from '../abis/swapper'

import networks from '../networks'

function useSwapContract (wallet) {
  const [contract, setContract] = useState()

  useEffect(() => {
    if (wallet?.provider && Object.keys(networks).includes(wallet?.chainId)) {
      const contractAddress = networks[wallet.chainId].swapContractAddress;
      const contract = new Contract(contractAddress, swapperABI, wallet.provider.getSigner(0))
      setContract(contract)
    }
  }, [wallet])

  return contract
}

export default useSwapContract
