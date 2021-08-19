import { useEffect, useState } from 'react'

function useSwapContractInfo (swapContract, chainId) {
  const [contractInfo, setContractInfo] = useState({})

  useEffect(() => {
    if (chainId === process.env.REACT_APP_CHAIN_ID) {
      const getSwapData = async (contract) => {
        const fromTokenAddress = await contract.hez()
        const toTokenAddress = await contract.matic()
        const swapRatio = await contract.SWAP_RATIO()
  
        return { fromTokenAddress, toTokenAddress, swapRatio }
      }
  
      if (swapContract) {
        getSwapData(swapContract).then(setContractInfo)
      }
    }
  }, [swapContract, chainId])

  return contractInfo
}

export default useSwapContractInfo
