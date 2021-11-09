import { createUseStyles } from 'react-jss'

const useStepperStyles = createUseStyles((theme) => ({
  stepper: {
    width: 700,
    minHeight: 740,
    background: theme.palette.white,
    borderRadius: theme.spacing(3.75),
    boxShadow: '0px 0px 4px rgba(200, 200, 221, 0.53)',
    padding: `0 ${theme.spacing(3.5)}px`,
    display: 'flex'
  }
}))

export default useStepperStyles
