const { useState } = require('react')

export const Step = {
  Login: 'login',
  Swap: 'swap',
  Confirm: 'success'
}

function useStepperData () {
  const [step, setStep] = useState(Step.Login)

  const switchStep = (step) => {
    setStep(step)
  }

  return { step, switchStep }
}

export default useStepperData
