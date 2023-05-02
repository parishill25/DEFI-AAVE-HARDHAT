require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-ethers")

/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIA_URL =
    process.env.SEPOLIA_URL ||
    "https://eth-sepolia.g.alchemy.com/v2/MApzhbGeStA_LEp3LGs0ze0fJIiguJGQ"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_KEY = process.env.COINMARKETCAP_KEY
const MAINNET_RPC_URL =
    process.env.MAINNET_RPC_URL ||"https://eth-mainnet.g.alchemy.com/v2/GKHTumRYdn7N_3RflilDwalyHyTUPgXD"
   

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            forking: {
                url: MAINNET_RPC_URL,
            },
        },

        sepolia: {
            url: SEPOLIA_URL,
            accounts: ["588bd71d38637d03d07a4cb3e2cba31cd68e1610bbbbdc90ddd0f3f04119fb86"],
            chainId: 11155111,
            blockConfirmations: 6,
        },
    },

    namedAccounts: {
        deployer: {
            default: 0,
            1: 0,
        },
    },

    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }, { version: "0.4.19" },{version:"0.6.12"}],
    },

    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: COINMARKETCAP_KEY,
    },

    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
}
