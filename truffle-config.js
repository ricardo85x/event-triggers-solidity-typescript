const path = require("path");

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
     port: 9545,
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",
    }
  },
};

