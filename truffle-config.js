const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "13.209.21.107",
      port: 8545,
      network_id: '*'
    },
  },
  compilers:{
    solc:{
      version:"0.4.24"
    }
  }

};
