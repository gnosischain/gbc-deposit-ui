# Gnosis Beacon Chain deposit UI

Simple tool to deposit tokens to the Gnosis Beacon Chain

## Getting Started

Clone the repo:

```sh
git clone git@github.com:gnosischain/gbc-deposit-ui.git
```

Move into the project directory:

```sh
cd gbc-deposit-ui
```

Install project dependencies:

```sh
npm install
```

Create the required `.env` file from the example provided in the repo:

```sh
cp .env.example .env
```

Run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

```sh
npm start
```

## Environment variables

The current production environment variables:

```
REACT_APP_NETWORK_ID=100
REACT_APP_RPC_URL="https://rpc-deposit.gnosischain.com/"
REACT_APP_WRAPPER_CONTRACT_ADDRESS=0x647507A70Ff598F386CB96ae5046486389368C66
REACT_APP_TOKEN_CONTRACT_ADDRESS=0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb
REACT_APP_WRAPPED_TOKEN_CONTRACT_ADDRESS=0x722fc4DAABFEaff81b97894fC623f91814a1BF68
REACT_APP_DEPOSIT_CONTRACT_ADDRESS=0x0B98057eA310F4d31F2a452B414647007d1645d9
REACT_APP_DEPOSIT_START_BLOCK_NUMBER=22673201
REACT_APP_DAPPNODE_DEPOSIT_CONTRACT_ADDRESS=0x6C68322cf55f5f025F2aebd93a28761182d077c3
REACT_APP_USE_PERMIT=true
```
