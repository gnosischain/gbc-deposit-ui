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
    minHeight: '200px',
    marginTop: theme.spacing(10),
  },
  replaceButton: {
    border: 'none',
    background: 'transparent',
    textDecoration: 'underline',
    color: theme.palette.black,
    margin: '15px 0 30px',
    cursor: 'pointer'
  },
  textItem: {
    margin: '5px 0'
  }
}))

export default useStyles
