import { useEffect, useState } from 'react'

import useSwapContract from './use-swap-contract'

function useSwapContractInfo (wallet) {
  const swapContract = useSwapContract(wallet)
  const [contractInfo, setContractInfo] = useState({})

  useEffect(() => {
    const getSwapData = async (contract) => {
      const fromTokenAddress = await contract.stake()
      const toTokenAddress = await contract.gno()
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
