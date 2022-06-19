const BRIDGE_GAS_LIMIT = 300000

const NETWORKS = {
  100: {
    name: 'Gnosis Chain',
    symbol: 'XDAI',
    chainName: 'Gnosis Chain',
    rpcUrl: 'https://rpc.gnosischain.com',
    blockExplorerUrl: 'https://blockscout.com/xdai/mainnet',
  },
  77: {
    name: 'Sokol',
    symbol: 'SKL',
    chainName: 'Sokol Testnet',
    rpcUrl: 'https://sokol.poa.network',
    blockExplorerUrl: 'https://blockscout.com/poa/sokol',
  }
}

export {
  BRIDGE_GAS_LIMIT,
  NETWORKS
}
