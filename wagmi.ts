import { http, createConfig } from "wagmi";
import { gnosis, gnosisChiado, hardhat } from "wagmi/chains";
import { coinbaseWallet, walletConnect } from "wagmi/connectors";
import { devnet } from "./utils/devnet";

export const isTestEnv = process.env.NEXT_PUBLIC_TEST_ENV === "test";

export const config = createConfig({
  chains: [gnosis, gnosisChiado, devnet, ...(isTestEnv ? [hardhat] : [])],
  connectors: [coinbaseWallet({ appName: "Gnosis Deposit" }), walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "" })],
  ssr: true,
  transports: {
    [gnosis.id]: http("https://rpc.gnosischain.com/"),
    [gnosisChiado.id]: http("https://rpc.chiadochain.net"),
    [devnet.id]: http("https://gnosis-devnet.nethermind.dev/execution"),
    [hardhat.id]: http("http://127.0.0.1:8545"),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
