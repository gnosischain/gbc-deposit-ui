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
import TxOverview from '../tx-overview/tx-overview.view'

function Stepper () {
  const classes = useStepperStyles()
  const { wallet, loadWallet } = useWallet()
  const fromTokenContract = useTokenContract(wallet, process.env.REACT_APP_FROM_TOKEN_ADDRESS)
  const toTokenContract = useTokenContract(wallet, process.env.REACT_APP_TO_TOKEN_ADDRESS)
  const swapContract = useSwapContract(wallet)
  const fromTokenInfo = useTokenInfo(fromTokenContract)
  const toTokenInfo = useTokenInfo(toTokenContract)
  const fromTokenBalance = useTokenBalance(wallet, fromTokenContract)
  const { step, switchStep } = useStep()
  const { swap, data: swapData, resetData: resetSwapData } = useSwap()

  return (
    <div className={classes.stepper}>
      {(() => {
        switch (step) {
          case Step.Login: {
            return (
              <Login
                wallet={wallet}
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
                fromTokenBalance={fromTokenBalance}
                swapData={swapData}
                onAmountChange={resetSwapData}
                onSubmit={(fromAmount) => {
                  swap(wallet, fromTokenContract, swapContract, fromAmount)
                  switchStep(Step.Confirm)
                }}
              />
            )
          }
          case Step.Confirm: {
            return (
              <TxConfirm
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
                swapData={swapData}
                fromTokenInfo={fromTokenInfo}
                toTokenInfo={toTokenInfo}
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
