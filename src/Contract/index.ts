import fs from "fs";
import ethers from "ethers";
import path from "path";
const solc = require("solc");

export function instanceSmartContract() {
  try {
    const input = {
      language: "Solidity",
      sources: {
        "postBox.sol": {
          content: fs.readFileSync(path.join("postBox.sol"), "utf8"),
        },
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["*"],
          },
        },
      },
    };
    const compiled = JSON.parse(solc.compile(JSON.stringify(input)));
    return {
      abi: compiled.contracts["postBox.sol"]["postBox"].abi,
      bytecode:
        "0x" + compiled.contracts["postBox.sol"]["postBox"].evm.bytecode.object,
    };
  } catch (err) {
    console.error("Something happened instanciating the SmartContract");
    throw err;
  }
}

export async function deploySmartContract(
  instance: ReturnType<typeof instanceSmartContract>,
  wallet: ethers.Signer
) {
  const tx = await wallet.sendTransaction({
    data: instance.bytecode,
  });
  await tx.wait();
  const receipt = await wallet.provider?.getTransactionReceipt(tx.hash);
  console.log("--- 📑 Contract deployed at addr", receipt!.contractAddress);
  return {
    ...instance,
    addr: receipt!.contractAddress!,
  };
}
