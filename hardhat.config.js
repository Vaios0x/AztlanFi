require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    "monad-testnet": {
      url: "https://testnet-rpc.monad.xyz",
      chainId: 10143,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 60000000000, // 60 gwei
      gas: 5000000,
    },
    hardhat: {
      chainId: 1337,
    },
  },
  etherscan: {
    apiKey: {
      "monad-testnet": "not-needed",
    },
    customChains: [
      {
        network: "monad-testnet",
        chainId: 10143,
        urls: {
          apiURL: "https://testnet.monadexplorer.com/api",
          browserURL: "https://testnet.monadexplorer.com",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
