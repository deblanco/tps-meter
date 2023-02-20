import { TypedEvent } from "./EventEmitter";
import { BlockEvent } from "./Types";
import { Gauge } from "clui";
import Config from "./config.json";
import fs from "fs";

type BlockSummary = BlockEvent & { instantTPS: number };

export class Summary {
  private eventBus: TypedEvent<BlockEvent>;
  private blocks: BlockSummary[] = [];

  constructor(te: TypedEvent<BlockEvent>) {
    this.eventBus = te;
    te.on((b) => this.onBlock(b));
  }

  public getTransactionAvg() {
    const sumTransactions = this.blocks.reduce(
      (sum, b) => sum + b.transactionsCount,
      0
    );
    return sumTransactions / this.blocks.length;
  }

  public getBlockTimeAvg() {
    if (this.blocks.length < 2) return 1;
    // (L - s) / (T - 1) = (Longest Value - Smallest value) / (Total Values - 1)
    return (
      (this.blocks[this.blocks.length - 1].timestamp -
        this.blocks[0].timestamp) /
      (this.blocks.length - 1)
    );
  }

  public getTPSAvg() {
    return this.getTransactionAvg() / this.getBlockTimeAvg();
  }

  public getBlocks() {
    return this.blocks;
  }

  public getTPSmax() {
    return this.blocks.reduce(
      (tps, i) => (i.instantTPS > tps ? i.instantTPS : tps),
      0
    );
  }

  public getMaxTxnInblock() {
    return this.blocks.reduce(
      (txns, i) => (i.transactionsCount > txns ? i.transactionsCount : txns),
      0
    );
  }

  private onBlock(block: BlockEvent) {
    const instantTPS = block.transactionsCount / this.getBlockTimeAvg();
    this.blocks.push({ ...block, instantTPS });
    this.blocks.sort((a, b) => a.timestamp - b.timestamp);
    this.print();
  }

  private print() {
    console.clear();

    // After a 1min we print the summary
    if (
      this.getBlockTimeAvg() * this.blocks.length >
      Config.sampleTimeInSeconds
    )
      return this.summary();

    console.log(
      Gauge(
        this.getTPSAvg(),
        this.getTPSmax(),
        20,
        this.getTPSmax() * 0.2,
        this.getTPSAvg() + " TPS"
      )
    );
  }

  private summary() {
    const text = `
    --- SUMMARY ---
    -- Blocks Tracked: ${this.blocks.length}
    -- Avg Block Time: ${this.getBlockTimeAvg()}
    -- Avg TPS: ${this.getTPSAvg()}
    -- Max TPS: ${this.getTPSmax()}
    -- Avg Txn per Block: ${this.getTransactionAvg()}
    -- Max Txns in a Block ${this.getMaxTxnInblock()}
    `;

    console.log(text);
    // write summary
    fs.writeFileSync(`logs/${new Date().toISOString()}.txt`, text);

    process.exit();
  }
}
