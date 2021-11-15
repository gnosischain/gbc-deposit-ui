import { useEffect } from 'react'

import useLoginStyles from './login.styles'
import { ReactComponent as PoaIcon } from '../../images/poa-icon.svg'
import { ReactComponent as SwapArrow } from '../../images/swap-arrow.svg'
import { ReactComponent as ToTokenIcon } from '../../images/to-token-icon.svg'

function Login ({ wallet, onLoadWallet, onGoToNextStep }) {
  const classes = useLoginStyles()

  useEffect(() => {
    if (wallet) {
      onGoToNextStep()
    }
  }, [wallet, onGoToNextStep])

  return (
    <div className={classes.login}>
      <div className={classes.column}>
        <div className={classes.tokenLogos}>
          <PoaIcon width="60" height="60" />
          <SwapArrow className={classes.swapArrow} />
          <ToTokenIcon width="60" height="60" />
        </div>
        <h1 className={classes.title}>Convert POA tokens to STAKE</h1>
        <button
          className={classes.metaMaskButton}
          onClick={onLoadWallet}
        >
          Connect wallet
        </button>
      </div>
      <a
        className={classes.learnMoreLink}
        href="https://poanetwork.page.link/swap"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more about POA to STAKE swap
      </a>
    </div>
  )
}

export default Login
