import useDappnodeHeaderStyles from './dappnodeHeader.styles'
import { ReactComponent as ArrowLeft } from '../../../images/arrow-left.svg'
import { ReactComponent as CrossIcon } from '../../../images/cross-icon.svg'
import infoIcon from '../../../images/info-icon.svg'
import checkIcon from '../../../images/check-icon-small.svg'
import wrongIcon from '../../../images/wrong-icon-small.svg'

const CheckIcon = () =>
  <img style={{ width: 16, height: 16 }} src={checkIcon} alt='' />

  const WrongIcon = () =>
  <img style={{ width: 16, height: 16 }} src={wrongIcon} alt='' />

function DappnodeHeader ({
  address, title, isGoBackButtonDisabled,
  onGoBack, onDisconnectWallet, onClose,
  dappnodeWhitelist
}) {
  const classes = useDappnodeHeaderStyles()

  function getPartiallyHiddenEthereumAddress (ethereumAddress) {
    const firstAddressSlice = ethereumAddress.slice(0, 6)
    const secondAddressSlice = ethereumAddress.slice(
      ethereumAddress.length - 4,
      ethereumAddress.length
    )

    return `${firstAddressSlice} *** ${secondAddressSlice}`
  }

  return (
    <div className={classes.header}>
      {onGoBack && (
        <button
          disabled={isGoBackButtonDisabled}
          className={classes.goBackButton}
          onClick={onGoBack}
        >
          <ArrowLeft />
        </button>
      )}
      {onClose && (
        <button
          className={classes.closeButton}
          onClick={onClose}
        >
          <CrossIcon className={classes.closeIcon} />
        </button>
      )}
      <span className={classes.title}>
        {title}{' '}
        <a
          href="https://medium.com/dappnode/dappnode-and-gnosis-chain-node-incentive-program-73af7d2084f8"
          target='_blank'
          rel='noopener noreferrer'
          data-tip="How to generate deposit_data.json?"
          onClick={e => { e.stopPropagation() }}
        >
          <img alt="" className={classes.infoIcon} src={infoIcon} />
        </a>
      </span>
      {address && (
        <p className={classes.address}>{getPartiallyHiddenEthereumAddress(address)}</p>
      )}
      {dappnodeWhitelist && (
          <p className={classes.dappnodeWhitelist}>{dappnodeWhitelist.isWhitelisted ? <><CheckIcon/> This address is whitelisted</> : <><WrongIcon/> This address can not be used. Reason: {dappnodeWhitelist.message}</>}</p>
      )}
      {onDisconnectWallet && (
        <button className={classes.disconnectButton} onClick={onDisconnectWallet}>Disconnect</button>
      )}
    </div>
  )
}

export default DappnodeHeader
