import useTxConfirmStyles from './tx-confirm.styles'
import Header from '../shared/header/header.view'
import Spinner from '../shared/spinner/spinner.view'
import { useEffect } from 'react'

function TxConfirm ({ wallet, fromTokenInfo, toTokenInfo, swapData, onGoBack, onGoToPendingStep }) {
  const classes = useTxConfirmStyles()

  useEffect(() => {
    if (swapData.status === 'failed') {
      onGoBack()
    }
    if (swapData.status === 'pending') {
      onGoToPendingStep()
    }
  }, [swapData, onGoBack, onGoToPendingStep])

  return (
    <div className={classes.txConfirm}>
      <Header
        address={wallet.address}
        fromTokenInfo={fromTokenInfo}
        toTokenInfo={toTokenInfo}
      />
      <div className={classes.spinnerWrapper}>
        <Spinner className={classes.title} />
      </div>
      <p className={classes.title}>
        Confirm the transaction in MetaMask
      </p>
    </div>
  )
}

export default TxConfirm
