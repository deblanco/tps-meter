import ethers, { Wallet, providers, Contract, Signer } from "ethers";
import { NonceManager } from "@ethersproject/experimental";
import { deploySmartContract, instanceSmartContract } from "./Contract";

export class Spammer {
  private reqBatch: number;
  private requests: number = 0;
  private running = false;
  private contract: ethers.Contract | undefined;
  private signer: NonceManager;

  constructor(rpcUrl: string, pk: string, reqBatch: number) {
    this.reqBatch = reqBatch;
    const rpc = new providers.JsonRpcProvider(rpcUrl);
    const wallet = new Wallet(pk, rpc);
    // Experimental impl of Signer/Wallet that automatically manage the Nonce
    // This is req for spamming the network
    this.signer = new NonceManager(wallet);
  }

  async execute() {
    this.contract = await this.getContract();
    await this.signer
      .getTransactionCount()
      .then((count) => this.signer.setTransactionCount(count));
    setInterval(() => {
      this.sendRequests();
    }, 100);
  }

  getTotalRequests() {
    return this.requests;
  }

  private sendRequests() {
    if (!this.running) {
      this.running = true;
      const onFlight = [];
      for (let i = 0; i < this.reqBatch; i++) {
        onFlight.push(this.request());
      }

      Promise.all(onFlight).then(() => {
        console.log("--- 📦 Submitted batch");
        this.running = false;
      });
    }
  }

  private request() {
    return this.contract!["postMsg"]("tps-meter")
      .then(() => {
        this.requests += 1;
      })
      .catch((err: Error) => {
        // console.error("Error sending test request", err);
      });
  }

  private async getContract() {
    const contractInstance = instanceSmartContract();
    const deployInstance = await deploySmartContract(
      contractInstance,
      this.signer
    );
    return new Contract(deployInstance.addr, deployInstance.abi, this.signer);
  }
}
