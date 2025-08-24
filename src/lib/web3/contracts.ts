// Configuración de contratos desplegados en Monad testnet
export const CONTRACT_ADDRESSES = {
  // Monad Testnet (Chain ID: 10143)
  monadTestnet: {
    RemittancePool: "0x42cCb3EB32ab80433e957260cD7C486ae1BFb9f6",
    ComplianceModule: "0x1546F9800d28ddff94438A76C8445381E487E1a8",
    IncentiveVault: "0xdFa24C062fb6fFDBF8fe7431aD8EB2014E841ef2",
    RemittanceToken: "0xB72EcDa4f600F5a5965C82eB421a551EdC8279D2",
    ExchangeRateOracle: "0x57439Fa61Ac189DD5fBFaA87113A70C70385cF64",
    AztlanFiCore: "0x46Ca523e51783a378fBa0D06d05929652D04B19E",
    PartnerIntegrations: "0xC1eeEDbc9bcB94484157BbC2F8B95D94B1d7e447",
  },
  // Hardhat Local (Chain ID: 1337) - para desarrollo local
  hardhat: {
    RemittancePool: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    ComplianceModule: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    IncentiveVault: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    RemittanceToken: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    ExchangeRateOracle: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    AztlanFiCore: "0x0000000000000000000000000000000000000000", // To be deployed
    PartnerIntegrations: "0x0000000000000000000000000000000000000000", // To be deployed
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
  AztlanFiCore: string;
  PartnerIntegrations: string;
}
