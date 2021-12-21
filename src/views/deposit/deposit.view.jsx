import { useState, useCallback } from 'react';

import Dropzone from './dropzone/dropzone.view';
import Header from '../shared/header/header.view'
import checkIcon from '../../images/check-icon-small.svg';
import useStyles from './deposit.styles';

const CheckIcon = () =>
  <img style={{ width: 16, height: 16}} src={checkIcon} alt="" />

function Deposit({ wallet, onDisconnectWallet }) {
  const classes = useStyles();
  const [depositData, setDepositData] = useState(null);
  const [filename, setFilename] = useState(null);
  const onDrop = useCallback(({ data, filename }) => {
    setFilename(filename);
    setDepositData(data);
  }, []);
  const onReplace = useCallback(() => {
    setDepositData(null);
    setFilename(null);
  }, []);
  return (
    <div className={classes.container}>
      <Header
        address={wallet.address}
        title="Gnosis Beacon Chain Deposit"
        onDisconnectWallet={onDisconnectWallet}
      />
      {!!depositData ? (
        <div className={classes.dataContainer}>
          <b>{filename}</b>
          <button className={classes.replaceButton} onClick={onReplace}>
            Replace
          </button>
          <span className={classes.textItem}>
            <CheckIcon /> Accepted
          </span>
          <span className={classes.textItem}>
            <CheckIcon /> Validator deposits: {depositData.length}
          </span>
          <span className={classes.textItem}>
            <CheckIcon /> Total amount required: {depositData.length * 32} mGNO
          </span>
        </div>
      ) : (
        <Dropzone onDrop={onDrop} />
      )}
    </div>
  );
}

export default Deposit;
