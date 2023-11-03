import { createUseStyles } from "react-jss";

const useStyles = createUseStyles((theme) => ({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(4),
  },
  claimButton: {
    fontSize: theme.spacing(2),
    fontWeight: theme.fontWeights.bold,
    margin: `${theme.spacing(12)}px auto ${theme.spacing(4)}px`,
    padding: `${theme.spacing(3)}px 0`,
    background: theme.palette.primary,
    color: theme.palette.white,
    width: "40%",
    borderRadius: theme.spacing(12.5),
    appearance: "none",
    border: "none",
    transition: theme.buttonTransition,
    cursor: "pointer",
    "&:disabled": {
      background: theme.palette.grey.dark,
      cursor: "default",
    },
  },
}));

export default useStyles;
