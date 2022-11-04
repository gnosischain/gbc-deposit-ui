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

function Stepper () {
  const classes = useStepperStyles()
  const { wallet, loadWallet, disconnectWallet, isMetamask, switchChainInMetaMask } = useWallet()
  const dappnodeContract = useDappnodeContract(process.env.REACT_APP_DAPPNODE_DEPOSIT_CONTRACT_ADDRESS, wallet)
  const tokenContract = useTokenContract(process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS, wallet)
  const tokenInfo = useTokenInfo(process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS, wallet)
  const tokenBalance = useTokenBalance(wallet?.address, tokenContract)
  const dappnodeWhitelist = useDappnodeWhitelist(wallet?.address, dappnodeContract)
  const { step, switchStep } = useStep()
  const {
    deposit, txData: depositTxData, depositData, setDepositData
  } = useDeposit(wallet, tokenInfo)
  const {
    dappNodeDeposit, txData: dappNodeDepositTxData, dappNodeDepositData, setDappNodeDepositData
  } = useDappNodeDeposit(wallet)

  const tabs = [
    { name: 'Deposit', step: Step.Deposit },
  ]
  if(process.env.REACT_APP_DAPPNODE_DEPOSIT_CONTRACT_ADDRESS !== "")
    tabs.push({ name: 'DAppNode', step: Step.DappNodeDeposit })
  tabs.push({ name: 'Validator Status', step: Step.ValidatorStatus })

  const [activeTab, setActiveTab] = useState(tabs[0].name)

  const selectTab = useCallback((tab) => {
    if (activeTab === tab.name) return
    setDepositData(null, null)
    setActiveTab(tab.name)
    switchStep(tab.step)
  }, [activeTab, switchStep, setDepositData])

  if (wallet && wallet.chainId !== process.env.REACT_APP_NETWORK_ID) {
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
              disabled={![Step.Deposit, Step.DappNodeDeposit, Step.DepositOverview, Step.ValidatorStatus].includes(step)}
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
