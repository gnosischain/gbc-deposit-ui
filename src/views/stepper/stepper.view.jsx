import { useState, useCallback } from 'react'
import useStepperStyles from './stepper.styles'
import useWallet from '../../hooks/use-wallet'
import useStep, { Step } from '../../hooks/use-stepper-data'
import Login from '../login/login.view'
import Deposit from '../deposit/deposit.view'
import useTokenContract from '../../hooks/use-token-contract'
import useTokenInfo from '../../hooks/use-token-info'
import useTokenBalance from '../../hooks/use-token-balance'
import useDeposit from '../../hooks/use-deposit'
import useDappNodeDeposit from '../../hooks/use-dappnode-deposit'
import NetworkError from '../network-error/network-error.view'
import DataLoader from '../data-loader/data-loader'
import LearnMoreLink from '../shared/learnMoreLink/learMoreLink.view'
import DepositTxConfirm from '../deposit-tx-confirm/deposit-tx-confirm.view'
import DepositTxPending from '../deposit-tx-pending/deposit-tx-pending.view'
import DepositTxOverview from '../deposit-tx-overview/deposit-tx-overview.view'
import DepositRisksInfo from '../deposit-risks-info/deposit-risks-info.view'
import ValidatorStatus from '../validator-status/validator-status.view'
import useDappnodeWhitelist from '../../hooks/use-dappnode-whitelist'
import useDappnodeContract from '../../hooks/use-dappnode-contract'
import { NETWORKS } from '../../constants';
import WithdrawalClaim from '../withdrawal-claim/withdrawal-claim.view'

function Stepper () {
  const classes = useStepperStyles()
  const { wallet, loadWallet, disconnectWallet, isMetamask, switchChainInMetaMask } = useWallet()
  const network = wallet ? NETWORKS[wallet.chainId] : null;
  const dappnodeContract = useDappnodeContract(network?.addresses.dappnodeDeposit, wallet)
  const tokenContract = useTokenContract(network?.addresses.token, wallet)
  const tokenInfo = useTokenInfo(network?.addresses.token, wallet)
  const tokenBalance = useTokenBalance(wallet?.address, tokenContract)
  const dappnodeWhitelist = useDappnodeWhitelist(wallet?.address, dappnodeContract)
  const { step, switchStep } = useStep()
  const {
    deposit, txData: depositTxData, depositData, setDepositData
  } = useDeposit(wallet, network, tokenInfo)
  const {
    dappNodeDeposit, txData: dappNodeDepositTxData, dappNodeDepositData, setDappNodeDepositData
  } = useDappNodeDeposit(wallet, network)

  const tabs = [{ name: 'Deposit', step: Step.Deposit }]
  if(network && network.addresses.dappnodeDeposit)
    tabs.push({ name: 'DAppNode', step: Step.DappNodeDeposit })
  tabs.push({name:'Withdrawal Claim', step: Step.WithdrawalClaim })
  tabs.push({ name: 'Validator Status', step: Step.ValidatorStatus })

  const [activeTab, setActiveTab] = useState(tabs[0].name)

  const selectTab = useCallback((tab) => {
    if (activeTab === tab.name) return
    setDepositData(null, null)
    setActiveTab(tab.name)
    switchStep(tab.step)
  }, [activeTab, switchStep, setDepositData])

  var isValidNetwork = false
  if(wallet && wallet.chainId){
    var supportedNetworks = process.env.REACT_APP_NETWORK_IDS.split(",")
    isValidNetwork = supportedNetworks.includes(wallet.chainId)


    //console.log(supportedNetworks)
    //console.log(wallet.chainId)
    //console.log(isValidNetwork)
  }



  if (wallet && !isValidNetwork) {
    return (
      <div className={classes.stepper}>
        <NetworkError {...{ isMetamask, switchChainInMetaMask }} />
      </div>
    )
  }

  return (
    <div className={classes.container}>
      {![Step.Login, Step.Loading].includes(step) && (
        <div className={classes.tabs}>
          {tabs.map(tab =>
            <button
              key={tab.name}
              className={activeTab === tab.name ? classes.tabActive : classes.tab}
              onClick={() => selectTab(tab)}
              disabled={![Step.Deposit, Step.DappNodeDeposit, Step.DepositOverview, Step.ValidatorStatus, Step.WithdrawalClaim].includes(step)}
            >
              <span className={classes.tabName}>{tab.name}</span>
            </button>
          )}
        </div>
      )}
      <div className={classes.stepper}>
        {(() => {
          switch (step) {
            case Step.Loading: {
              return (
                <DataLoader
                  tokenInfo={tokenInfo}
                  onFinishLoading={() => switchStep(Step.Deposit)}
                />
              )
            }
            case Step.Login: {
              return (
                <Login
                  wallet={wallet}
                  onLoadWallet={loadWallet}
                  onGoToNextStep={() => switchStep(Step.Loading)}
                />
              )
            }
            case Step.DappNodeDeposit: {
              return (
                <Deposit
                  network={network}
                  wallet={wallet}
                  tokenInfo={tokenInfo}
                  balance={tokenBalance}
                  onDisconnectWallet={disconnectWallet}
                  onGoNext={() => switchStep(Step.DepositRisksInfo)}
                  depositData={dappNodeDepositData}
                  setDepositData={setDappNodeDepositData}
                  dappNode={true}
                  dappnodeWhitelist={dappnodeWhitelist}
                />
              )
            }
            case Step.Deposit: {
              return (
                <Deposit
                  network={network}
                  wallet={wallet}
                  tokenInfo={tokenInfo}
                  balance={tokenBalance}
                  onDisconnectWallet={disconnectWallet}
                  onGoNext={() => switchStep(Step.DepositRisksInfo)}
                  depositData={depositData}
                  setDepositData={setDepositData}
                  dappNode={false}
                  dappnodeWhitelist={dappnodeWhitelist}
                />
              )
            }
            case Step.DepositRisksInfo: {
              return (
                <DepositRisksInfo
                  deposit={() => {
                    if(activeTab === "DAppNode") {
                      dappNodeDeposit()
                    } else {
                      deposit()
                    }
                    switchStep(Step.DepositConfirm)
                  }}
                  wallet={wallet}
                  onClose={() => switchStep(Step.Deposit)}
                />
              )
            }
            case Step.DepositConfirm: {
              return (
                <DepositTxConfirm
                  wallet={wallet}
                  txData={activeTab === "DAppNode" ? dappNodeDepositTxData : depositTxData}
                  onGoBack={() => switchStep(Step.Deposit)}
                  onGoToPendingStep={() => switchStep(Step.DepositPending)}
                />
              )
            }
            case Step.DepositPending: {
              return (
                <DepositTxPending
                  wallet={wallet}
                  txData={activeTab === "DAppNode" ? dappNodeDepositTxData : depositTxData}
                  onGoBack={() => switchStep(Step.Deposit)}
                  onGoToOverviewStep={() => switchStep(Step.DepositOverview)}
                />
              )
            }
            case Step.DepositOverview: {
              return (
                <DepositTxOverview
                  wallet={wallet}
                  txData={activeTab === "DAppNode" ? dappNodeDepositTxData : depositTxData}
                  onGoBack={() => window.location.reload()}
                  onDisconnectWallet={disconnectWallet}
                  isMetamask={isMetamask}
                />
              )
            }
            case Step.ValidatorStatus: {
              return (
                <ValidatorStatus
                  wallet={wallet}
                  network={network}
                  tokenInfo={tokenInfo}
                  balance={tokenBalance}
                  onDisconnectWallet={disconnectWallet}
                  onGoNext={() => switchStep(Step.DepositRisksInfo)}
                  depositData={depositData}
                  setDepositData={setDepositData}
                  dappNode={false}
                  dappnodeWhitelist={dappnodeWhitelist}
                />
              )
            }
            case Step.WithdrawalClaim: {
              return <WithdrawalClaim
                wallet={wallet}
                network={network}
                tokenInfo={tokenInfo}
                balance={tokenBalance}
                onDisconnectWallet={disconnectWallet} />
            }
            default: {
              return <></>
            }
          }
        })()}
        <LearnMoreLink />
      </div>
    </div>
  )
}

export default Stepper
