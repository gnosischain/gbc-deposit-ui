const theme = {
  palette: {
    white: '#ffffff',
    black: '#2b2b2b'
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
  spacing: (value) => value * 8
}

export default theme
