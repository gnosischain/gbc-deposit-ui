import Header from '../shared/header/header.view'
import useTxOverviewStyles from './tx-overview.styles'
import { ReactComponent as CheckIcon } from '../../images/check-icon.svg'
import { ReactComponent as LinkIcon } from '../../images/link-icon.svg'
import { ReactComponent as MetaMaskLogo } from '../../images/metamask-logo.svg'
import useWatchAsset from '../../hooks/use-watch-asset'

import { NETWORKS } from '../../constants'

function TxOverview ({ wallet, swapData, fromTokenInfo, toTokenInfo, onGoBack, onDisconnectWallet, isMetamask, toTokenBalance }) {
  const classes = useTxOverviewStyles()
  const watchAsset = useWatchAsset()

  return (
    <div className={classes.txOverview}>
      <Header
        address={wallet.address}
        title={`${fromTokenInfo.symbol} → ${toTokenInfo.symbol}`}
        onGoBack={onGoBack}
        onDisconnectWallet={onDisconnectWallet}
        tokenInfo={toTokenInfo}
        balance={toTokenBalance}
      />
      <CheckIcon className={classes.checkIcon} />
      <p className={classes.title}>{fromTokenInfo.symbol} token conversion to {toTokenInfo.symbol} has been completed.</p>
      <div className={classes.buttonGroup}>
        <a
          className={classes.button}
          href={`${NETWORKS[wallet.chainId].blockExplorerUrl}/tx/${swapData.data.hash}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          Check transaction details here
          <LinkIcon className={classes.buttonIcon} />
        </a>
        {isMetamask && (
          <button
            className={classes.button}
            onClick={() => watchAsset(wallet, toTokenInfo)}
          >
            Add {toTokenInfo.symbol} token to MetaMask
            <MetaMaskLogo className={classes.buttonIcon} />
          </button>
        )}
      </div>
    </div>
  )
}

export default TxOverview
