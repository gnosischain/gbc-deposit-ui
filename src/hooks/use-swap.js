import { useState } from 'react'

import { BRIDGE_GAS_LIMIT } from '../constants'
import { approve, permit } from '../utils/tokens'

const INITIAL_DATA = { status: 'pending' }

function useSwap () {
  const [data, setData] = useState(INITIAL_DATA)

  const swap = async (wallet, hezTokenContract, swapContract, hezAmount) => {
    setData({ status: 'loading' })

    if (!wallet) {
      setData({ status: 'failed', error: 'Wallet doesn\'t exist' })
      return
    }

    if (!hezTokenContract) {
      setData({ status: 'failed', error: 'HEZ token contract doesn\'t exist' })
      return
    }

    try {
      const usePermit = process.env.REACT_APP_USE_PERMIT === 'true'
      const permitSignature = usePermit
        ? await permit(hezTokenContract, wallet, swapContract, hezAmount)
        : []

      if (!usePermit) {
        await approve(hezTokenContract, wallet, swapContract, hezAmount)
      }

      const txData = await swapContract.bridge(hezAmount, permitSignature, { gasLimit: BRIDGE_GAS_LIMIT })
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
