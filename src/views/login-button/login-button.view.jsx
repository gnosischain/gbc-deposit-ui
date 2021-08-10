import React from 'react'

function LoginButton ({ wallet, onLoadWallet }) {
  return (
    <div>
      {wallet
        ? <p>{wallet.address}</p>
        : <button onClick={onLoadWallet}>Login</button>}
    </div>
  )
}

export default LoginButton
