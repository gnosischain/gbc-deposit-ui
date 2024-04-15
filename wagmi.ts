import { http, createConfig } from "wagmi";
import { gnosis, gnosisChiado, mainnet, sepolia } from "wagmi/chains";
import { coinbaseWallet, walletConnect } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, sepolia, gnosis, gnosisChiado],
  connectors: [coinbaseWallet({ appName: "Gnosis Deposit" }), walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "" })],
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [gnosis.id]: http(),
    [gnosisChiado.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
