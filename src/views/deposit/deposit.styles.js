import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles((theme) => ({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(4),
  },
  dataContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    borderRadius: '10px',
    backgroundColor: theme.palette.secondary,
    outline: 'none',
    width: '100%',
    minHeight: '100px',
    marginTop: theme.spacing(10),
    overflowWrap: 'break-word'
  },
  replaceButton: {
    border: 'none',
    background: 'transparent',
    textDecoration: 'underline',
    color: theme.palette.black,
    margin: '15px 0 0',
    cursor: 'pointer'
  },
  textItemsContainer: {
    marginTop: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textItem: {
    margin: '5px 0',
    width: '100%',
    textAlign: 'center'
  },
  depositButton: {
    fontSize: theme.spacing(2),
    fontWeight: theme.fontWeights.bold,
    margin: `${theme.spacing(12)}px auto ${theme.spacing(4)}px`,
    padding: `${theme.spacing(3)}px 0`,
    background: theme.palette.primary,
    color: theme.palette.white,
    width: '40%',
    borderRadius: theme.spacing(12.5),
    appearance: 'none',
    border: 'none',
    transition: theme.buttonTransition,
    cursor: 'pointer',
    '&:disabled': {
      background: theme.palette.grey.dark,
      cursor: 'default'
    }
  },
  dappnodeWhitelist: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    width: '100%',
    minHeight: '200px',
  },
  note: {
    backgroundColor: '#fff3d6',
    padding: '10px 20px',
    fontSize: theme.spacing(2),
    lineHeight: '18px',
    marginTop: theme.spacing(4),
    borderRadius: 10,
    textAlign: 'center'
  }
}))

export default useStyles
