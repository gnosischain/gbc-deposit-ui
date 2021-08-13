import { useEffect, useRef } from 'react'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

import useSwapFormStyles from './swap-form.styles'
import useSwapFormData from '../../hooks/use-swap-form-data'
import Header from '../shared/header/header.view'
import { ReactComponent as InfoIcon } from '../../images/info-icon.svg'

function SwapForm ({ wallet, fromTokenInfo, toTokenInfo, swapRatio, fromTokenBalance, swapData, onAmountChange, onSubmit }) {
  const { values, amounts, error, convertAll, changeValue } = useSwapFormData(wallet, fromTokenBalance, fromTokenInfo, swapRatio)
  const classes = useSwapFormStyles({ error })
  const inputEl = useRef()

  useEffect(() => {
    if (fromTokenBalance && inputEl) {
      inputEl.current.focus()
    }
  }, [fromTokenBalance, inputEl])

  useEffect(() => {
    if (!amounts.from.eq(BigNumber.from(0))) {
      onAmountChange()
    }
  }, [amounts, onAmountChange])

  return (
    <div className={classes.swapForm}>
      <Header
        fromTokenInfo={fromTokenInfo}
        toTokenInfo={toTokenInfo}
      />
      <div className={classes.balanceCard}>
        <p className={classes.balance}>
          You have {fromTokenBalance && formatUnits(fromTokenBalance, fromTokenInfo.decimals)} {fromTokenInfo.symbol}
        </p>
        <button
          className={classes.convertAllButton}
          type='button'
          disabled={!fromTokenBalance}
          onClick={convertAll}
        >
          Convert All
        </button>
      </div>
      <form
        className={classes.form}
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit(amounts.from)
        }}
      >
        <div className={classes.fromInputGroup}>
          <p className={classes.fromTokenSymbol}>
            {fromTokenInfo.symbol}
          </p>
          <input
            ref={inputEl}
            className={classes.fromInput}
            disabled={!fromTokenBalance}
            placeholder='0.0'
            value={values.from}
            onChange={event => changeValue(event.target.value)}
          />
          <p className={classes.toValue}>
            {formatUnits(amounts.to, fromTokenInfo.decimals)} {toTokenInfo.symbol}
          </p>
        </div>
        {error && (
          <div className={classes.inputErrorContainer}>
            <InfoIcon className={classes.inputErrorIcon} />
            <p>{error}</p>
          </div>
        )}
        <button
          className={classes.submitButton}
          disabled={amounts.from.eq(BigNumber.from(0)) || !!error}
          type='submit'
        >
          Convert
        </button>
        {swapData.status === 'failed' && (
          <p className={classes.swapError}>{swapData.error}</p>
        )}
      </form>
    </div>
  )
}

export default SwapForm
