import { useState, useCallback } from 'react'
import useStyles from './deposit-risks-info.styles'
import Header from '../shared/header/header.view'
import Checkbox from '../shared/checkbox/checkbox.view'

import { ReactComponent as LinkIcon } from '../../images/link-icon.svg'

const checkboxLabels = [
  'I understand that I will not be able to withdraw my funds if I lose my mnemonic phrase',
  'I understand the slashing risks',
  'I understand that this transaction is not reversable'
]

const titles = {
  risks: 'Understanding the risks',
  phishing: `Make sure you aren't being phished`
}

function DepositRisksInfo ({ wallet, deposit, onClose }) {
  const classes = useStyles()
  const [step, setStep] = useState('risks')
  const [checkboxValues, setCheckboxValues] = useState([false, false, false])

  const toggleCheckbox = useCallback((index) => {
    const values = [...checkboxValues]
    values[index] = !values[index]
    setCheckboxValues(values)
  }, [checkboxValues])

  let component
  if (step === 'risks') {
    component = (
      <>
        <div>
          {checkboxLabels.map((label, index) =>
            <Checkbox key={label} checked={checkboxValues[index]} onClick={() => toggleCheckbox(index)}>
              {label}
            </Checkbox>
          )}
        </div>
        <button
          className={classes.button}
          disabled={checkboxValues.some(checked => !checked)}
          onClick={() => setStep('phishing')}
        >Ok</button>
      </>
    )
  } else if (step === 'phishing') {
    component = (
      <>
        <div className={classes.textContainer}>
          <p className={classes.text}>
            You are responsible for the transaction.<br />
            Fraudulent websites might try to lure you into sending funds to them,{' '}
            instead of the official deposit contract. Make sure that you are sending the transaction with correct data.
          </p>
          <a
            className={classes.contractAddressLink}
            href="https://docs.gnosischain.com/node/validator-deposits"
            target="_blank"
            rel="noopener noreferrer"
          >
            Check instructions
            <LinkIcon className={classes.linkIcon} />
          </a>
        </div>
        <button
          className={classes.button}
          onClick={deposit}
        >Ok</button>
      </>
    )
  }
  return (
    <div className={classes.page}>
      <Header
        title={titles[step]}
        onClose={onClose}
      />
      {component}
    </div>
  )
}

export default DepositRisksInfo
