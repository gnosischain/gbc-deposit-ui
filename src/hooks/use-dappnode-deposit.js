import { useCallback, useState } from 'react'
import { Contract, ethers } from 'ethers'

import depositABI from "../abis/deposit"
import dappnodeDepositABI from '../abis/dappnodeDeposit'
import { loadCachedDeposits } from '../utils/deposits'

const INITIAL_DATA = { status: 'pending' }

function useDappNodeDeposit(wallet, network) {
  const [txData, setTxData] = useState(INITIAL_DATA)
  const [deposits, setDeposits] = useState(null)
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

    if (!deposits.every(d => checkJsonStructure(d))) {
      throw Error('This is not a valid file. Please try again.')
    }

    if (!deposits.every(d => d.fork_version === network.forkVersion)) {
      throw Error("This JSON file isn't for the right network (" + deposits[0].fork_version + "). Upload a file generated for you current network: " + network.chainName)
    }

    if (deposits.length !== 4) {
      throw Error('Number of validators different than 4. Please upload a file with 4 validators.')
    }

    const wc = deposits[0].withdrawal_credentials
    if (!deposits.every(d => d.withdrawal_credentials === wc)) {
      throw Error('Batch deposits for validators with BLS signature scheme are not supported at the moment. Please use deposit script described in the docs.')
    }

    if (!deposits.every(d => d.amount === 32000000000)) {
      throw Error('Amount should be exactly 32 tokens for batch deposits.')
    }

    const pubKeys = deposits.map(d => d.pubkey)
    if (pubKeys.some((pubkey, index) => pubKeys.indexOf(pubkey) !== index)) {
      throw Error('Duplicated public keys.')
    }

    const provider = new ethers.providers.StaticJsonRpcProvider(network.rpcUrl)
    const depositContract = new Contract(network.addresses.deposit, depositABI, provider)

    console.log('Fetching existing deposits')
    const {
      deposits: existingDeposits,
      lastBlock: fromBlock,
    } = await loadCachedDeposits(network);
    const toBlock = await provider.getBlockNumber()
    const events = await getPastLogs(depositContract, 'DepositEvent', { fromBlock, toBlock }, true)
    let pks = events.map(e => e.args.pubkey)
    pks = pks.concat(existingDeposits)
    console.log(`Found ${pks.length} existing deposits`)
    for (const deposit of deposits) {
      if (pks.some(pk => pk === '0x' + deposit.pubkey)) {
        throw Error(`
          Deposits have already been made to some validators in this file.${' '}
          Max deposit is 32 mGNO per validator. Please recreate and upload a new file.
        `)
      }
    }

    // DAppNode incentive deposit contract: https://blockscout.com/xdai/mainnet/address/0x6C68322cf55f5f025F2aebd93a28761182d077c3/write-proxy
    // Must be called with the same tx data as the deposit contract
    const dappnodeDepositContract = new Contract(network.addresses.dappnodeDeposit, dappnodeDepositABI, wallet.provider.getSigner(0))

    // Check requirements: address is whitelisted and must not be expired
    // addressToIncentive: https://blockscout.com/xdai/mainnet/address/0x6C68322cf55f5f025F2aebd93a28761182d077c3/contracts
    const addressToIncentive = await dappnodeDepositContract.addressToIncentive(wallet.address) // returns struct {endTime, isClaimed}

    const isClaimed = addressToIncentive.isClaimed
    const endTime = parseInt(addressToIncentive.endTime)

    if (isClaimed) throw Error('Address has already been claimed')
    if (endTime === 0) throw Error('Address is not whitelisted')
    if (endTime < Math.floor(Date.now()/1000)) throw Error('Address has expired')
  }, [wallet, network])

  const setDappNodeDepositData = useCallback(async (fileData, filename) => {
    setFilename(filename)
    let data = null
    if (fileData) {
      try {
        data = JSON.parse(fileData)
      } catch (error) {
        throw Error('Oops, something went wrong while parsing your json file. Please check the file and try again.')
      }
      await validate(data)
    }
    setDeposits(data)
  }, [validate])

  const dappNodeDeposit = useCallback(async () => {
    try {
      setTxData({ status: 'loading' })
      console.log(`Sending deposit transaction for ${deposits.length} deposits`)
      // DAppNode incentive deposit contract: https://blockscout.com/xdai/mainnet/address/0x6C68322cf55f5f025F2aebd93a28761182d077c3/write-proxy
      // Must be called with the same tx data as the deposit contract
      const dappnodeDepositContract = new Contract(network.addresses.dappnodeDeposit, dappnodeDepositABI, wallet.provider.getSigner(0))
      let data = '0x'
      data += deposits[0].withdrawal_credentials
      deposits.forEach(deposit => {
        data += deposit.pubkey
        data += deposit.signature
        data += deposit.deposit_data_root
      })
      const tx = await dappnodeDepositContract.claimIncentive(data)
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
  }, [wallet, network, deposits])

  return { dappNodeDeposit, validate, txData, dappNodeDepositData: { deposits, filename }, setDappNodeDepositData }
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

export default useDappNodeDeposit
