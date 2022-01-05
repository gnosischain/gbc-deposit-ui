import { useState, useEffect } from 'react'
import { Contract } from 'ethers'

import dappnodeDepositABI from '../abis/dappnodeDeposit'

function useDappnodeContract (address, wallet) {
  const [contract, setContract] = useState()

  useEffect(() => {
    if (address && wallet?.provider) {
      const contract = new Contract(address, dappnodeDepositABI, wallet.provider.getSigner(0))
      setContract(contract)
    }
  }, [address, wallet])

  return contract
}

export default useDappnodeContract
