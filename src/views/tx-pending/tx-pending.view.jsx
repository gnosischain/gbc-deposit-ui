import { useEffect } from 'react'
import Header from '../shared/header/header.view'
import useTxPendingStyles from './tx-pending.styles'
import { ReactComponent as LinkIcon } from '../../images/link-icon.svg'
import Spinner from '../shared/spinner/spinner.view'

const explorerUrl = {
  1: 'https://etherscan.io/tx/',
  4: 'https://rinkeby.etherscan.io/tx/',
  100: 'https://blockscout.com/xdai/mainnet/tx/'
}

function TxPending ({ wallet, swapData, fromTokenInfo, toTokenInfo, onGoBack, onGoToOverviewStep }) {
  const classes = useTxPendingStyles()

  useEffect(() => {
    if (swapData.status === 'failed') {
      onGoBack()
    }
    if (swapData.status === 'successful') {
      onGoToOverviewStep()
    }
  }, [swapData, onGoBack, onGoToOverviewStep])

  return (
    <div className={classes.txOverview}>
      <Header
        address={wallet.address}
        fromTokenInfo={fromTokenInfo}
        toTokenInfo={toTokenInfo}
        chainId={wallet.chainId}
      />
      <div className={classes.spinnerWrapper}>
        <Spinner className={classes.title} />
      </div>
      <p className={classes.title}>{fromTokenInfo.symbol} token conversion to {toTokenInfo.symbol} has been initiated.</p>
      <div className={classes.buttonGroup}>
        <a
          className={classes.button}
          href={`${explorerUrl[wallet.chainId]}${swapData?.data?.hash}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          Check transaction status here
          <LinkIcon className={classes.buttonIcon} />
        </a>
      </div>
    </div>
  )
}

export default TxPending
