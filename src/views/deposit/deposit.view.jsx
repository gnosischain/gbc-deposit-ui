import { useState, useCallback } from 'react'

import Dropzone from './dropzone/dropzone.view'
import Header from '../shared/header/header.view'
import checkIcon from '../../images/check-icon-small.svg'
import replaceIcon from '../../images/replace-icon.svg'
import useStyles from './deposit.styles'
import DappnodeHeader from '../shared/dappnodeHeader/dappnodeHeader.view'

const CheckIcon = () =>
  <img style={{ width: 16, height: 16 }} src={checkIcon} alt='' />

const ReplaceIcon = () =>
  <img style={{ width: 16, height: 16, margin: '0 8px -1px 0' }} src={replaceIcon} alt='' />

function Deposit ({ wallet, onDisconnectWallet, tokenInfo, balance, depositData, setDepositData, onGoNext, dappNode, dappnodeWhitelist }) {
  const classes = useStyles()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const onDrop = useCallback(async ({ fileData, filename }) => {
    setLoading(true)
    try {
      await setDepositData(fileData, filename)
    } catch (error) {
      setError(error.message)
    }
    setLoading(false)
  }, [setDepositData])
  const onReplace = useCallback(() => {
    setDepositData(null, null)
    setError(null)
  }, [setDepositData])

  let component
  if (error) {
    component = (
      <div className={classes.dataContainer}>
        <b>{depositData.filename}</b>
        <button className={classes.replaceButton} onClick={onReplace}>
          <ReplaceIcon />Replace
        </button>
        <div className={classes.textItemsContainer}>
          <span className={classes.textItem}>
            {error}
          </span>
        </div>
      </div>
    );
  } else if (loading) {
    component = (
      <div className={classes.dataContainer}>
        <b>deposit_data.json</b>
        <div className={classes.textItemsContainer}>
          <span className={classes.textItem}>
            Validating...
          </span>
        </div>
      </div>
    );
  } else if (!!depositData.deposits) {
    component = (
      <>
        <div className={classes.dataContainer}>
          <b>{depositData.filename}</b>
          <button className={classes.replaceButton} onClick={onReplace}>
            <ReplaceIcon />Replace
          </button>
          <div className={classes.textItemsContainer}>
            <span className={classes.textItem}>
              <CheckIcon /> Accepted
            </span>
            <span className={classes.textItem}>
              <CheckIcon /> Validator deposits: {depositData.deposits.length}
            </span>
            <span className={classes.textItem}>
              <CheckIcon /> Total amount required: {depositData.deposits.length * 32} {tokenInfo.symbol}
            </span>
          </div>
          {depositData.hasDuplicates && (
            <div className={classes.note}>
              Deposits have already been made to some validators in this file.{' '}
              Continue on to make deposits to the rest of them.
            </div>
          )}
        </div>
        <button className={classes.depositButton} onClick={() => onGoNext()}>
          Deposit
        </button>
      </>
    )
  } else if(dappNode && !dappnodeWhitelist.isWhitelisted) {
    component = (
      <div className={classes.dataContainer}><p>Please, select a whitelisted address</p></div>
    )
  } else {
    component = <Dropzone
      onDrop={onDrop}
      dappNode={dappNode} />
  }
  return (
    <div className={classes.container}>
      {!dappNode ? <Header
        address={wallet.address}
        title='Gnosis Beacon Chain Deposit'
        onDisconnectWallet={onDisconnectWallet}
        tokenInfo={tokenInfo}
        balance={balance} />
        :
        <DappnodeHeader
        address={wallet.address}
        title='DAppNode incentive program'
        onDisconnectWallet={onDisconnectWallet}
        dappnodeWhitelist={dappnodeWhitelist} />}
      {component}
    </div>
  )
}

export default Deposit
