import { createUseStyles } from 'react-jss'

const useHeaderStyles = createUseStyles((theme) => ({
  header: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(4)
  },
  title: {
    fontSize: theme.spacing(3),
    fontWeight: theme.fontWeights.bold
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
  }
}))

export default useHeaderStyles
