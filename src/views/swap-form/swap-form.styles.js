import { createUseStyles } from 'react-jss'

const useSwapFormStyles = createUseStyles((theme) => ({
  balanceCard: {
    background: theme.palette.grey.light1,
    padding: `${theme.spacing(3)}px ${theme.spacing(5)}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing(7.5),
    borderRadius: theme.spacing(2)
  },
  balance: {
    fontWeight: theme.fontWeights.bold
  },
  convertAllButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  fromInputGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(3),
    paddingTop: theme.spacing(5),
    paddingRight: theme.spacing(5),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(5),
    border: `2px solid ${theme.palette.grey.light2}`,
    borderRadius: `${theme.spacing(2.5)}px ${theme.spacing(2.5)}px 0 0`
  },
  fromInput: {
    fontSize: theme.spacing(5),
    fontWeight: theme.fontWeights.bold,
    appearance: 'none',
    border: 'none',
    outline: 'none',
    width: '100%',
    textAlign: 'center',
    marginTop: theme.spacing(2),
    caretColor: theme.palette.orange,
    '&:disabled': {
      background: theme.palette.white
    }
  },
  toValue: {
    fontSize: theme.spacing(2),
    color: theme.palette.grey.main,
    textAlign: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(5)}px`,
    border: `2px solid ${theme.palette.grey.light2}`,
    borderTop: 'none',
    borderRadius: `0 0 ${theme.spacing(2.5)}px ${theme.spacing(2.5)}px`
  },
  submitButton: {
    fontSize: theme.spacing(2),
    fontWeight: theme.fontWeights.bold,
    margin: `${theme.spacing(12)}px auto 0 auto`,
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
  }
}))

export default useSwapFormStyles
