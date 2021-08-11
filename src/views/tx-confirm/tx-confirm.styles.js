import { createUseStyles } from 'react-jss'

const useTxConfirmStyles = createUseStyles((theme) => ({
  txConfirm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  spinnerWrapper: {
    marginTop: theme.spacing(20.5)
  },
  title: {
    fontSize: theme.spacing(3),
    fontWeight: theme.fontWeights.bold,
    marginTop: theme.spacing(8)
  }
}))

export default useTxConfirmStyles
