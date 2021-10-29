import useNetworkErrorStyles from './network-error.styles'
import { ReactComponent as SwitchNetwork } from '../../images/switch-network.svg'

const NETWORKS = {
  '1': 'Ethereum Mainnet',
  '4': 'Rinkeby',
  '100': 'xDai Chain'
}
function NetworkError () {
  const classes = useNetworkErrorStyles()

  return (
    <div className={classes.networkError}>
      <SwitchNetwork />
      <p className={classes.title}>Switch Network</p>
      <p className={classes.description}>Select the {NETWORKS[process.env.REACT_APP_CHAIN_ID]} network in your Metamask wallet to connect.</p>
    </div>
  )
}

export default NetworkError
