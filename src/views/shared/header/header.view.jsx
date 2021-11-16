import useHeaderStyles from './header.styles'
import { ReactComponent as ArrowLeft } from '../../../images/arrow-left.svg'

import Select from '../network-select/network-select.view'

function Header ({
  address, fromTokenInfo, toTokenInfo, isGoBackButtonDisabled,
  onGoBack, onDisconnectWallet, isMetamask, switchChainInMetaMask, chainId
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
      <p className={classes.title}>{fromTokenInfo.symbol} → {toTokenInfo.symbol}</p>
      <p className={classes.address}>{getPartiallyHiddenEthereumAddress(address)}</p>
      <Select
        chainId={chainId}
        isMetamask={isMetamask}
        switchChainInMetaMask={switchChainInMetaMask}
      />
      {onDisconnectWallet && (
        <button className={classes.disconnectButton} onClick={onDisconnectWallet}>Disconnect</button>
      )}
    </div>
  )
}

export default Header
