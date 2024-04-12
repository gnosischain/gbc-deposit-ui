import { useCallback, useState } from 'react'
import { Contract, BigNumber, ethers } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

import erc677ABI from '../abis/erc677'
import depositABI from '../abis/deposit'
import { loadCachedDeposits } from '../utils/deposits'

const depositAmountBN = BigNumber.from(1).mul(BigNumber.from(ethers.constants.WeiPerEther))

const INITIAL_DATA = { status: 'pending' }

function useDeposit(wallet, network, tokenInfo) {
  const [txData, setTxData] = useState(INITIAL_DATA)
  const [deposits, setDeposits] = useState(null)
  const [hasDuplicates, setHasDuplicates] = useState(false)
  const [isBatch, setIsBatch] = useState(false)
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

    console.log(network)

    if (!deposits.every) {
      throw Error('Oops, something went wrong while parsing your json file. Please check the file and try again.')
    }

    if (deposits.length === 0 || !deposits.every(d => checkJsonStructure(d))) {
      throw Error('This is not a valid file. Please try again.')
    }

    if (!deposits.every(d => d.fork_version === network.forkVersion)) {
      throw Error("This JSON file isn't for the right network (" + deposits[0].fork_version + "). Upload a file generated for you current network: " + network.chainName)
    }

    const provider = new ethers.providers.StaticJsonRpcProvider(network.rpcUrl)
    const depositContract = new Contract(network.addresses.deposit, depositABI, provider)

    let events = []
    const {
      deposits: existingDeposits,
      lastBlock: fromBlock,
    } = await loadCachedDeposits(network);
      
    try {
      console.log('Fetching existing deposits')
      const toBlock = await provider.getBlockNumber()
      events = await getPastLogs(depositContract, 'DepositEvent', { fromBlock, toBlock }, true)
    } catch (error) {
      throw Error('Failed to fetch existing deposits. Please try again')
    }
    let pks = events.map(e => e.args.pubkey)
    pks = pks.concat(existingDeposits)
    console.log(`Found ${pks.length} existing deposits`)
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

    const wc = newDeposits[0].withdrawal_credentials

    // batch processing necessary for both single deposit and batch deposit for same withdrawal_credentials
    const isBatch = newDeposits.every(d => d.withdrawal_credentials === wc)

    if (isBatch && newDeposits.length > 128) {
      throw Error('Number of validators exceeds the maximum batch size of 128. Please upload a file with 128 or fewer validators.')
    }

    if (!newDeposits.every(d => d.amount === 32000000000)) {
      throw Error('Amount should be exactly 32 tokens for deposits.')
    }

    const pubKeys = newDeposits.map(d => d.pubkey)
    if (pubKeys.some((pubkey, index) => pubKeys.indexOf(pubkey) !== index)) {
      throw Error('Duplicated public keys.')
    }

    const token = new Contract(tokenInfo.address, erc677ABI, provider)
    const totalDepositAmountBN = depositAmountBN.mul(BigNumber.from(newDeposits.length))
    const tokenBalance = await token.balanceOf(wallet.address)

    if (tokenBalance.lt(totalDepositAmountBN)) {
      throw Error(`
        Unsufficient balance. You have ${Number(formatUnits(tokenBalance.toString(), tokenInfo.decimals))} ${tokenInfo.symbol},${' '}
        but required ${Number(formatUnits(totalDepositAmountBN.toString(), tokenInfo.decimals))}  ${tokenInfo.symbol}.
      `)
    }

    return { deposits: newDeposits, hasDuplicates, isBatch }
  }, [wallet, network, tokenInfo]);

  const setDepositData = useCallback(async (fileData, filename) => {
    setFilename(filename)
    if (fileData) {
      let data
      try {
        data = JSON.parse(fileData)
      } catch (error) {
        throw Error('Oops, something went wrong while parsing your json file. Please check the file and try again.')
      }
      const { deposits, hasDuplicates, isBatch } = await validate(data)
      setDeposits(deposits)
      setHasDuplicates(hasDuplicates)
      setIsBatch(isBatch)
    } else {
      setDeposits(null)
      setHasDuplicates(false)
      setIsBatch(false)
    }
  }, [validate])

  const deposit = useCallback(async () => {
    const token = new Contract(tokenInfo.address, erc677ABI, wallet.provider.getSigner(0))
    // if wrapper address is not null => use it for call (mainnet), otherwise use deposit address (chiado)
    const callDest = network.addresses.wrapper ?? network.addresses.deposit
    if (isBatch) {
      try {
        setTxData({ status: 'loading' })
        const totalDepositAmountBN = depositAmountBN.mul(BigNumber.from(deposits.length))
        console.log(`Sending deposit transaction for ${deposits.length} deposits`)
        let data = '0x'
        data += deposits[0].withdrawal_credentials
        deposits.forEach(deposit => {
          data += deposit.pubkey
          data += deposit.signature
          data += deposit.deposit_data_root
        })
        const tx = await token.transferAndCall(callDest, totalDepositAmountBN, data)
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
    } else {
      setTxData({ status: 'loading', isArray: true })
      let txs = await Promise.all(
        deposits.map(async deposit => {
          let data = '0x'
          data += deposit.withdrawal_credentials
          data += deposit.pubkey
          data += deposit.signature
          data += deposit.deposit_data_root

          let tx = null
          try {
            tx = await token.transferAndCall(callDest, depositAmountBN, data)
          } catch (error) {
            console.log(error)
          }
          return tx
        })
      )
      txs = txs.filter(tx => !!tx)
      if (!txs.length) {
        setTxData({ status: 'failed', isArray: true, error: 'All transactions were rejected' })
      }
      setTxData({ status: 'pending', isArray: true, data: txs })
      await Promise.all(txs.map(tx => tx.wait()))
      setTxData({ status: 'successful', isArray: true, data: txs })
    }
  }, [wallet, network, tokenInfo, deposits, isBatch])

  return { deposit, txData, depositData: { deposits, filename, hasDuplicates, isBatch }, setDepositData }
}

const stepSize = 50000
const maxConcurrency = 20
async function getPastLogs(contract, event, { fromBlock, toBlock }, isFirstCall) {
  const allEvents = []
  const range = toBlock - fromBlock

  if (isFirstCall) {
    const chunkSize = Math.ceil((range) / maxConcurrency);
    const promises = [];

    for (let i = 0; i < maxConcurrency; i++) {
      const startBlock = fromBlock + i * chunkSize;
      let endBlock = startBlock + chunkSize - 1;
      endBlock = endBlock < toBlock ? endBlock : toBlock
      promises.push(getPastLogs(contract, event, { fromBlock: startBlock, toBlock: endBlock }, false));
    }

    const results = await Promise.all(promises);
    results.forEach((result) => allEvents.push(...result));
    return allEvents
  }

  for(;fromBlock < toBlock; fromBlock = fromBlock + stepSize) {
    let stepBlock = fromBlock + stepSize - 1
    stepBlock = stepBlock < toBlock ? stepBlock : toBlock
    try {
      const newEvents = await contract.queryFilter(event, fromBlock, stepBlock)
      allEvents.push(...newEvents)
    } catch (e) {
      console.log(e)
    }
  }
  return allEvents
}

export default useDeposit
