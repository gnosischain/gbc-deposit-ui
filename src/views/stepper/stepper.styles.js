import { createUseStyles } from 'react-jss'

const useStepperStyles = createUseStyles((theme) => ({
  stepper: {
    width: 700,
    minHeight: 740,
    background: theme.palette.white,
    borderRadius: theme.spacing(3.75),
    boxShadow: '0px 0px 4px rgba(200, 200, 221, 0.53)',
    padding: `0 ${theme.spacing(3.5)}px`,
    paddingBottom: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column'
  },
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  tabs: {
    display: 'flex',
    justifyContent: 'center'
  },
  tab: {
    minWidth: '130px',
    padding: '10px 20px',
    background: theme.palette.secondary,
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    boxShadow: '0px 0px 4px rgba(200, 200, 221, 0.53)',
    marginRight: '1px',
    cursor: 'pointer'
  },
  tabActive: {
    composes: '$tab',
    background: theme.palette.white
  }
}))

export default useStepperStyles
