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
        ? await permit(fromTokenContract, wallet, swapContract)
        : []

      if (permitSignature.length === 0) {
        await approve(fromTokenContract, wallet, swapContract)
      }

      const tx = await swapContract.swap(
        process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS,
        amount,
        permitSignature,
        { gasLimit: BRIDGE_GAS_LIMIT }
      )
      setData({ status: 'pending', data: tx })
      await tx.wait()
      setData({ status: 'successful', data: tx })
    } catch (err) {
      let error = 'Transaction failed.'
      if (err?.code === -32603) {
        error = 'Transaction was not sent because of the low gas price. Try to increase it.'
      }
      setData({ status: 'failed', error })
      console.log(err)
    }
  }

  const resetData = () => {
    setData(INITIAL_DATA)
  }

  return { swap, data, resetData }
}

export default useSwap
