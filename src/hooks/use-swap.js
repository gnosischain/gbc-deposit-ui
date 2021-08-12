import { useState } from 'react'

import { BRIDGE_GAS_LIMIT } from '../constants'
import { approve, permit } from '../utils/tokens'

const INITIAL_DATA = { status: 'pending' }

function useSwap () {
  const [data, setData] = useState(INITIAL_DATA)

  const swap = async (wallet, fromTokenContract, swapContract, amount) => {
    setData({ status: 'loading' })

    if (!wallet) {
      setData({ status: 'failed', error: 'Wallet doesn\'t exist' })
      return
    }

    if (!fromTokenContract) {
      setData({ status: 'failed', error: 'From token contract doesn\'t exist' })
      return
    }

    try {
      const usePermit = process.env.REACT_APP_USE_PERMIT === 'true'
      const permitSignature = usePermit
        ? await permit(fromTokenContract, wallet, swapContract, amount)
        : []

      if (!usePermit) {
        await approve(fromTokenContract, wallet, swapContract, amount)
      }

      const txData = await swapContract.bridge(amount, permitSignature, { gasLimit: BRIDGE_GAS_LIMIT })
      setData({ status: 'successful', data: txData })
    } catch (err) {
      setData({ status: 'failed', error: err.message })
      console.log(err)
    }
  }

  const resetData = () => {
    setData(INITIAL_DATA)
  }

  return { swap, data, resetData }
}

export default useSwap
