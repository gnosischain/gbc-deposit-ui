import { Address } from "viem";

export type ContractNetwork = {
  forkVersion: string;
  addresses: {
    token: Address;
    deposit: Address;
    claimRegistry: Address;
  };
  depositStartBlockNumber: bigint;
};

type Contracts = {
  [key: number]: ContractNetwork | undefined;
};

const CONTRACTS: Contracts = {
  100: {
    forkVersion: "00000064",
    addresses: {
      token: "0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb",
      deposit: "0x0B98057eA310F4d31F2a452B414647007d1645d9",
      claimRegistry: "0xe4d0a119cc2546c1ec4945c04b04985d1e59cdba",
    },
    depositStartBlockNumber: BigInt(19475089),
  },
  10200: {
    forkVersion: "0000006f",
    addresses: {
      token: "0x19C653Da7c37c66208fbfbE8908A5051B57b4C70",
      deposit: "0xb97036A26259B7147018913bD58a774cf91acf25",
      claimRegistry: "0xe4d0a119cc2546c1ec4945c04b04985d1e59cdba",
    },
    depositStartBlockNumber: BigInt(155530),
  },
};

export default CONTRACTS;
