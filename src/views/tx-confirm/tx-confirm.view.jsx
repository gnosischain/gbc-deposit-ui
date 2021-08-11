import useTxConfirmStyles from './tx-confirm.styles'
import Header from '../header/header.view'
import Spinner from '../spinner/spinner.view'
import { useEffect } from 'react'

function TxConfirm ({ swapData, onGoBack, onGoToOverviewStep }) {
  const classes = useTxConfirmStyles()

  useEffect(() => {
    if (swapData.status === 'failed') {
      onGoBack()
    }
    if (swapData.status === 'successful') {
      onGoToOverviewStep()
    }
  }, [swapData, onGoBack, onGoToOverviewStep])

  return (
    <div className={classes.txConfirm}>
      <Header
        isGoBackButtonDisabled={swapData.status === 'loading'}
        onGoBack={onGoBack}
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
