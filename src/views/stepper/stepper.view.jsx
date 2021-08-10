import useStepperStyles from './stepper.styles'
import useWallet from '../../hooks/use-wallet'
import useStep, { Step } from '../../hooks/use-stepper-data'
import Login from '../login/login.view'
import SwapForm from '../swap-form/swap-form.view'

function Stepper () {
  const classes = useStepperStyles()
  const { wallet, loadWallet } = useWallet()
  const { step, switchStep } = useStep()

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
                onSubmit={(amounts) => console.log(amounts)}
              />
            )
          }
          case Step.Confirm: {
            return
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
