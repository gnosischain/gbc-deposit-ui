import { useEffect, useState } from 'react'
import { providers } from 'ethers'

function useWallet () {
  const [wallet, setWallet] = useState()

  const loadWallet = async () => {
    try {
      const provider = new providers.Web3Provider(window.ethereum)

      await provider.send('eth_requestAccounts')

      const address = await provider.getSigner().getAddress()

      setWallet({ provider, address })
    } catch (err) {
      setWallet()
      console.error(err)
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => accounts.length ? loadWallet() : setWallet())
      window.ethereum.on('chainChanged', () => { window.location.reload() })
    }
  }, [])

  return { wallet, loadWallet }
}

export default useWallet
