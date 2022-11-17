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

Sample .env file is located in the root for the supported networks:

- [Gnosis mainnet](./.env.gnosis)
- [Chiado testnet](./.env.chiado)

Create the required `.env` file from the example provided in the repo, change `NETWORK` with the desired one:

```sh
cp .env.NETWORK .env
```

Run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

```sh
npm start
```