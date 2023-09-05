import path from 'path'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { Contract, providers } from 'ethers'
import PQueue from 'p-queue'

// Network config and ABI
import depositABI from '../abis/deposit.js'
import { NETWORKS } from '../constants.js'

// Config
const stepSize = 25_000
const concurrency = 5
const retries = 5
const retryDelay = 500
const __dirname = path.dirname(new URL(import.meta.url).pathname)

async function sleep (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// NOTE: The replacer is used in order not to keep all the events in RAM
// when only a subset of the data is required.
async function getPastLogs (contract, event, { fromBlock, toBlock }, replacer) {
  const allEvents = []
  const queue = new PQueue({ concurrency })
  const count = Math.ceil((toBlock - fromBlock) / stepSize)

  queue.on('active', () => {
    const left = queue.size + queue.pending
    const log = `${Math.round((10000 * (count - left)) / count) / 100}% done`

    if (process.stdout.isTTY) {
      process.stdout.clearLine(0)
      process.stdout.cursorTo(0)
      process.stdout.write(log)
    }
  })

  for (; fromBlock <= toBlock; fromBlock = fromBlock + stepSize) {
    const stepBlock = Math.min(toBlock, fromBlock + stepSize - 1)
    const from = fromBlock

    queue.add(async () => {
      for (let i = 0; i < retries; i++) {
        try {
          const newEvents = await contract.queryFilter(event, from, stepBlock)
          allEvents.push(...(replacer ? newEvents.map(replacer) : newEvents))
          break
        } catch (err) {
          await sleep(retryDelay)
        }
      }
    })
  }

  await queue.onIdle()
  process.stdout.isTTY && process.stdout.write("\n");
  return allEvents
}

async function readCurrentDeposits (filePath) {
  try {
    const content = await readFile(filePath, 'utf8')
    return JSON.parse(content)
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err
    }
  }

  return {}
}

async function updateNetwork (networkId) {
  const network = NETWORKS[networkId]
  if (!network) {
    throw new Error(`Network with ID ${networkId} does not exist`)
  }

  console.log(`Updating deposits for ${network.name}`)
  const filePath = path.resolve(
    __dirname,
    `../data/${networkId}/deposits.json`
  )

  let {
    lastBlock = network.depositStartBlockNumber,
    deposits = []
  } = await readCurrentDeposits(filePath)

  const rpcUrl = process.env[`RPC_URL_${networkId}`] ?? network.rpcUrl
  const provider = new providers.StaticJsonRpcProvider(rpcUrl)
  const depositContract = new Contract(
    network.addresses.deposit,
    depositABI,
    provider
  )

  console.log('Fetching existing deposits')
  const fromBlock = lastBlock
  const toBlock = await provider.getBlockNumber()
  const pks = await getPastLogs(
    depositContract,
    'DepositEvent',
    {
      fromBlock,
      toBlock
    },
    (event) => event.args.pubkey
  )

  deposits = deposits.concat(pks)
  lastBlock = toBlock

  // Write the new deposits to file
  const newContent = JSON.stringify({ lastBlock, deposits })
  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(filePath, newContent, 'utf8')

  console.log(
    `Added ${pks.length} new cached pubkeys, new total is ${deposits.length}.`
  )
}

async function main () {
  for (const networkId of Object.keys(NETWORKS)) {
    await updateNetwork(networkId)
  }
}

main()
