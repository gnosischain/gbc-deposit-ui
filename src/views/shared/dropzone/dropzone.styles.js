import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles((theme) => ({
  dropzone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    borderWidth: '2px',
    borderRadius: '10px',
    borderColor: theme.palette.grey.light2,
    borderStyle: 'dashed',
    backgroundColor: theme.palette.secondary,
    outline: 'none',
    cursor: 'pointer',
    width: '100%',
    minHeight: '200px',
    marginTop: theme.spacing(10)
  },
  plusIcon: {
    width: '60px',
    height: '60px',
    margin: '20px 0'
  },
  infoIcon: {
    width: 24,
    height: 24,
    marginBottom: -6
  }
}))

export default useStyles
