import { useState, useCallback } from 'react';

import Dropzone from './dropzone/dropzone.view';
import Header from '../shared/header/header.view'
import checkIcon from '../../images/check-icon-small.svg';
import useStyles from './deposit.styles';

const CheckIcon = () =>
  <img style={{ width: 16, height: 16}} src={checkIcon} alt="" />

function Deposit({ wallet, onDisconnectWallet, tokenInfo, deposit, validate }) {
  const classes = useStyles();
  const [depositData, setDepositData] = useState(null);
  const [filename, setFilename] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const onDrop = useCallback(async ({ data, filename }) => {
    setLoading(true);
    setFilename(filename);
    try {
      await validate(data);
      setDepositData(data);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }, [validate]);
  const onReplace = useCallback(() => {
    setDepositData(null);
    setFilename(null);
    setError(null);
  }, []);

  let component;
  if (error) {
    component = (
      <div className={classes.dataContainer}>
        <b>{filename}</b>
        <button className={classes.replaceButton} onClick={onReplace}>
          Replace
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
  } else if (!!depositData) {
    component = (
      <>
        <div className={classes.dataContainer}>
          <b>{filename}</b>
          <button className={classes.replaceButton} onClick={onReplace}>
            Replace
          </button>
          <div className={classes.textItemsContainer}>
            <span className={classes.textItem}>
              <CheckIcon /> Accepted
            </span>
            <span className={classes.textItem}>
              <CheckIcon /> Validator deposits: {depositData.length}
            </span>
            <span className={classes.textItem}>
              <CheckIcon /> Total amount required: {depositData.length * 32} {tokenInfo.symbol}
            </span>
          </div>
        </div>
        <button className={classes.depositButton} onClick={() => deposit(depositData)}>
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
