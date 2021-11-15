import { createUseStyles } from 'react-jss'

const useNetworkErrorStyles = createUseStyles((theme) => ({
  networkSelectRow: {
    display: 'flex',
    alignItems: 'center',
  },
  networkLogoImage: {
    width: '30px',
    height: '30px',
  },
  networkName: {
    marginLeft: '10px',
  },
}));

export default useNetworkErrorStyles
