import env from "dotenv";

import { Command } from "commander";
import { TypedEvent } from "./EventEmitter";
import { Monitor } from "./Monitor";
import { Spammer } from "./Spammer";
import { Summary } from "./Summary";
import { BlockEvent } from "./Types";

function main() {
  const parsedArgs = parseArgs();

  console.log(
    "🚀 Starting TPS Meter with the following parameters:",
    JSON.stringify(parsedArgs, null, 2)
  );

  const te = new TypedEvent<BlockEvent>();
  const summary = new Summary(te);

  const monitor = new Monitor(parsedArgs.rpc[0]); // Forced always to RPC[0] ??
  monitor.execute(te);

  const spammers = parsedArgs.rpc.map((rpc, index) => {
    const spammer = new Spammer(
      rpc,
      parsedArgs.privateKey[index],
      parsedArgs.concurrentCalls[index]
    );
    spammer.execute();
    return spammer;
  });

  console.log(`🦄 ${spammers.length} Spammers instances started`);
}

function parseArgs() {
  const program = new Command();

  program
    .name("tps-meter")
    .version("0.0.1")
    .description(
      "A tool for benchmarking the transactions per second (TPS) of a blockchain"
    )
    .option("-r, --rpc <rpc>", "RPC endpoint")
    .option("-pk, --privateKey <privateKey>", "Account privateKey")
    .option(
      "-c, --concurrentCalls [concurrentCalls]",
      "Concurrent calls",
      "150"
    )
    .option(
      "-e, --env",
      "Load environment variables from .env file, ommitting other parameters"
    );

  program.parse(process.argv);
  const options = program.opts();

  // Omits other parameters
  if (options.env) {
    env.config();
    const rpc = process.env.RPCS?.split(",") ?? [];
    const privateKey = process.env.PRIVATE_KEYS?.split(",") ?? [];
    const concurrentCalls = process.env.CONCURRENT_CALLS ?? "150";

    if (rpc.length !== privateKey.length || rpc.length === 0) {
      program.error(
        "The number of RPC endpoints must be equal to the number of private keys or greater than 0"
      );
    }

    return { rpc, privateKey, concurrentCalls };
  }

  if (!options.rpc || !options.privateKey) {
    return program.help();
  }

  return {
    rpc: [options.rpc],
    privateKey: [options.privateKey],
    concurrentCalls: [options.concurrentCalls],
  };
}

main();
