const { useState } = require('react')

export const Step = {
  Loading: 'loading',
  Login: 'login',
  Swap: 'swap',
  Confirm: 'confirm',
  Overview: 'overview'
}

function useStepperData () {
  const [step, setStep] = useState(Step.Loading)

  const switchStep = (step) => {
    setStep(step)
  }

  return { step, switchStep }
}

export default useStepperData
