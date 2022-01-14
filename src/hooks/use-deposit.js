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
  const [deposits, setDeposits] = useState(null)
  const [hasDuplicates, setHasDuplicates] = useState(false)
  const [filename, setFilename] = useState(null)

  const validate = useCallback(async (deposits) => {
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

    if (!deposits.every) {
      throw Error('Oops, something went wrong while parsing your json file. Please check the file and try again.')
    }

    if (deposits.length === 0 || !deposits.every(d => checkJsonStructure(d))) {
      throw Error('This is not a valid file. Please try again.')
    }

    if (!deposits.every(d => d.fork_version === '00000064')) {
      throw Error(`This JSON file isn't for the right network. Upload a file generated for you current network: Gnosis Chain`)
    }

    const depositContract = new Contract(depositAddress, depositABI, wallet.provider)

    console.log('Fetching existing deposits')
    const fromBlock = parseInt(process.env.REACT_APP_DEPOSIT_START_BLOCK_NUMBER, 10) || 0
    const toBlock = await wallet.provider.getBlockNumber()
    const events = await getPastLogs(depositContract, 'DepositEvent', { fromBlock, toBlock })
    console.log(`Found ${events.length} existing deposits`)
    const pks = events.map(e => e.args.pubkey)
    const newDeposits = []
    for (const deposit of deposits) {
      if (!pks.some(pk => pk === '0x' + deposit.pubkey)) {
        newDeposits.push(deposit)
      }
    }
    const hasDuplicates = newDeposits.length !== deposits.length

    if (newDeposits.length === 0) {
      throw Error('Deposits have already been made to all validators in this file.')
    }

    if (newDeposits.length > 128) {
      throw Error('Number of validators exceeds 128. Please upload a file with 128 or fewer validators.')
    }

    const wc = newDeposits[0].withdrawal_credentials
    if (!newDeposits.every(d => d.withdrawal_credentials === wc)) {
      throw Error('Batch deposits for validators with BLS signature scheme are not supported at the moment. Please use deposit script described in the docs.')
    }

    if (!newDeposits.every(d => d.amount === 32000000000)) {
      throw Error('Amount should be exactly 32 tokens for batch deposits.')
    }

    const pubKeys = newDeposits.map(d => d.pubkey)
    if (pubKeys.some((pubkey, index) => pubKeys.indexOf(pubkey) !== index)) {
      throw Error('Duplicated public keys.')
    }

    const token = new Contract(tokenInfo.address, erc677ABI, wallet.provider)
    const totalDepositAmountBN = depositAmountBN.mul(BigNumber.from(newDeposits.length))
    const tokenBalance = await token.balanceOf(wallet.address)

    if (tokenBalance.lt(totalDepositAmountBN)) {
      throw Error(`
        Unsufficient balance. You have ${Number(formatUnits(tokenBalance.toString(), tokenInfo.decimals))} ${tokenInfo.symbol},${' '}
        but required ${Number(formatUnits(totalDepositAmountBN.toString(), tokenInfo.decimals))}  ${tokenInfo.symbol}.${' '}
        Select the swap tab to swap your GNO to ${tokenInfo.symbol} for deposits.
      `)
    }

    return { deposits: newDeposits, hasDuplicates }
  }, [wallet, tokenInfo]);

  const setDepositData = useCallback(async (fileData, filename) => {
    setFilename(filename)
    if (fileData) {
      let data
      try {
        data = JSON.parse(fileData)
      } catch (error) {
        throw Error('Oops, something went wrong while parsing your json file. Please check the file and try again.')
      }
      const { deposits, hasDuplicates } = await validate(data)
      setDeposits(deposits)
      setHasDuplicates(hasDuplicates)
    } else {
      setDeposits(null)
      setHasDuplicates(false)
    }
  }, [validate])

  const deposit = useCallback(async () => {
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
  }, [wallet, tokenInfo, deposits])

  return { deposit, txData, depositData: { deposits, filename, hasDuplicates }, setDepositData }
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
