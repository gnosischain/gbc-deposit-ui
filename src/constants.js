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
    addresses: {
      wrapper: '0x647507A70Ff598F386CB96ae5046486389368C66',
      token: '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb',
      wrappedToken: '0x722fc4DAABFEaff81b97894fC623f91814a1BF68',
      deposit: '0x0B98057eA310F4d31F2a452B414647007d1645d9',
      dappnodeDeposit: '0x6C68322cf55f5f025F2aebd93a28761182d077c3',
    },
    depositStartBlockNumber: 22673201,
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
    addresses: {
      wrapper: '0x917947dC7E341d843ab38e91623bcAeb65512b75',
      token: '0x19C653Da7c37c66208fbfbE8908A5051B57b4C70',
      wrappedToken: '0xc5be8bf53755a41c2385e7aa86f6a9e28746f466',
      deposit: '0xb97036A26259B7147018913bD58a774cf91acf25',
      dappnodeDeposit: null,
    },
    depositStartBlockNumber: 0,
  }
}

export {
  BRIDGE_GAS_LIMIT,
  NETWORKS
}
