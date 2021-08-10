import React from 'react'

import useAppStyles from './app.styles'
import useWallet from '../hooks/use-wallet'
import LoginButton from './login-button/login-button.view'
import SwapForm from './swap-form/swap-form.view'

function App () {
  const { wallet, loadWallet } = useWallet()

  useAppStyles()

  return (
    <div>
      <LoginButton wallet={wallet} onLoadWallet={loadWallet} />
      <SwapForm wallet={wallet} />
    </div>
  )
}

export default App
