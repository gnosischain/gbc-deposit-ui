import { useState, useEffect } from 'react'
import { providers } from 'ethers'

function useProvider() {
  const [provider, setProvider] = useState()

  useEffect(() => {
    const provider = new providers.StaticJsonRpcProvider(process.env.REACT_APP_RPC_URL);
    setProvider(provider);
  }, [])

  return provider
}

export default useProvider
