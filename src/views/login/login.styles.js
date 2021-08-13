import { createUseStyles } from 'react-jss'

const useLoginStyles = createUseStyles((theme) => ({
  login: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(15.5)
  },
  tokenLogos: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  swapArrow: {
    margin: `0 ${theme.spacing(2)}px`
  },
  title: {
    marginTop: theme.spacing(4),
    fontSize: theme.spacing(3),
    fontWeight: theme.fontWeights.bold
  },
  connectText: {
    fontWeight: theme.fontWeights.medium,
    color: theme.palette.grey.main,
    marginTop: theme.spacing(11.75)
  },
  metaMaskButton: {
    padding: theme.spacing(2.5),
    borderRadius: theme.spacing(3.5),
    background: theme.palette.white,
    boxShadow: '0px 3.75px 17px #F7EBD5',
    marginTop: theme.spacing(3),
    border: 'none',
    transition: theme.buttonTransition,
    cursor: 'pointer'
  },
  metaMaskIcon: {
    width: theme.spacing(7),
    height: theme.spacing(7)
  },
  metaMaskNameText: {
    fontWeight: theme.fontWeights.bold,
    marginTop: theme.spacing(2)
  }
}))

export default useLoginStyles
