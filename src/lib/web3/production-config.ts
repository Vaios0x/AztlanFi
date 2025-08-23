// Configuración para producción - Monad Mainnet
export const PRODUCTION_CONFIG = {
  // Monad Mainnet (cuando esté disponible)
  monadMainnet: {
    chainId: 10143, // Por ahora usamos testnet, cambiar cuando mainnet esté disponible
    rpcUrl: "https://rpc.monad.xyz",
    explorerUrl: "https://monadscan.com",
    contractAddresses: {
      // Estas direcciones se actualizarán cuando se desplieguen en mainnet
      RemittancePool: "0x138ad2d0d48070dffD6C6DaeaEbADc483CbeE29a",
      ComplianceModule: "0x025434d9Cd4c77F7acC24f8DF90F07b425eFA953",
      IncentiveVault: "0x6fF6aD8216dD1454bC977Ebb72C83aD96C034E28",
      RemittanceToken: "0x2e2e47ab692b8A29c16a38bca3A8523fA520853b",
      ExchangeRateOracle: "0xFFdCc99Cc7A9DE930716e3fB4a1b153caa740AfC",
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
    !PRODUCTION_CONFIG.monadMainnet[field as keyof typeof PRODUCTION_CONFIG.monadMainnet]
  );
  
  if (missingFields.length > 0) {
    throw new Error(`Configuración de producción incompleta. Campos faltantes: ${missingFields.join(', ')}`);
  }
  
  return true;
}
