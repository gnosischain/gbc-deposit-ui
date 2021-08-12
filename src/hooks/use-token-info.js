import { useEffect, useState } from 'react'

function useTokenInfo (contract) {
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
