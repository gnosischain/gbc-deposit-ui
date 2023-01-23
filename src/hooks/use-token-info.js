import { useEffect, useState } from 'react'

import useTokenContract from './use-token-contract'

function useTokenInfo (address, wallet) {
  const contract = useTokenContract(address, wallet)
  const [tokenInfo, setTokenInfo] = useState()

  useEffect(() => {
    const getTokenData = async (contract) => {
      const address = contract.address
      const symbol = await contract.symbol()
      const decimals = await contract.decimals()
      return { address, symbol, decimals }
    }

    if (contract) {
      getTokenData(contract).then(setTokenInfo).catch(() => setTokenInfo())
    }
  }, [contract])

  return tokenInfo
}

export default useTokenInfo
