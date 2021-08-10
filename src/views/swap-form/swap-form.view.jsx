import { formatUnits } from 'ethers/lib/utils'

import useSwapFormStyles from './swap-form.styles'
import useTokenContract from '../../hooks/use-token-contract'
import useTokenInfo from '../../hooks/use-token-info'
import useTokenBalance from '../../hooks/use-token-balance'
import useSwapFormData from '../../hooks/use-swap-form-data'
import { BigNumber } from 'ethers'
import Header from '../header/header.view'

function SwapForm ({ wallet, onSubmit }) {
  const classes = useSwapFormStyles()
  const hezContract = useTokenContract(wallet, process.env.REACT_APP_HEZ_TOKEN_ADDRESS)
  const hezTokenInfo = useTokenInfo(hezContract)
  const hezTokenBalance = useTokenBalance(wallet, hezContract)
  const { values, amounts, error, convertAll, changeValue } = useSwapFormData(wallet, hezTokenBalance, hezTokenInfo)

  return (
    <div>
      <Header />
      <div className={classes.balanceCard}>
        <p className={classes.balance}>
          You have {hezTokenBalance && hezTokenInfo ? formatUnits(hezTokenBalance, hezTokenInfo.decimals) : '--'} {hezTokenInfo && hezTokenInfo.symbol}
        </p>
        {hezTokenBalance && (
          <button
            className={classes.convertAllButton}
            type='button'
            disabled={!wallet}
            onClick={convertAll}
          >
            Convert All
          </button>
        )}
      </div>
      <form
        className={classes.form}
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit(amounts)
        }}
      >
        <div className={classes.fromInputGroup}>
          <p>{hezTokenInfo && hezTokenInfo.symbol}</p>
          <input
            className={classes.fromInput}
            disabled={!hezTokenBalance}
            placeholder='0.0'
            value={values.from}
            onChange={event => changeValue(event.target.value)}
          />

        </div>
        <p className={classes.toValue}>
          {hezTokenInfo && formatUnits(amounts.to, hezTokenInfo.decimals)} MATIC
        </p>
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
