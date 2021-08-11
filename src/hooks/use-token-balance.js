import { useState, useEffect } from 'react'

function useTokenBalance (wallet, contract) {
  const [balance, setBalance] = useState()

  useEffect(() => {
    if (wallet && contract) {
      contract.balanceOf(wallet.address).then(setBalance)
    } else {
      setBalance()
    }
  }, [wallet, contract])

  return balance
}

export default useTokenBalance
