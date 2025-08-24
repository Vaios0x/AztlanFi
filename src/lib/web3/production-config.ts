// Configuración para producción - Monad Testnet (actualmente)
export const PRODUCTION_CONFIG = {
  // Monad Testnet (actualmente en uso)
  monadTestnet: {
    chainId: 10143,
    rpcUrl: "https://testnet-rpc.monad.xyz",
    explorerUrl: "https://testnet.monadscan.com",
    contractAddresses: {
      // Direcciones desplegadas en Monad testnet
      RemittancePool: "0x42cCb3EB32ab80433e957260cD7C486ae1BFb9f6",
      ComplianceModule: "0x1546F9800d28ddff94438A76C8445381E487E1a8",
      IncentiveVault: "0xdFa24C062fb6fFDBF8fe7431aD8EB2014E841ef2",
      RemittanceToken: "0xB72EcDa4f600F5a5965C82eB421a551EdC8279D2",
      ExchangeRateOracle: "0x57439Fa61Ac189DD5fBFaA87113A70C70385cF64",
      AztlanFiCore: "0x46Ca523e51783a378fBa0D06d05929652D04B19E",
      PartnerIntegrations: "0xC1eeEDbc9bcB94484157BbC2F8B95D94B1d7e447",
    }
  },
  
  // Configuración de gas para producción
  gasConfig: {
    defaultGasPrice: 50000000000, // 50 gwei
    maxGasPrice: 100000000000, // 100 gwei
    gasLimit: 5000000,
  },
  
  // Configuración de la aplicación
  app: {
    name: "AztlanFi",
    version: "1.0.0",
    description: "Plataforma de remesas descentralizada en Monad",
    website: "https://aztlanfi.com",
    supportEmail: "support@aztlanfi.com",
  },
  
  // Configuración de seguridad
  security: {
    maxTransactionAmount: 10000, // USD
    minTransactionAmount: 1, // USD
    maxDailyTransactions: 50,
    complianceEnabled: true,
  },
  
  // Configuración de oráculos
  oracles: {
    exchangeRateUpdateInterval: 300000, // 5 minutos
    maxRateDeviation: 0.05, // 5%
    backupRateSources: [
      "https://api.exchangerate-api.com/v4/latest/USD",
      "https://api.fixer.io/latest?base=USD&symbols=MXN",
    ],
  },
  
  // Configuración de recompensas
  rewards: {
    referralBonus: 0.05, // 5%
    transactionBonus: 0.01, // 1%
    maxRewardsPerDay: 100, // RFLASH tokens
  },
};

// Función para obtener configuración según el entorno
export function getProductionConfig(environment: 'development' | 'staging' | 'production') {
  switch (environment) {
    case 'production':
      return {
        ...PRODUCTION_CONFIG,
        // Configuraciones específicas de producción
        gasConfig: {
          ...PRODUCTION_CONFIG.gasConfig,
          defaultGasPrice: 30000000000, // 30 gwei para producción
        },
      };
    case 'staging':
      return {
        ...PRODUCTION_CONFIG,
        // Configuraciones específicas de staging
        gasConfig: {
          ...PRODUCTION_CONFIG.gasConfig,
          defaultGasPrice: 40000000000, // 40 gwei para staging
        },
      };
    default:
      return PRODUCTION_CONFIG;
  }
}

// Función para validar configuración de producción
export function validateProductionConfig() {
  const requiredFields = [
    'chainId',
    'rpcUrl',
    'explorerUrl',
    'contractAddresses',
  ];
  
  const missingFields = requiredFields.filter(field => 
    !PRODUCTION_CONFIG.monadTestnet[field as keyof typeof PRODUCTION_CONFIG.monadTestnet]
  );
  
  if (missingFields.length > 0) {
    throw new Error(`Configuración de producción incompleta. Campos faltantes: ${missingFields.join(', ')}`);
  }
  
  return true;
}
