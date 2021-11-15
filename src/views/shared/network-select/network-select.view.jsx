import React from 'react';
import Select, { components } from 'react-select';

import useNetworkSelectStyles from './network-select.styles';

import { ReactComponent as DropdownIcon } from '../../../images/dropdown.svg';

import networks from '../../../networks'

const DropdownIndicator = props => (
  <components.DropdownIndicator {...props}>
    <DropdownIcon />
  </components.DropdownIndicator>
);

const NetworkLogo = ({ networkId }) => {
  const classes = useNetworkSelectStyles();
  const src = require(`../../../images/networks/${networkId}.png`).default;
  return <img className={classes.networkLogoImage} src={src} alt="" />;
}

const CustomSelect = ({ chainId, isMetamask, switchChainInMetaMask }) => {
  const classes = useNetworkSelectStyles();

  const customStyles = {
    option: provided => ({
      ...provided,
      backgroundColor: '#fff',
      cursor: 'pointer',
      ':hover': {
        backgroundColor: '#f0f0f0',
      },
    }),
    container: provided => ({
      ...provided,
      width: 'auto',
      zIndex: 3,
      ':focus': {
        outline: 'none',
      },
      marginTop: '10px'
    }),
    control: provided => ({
      ...provided,
      cursor: 'pointer',
      border: 0,
      boxShadow: 'none',
      justifyContent: 'flex-start',
      backgroundColor: 'transparent'
    }),
    valueContainer: provided => ({
      ...provided,
      padding: 0,
      flex: 'none'
    }),
    singleValue: provided => ({
      ...provided,
      position: 'relative',
      transform: 'none',
      marginLeft: 0,
      color: '#2b2b2b'
    }),
    menu: provided => ({
      ...provided,
      marginLeft: -13,
      width: 180,
      border: '1px solid #e1e1e1',
      boxShadow: '0px 15px 30px rgba(117,129,141,0.1)',
      overflow: 'hidden',
    }),
    menuList: provided => ({ ...provided, padding: 0 }),
    indicatorSeparator: () => ({ display: 'none' }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      marginBottom: -1,
      display: state.isDisabled ? 'none' : 'flex'
    }),
    input: provided => ({ ...provided, color: 'transparent' })
  };

  const networkOptions = Object.keys(networks).map(chainId => ({
    value: chainId,
    label: (
      <div className={classes.networkSelectRow}>
        <NetworkLogo networkId={chainId} />
        <p className={classes.networkName}>{networks[chainId].networkName}</p>
      </div>
    ),
  }));

  return (
    <Select
      isDisabled={!isMetamask}
      value={networkOptions.find(item => item.value === chainId)}
      onChange={e => switchChainInMetaMask(e.value)}
      options={networkOptions}
      styles={customStyles}
      hideSelectedOptions
      components={{ DropdownIndicator }}
    />
  );
};

export default CustomSelect;
