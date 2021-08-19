import useHeaderStyles from './header.styles'
import { ReactComponent as ArrowLeft } from '../../../images/arrow-left.svg'

function Header ({ address, fromTokenInfo, toTokenInfo, isGoBackButtonDisabled, onGoBack }) {
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
    </div>
  )
}

export default Header
