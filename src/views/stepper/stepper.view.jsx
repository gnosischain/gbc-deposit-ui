import useStepperStyles from './stepper.styles'
import useWallet from '../../hooks/use-wallet'
import useStep, { Step } from '../../hooks/use-stepper-data'
import Login from '../login/login.view'
import SwapForm from '../swap-form/swap-form.view'
import useTokenContract from '../../hooks/use-token-contract'
import useSwapContract from '../../hooks/use-swap-contract'
import useSwapContractInfo from '../../hooks/use-swap-contract-info'
import useTokenInfo from '../../hooks/use-token-info'
import useTokenBalance from '../../hooks/use-token-balance'
import TxConfirm from '../tx-confirm/tx-confirm.view'
import useSwap from '../../hooks/use-swap'
import TxPending from '../tx-pending/tx-pending.view'
import TxOverview from '../tx-overview/tx-overview.view'
import NetworkError from '../network-error/network-error.view'
import DataLoader from '../data-loader/data-loader'
import LearnMoreLink from '../shared/learnMoreLink/learMoreLink.view'

function Stepper () {
  const classes = useStepperStyles()
  const { wallet, loadWallet, disconnectWallet, isMetamask, switchChainInMetaMask } = useWallet()
  const swapContract = useSwapContract(wallet)
  const { swapRatio } = useSwapContractInfo(wallet)
  const fromTokenContract = useTokenContract(process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS, wallet)
  const toTokenContract = useTokenContract(process.env.REACT_APP_WRAPPED_TOKEN_CONTRACT_ADDRESS, wallet)
  const fromTokenInfo = useTokenInfo(process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS, wallet)
  const toTokenInfo = useTokenInfo(process.env.REACT_APP_WRAPPED_TOKEN_CONTRACT_ADDRESS, wallet)
  const fromTokenBalance = useTokenBalance(wallet?.address, fromTokenContract)
  const { step, switchStep } = useStep()
  const { swap, data: swapData, resetData: resetSwapData } = useSwap()

  if (wallet && wallet.chainId !== process.env.REACT_APP_NETWORK_ID) {
    return (
      <div className={classes.stepper}>
        <NetworkError {...{ isMetamask, switchChainInMetaMask }} />
      </div>
    )
  }

  return (
    <div className={classes.stepper}>
      {(() => {
        switch (step) {
          case Step.Loading: {
            return (
              <DataLoader
                fromTokenInfo={fromTokenInfo}
                toTokenInfo={toTokenInfo}
                onFinishLoading={() => switchStep(Step.Swap)}
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
          case Step.Swap: {
            return (
              <SwapForm
                wallet={wallet}
                fromTokenInfo={fromTokenInfo}
                toTokenInfo={toTokenInfo}
                fromTokenBalance={fromTokenBalance}
                swapData={swapData}
                onAmountChange={resetSwapData}
                onSubmit={(fromAmount) => {
                  swap(wallet, fromTokenContract, swapContract, fromAmount)
                  switchStep(Step.Confirm)
                }}
                onDisconnectWallet={disconnectWallet}
                isMetamask={isMetamask}
                switchChainInMetaMask={switchChainInMetaMask}
                swapRatio={swapRatio}
              />
            )
          }
          case Step.Confirm: {
            return (
              <TxConfirm
                wallet={wallet}
                fromTokenInfo={fromTokenInfo}
                toTokenInfo={toTokenInfo}
                swapData={swapData}
                onGoBack={() => switchStep(Step.Swap)}
                onGoToPendingStep={() => switchStep(Step.Pending)}
              />
            )
          }
          case Step.Pending: {
            return (
              <TxPending
                wallet={wallet}
                fromTokenInfo={fromTokenInfo}
                toTokenInfo={toTokenInfo}
                swapData={swapData}
                onGoBack={() => switchStep(Step.Swap)}
                onGoToOverviewStep={() => switchStep(Step.Overview)}
              />
            )
          }
          case Step.Overview: {
            return (
              <TxOverview
                wallet={wallet}
                fromTokenInfo={fromTokenInfo}
                toTokenInfo={toTokenInfo}
                swapData={swapData}
                onGoBack={() => window.location.reload()}
                onDisconnectWallet={disconnectWallet}
                isMetamask={isMetamask}
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
  )
}

export default Stepper
