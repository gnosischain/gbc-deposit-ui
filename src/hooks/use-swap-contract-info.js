import { useEffect, useState } from 'react'

import useSwapContract from './use-swap-contract'
import useProvider from './use-provider'

function useSwapContractInfo () {
  const provider = useProvider()
  const swapContract = useSwapContract(provider)
  const [contractInfo, setContractInfo] = useState({})

  useEffect(() => {
    const getSwapData = async (contract) => {
      const fromTokenAddress = await contract.poa()
      const toTokenAddress = await contract.stake()
      const swapRatio = await contract.SWAP_RATIO()

      return { fromTokenAddress, toTokenAddress, swapRatio }
    }

    if (swapContract) {
      getSwapData(swapContract).then(setContractInfo)
    }
  }, [swapContract])

  return contractInfo
}

export default useSwapContractInfo
