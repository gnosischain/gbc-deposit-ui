import { createUseStyles } from 'react-jss'

const useNetworkErrorStyles = createUseStyles((theme) => ({
  networkError: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: theme.palette.black,
    paddingTop: theme.spacing(15.5)
  },
  title: {
    marginTop: theme.spacing(3),
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.spacing(2.5)
  },
  description: {
    marginTop: theme.spacing(0.5),
    fontWeight: theme.fontWeights.medium,
    fontSize: theme.spacing(2),
    textAlign: 'center'
  }
}))

export default useNetworkErrorStyles
