const path = require("path");

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
     port: 9545,
     host: "127.0.0.1",
     network_id: "*", // match any network
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",
    }
  },
};

