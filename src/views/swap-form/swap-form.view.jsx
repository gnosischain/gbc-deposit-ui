import React from 'react'
import { formatUnits } from 'ethers/lib/utils'

import useSwapFormStyles from './swap-form.styles'
import useTokenContract from '../../hooks/use-token-contract'
import useTokenInfo from '../../hooks/use-token-info'
import useTokenBalance from '../../hooks/use-token-balance'
import useSwapFormData from '../../hooks/use-swap-form-data'
import { BigNumber } from 'ethers'

function SwapForm ({ wallet }) {
  const classes = useSwapFormStyles()
  const hezContract = useTokenContract(wallet, process.env.REACT_APP_HEZ_TOKEN_ADDRESS)
  const hezTokenInfo = useTokenInfo(hezContract)
  const hezTokenBalance = useTokenBalance(wallet, hezContract)
  const { values, amounts, error, sendMax, changeValue } = useSwapFormData(wallet, hezTokenBalance, hezTokenInfo)

  return (
    <form
      className={classes.form}
      onSubmit={(event) => {
        event.preventDefault()
        console.log('trying to send:', amounts)
      }}
    >
      <div className={classes.fromInputGroup}>
        <div className={classes.fromInputWrapper}>
          <input
            className={classes.fromInput}
            disabled={!hezTokenBalance}
            placeholder='0.0'
            value={values.from}
            onChange={event => changeValue(event.target.value)}
          />
          {hezTokenInfo && (
            <button
              type='button'
              disabled={!wallet}
              onClick={sendMax}
            >
              Send max
            </button>
          )}
        </div>
        <p className={classes.fromTokenBalance}>
          You have {hezTokenBalance && hezTokenInfo ? formatUnits(hezTokenBalance, hezTokenInfo.decimals) : '--'} {hezTokenInfo && hezTokenInfo.symbol}
        </p>
      </div>
      <input
        className={classes.toInput}
        disabled
        placeholder='0.0'
        value={values.to}
      />
      {error && <p className={classes.error}>{error}</p>}
      <button
        disabled={amounts.from.eq(BigNumber.from(0)) || !!error}
        type='submit'
      >
        Swap
      </button>
    </form>
  )
}

export default SwapForm
