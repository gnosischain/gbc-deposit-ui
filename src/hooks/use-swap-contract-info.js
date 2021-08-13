import { useEffect, useState } from 'react'

function useSwapContractInfo (swapContract) {
  const [contractInfo, setContractInfo] = useState({})

  useEffect(() => {
    const getSwapData = async (contract) => {
      const fromTokenAddress = await contract.tokenA()
      const toTokenAddress = await contract.tokenB()
      const swapRatio = await contract.BRIDGE_RATIO()

      return { fromTokenAddress, toTokenAddress, swapRatio }
    }

    if (swapContract) {
      getSwapData(swapContract).then(setContractInfo)
    }
  }, [swapContract])

  return contractInfo
}

export default useSwapContractInfo
