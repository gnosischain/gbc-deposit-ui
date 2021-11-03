import { createUseStyles } from 'react-jss'

const useHeaderStyles = createUseStyles((theme) => ({
  header: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(4)
  },
  title: {
    fontSize: theme.spacing(3),
    fontWeight: theme.fontWeights.bold
  },
  address: {
    marginTop: theme.spacing(2),
    fontSize: theme.spacing(2.5),
    color: theme.palette.grey.dark
  },
  goBackButton: {
    position: 'absolute',
    background: 'transparent',
    appearance: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: theme.spacing(1),
    left: -(theme.spacing(1)),
    top: -(theme.spacing(1)),
    '&:disabled': {
      cursor: 'default'
    }
  },
  disconnectButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: theme.spacing(2),
    marginTop: theme.spacing(1.5)
  }
}))

export default useHeaderStyles
