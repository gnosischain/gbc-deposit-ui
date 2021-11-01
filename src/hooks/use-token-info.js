import { useEffect, useState } from 'react'

import useTokenContract from './use-token-contract'
import useProvider from './use-provider'

function useTokenInfo (address) {
  const provider = useProvider()
  const contract = useTokenContract(address, provider)
  const [tokenInfo, setTokenInfo] = useState()

  useEffect(() => {
    const getTokenData = async (contract) => {
      const address = contract.address
      const symbol = await contract.symbol()
      const decimals = await contract.decimals()
      return { address, symbol, decimals }
    }

    if (contract) {
      getTokenData(contract).then(setTokenInfo)
    }
  }, [contract])

  return tokenInfo
}

export default useTokenInfo
