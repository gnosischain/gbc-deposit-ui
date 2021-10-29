import { providers } from 'ethers';

function getProvider() {
  return new providers.StaticJsonRpcProvider(process.env.REACT_APP_RPC_URL);
}

export default getProvider;
