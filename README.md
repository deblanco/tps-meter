# tps-meter

This is a tool for benchmarking the transactions per second (TPS) of a blockchain. It measures the TPS by creating a specified number of transactions and measuring the time it takes for those transactions to be confirmed on the blockchain.

# Usage

## Installation

- Clone this repo
- Install the dependencies with `yarn`
- Run `yarn build`

* This project has been built using NodeJS v16

## Running the benchmark

To run the benchmark, execute the `yarn start` script:

```sh
yarn start RPC_ENDPOINT PRIVATE_KEY OPT_BATCH_SIZE
```

The tool will create the specified number of transactions and measure the time it takes for those transactions to be confirmed on the blockchain. It will output the TPS measurement to the console.

The script requires a _Private Key_ for creating the transactions, which will measure the TPS. The _Batch Size_ is an optional parameter, by default 150, which you can find low, consider changing it over >300.

# Contributing

If you'd like to contribute to this tool, please fork the repository and create a pull request.

# License

This tool is licensed under the MIT License.
