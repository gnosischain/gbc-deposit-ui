import { Address } from "viem";

export type ContractNetwork = {
  forkVersion: string;
  beaconExplorerUrl: string;
  addresses: {
    token: Address;
    deposit: Address;
    claimRegistry: Address;
    dappnodeIncentive?: Address; // SC only avaliable in gnosis chain
    consolidate?: Address; // SC only avaliable in devnet
  };
  depositStartBlockNumber: bigint;
  claimRegistryStartBlockNumber: bigint;
  blockExplorerUrl?: string;
};

type Contracts = {
  [key: number]: ContractNetwork;
};

const CONTRACTS: Contracts = {
  100: {
    forkVersion: "00000064",
    beaconExplorerUrl: 'https://gnosischa.in',
    addresses: {
      token: "0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb",
      deposit: "0x0B98057eA310F4d31F2a452B414647007d1645d9",
      claimRegistry: "0xe4d0a119cc2546c1ec4945c04b04985d1e59cdba",
      dappnodeIncentive: "0x485c6Be503D32511c1282b68dD99E85f250572c3",
      consolidate: "0x00431F263cE400f4455c2dCf564e53007Ca4bbBb"
    },
    depositStartBlockNumber: BigInt(19475089),
    claimRegistryStartBlockNumber: BigInt(33473327),
    blockExplorerUrl: 'https://gnosis.blockscout.com/'
  },
  10200: {
    forkVersion: "0000006f",
    beaconExplorerUrl: 'https://beacon.chiadochain.net',
    addresses: {
      token: "0x19C653Da7c37c66208fbfbE8908A5051B57b4C70",
      deposit: "0xb97036A26259B7147018913bD58a774cf91acf25",
      claimRegistry: "0x28f1ba1f2Db9Aa0ca4b3B7cD9Ae327f6E872867D",
    },
    depositStartBlockNumber: BigInt(155530),
    claimRegistryStartBlockNumber: BigInt(9311142),
    blockExplorerUrl: 'https://gnosis-chiado.blockscout.com/'
  },
  31337: {
    forkVersion: "0000006f",
    beaconExplorerUrl: 'https://beacon.chiadochain.net',
    addresses: {
      token: "0x19C653Da7c37c66208fbfbE8908A5051B57b4C70",
      deposit: "0xb97036A26259B7147018913bD58a774cf91acf25",
      claimRegistry: "0x28f1ba1f2Db9Aa0ca4b3B7cD9Ae327f6E872867D",
    },
    depositStartBlockNumber: BigInt(155530),
    claimRegistryStartBlockNumber: BigInt(9311142),
  },

  10209: {
    forkVersion: "00000072",
    beaconExplorerUrl: 'https://gnosischa.in',
    addresses: {
      token: "0xBabe2bEd00000000000000000000000000000002",
      deposit: "0xbabe2bed00000000000000000000000000000003",
      claimRegistry: "0x28f1ba1f2Db9Aa0ca4b3B7cD9Ae327f6E872867D",
      consolidate: "0x01aBEa29659e5e97C95107F20bb753cD3e09bBBb"
    },
    depositStartBlockNumber: BigInt(0),
    claimRegistryStartBlockNumber: BigInt(9311142),
    blockExplorerUrl: 'ttp://192.155.94.248:8082/'
  },
};

export default CONTRACTS;
