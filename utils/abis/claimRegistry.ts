const claimRegistryABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  { inputs: [{ internalType: "address", name: "target", type: "address" }], name: "AddressEmptyCode", type: "error" },
  { inputs: [{ internalType: "address", name: "implementation", type: "address" }], name: "ERC1967InvalidImplementation", type: "error" },
  { inputs: [], name: "ERC1967NonPayable", type: "error" },
  { inputs: [], name: "FailedInnerCall", type: "error" },
  { inputs: [], name: "InvalidInitialization", type: "error" },
  { inputs: [], name: "NotInitializing", type: "error" },
  { inputs: [{ internalType: "address", name: "owner", type: "address" }], name: "OwnableInvalidOwner", type: "error" },
  { inputs: [{ internalType: "address", name: "account", type: "address" }], name: "OwnableUnauthorizedAccount", type: "error" },
  { inputs: [], name: "UUPSUnauthorizedCallContext", type: "error" },
  { inputs: [{ internalType: "bytes32", name: "slot", type: "bytes32" }], name: "UUPSUnsupportedProxiableUUID", type: "error" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "caller", type: "address" },
      { indexed: false, internalType: "address[]", name: "withdrawalAddresses", type: "address[]" },
    ],
    name: "ClaimBatch",
    type: "event",
  },
  { anonymous: false, inputs: [{ indexed: false, internalType: "uint64", name: "version", type: "uint64" }], name: "Initialized", type: "event" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  { anonymous: false, inputs: [{ indexed: true, internalType: "address", name: "user", type: "address" }], name: "Register", type: "event" },
  { anonymous: false, inputs: [{ indexed: true, internalType: "address", name: "user", type: "address" }], name: "Unregister", type: "event" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "oldTime", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "newTime", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "oldAmount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "newAmount", type: "uint256" },
    ],
    name: "UpdateConfig",
    type: "event",
  },
  { anonymous: false, inputs: [{ indexed: true, internalType: "address", name: "implementation", type: "address" }], name: "Upgraded", type: "event" },
  { inputs: [], name: "UPGRADE_INTERFACE_VERSION", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "batchSizeMax", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "withdrawalAddress", type: "address" }], name: "claim", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "address[]", name: "withdrawalAddresses", type: "address[]" }], name: "claimBatch", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "configs",
    outputs: [
      { internalType: "uint256", name: "idx", type: "uint256" },
      { internalType: "uint256", name: "lastClaim", type: "uint256" },
      { internalType: "uint256", name: "timeThreshold", type: "uint256" },
      { internalType: "uint256", name: "amountThreshold", type: "uint256" },
      { internalType: "enum ClaimRegistryUpgradeable.ConfigStatus", name: "status", type: "uint8" },
    ],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "depositContract", outputs: [{ internalType: "contract ISBCDepositContract", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "getClaimableAddresses", outputs: [{ internalType: "address[]", name: "", type: "address[]" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "getValidatorsLength", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "implementation", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  {
    inputs: [
      { internalType: "address", name: "_depositContract", type: "address" },
      { internalType: "uint256", name: "_batchSizeMax", type: "uint256" },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { inputs: [{ internalType: "address", name: "_withdrawalAddress", type: "address" }], name: "isConfigActive", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "owner", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "proxiableUUID", outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }], stateMutability: "view", type: "function" },
  {
    inputs: [
      { internalType: "address", name: "_withdrawalAddress", type: "address" },
      { internalType: "uint256", name: "_timeThreshold", type: "uint256" },
      { internalType: "uint256", name: "_amountThreshold", type: "uint256" },
    ],
    name: "register",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { inputs: [], name: "renounceOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [],
    name: "resolve",
    outputs: [
      { internalType: "bool", name: "flag", type: "bool" },
      { internalType: "bytes", name: "cdata", type: "bytes" },
    ],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [{ internalType: "uint256", name: "size", type: "uint256" }], name: "setBatchSizeMax", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "address", name: "newOwner", type: "address" }], name: "transferOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "address", name: "_withdrawalAddress", type: "address" }], name: "unregister", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [
      { internalType: "address", name: "_withdrawalAddress", type: "address" },
      { internalType: "uint256", name: "_timeThreshold", type: "uint256" },
      { internalType: "uint256", name: "_amountThreshold", type: "uint256" },
    ],
    name: "updateConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "newImplementation", type: "address" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  { inputs: [{ internalType: "uint256", name: "", type: "uint256" }], name: "validators", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
] as const;

export default claimRegistryABI;
