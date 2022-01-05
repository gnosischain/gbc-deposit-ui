const { useState } = require('react')

export const Step = {
  Loading: 'loading',
  Login: 'login',
  Swap: 'swap',
  Confirm: 'confirm',
  Pending: 'pending',
  Overview: 'overview',
  DappNodeDeposit: 'dappnode_deposit',
  Deposit: 'deposit',
  DepositConfirm: 'deposit_confirm',
  DepositPending: 'deposit_pending',
  DepositOverview: 'deposit_overview',
}

function useStepperData () {
  const [step, setStep] = useState(Step.Login)

  const switchStep = (step) => {
    setStep(step)
  }

  return { step, switchStep }
}

export default useStepperData
