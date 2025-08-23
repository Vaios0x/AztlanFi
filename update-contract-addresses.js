const fs = require('fs');

// Read deployment info
const deploymentInfo = JSON.parse(fs.readFileSync('deployment-info-monad-final.json', 'utf8'));

// Update contracts.ts file
const contractsTsContent = `// Configuración de contratos desplegados en Monad testnet
export const CONTRACT_ADDRESSES = {
  // Monad Testnet (Chain ID: 10143)
  monadTestnet: {
    RemittancePool: "${deploymentInfo.contracts.RemittancePool}",
    ComplianceModule: "${deploymentInfo.contracts.ComplianceModule}",
    IncentiveVault: "${deploymentInfo.contracts.IncentiveVault}",
    RemittanceToken: "${deploymentInfo.contracts.RemittanceToken}",
    ExchangeRateOracle: "${deploymentInfo.contracts.ExchangeRateOracle}",
    AztlanFiCore: "${deploymentInfo.contracts.AztlanFiCore}",
    PartnerIntegrations: "${deploymentInfo.contracts.PartnerIntegrations}",
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
      throw new Error(\`Chain ID \${chainId} no soportado\`);
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
      throw new Error(\`Chain ID \${chainId} no soportado\`);
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
`;

// Write updated contracts.ts file
fs.writeFileSync('src/lib/web3/contracts.ts', contractsTsContent);

console.log('✅ Updated src/lib/web3/contracts.ts with new contract addresses');
console.log('📋 Contract addresses updated:');
Object.entries(deploymentInfo.contracts).forEach(([name, address]) => {
  console.log(`  ${name}: ${address}`);
});
