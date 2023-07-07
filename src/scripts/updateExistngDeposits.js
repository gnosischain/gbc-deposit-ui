import depositABI from '../abis/deposit.js'
import { NETWORKS } from '../constants.js';
import { Contract, ethers } from 'ethers'
import path from 'path';
import { readFile, writeFile } from 'fs/promises';

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

async function main() {
  const filePath = path.resolve(new URL(import.meta.url).pathname, '../../existing_deposits.json');
  const existingDepositsString = await readFile(filePath, 'utf8')
  let existingDeposits = JSON.parse(existingDepositsString);

  const network = NETWORKS[100]
  const provider = new ethers.providers.StaticJsonRpcProvider(network.rpcUrl)
  const depositContract = new Contract(network.addresses.deposit, depositABI, provider)

  console.log('Fetching existing deposits')
  const fromBlock = parseInt(network.depositStartBlockNumber, 10) || 0
  const toBlock = await provider.getBlockNumber()
  const events = await getPastLogs(depositContract, 'DepositEvent', { fromBlock, toBlock }, true)

  const pks = events.map(e => e.args.pubkey)
  existingDeposits = existingDeposits.concat(pks)

  // convert existingDeposits back to formatted json
  let updatedExistingDepositsString = JSON.stringify(existingDeposits)
  updatedExistingDepositsString = updatedExistingDepositsString.replaceAll('[', '[\n')
  updatedExistingDepositsString = updatedExistingDepositsString.replaceAll(']', '\n]')
  updatedExistingDepositsString = updatedExistingDepositsString.replaceAll(',', ',\n')
  updatedExistingDepositsString = updatedExistingDepositsString.replaceAll('"0x', '\t"0x')
  await writeFile(filePath, updatedExistingDepositsString, 'utf8');

  // update depositStartBlockNumber and convert NETWORKS back to constants.js format
  NETWORKS[100].depositStartBlockNumber = toBlock
  let updatedNETWORKS = JSON.stringify(NETWORKS, null, "  ")
  updatedNETWORKS = updatedNETWORKS.replaceAll('  "', '  ')
  updatedNETWORKS = updatedNETWORKS.replaceAll('":', ':')
  updatedNETWORKS = "const NETWORKS = " + updatedNETWORKS + "\n\nexport {\n  NETWORKS\n}"
  
  const filePathConstants = path.resolve(new URL(import.meta.url).pathname, '../../constants.js');
  await writeFile(filePathConstants, updatedNETWORKS, 'utf8');

  console.log(`Updated existing_deposits! Added ${pks.length} new cached pubkeys, new total is ${existingDeposits.length}.`)
}

main()
