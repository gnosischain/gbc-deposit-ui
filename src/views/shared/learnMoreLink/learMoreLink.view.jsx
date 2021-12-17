import useStyles from './learnMoreLink.styles'

const LearMoreLink = () => {
  const classes = useStyles()
  return (
    <a
      className={classes.learnMoreLink}
      href="https://docs.gnosischain.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Learn more about the Gnosis Beacon Chain
    </a>
  )
}

export default LearMoreLink
