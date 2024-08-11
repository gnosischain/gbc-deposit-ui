const dappnodeIncentiveABI = [
  {
    inputs: [
      {
        internalType: "contract SafeProxyFactory",
        name: "_proxyFactory",
        type: "address",
      },
      { internalType: "contract Safe", name: "_safe", type: "address" },
      {
        internalType: "contract ISBCDepositContract",
        name: "_depositContract",
        type: "address",
      },
      { internalType: "address", name: "withdrawalToken", type: "address" },
      { internalType: "address", name: "owner", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "safe",
        type: "address",
      },
    ],
    name: "RegisteredUser",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    name: "SubmitPendingDeposits",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "expiry", type: "uint256" },
      { internalType: "uint256", name: "withdrawThreshold", type: "uint256" },
      { internalType: "address", name: "beneficiary", type: "address" },
      { internalType: "bool", name: "autoClaimEnabled", type: "bool" },
      { internalType: "uint16", name: "expectedDepositCount", type: "uint16" },
      { internalType: "uint256", name: "totalStakeAmount", type: "uint256" },
    ],
    name: "assignSafe",
    outputs: [
      { internalType: "contract SafeProxy", name: "", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "address", name: "_to", type: "address" },
    ],
    name: "claimTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "beneficiary", type: "address" }],
    name: "clearPendingDeposits",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "depositContract",
    outputs: [
      {
        internalType: "contract ISBCDepositContract",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "beneficiary", type: "address" }],
    name: "executePendingDeposits",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "beneficiary", type: "address" },
      { internalType: "uint256", name: "index", type: "uint256" },
    ],
    name: "getPendingDeposit",
    outputs: [
      { internalType: "bytes", name: "pubkey", type: "bytes" },
      { internalType: "bytes", name: "signature", type: "bytes" },
      { internalType: "bytes32", name: "deposit_data_root", type: "bytes32" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxyFactory",
    outputs: [
      { internalType: "contract SafeProxyFactory", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "safe",
    outputs: [{ internalType: "contract Safe", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "safeModule",
    outputs: [
      {
        internalType: "contract GnosisDAppNodeIncentiveV2SafeModule",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "safeModuleSetup",
    outputs: [
      {
        internalType: "contract GnosisDAppNodeIncentiveV2SafeModuleSetup",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes", name: "pubkeys", type: "bytes" },
      { internalType: "bytes", name: "signatures", type: "bytes" },
      {
        internalType: "bytes32[]",
        name: "deposit_data_roots",
        type: "bytes32[]",
      },
    ],
    name: "submitPendingDeposits",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "beneficiary", type: "address" },
      { internalType: "bytes", name: "pubkeys", type: "bytes" },
      { internalType: "bytes", name: "signatures", type: "bytes" },
      {
        internalType: "bytes32[]",
        name: "deposit_data_roots",
        type: "bytes32[]",
      },
    ],
    name: "submitPendingDepositsFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "users",
    outputs: [
      { internalType: "contract Safe", name: "safe", type: "address" },
      {
        internalType: "enum GnosisDAppNodeIncentiveV2Deployer.Status",
        name: "status",
        type: "uint8",
      },
      { internalType: "uint16", name: "expectedDepositCount", type: "uint16" },
      { internalType: "uint256", name: "totalStakeAmount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export default dappnodeIncentiveABI;
