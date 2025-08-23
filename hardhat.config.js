require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
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
      accounts: ["2003f926c578fea4a77ffdd98a288a3297ee12b8893505562422dd258e4a5765"],
      gasPrice: 60000000000, // 60 gwei (higher than current 52 gwei)
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
          apiURL: "https://testnet.monadscan.com/api",
          browserURL: "https://testnet.monadscan.com",
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
