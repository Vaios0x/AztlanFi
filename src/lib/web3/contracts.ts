// Configuración de contratos desplegados en Monad testnet
export const CONTRACT_ADDRESSES = {
  // Monad Testnet (Chain ID: 10143)
  monadTestnet: {
    RemittancePool: "0x138ad2d0d48070dffD6C6DaeaEbADc483CbeE29a",
    ComplianceModule: "0x025434d9Cd4c77F7acC24f8DF90F07b425eFA953",
    IncentiveVault: "0x6fF6aD8216dD1454bC977Ebb72C83aD96C034E28",
    RemittanceToken: "0x2e2e47ab692b8A29c16a38bca3A8523fA520853b",
    ExchangeRateOracle: "0xFFdCc99Cc7A9DE930716e3fB4a1b153caa740AfC",
  },
  // Hardhat Local (Chain ID: 1337) - para desarrollo local
  hardhat: {
    RemittancePool: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    ComplianceModule: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    IncentiveVault: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    RemittanceToken: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    ExchangeRateOracle: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  },
};

// URLs del explorador
export const EXPLORER_URLS = {
  monadTestnet: "https://testnet.monadscan.com",
  hardhat: "http://localhost:8545",
};

// Función para obtener direcciones según la red
export function getContractAddresses(chainId: number) {
  switch (chainId) {
    case 10143: // Monad Testnet
      return CONTRACT_ADDRESSES.monadTestnet;
    case 1337: // Hardhat Local
      return CONTRACT_ADDRESSES.hardhat;
    default:
      throw new Error(`Chain ID ${chainId} no soportado`);
  }
}

// Función para obtener URL del explorador
export function getExplorerUrl(chainId: number) {
  switch (chainId) {
    case 10143: // Monad Testnet
      return EXPLORER_URLS.monadTestnet;
    case 1337: // Hardhat Local
      return EXPLORER_URLS.hardhat;
    default:
      throw new Error(`Chain ID ${chainId} no soportado`);
  }
}

// Tipos para los contratos
export interface ContractAddresses {
  RemittancePool: string;
  ComplianceModule: string;
  IncentiveVault: string;
  RemittanceToken: string;
  ExchangeRateOracle: string;
}
