import { useEffect } from 'react'

import useLoginStyles from './login.styles'
import { ReactComponent as FromTokenIcon } from '../../images/from-token-icon.svg'
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
          <FromTokenIcon width="60" height="60" />
          <SwapArrow className={classes.swapArrow} />
          <ToTokenIcon width="60" height="60" />
        </div>
        <h1 className={classes.title}>Convert STAKE tokens to GNO</h1>
        <button
          className={classes.metaMaskButton}
          onClick={onLoadWallet}
        >
          Connect wallet
        </button>
      </div>
      <a
        className={classes.learnMoreLink}
        href="https://forum.gnosis.io/t/gip-16-gnosis-chain-xdai-gnosis-merge/1904"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more about STAKE to GNO swap
      </a>
    </div>
  )
}

export default Login
