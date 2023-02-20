import { TypedEvent } from "./EventEmitter";
import { Monitor } from "./Monitor";
import { Spammer } from "./Spammer";
import { Summary } from "./Summary";
import { BlockEvent } from "./Types";

function main() {
  const parsedArgs = parseArgs();
  const te = new TypedEvent<BlockEvent>();
  const summary = new Summary(te);
  const monitor = new Monitor(parsedArgs.rpc);
  monitor.execute(te);
  const spammer = new Spammer(
    parsedArgs.rpc,
    parsedArgs.privateKey,
    parsedArgs.concurrentCalls ? Number(parsedArgs.concurrentCalls) : 150
  );
  spammer.execute();
}

function parseArgs() {
  const [, , rpc, privateKey, concurrentCalls] = process.argv;
  if (!rpc || !privateKey) {
    throw Error(`Missing parameters.
    Usage "yarn start RPC_ENDPOINT PRIVATE_KEY OPT_CONCURRENT_CALLS"`);
  }
  return { rpc, privateKey, concurrentCalls };
}

main();
