import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

import useSwapFormStyles from './swap-form.styles'
import useTokenContract from '../../hooks/use-token-contract'
import useTokenInfo from '../../hooks/use-token-info'
import useTokenBalance from '../../hooks/use-token-balance'
import useSwapFormData from '../../hooks/use-swap-form-data'
import Header from '../header/header.view'
import { ReactComponent as InfoIcon } from '../../images/info-icon.svg'
import { TO_TOKEN_SYMBOL } from '../../constants'

function SwapForm ({ wallet, onSubmit }) {
  const hezContract = useTokenContract(wallet, process.env.REACT_APP_HEZ_TOKEN_ADDRESS)
  const hezTokenInfo = useTokenInfo(hezContract)
  const hezTokenBalance = useTokenBalance(wallet, hezContract)
  const { values, amounts, error, convertAll, changeValue } = useSwapFormData(wallet, hezTokenBalance, hezTokenInfo)
  const classes = useSwapFormStyles({ error })

  return (
    <div>
      <Header />
      <div className={classes.balanceCard}>
        <p className={classes.balance}>
          You have {hezTokenBalance && hezTokenInfo ? formatUnits(hezTokenBalance, hezTokenInfo.decimals) : '--'} {hezTokenInfo && hezTokenInfo.symbol}
        </p>
        <button
          className={classes.convertAllButton}
          type='button'
          disabled={!hezTokenBalance}
          onClick={convertAll}
        >
          Convert All
        </button>
      </div>
      <form
        className={classes.form}
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit(amounts)
        }}
      >
        <div className={classes.fromInputGroup}>
          <p className={classes.fromTokenSymbol}>
            {hezTokenInfo && hezTokenInfo.symbol}
          </p>
          <input
            className={classes.fromInput}
            disabled={!hezTokenBalance}
            placeholder='0.0'
            value={values.from}
            onChange={event => changeValue(event.target.value)}
          />
          <p className={classes.toValue}>
            {hezTokenInfo && formatUnits(amounts.to, hezTokenInfo.decimals)} {TO_TOKEN_SYMBOL}
          </p>
        </div>
        {error && (
          <div className={classes.errorContainer}>
            <InfoIcon className={classes.errorIcon} />
            <p className={classes.error}>{error}</p>
          </div>
        )}
        <button
          className={classes.submitButton}
          disabled={amounts.from.eq(BigNumber.from(0)) || !!error}
          type='submit'
        >
          Convert
        </button>
      </form>
    </div>
  )
}

export default SwapForm
