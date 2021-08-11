import { useState } from 'react'
import { Contract } from 'ethers'

import swapperABI from '../abis/swapper'

const INITIAL_DATA = { status: 'pending' }

function useSwap () {
  const [data, setData] = useState(INITIAL_DATA)

  const swap = async (wallet, hezTokenContract, hezAmount) => {
    const spender = process.env.REACT_APP_SWAP_CONTRACT_ADDRESS

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
      const hezAllowance = await hezTokenContract.allowance(wallet.address, spender)
      const swapperContract = new Contract(spender, swapperABI, wallet.provider.getSigner())

      if (hezAllowance.lt(hezAmount)) {
        await hezTokenContract.approve(spender, hezAmount)
      }

      const txData = await swapperContract.bridge(hezAmount, [], { gasLimit: 150000 })
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
