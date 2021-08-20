import { useEffect, useState } from 'react'

function useTokenInfo (contract, chainId) {
  const [tokenInfo, setTokenInfo] = useState()

  useEffect(() => {
    if (chainId === process.env.REACT_APP_CHAIN_ID) {
      const getTokenData = async (contract) => {
        const address = contract.address
        const symbol = await contract.symbol()
        const decimals = await contract.decimals()

        return { address, symbol, decimals }
      }

      if (contract) {
        getTokenData(contract).then(setTokenInfo)
      }
    }
  }, [contract, chainId])

  return tokenInfo
}

export default useTokenInfo
