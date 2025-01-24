import { type Chain } from 'viem'

export const devnet = {
  id: 10209,
  name: 'Devnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://172.105.149.51:8545'] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'http://192.155.94.248:8082' },
  },
} as const satisfies Chain