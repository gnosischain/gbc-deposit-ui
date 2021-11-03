import useStepperStyles from './stepper.styles'
import useWallet from '../../hooks/use-wallet'
import useStep, { Step } from '../../hooks/use-stepper-data'
import Login from '../login/login.view'
import SwapForm from '../swap-form/swap-form.view'
import useTokenContract from '../../hooks/use-token-contract'
import useSwapContract from '../../hooks/use-swap-contract'
import useTokenInfo from '../../hooks/use-token-info'
import useTokenBalance from '../../hooks/use-token-balance'
import TxConfirm from '../tx-confirm/tx-confirm.view'
import useSwap from '../../hooks/use-swap'
import TxPending from '../tx-pending/tx-pending.view'
import TxOverview from '../tx-overview/tx-overview.view'
import NetworkError from '../network-error/network-error.view'
import DataLoader from '../data-loader/data-loader'
import useSwapContractInfo from '../../hooks/use-swap-contract-info'

function Stepper () {
  const classes = useStepperStyles()
  const { wallet, loadWallet, disconnectWallet, isMetamask, switchChainInMetaMask } = useWallet()
  const swapContract = useSwapContract(wallet?.provider)
  const { fromTokenAddress, toTokenAddress, swapRatio } = useSwapContractInfo()
  const fromTokenContract = useTokenContract(fromTokenAddress, wallet?.provider)
  const toTokenContract = useTokenContract(toTokenAddress, wallet?.provider)
  const fromTokenInfo = useTokenInfo(fromTokenAddress)
  const toTokenInfo = useTokenInfo(toTokenAddress)
  const fromTokenBalance = useTokenBalance(wallet?.address, fromTokenContract)
  const toTokenBalanceInSwapContract = useTokenBalance(process.env.REACT_APP_SWAP_CONTRACT_ADDRESS, toTokenContract)
  const { step, switchStep } = useStep()
  const { swap, data: swapData, resetData: resetSwapData } = useSwap()

  if (wallet && wallet.chainId !== Number(process.env.REACT_APP_CHAIN_ID)) {
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
                onFinishLoading={() => switchStep(Step.Login)}
              />
            )
          }
          case Step.Login: {
            return (
              <Login
                wallet={wallet}
                fromTokenInfo={fromTokenInfo}
                toTokenInfo={toTokenInfo}
                onLoadWallet={loadWallet}
                onGoToNextStep={() => switchStep(Step.Swap)}
              />
            )
          }
          case Step.Swap: {
            return (
              <SwapForm
                wallet={wallet}
                fromTokenInfo={fromTokenInfo}
                toTokenInfo={toTokenInfo}
                swapRatio={swapRatio}
                fromTokenBalance={fromTokenBalance}
                toTokenBalanceInSwapContract={toTokenBalanceInSwapContract}
                swapData={swapData}
                onAmountChange={resetSwapData}
                onSubmit={(fromAmount) => {
                  swap(wallet, fromTokenContract, swapContract, fromAmount)
                  switchStep(Step.Confirm)
                }}
                onDisconnectWallet={disconnectWallet}
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
                onGoBack={() => switchStep(Step.Swap)}
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
    </div>
  )
}

export default Stepper
