const swapperABI = [
  {
    inputs: [],
    name: 'hez',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'matic',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'SWAP_RATIO',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'hezAmount',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: '_permitData',
        type: 'bytes'
      }
    ],
    name: 'hezToMatic',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]

export default swapperABI
