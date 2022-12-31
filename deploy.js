const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  //   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const encryptedjson = fs.readFileSync("./.encryptedKey.json", "utf-8");

  let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    encryptedjson,
    process.env.PRIVATE_KEY_PASS
  );

  wallet = await wallet.connect(provider);

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");

  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("deploying");

  const contract = await contractFactory.deploy();
  const transactionReciept = await contract.deployTransaction.wait(1);
  console.log(`Contract address: ${contract.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
