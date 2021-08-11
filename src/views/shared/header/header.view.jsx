import useHeaderStyles from './header.styles'
import { ReactComponent as ArrowLeft } from '../../../images/arrow-left.svg'

function Header ({ fromTokenInfo, toTokenInfo, isGoBackButtonDisabled, onGoBack }) {
  const classes = useHeaderStyles()

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
    </div>
  )
}

export default Header
