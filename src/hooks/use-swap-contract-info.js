import { useEffect, useState } from 'react'

import useSwapContract from './use-swap-contract'

function useSwapContractInfo (wallet) {
  const swapContract = useSwapContract(wallet)
  const [contractInfo, setContractInfo] = useState({})

  useEffect(() => {
    const getSwapData = async (contract) => {
      const swapRatio = await contract.tokenRate(process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS)
      return { swapRatio }
    }

    if (swapContract) {
      getSwapData(swapContract).then(setContractInfo)
    }
  }, [swapContract])

  return contractInfo
}

export default useSwapContractInfo
