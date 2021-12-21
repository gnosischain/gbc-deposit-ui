import useHeaderStyles from './header.styles'
import { ReactComponent as ArrowLeft } from '../../../images/arrow-left.svg'

function Header ({
  address, title, isGoBackButtonDisabled,
  onGoBack, onDisconnectWallet
}) {
  const classes = useHeaderStyles()

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
      <p className={classes.title}>{title}</p>
      <p className={classes.address}>{getPartiallyHiddenEthereumAddress(address)}</p>
      {onDisconnectWallet && (
        <button className={classes.disconnectButton} onClick={onDisconnectWallet}>Disconnect</button>
      )}
    </div>
  )
}

export default Header
