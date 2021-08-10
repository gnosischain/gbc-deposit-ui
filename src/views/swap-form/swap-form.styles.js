import { createUseStyles } from 'react-jss'

const useSwapFormStyles = createUseStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '25%'
  },
  fromInputGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2)
  },
  fromInputWrapper: {
    display: 'flex',
    marginBottom: theme.spacing(1)
  },
  fromInput: {
    flex: 1
  },
  fromTokenBalance: {
    textAlign: 'right'
  },
  toInput: {
    marginBottom: theme.spacing(2)
  },
  error: {
    marginBottom: theme.spacing(2)
  }
}))

export default useSwapFormStyles
