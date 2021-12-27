import { createUseStyles } from 'react-jss'

const useTxConfirmStyles = createUseStyles((theme) => ({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 40px'
  },
  button: {
    fontSize: theme.spacing(2),
    fontWeight: theme.fontWeights.bold,
    marginBottom: 50,
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
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  contractAddressLink: {
    textDecoration: 'underline',
    alignSelf: 'center',
    marginTop: 30,
    color: theme.palette.black
  },
  text: {
    textAlign: 'center',
    lineHeight: '24px'
  },
  linkIcon: {
    height: 16,
    marginLeft: 6,
    marginBottom: -2,
    '& > path': {
      fill: theme.palette.black
    }
  }
}))

export default useTxConfirmStyles
