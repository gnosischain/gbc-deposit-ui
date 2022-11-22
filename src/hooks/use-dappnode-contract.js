import { useState, useEffect } from 'react'
import { Contract } from 'ethers'

import dappnodeDepositABI from '../abis/dappnodeDeposit'
import { NETWORKS } from '../constants';

function useDappnodeContract (wallet) {
  const [contract, setContract] = useState()

  useEffect(() => {
    if (wallet && wallet?.provider) {
      var address = NETWORKS[wallet.chainId].addresses.dappnodeDeposit

      if(address){
        const contract = new Contract(address, dappnodeDepositABI, wallet.provider.getSigner(0))
        setContract(contract)
      }
    }
  }, [wallet])

  return contract
}

export default useDappnodeContract
