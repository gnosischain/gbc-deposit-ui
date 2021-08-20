import { useEffect, useState } from 'react'
import { providers } from 'ethers'

import useStepperStyles from './stepper.styles'
import useWallet from '../../hooks/use-wallet'
import useStep, { Step } from '../../hooks/use-stepper-data'
import Login from '../login/login.view'
import SwapForm from '../swap-form/swap-form.view'
import useTokenContract from '../../hooks/use-token-contract'
import useSwapContract from '../../hooks/use-swap-contract'
import useTokenInfo from '../../hooks/use-token-info'
import useTokenBalance from '../../hooks/use-token-balance'
import TxConfirm from '../tx-confirm/tx-confirm.view'
import useSwap from '../../hooks/use-swap'
import TxOverview from '../tx-overview/tx-overview.view'
import NetworkError from '../network-error/network-error.view'
import DataLoader from '../data-loader/data-loader'
import useSwapContractInfo from '../../hooks/use-swap-contract-info'

function Stepper () {
  const classes = useStepperStyles()
  const [chainId, setChainId] = useState()

  useEffect(() => {
    async function getChainId () {
      const provider = new providers.Web3Provider(window.ethereum)
      const network = await provider.getNetwork()
      setChainId(network.chainId?.toString())
    }

    getChainId()
  }, [])

  const { wallet, loadWallet } = useWallet()
  const swapContract = useSwapContract(wallet)
  const { fromTokenAddress, toTokenAddress, swapRatio } = useSwapContractInfo(swapContract, chainId)
  const fromTokenContract = useTokenContract(wallet, fromTokenAddress)
  const toTokenContract = useTokenContract(wallet, toTokenAddress)
  const fromTokenInfo = useTokenInfo(fromTokenContract, chainId)
  const toTokenInfo = useTokenInfo(toTokenContract, chainId)
  const fromTokenBalance = useTokenBalance(wallet?.address, fromTokenContract)
  const toTokenBalanceInSwapContract = useTokenBalance(process.env.REACT_APP_SWAP_CONTRACT_ADDRESS, toTokenContract)
  const { step, switchStep } = useStep()
  const { swap, data: swapData, resetData: resetSwapData } = useSwap()

  if (chainId !== process.env.REACT_APP_CHAIN_ID) {
    return (
      <div className={classes.stepper}>
        <NetworkError />
      </div>
    )
  }

  return (
    <div className={classes.stepper}>
      {(() => {
        switch (step) {
          case Step.Loading: {
            return (
              <DataLoader
                fromTokenInfo={fromTokenInfo}
                toTokenInfo={toTokenInfo}
                onFinishLoading={() => switchStep(Step.Login)}
              />
            )
          }
          case Step.Login: {
            return (
              <Login
                wallet={wallet}
                fromTokenInfo={fromTokenInfo}
                toTokenInfo={toTokenInfo}
                onLoadWallet={loadWallet}
                onGoToNextStep={() => switchStep(Step.Swap)}
              />
            )
          }
          case Step.Swap: {
            return (
              <SwapForm
                wallet={wallet}
                fromTokenInfo={fromTokenInfo}
                toTokenInfo={toTokenInfo}
                swapRatio={swapRatio}
                fromTokenBalance={fromTokenBalance}
                toTokenBalanceInSwapContract={toTokenBalanceInSwapContract}
                swapData={swapData}
                onAmountChange={resetSwapData}
                onSubmit={(fromAmount) => {
                  swap(wallet, fromTokenContract, swapContract, fromAmount)
                  switchStep(Step.Confirm)
                }}
              />
            )
          }
          case Step.Confirm: {
            return (
              <TxConfirm
                wallet={wallet}
                fromTokenInfo={fromTokenInfo}
                toTokenInfo={toTokenInfo}
                swapData={swapData}
                onGoBack={() => switchStep(Step.Swap)}
                onGoToOverviewStep={() => switchStep(Step.Overview)}
              />
            )
          }
          case Step.Overview: {
            return (
              <TxOverview
                wallet={wallet}
                fromTokenInfo={fromTokenInfo}
                toTokenInfo={toTokenInfo}
                swapData={swapData}
              />
            )
          }
          default: {
            return <></>
          }
        }
      })()}
    </div>
  )
}

export default Stepper
