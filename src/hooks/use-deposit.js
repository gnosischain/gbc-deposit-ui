import { useCallback, useState } from 'react'
import { Contract, BigNumber, ethers } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

import erc677ABI from '../abis/erc677'
import depositABI from '../abis/deposit'

const depositAddress = process.env.REACT_APP_DEPOSIT_CONTRACT_ADDRESS;
const depositAmountBN = BigNumber.from(32).mul(BigNumber.from(ethers.constants.WeiPerEther))

const INITIAL_DATA = { status: 'pending' }

function useDeposit(wallet, tokenInfo) {
  const [txData, setTxData] = useState(INITIAL_DATA)

  const validate = useCallback(async (deposits) => {
    const token = new Contract(tokenInfo.address, erc677ABI, wallet.provider)
    const depositContract = new Contract(depositAddress, depositABI, wallet.provider)

    const checkJsonStructure = (depositDataJson) => {
      return (
        depositDataJson.pubkey &&
        depositDataJson.withdrawal_credentials &&
        depositDataJson.amount &&
        depositDataJson.signature &&
        depositDataJson.deposit_message_root &&
        depositDataJson.deposit_data_root &&
        depositDataJson.fork_version
      );
    };

    if (!deposits.every(d => checkJsonStructure(d))) {
      throw Error('This is not a valid file. Please try again.')
    }

    if (!deposits.every(d => d.fork_version === '00000064')) {
      throw Error(`This JSON file isn't for the right network. Upload a file generated for you current network: Gnosis Chain`)
    }

    if (deposits.length > 128) {
      throw Error('Number of validators exceeds 128. Please upload a file with 128 or fewer validators.')
    }

    const wc = deposits[0].withdrawal_credentials
    if (!deposits.every(d => d.withdrawal_credentials === wc)) {
      throw Error('Withdrawal credentials do not match.')
    }

    if (!deposits.every(d => d.amount === 32000000000)) {
      throw Error('Amount should be exactly 32 tokens for batch deposits.')
    }

    const pubKeys = deposits.map(d => d.pubkey)
    if (pubKeys.some((pubkey, index) => pubKeys.indexOf(pubkey) !== index)) {
      throw Error('Duplicated public keys.')
    }

    const totalDepositAmountBN = depositAmountBN.mul(BigNumber.from(deposits.length))
    const tokenBalance = await token.balanceOf(wallet.address)

    if (tokenBalance.lt(totalDepositAmountBN)) {
      throw Error(`
        Unsufficient balance. You have ${Number(formatUnits(tokenBalance.toString(), tokenInfo.decimals))} ${tokenInfo.symbol},${' '}
        but required ${Number(formatUnits(totalDepositAmountBN.toString(), tokenInfo.decimals))}  ${tokenInfo.symbol}.${' '}
        Select the swap tab to swap your GNO to ${tokenInfo.symbol} for deposits.
      `)
    }

    console.log('Fetching existing deposits')
    const fromBlock = parseInt(process.env.REACT_APP_DEPOSIT_START_BLOCK_NUMBER, 10) || 0
    const toBlock = await wallet.provider.getBlockNumber()
    const events = await getPastLogs(depositContract, 'DepositEvent', { fromBlock, toBlock })
    console.log(`Found ${events.length} existing deposits`)
    const pks = events.map(e => e.args.pubkey)
    for (const deposit of deposits) {
      if (pks.some(pk => pk === '0x' + deposit.pubkey)) {
        throw Error(`
          Deposits have already been made to some validators in this file.${' '}
          Max deposit is 32 ${tokenInfo.symbol} per validator. Please recreate and upload a new file.
        `)
      }
    }
  }, [wallet, tokenInfo]);
  const deposit = useCallback(async (deposits) => {
    try {
      setTxData({ status: 'loading' })
      const token = new Contract(tokenInfo.address, erc677ABI, wallet.provider.getSigner(0))
      const totalDepositAmountBN = depositAmountBN.mul(BigNumber.from(deposits.length))

      console.log(`Sending deposit transaction for ${deposits.length} deposits`)
      let data = '0x'
      data += deposits[0].withdrawal_credentials
      deposits.forEach(deposit => {
        data += deposit.pubkey
        data += deposit.signature
        data += deposit.deposit_data_root
      })
      const tx = await token.transferAndCall(depositAddress, totalDepositAmountBN, data)
      setTxData({ status: 'pending', data: tx })
      await tx.wait()
      setTxData({ status: 'successful', data: tx })
      console.log(`\tTx hash: ${tx.hash}`)
    } catch (err) {
      let error = 'Transaction failed.'
      if (err?.code === -32603) {
        error = 'Transaction was not sent because of the low gas price. Try to increase it.'
      }
      setTxData({ status: 'failed', error })
      console.log(err)
    }
  }, [wallet, tokenInfo])

  return { deposit, validate, txData }
}

async function getPastLogs(contract, event, { fromBlock, toBlock }) {
  try {
    return contract.queryFilter(event, fromBlock, toBlock)
  } catch (e) {
    if (e.message.includes('query returned more than') || e.message.toLowerCase().includes('timeout')) {
      const middle = Math.round((fromBlock + toBlock) / 2)
      const firstHalfEvents = await getPastLogs(contract, event, {
        fromBlock,
        toBlock: middle
      })
      const secondHalfEvents = await getPastLogs(contract, event, {
        fromBlock: middle + 1,
        toBlock
      })
      return [ ...firstHalfEvents, ...secondHalfEvents ]
    } else {
      throw e
    }
  }
}

export default useDeposit
