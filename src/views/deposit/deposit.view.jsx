import { useState, useCallback } from 'react';

import Dropzone from './dropzone/dropzone.view';
import Header from '../shared/header/header.view'
import checkIcon from '../../images/check-icon-small.svg';
import replaceIcon from '../../images/replace-icon.svg';
import useStyles from './deposit.styles';

const CheckIcon = () =>
  <img style={{ width: 16, height: 16}} src={checkIcon} alt="" />

const ReplaceIcon = () =>
  <img style={{ width: 16, height: 16, margin: '0 8px -1px 0' }} src={replaceIcon} alt="" />

function Deposit({ wallet, onDisconnectWallet, tokenInfo, depositData, setDepositData, onGoNext }) {
  const classes = useStyles();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const onDrop = useCallback(async ({ data, filename }) => {
    setLoading(true);
    try {
      await setDepositData(data, filename);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }, [setDepositData]);
  const onReplace = useCallback(() => {
    setDepositData(null, null);
    setError(null);
  }, [setDepositData]);

  let component;
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
        </div>
        <button className={classes.depositButton} onClick={() => onGoNext()}>
          Deposit
        </button>
      </>
    );
  } else {
    component = <Dropzone onDrop={onDrop} />;
  }
  return (
    <div className={classes.container}>
      <Header
        address={wallet.address}
        title="Gnosis Beacon Chain Deposit"
        onDisconnectWallet={onDisconnectWallet}
      />
      {component}
    </div>
  );
}

export default Deposit;
