# tps-meter

This repository contains a tool for measuring the Transactions Per Second (TPS) of a blockchain network, along with a smart contract that will be written for the measurements. The purpose of this tool is to help users evaluate the performance of various blockchain networks by providing a simple, reliable, and decentralized approach to benchmarking their TPS.

# Usage

## Installation

- Clone this repo
- Install the dependencies with `yarn`
- Run `yarn build`

* This project has been built using NodeJS v16

## Running the benchmark

To run the benchmark, execute the `yarn start` script:

```sh
yarn start -r RPC_ENDPOINT -pk PRIVATE_KEY -c OPTIONAL_BATCH_SIZE
```

The tool will create the specified number of transactions and measure the time it takes for those transactions to be confirmed on the blockchain. It will output the TPS measurement to the console.

The script requires a _Private Key_ for creating the transactions, which will measure the TPS. The _Batch Size_ is an optional parameter, by default 150, which you can find low, consider changing it over >300.

## Running in parallel

When running the script with the parallel testing option, it will use the provided RPCs and private keys from the `.env` file to perform concurrent writes to the blockchain. This allows for a more accurate measurement of the network's maximum TPS under high load conditions.

To use this option, pass the option `--env`. It will ignore the rest of the parameters. For more information check the [example env file](.env.example).

## CLI

```sh
Usage: tps-meter [options]

A tool for benchmarking the transactions per second (TPS) of a blockchain

Options:
  -V, --version                            output the version number
  -r, --rpc <rpc>                          RPC endpoint
  -pk, --privateKey <privateKey>           Account privateKey
  -c, --concurrentCalls [concurrentCalls]  Concurrent calls (default: "150")
  -e, --env                                Load environment variables from .env file, ommitting other parameters
  -h, --help
```

# Contributing

If you'd like to contribute to this tool, please fork the repository and create a pull request.

# License

This tool is licensed under the MIT License.
