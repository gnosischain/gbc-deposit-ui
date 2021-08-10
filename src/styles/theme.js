const theme = {
  palette: {
    white: '#ffffff',
    black: '#2b2b2b',
    primary: '#e75a2b',
    secondary: '#faf4ea',
    grey: {
      light1: '#f3f3f8',
      light2: '#e1e1f1',
      main: '#7a7c89',
      dark: '#888baa'
    },
    orange: '#ffa600'
  },
  hoverTransition: 'all 100ms',
  fontWeights: {
    normal: '400',
    medium: '500',
    bold: '700',
    extraBold: '800'
  },
  breakpoints: {
    upSm: '@media (min-width: 576px)'
  },
  spacing: (value) => value * 8,
  buttonTransition: 'all 100ms'
}

export default theme
