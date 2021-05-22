var HDWalletProvider = require("@truffle/hdwallet-provider");
const path = require("path");
require('dotenv').config();

console.log(`KEY=${process.env.INFURA_API_KEY}`)

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
     port: 9545,
     host: "127.0.0.1",
     network_id: "*", // match any network
    },
    ropsten: {
      provider: () => 
      new HDWalletProvider(
        process.env.MNEMONIC,
        `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`
      ),
        network_id: 3,       // Ropsten's id
        gas: 5500000,        // Ropsten has a lower block limit than mainnet
        confirmations: 2,    // # of confs to wait between deployments. (default: 0)
        timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
        skipDryRun: true 
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",
    }
  },
};

