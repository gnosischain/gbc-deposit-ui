import useTxConfirmStyles from './deposit-tx-confirm.styles'
import Header from '../shared/header/header.view'
import Spinner from '../shared/spinner/spinner.view'
import { useEffect } from 'react'

function TxConfirm ({ wallet, txData, onGoBack, onGoToPendingStep }) {
  const classes = useTxConfirmStyles()

  useEffect(() => {
    if (txData.status === 'failed') {
      onGoBack()
    }
    if (txData.status === 'pending') {
      onGoToPendingStep()
    }
  }, [txData, onGoBack, onGoToPendingStep])

  return (
    <div className={classes.txConfirm}>
      <Header
        address={wallet.address}
        title="Gnosis Beacon Chain Deposit"
      />
      <div className={classes.spinnerWrapper}>
        <Spinner className={classes.title} />
      </div>
      <p className={classes.title}>
        Confirm the transaction in your wallet
      </p>
    </div>
  )
}

export default TxConfirm
