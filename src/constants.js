const BRIDGE_GAS_LIMIT = 300000

const NETWORKS = {
  100: {
    forkVersion: "00000064",
    chainId: 100,
    name: 'Gnosis Chain',
    symbol: 'XDAI',
    chainName: 'Gnosis Chain',
    rpcUrl: 'https://rpc.gnosischain.com',
    blockExplorerUrl: 'https://blockscout.com/xdai/mainnet',
    beaconExplorerUrl: 'https://beacon.gnosischain.com',

  },
  10200: {
    forkVersion: "0000006f",
    chainId: 10200,
    name: 'Chiado',
    symbol: 'CHI',
    chainName: 'Chiado Testnet',
    rpcUrl: 'https://rpc.chiadochain.net',
    blockExplorerUrl: 'https://blockscout.chiadochain.net',
    beaconExplorerUrl: 'https://beacon.chiadochain.net',
  }
}

export {
  BRIDGE_GAS_LIMIT,
  NETWORKS
}
