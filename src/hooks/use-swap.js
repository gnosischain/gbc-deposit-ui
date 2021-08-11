import { useState } from 'react'

import { approve, permit } from '../utils/tokens'

const INITIAL_DATA = { status: 'pending' }

function useSwap () {
  const [data, setData] = useState(INITIAL_DATA)

  const swap = async (wallet, hezTokenContract, swapContract, hezAmount, usePermit) => {
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
      const permitSignature = usePermit
        ? await permit(hezTokenContract, wallet, swapContract, hezAmount)
        : []

      if (!usePermit) {
        await approve(hezTokenContract, wallet, swapContract, hezAmount)
      }

      const txData = await swapContract.bridge(hezAmount, permitSignature, { gasLimit: 150000 })
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
