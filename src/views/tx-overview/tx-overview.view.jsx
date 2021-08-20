import Header from '../shared/header/header.view'
import useTxOverviewStyles from './tx-overview.styles'
import { ReactComponent as CheckIcon } from '../../images/check-icon.svg'
import { ReactComponent as LinkIcon } from '../../images/link-icon.svg'
import { ReactComponent as MetaMaskLogo } from '../../images/metamask-logo.svg'
import useWatchAsset from '../../hooks/use-watch-asset'

function TxOverview ({ wallet, swapData, fromTokenInfo, toTokenInfo }) {
  const classes = useTxOverviewStyles()
  const watchAsset = useWatchAsset()
  const etherscanUrl = wallet.chainId === 1
    ? `https://etherscan.io/tx/${swapData.data.hash}`
    : `https://rinkeby.etherscan.io/tx/${swapData.data.hash}`

  return (
    <div className={classes.txOverview}>
      <Header
        address={wallet.address}
        fromTokenInfo={fromTokenInfo}
        toTokenInfo={toTokenInfo}
      />
      <CheckIcon className={classes.checkIcon} />
      <p className={classes.title}>{fromTokenInfo.symbol} token conversion to {toTokenInfo.symbol} has been initiated.</p>
      <div className={classes.buttonGroup}>
        <a
          className={classes.button}
          href={etherscanUrl}
          target='_blank'
          rel='noopener noreferrer'
        >
          Check the status here
          <LinkIcon className={classes.buttonIcon} />
        </a>
        <button
          className={classes.button}
          onClick={() => watchAsset(wallet, toTokenInfo)}
        >
          Add {toTokenInfo.symbol} token to MetaMask
          <MetaMaskLogo className={classes.buttonIcon} />
        </button>
      </div>
    </div>
  )
}

export default TxOverview
