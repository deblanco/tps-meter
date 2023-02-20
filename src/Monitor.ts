import ethers, { providers } from "ethers";
import { TypedEvent } from "./EventEmitter";
import { BlockEvent } from "./Types";

export class Monitor {
  private provider: ethers.providers.BaseProvider;

  constructor(rpc: string) {
    this.provider = new providers.JsonRpcProvider(rpc);
  }

  execute(te: TypedEvent<BlockEvent>) {
    this.provider.on("block", async (blockNumber: number) => {
      const block = await this.provider.getBlockWithTransactions(blockNumber);
      // add filters here like only catch txs with target the sample contract
      // we are gonna catch every tx because we don't care about specifics
      const transactionsCount = block.transactions.length;
      const blockEvent: BlockEvent = {
        blockNumber: block.number,
        timestamp: block.timestamp,
        transactionsCount,
      };
      te.emit(blockEvent);
    });
  }
}
