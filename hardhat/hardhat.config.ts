import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      forking: {
        url: "https://rpc.chiadochain.net",
      },
      chains: {
        10200: {
          hardforkHistory: {
            cancun: 10163281,
          },
        },
      },
    },
  },
};

export default config;
