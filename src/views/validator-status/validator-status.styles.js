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
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  textItem: {
    margin: '0 10px',
    display: 'flex',
    alignItems: 'center',
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
  },
  dot: {
    width: 10,
    height: 10,
    display: 'inline-block',
    borderRadius: 5,
    marginRight: 7
  },
  'dot-green': {
    composes: '$dot',
    background: theme.palette.green
  },
  'dot-orange': {
    composes: '$dot',
    background: theme.palette.orange
  },
  'dot-red': {
    composes: '$dot',
    background: theme.palette.red
  },
  'dot-blue': {
    composes: '$dot',
    background: theme.palette.blue
  },
  txsContainer: {
    border: `1px solid ${theme.palette.grey.dark}`,
    borderRadius: 10,
    maxHeight: '300px',
    overflow: 'scroll',
    padding: '10px',
    marginTop: 20,
    width: '100%'
  },
  button: {
    fontSize: theme.spacing(2.5),
    color: theme.palette.blue,
    appearance: 'none',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    flex: 35,
  },
  buttonIcon: {
    marginLeft: theme.spacing(1)
  },
  listItem: {
    margin: '10px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  listItemIndex: {
    flex: 5
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    flex: 20,
  },
  statusItem: {
    margin: '5px 10px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  statusesContainer: {
    marginTop: '30px',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  listItemsContainer: {
    width: '100%',
    paddingBottom: '10px',
    borderBottom: `1px solid ${theme.palette.grey.dark}`,
    marginBottom: '25px',
    '&:last-child': {
      paddingBottom: 0,
      borderBottom: 0,
      marginBottom: 0,
    }
  },
}))

export default useStyles
