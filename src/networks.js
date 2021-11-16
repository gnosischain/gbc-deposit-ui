
const supportedNetworks = JSON.parse(process.env.REACT_APP_SUPPORTED_NETWORKS)
const rpcUrls = JSON.parse(process.env.REACT_APP_RPC_URLS)
const contractAddresses = JSON.parse(process.env.REACT_APP_SWAP_CONTRACT_ADDRESSES)

const networkNames = {
  '1': 'Ethereum',
  '100': 'xDai Chain',
}

function networks() {
  const networks = {}

  supportedNetworks.forEach((networkId, index) => {
    networks[networkId] = {
      rpcUrl: rpcUrls[index],
      swapContractAddress: contractAddresses[index],
      networkName: networkNames[networkId]
    }
  })

  return networks
}

export default networks()
