import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-solhint";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-prettier";
import "hardhat-deploy";
import "@typechain/hardhat";

import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100,
      },
    },
  },
  networks: {
    test: {
      url: process.env.TEST_RPC_URL,
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    main: {
      url: process.env.MAIN_RPC_URL,
      accounts: [process.env.MAIN_PRIVATE_KEY || ""],
    },
    hardhat: {
      gas: 1800000,
      forking: {
        url: process.env.TEST_RPC_URL || "",
      },
    },
  },
  namedAccounts: {
    deployer: 0,
  },
  etherscan: {
    apiKey: {
      Mantle: process.env.ETHERSCAN_KEY || '',
    },
    customChains: [
      {
        network: "Mantle",
        chainId: 5001,
        urls: {
          apiURL: "https://explorer.mantle.xyz/api",
          browserURL: "https://explorer.testnet.mantle.xyz/"
        }
      }
    ]
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  mocha: {
    timeout: 100000000,
  },
};

export default config;
