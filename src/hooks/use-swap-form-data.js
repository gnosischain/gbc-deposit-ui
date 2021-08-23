import { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

// ethers BigNumber doesn't support decimals, so we need to workaround it
// using 35 as the SWAP_FACTOR instead of 3.5 and later divide the result by 10
// in the multiplyAmountBySwapFactor function
const INITIAL_VALUES = { from: '', to: '' }
const INITIAL_AMOUNTS = { from: BigNumber.from(0), to: BigNumber.from(0) }

function useSwapFormData (wallet, maxTokenAmount, tokenInfo, swapRatio, toTokenBalanceInSwapContract) {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [error, setError] = useState()
  const [amounts, setAmounts] = useState(INITIAL_AMOUNTS)

  useEffect(() => {
    setValues(INITIAL_VALUES)
    setAmounts(INITIAL_AMOUNTS)
    setError()
  }, [wallet])

  const multiplyAmountBySwapFactor = (value) => value.mul(swapRatio).div(1000)

  const changeValue = (newFromValue) => {
    const INPUT_REGEX = new RegExp(`^\\d*(?:\\.\\d{0,${tokenInfo.decimals}})?$`)
    if (INPUT_REGEX.test(newFromValue)) {
      try {
        const newFromAmount = parseUnits(newFromValue.length > 0 ? newFromValue : '0', tokenInfo.decimals)
        const newToAmount = multiplyAmountBySwapFactor(newFromAmount)

        setAmounts({ from: newFromAmount, to: newToAmount })
        setValues({ from: newFromValue, to: formatUnits(newToAmount, tokenInfo.decimals) })

        if (newFromAmount.gt(maxTokenAmount)) {
          setError('You don\'t have enough funds')
        } else if (newToAmount.gt(toTokenBalanceInSwapContract)) {
          setError('Oops, at this moment there are not enough MATIC tokens available for your conversion request. For security reasons, pooled tokens are added in batches as they are requested. Please try again in a few hours and you will be able to swap your HEZ tokens. You can also contact us via email at hello@hermez.network')
        } else {
          setError()
        }
      } catch (err) { console.log(err) }
    }
  }

  const convertAll = () => {
    if (maxTokenAmount && tokenInfo) {
      const newToAmount = multiplyAmountBySwapFactor(maxTokenAmount)

      setAmounts({ from: maxTokenAmount, to: newToAmount })
      setValues({
        from: formatUnits(maxTokenAmount, tokenInfo.decimals),
        to: formatUnits(newToAmount, tokenInfo.decimals)
      })
      if (newToAmount.gt(toTokenBalanceInSwapContract)) {
        setError('Oops, at this moment there are not enough MATIC tokens available for your conversion request. For security reasons, pooled tokens are added in batches as they are requested. Please try again in a few hours and you will be able to swap your HEZ tokens. You can also contact us via email at hello@hermez.network')
      } else {
        setError()
      }
    }
  }

  return { values, amounts, error, setError, changeValue, convertAll }
}

export default useSwapFormData
