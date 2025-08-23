import { useAccount, useContractRead, useContractWrite, useChainId, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { getContractAddresses } from './contracts';

// ============================================================================
// AZTLANFI CORE ABI - Funciones principales con integración de partners
// ============================================================================
const AZTLANFI_CORE_ABI = [
  // Enviar remesa con integración de partners
  {
    "inputs": [
      { "internalType": "address", "name": "recipient", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "string", "name": "corridor", "type": "string" },
      { "internalType": "string", "name": "offRampMethod", "type": "string" },
      { "internalType": "string", "name": "phoneHash", "type": "string" },
      { "internalType": "string", "name": "partnerIntegration", "type": "string" },
      { "internalType": "bool", "name": "gaslessTransaction", "type": "bool" },
      { "internalType": "string", "name": "socialLoginProvider", "type": "string" },
      { "internalType": "uint256", "name": "savingsGoalId", "type": "uint256" }
    ],
    "name": "sendRemittance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Obtener corredor
  {
    "inputs": [{ "internalType": "string", "name": "corridor", "type": "string" }],
    "name": "getCorridor",
    "outputs": [{
      "components": [
        { "internalType": "string", "name": "from", "type": "string" },
        { "internalType": "string", "name": "to", "type": "string" },
        { "internalType": "uint256", "name": "totalVolume", "type": "uint256" },
        { "internalType": "uint256", "name": "feePercentage", "type": "uint256" },
        { "internalType": "bool", "name": "active", "type": "bool" },
        { "internalType": "address", "name": "liquidityPool", "type": "address" },
        { "internalType": "uint256", "name": "dailyLimit", "type": "uint256" },
        { "internalType": "uint256", "name": "monthlyLimit", "type": "uint256" },
        { "internalType": "uint256", "name": "dailyUsed", "type": "uint256" },
        { "internalType": "uint256", "name": "monthlyUsed", "type": "uint256" },
        { "internalType": "uint256", "name": "lastDailyReset", "type": "uint256" },
        { "internalType": "uint256", "name": "lastMonthlyReset", "type": "uint256" }
      ],
      "internalType": "struct AztlanFiCore.Corridor",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  // Obtener remesa
  {
    "inputs": [{ "internalType": "uint256", "name": "remittanceId", "type": "uint256" }],
    "name": "getRemittance",
    "outputs": [{
      "components": [
        { "internalType": "address", "name": "sender", "type": "address" },
        { "internalType": "address", "name": "recipient", "type": "address" },
        { "internalType": "uint256", "name": "amount", "type": "uint256" },
        { "internalType": "string", "name": "corridor", "type": "string" },
        { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
        { "internalType": "uint256", "name": "fee", "type": "uint256" },
        { "internalType": "bool", "name": "completed", "type": "bool" },
        { "internalType": "string", "name": "offRampMethod", "type": "string" },
        { "internalType": "bytes32", "name": "id", "type": "bytes32" },
        { "internalType": "string", "name": "phoneHash", "type": "string" },
        { "internalType": "string", "name": "partnerIntegration", "type": "string" },
        { "internalType": "bool", "name": "gaslessTransaction", "type": "bool" },
        { "internalType": "string", "name": "socialLoginProvider", "type": "string" },
        { "internalType": "uint256", "name": "savingsGoalId", "type": "uint256" },
        { "internalType": "bool", "name": "analyticsTracked", "type": "bool" }
      ],
      "internalType": "struct AztlanFiCore.Remittance",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  }
];

// ============================================================================
// PARTNER INTEGRATIONS ABI - Funciones de integración con partners
// ============================================================================
const PARTNER_INTEGRATIONS_ABI = [
  // 0x Protocol Integration
  {
    "inputs": [
      { "internalType": "uint256", "name": "remittanceId", "type": "uint256" },
      { "internalType": "bool", "name": "gasless", "type": "bool" },
      { "internalType": "uint256", "name": "gasSaved", "type": "uint256" }
    ],
    "name": "processZeroXTransaction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Reown AppKit Integration
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "string", "name": "provider", "type": "string" }
    ],
    "name": "processReownLogin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Envio Analytics Integration
  {
    "inputs": [
      { "internalType": "bytes32", "name": "eventId", "type": "bytes32" },
      { "internalType": "string", "name": "eventType", "type": "string" },
      { "internalType": "string", "name": "data", "type": "string" }
    ],
    "name": "indexAnalyticsEvent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Para Wallet Integration
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "uint256", "name": "goalId", "type": "uint256" },
      { "internalType": "uint256", "name": "targetAmount", "type": "uint256" }
    ],
    "name": "createParaSavingsGoal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Obtener estadísticas de partners
  {
    "inputs": [],
    "name": "getZeroXStats",
    "outputs": [{
      "components": [
        { "internalType": "uint256", "name": "totalGaslessTransactions", "type": "uint256" },
        { "internalType": "uint256", "name": "totalGasSaved", "type": "uint256" },
        { "internalType": "uint256", "name": "averageRouteOptimization", "type": "uint256" },
        { "internalType": "uint256", "name": "successRate", "type": "uint256" },
        { "internalType": "uint256", "name": "lastUpdate", "type": "uint256" }
      ],
      "internalType": "struct PartnerIntegrations.ZeroXStats",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getReownStats",
    "outputs": [{
      "components": [
        { "internalType": "uint256", "name": "totalSocialLogins", "type": "uint256" },
        { "internalType": "uint256", "name": "telegramUsers", "type": "uint256" },
        { "internalType": "uint256", "name": "farcasterUsers", "type": "uint256" },
        { "internalType": "uint256", "name": "totalUsers", "type": "uint256" },
        { "internalType": "uint256", "name": "lastUpdate", "type": "uint256" }
      ],
      "internalType": "struct PartnerIntegrations.ReownStats",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getEnvioStats",
    "outputs": [{
      "components": [
        { "internalType": "uint256", "name": "indexedEvents", "type": "uint256" },
        { "internalType": "uint256", "name": "realTimeQueries", "type": "uint256" },
        { "internalType": "uint256", "name": "averageQueryTime", "type": "uint256" },
        { "internalType": "uint256", "name": "uptime", "type": "uint256" },
        { "internalType": "uint256", "name": "lastUpdate", "type": "uint256" }
      ],
      "internalType": "struct PartnerIntegrations.EnvioStats",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getParaStats",
    "outputs": [{
      "components": [
        { "internalType": "uint256", "name": "totalLocked", "type": "uint256" },
        { "internalType": "uint256", "name": "averageGoalAmount", "type": "uint256" },
        { "internalType": "uint256", "name": "lastUpdate", "type": "uint256" }
      ],
      "internalType": "struct PartnerIntegrations.ParaStats",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  }
];

// ============================================================================
// REMITTANCE POOL ABI - Funciones principales
// ============================================================================
const REMITTANCE_POOL_ABI = [
  // Crear remesa
  {
    "inputs": [
      { "internalType": "address", "name": "_receiver", "type": "address" },
      { "internalType": "uint256", "name": "_amount", "type": "uint256" },
      { "internalType": "string", "name": "_phoneHash", "type": "string" }
    ],
    "name": "createRemittance",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "payable",
    "type": "function"
  },
  // Completar remesa
  {
    "inputs": [{ "internalType": "bytes32", "name": "_remittanceId", "type": "bytes32" }],
    "name": "completeRemittance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Agregar liquidez
  {
    "inputs": [],
    "name": "addLiquidity",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  // Remover liquidez
  {
    "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }],
    "name": "removeLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Retirar balance
  {
    "inputs": [],
    "name": "withdrawBalance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Calcular fee
  {
    "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }],
    "name": "calculateFee",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  // Calcular recompensas
  {
    "inputs": [{ "internalType": "address", "name": "_provider", "type": "address" }],
    "name": "calculateRewards",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  // Obtener remesa
  {
    "inputs": [{ "internalType": "bytes32", "name": "_id", "type": "bytes32" }],
    "name": "getRemittance",
    "outputs": [{
      "components": [
        { "internalType": "address", "name": "sender", "type": "address" },
        { "internalType": "address", "name": "receiver", "type": "address" },
        { "internalType": "uint256", "name": "amount", "type": "uint256" },
        { "internalType": "uint256", "name": "fee", "type": "uint256" },
        { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
        { "internalType": "bool", "name": "completed", "type": "bool" },
        { "internalType": "string", "name": "phoneHash", "type": "string" },
        { "internalType": "bytes32", "name": "id", "type": "bytes32" }
      ],
      "internalType": "struct RemittancePool.Remittance",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  // Obtener balance del usuario
  {
    "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
    "name": "getBalance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  // Obtener proveedor de liquidez
  {
    "inputs": [{ "internalType": "address", "name": "_provider", "type": "address" }],
    "name": "getLiquidityProvider",
    "outputs": [{
      "components": [
        { "internalType": "uint256", "name": "amount", "type": "uint256" },
        { "internalType": "uint256", "name": "rewards", "type": "uint256" },
        { "internalType": "uint256", "name": "lastUpdate", "type": "uint256" }
      ],
      "internalType": "struct RemittancePool.LiquidityProvider",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  // ============================================================================
  // FUNCIONES DE ADMINISTRACIÓN - RemittancePool
  // ============================================================================
  // Pausar contrato
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Despausar contrato
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Establecer Oracle
  {
    "inputs": [{ "internalType": "address", "name": "_newOracle", "type": "address" }],
    "name": "setOracle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Establecer módulo de compliance
  {
    "inputs": [{ "internalType": "address", "name": "_newComplianceModule", "type": "address" }],
    "name": "setComplianceModule",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Retiro de emergencia
  {
    "inputs": [],
    "name": "emergencyWithdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Obtener estadísticas globales
  {
    "inputs": [],
    "name": "totalVolume",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalTransactions",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalLiquidity",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentExchangeRate",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "oracle",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "complianceModule",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// ============================================================================
// COMPLIANCE MODULE ABI - Sistema de cumplimiento
// ============================================================================
const COMPLIANCE_MODULE_ABI = [
  // Registrar usuario
  {
    "inputs": [
      { "internalType": "address", "name": "_user", "type": "address" },
      { "internalType": "uint256", "name": "_kycLevel", "type": "uint256" }
    ],
    "name": "registerUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Verificar transacción
  {
    "inputs": [
      { "internalType": "address", "name": "_sender", "type": "address" },
      { "internalType": "address", "name": "_receiver", "type": "address" },
      { "internalType": "uint256", "name": "_amount", "type": "uint256" }
    ],
    "name": "checkTransaction",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" },
      { "internalType": "string", "name": "", "type": "string" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Blacklist usuario
  {
    "inputs": [
      { "internalType": "address", "name": "_user", "type": "address" },
      { "internalType": "string", "name": "_reason", "type": "string" }
    ],
    "name": "blacklistUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Remover de blacklist
  {
    "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
    "name": "removeFromBlacklist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Mejorar KYC
  {
    "inputs": [
      { "internalType": "address", "name": "_user", "type": "address" },
      { "internalType": "uint256", "name": "_newLevel", "type": "uint256" }
    ],
    "name": "upgradeKYC",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Obtener usuario
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "users",
    "outputs": [{
      "components": [
        { "internalType": "bool", "name": "isRegistered", "type": "bool" },
        { "internalType": "uint256", "name": "kycLevel", "type": "uint256" },
        { "internalType": "uint256", "name": "dailyLimit", "type": "uint256" },
        { "internalType": "uint256", "name": "monthlyLimit", "type": "uint256" },
        { "internalType": "uint256", "name": "dailyUsed", "type": "uint256" },
        { "internalType": "uint256", "name": "monthlyUsed", "type": "uint256" },
        { "internalType": "uint256", "name": "lastDailyReset", "type": "uint256" },
        { "internalType": "uint256", "name": "lastMonthlyReset", "type": "uint256" },
        { "internalType": "bool", "name": "isBlacklisted", "type": "bool" },
        { "internalType": "string", "name": "kycHash", "type": "string" }
      ],
      "internalType": "struct ComplianceModule.User",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  // ============================================================================
  // FUNCIONES DE ADMINISTRACIÓN - ComplianceModule
  // ============================================================================
  // Pausar contrato
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Despausar contrato
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Establecer oficial de compliance
  {
    "inputs": [{ "internalType": "address", "name": "_newOfficer", "type": "address" }],
    "name": "setComplianceOfficer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Establecer pool de remesas
  {
    "inputs": [{ "internalType": "address", "name": "_newPool", "type": "address" }],
    "name": "setRemittancePool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Establecer límites personalizados
  {
    "inputs": [
      { "internalType": "address", "name": "_user", "type": "address" },
      { "internalType": "uint256", "name": "_dailyLimit", "type": "uint256" },
      { "internalType": "uint256", "name": "_monthlyLimit", "type": "uint256" }
    ],
    "name": "setCustomLimits",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Agregar sanción OFAC
  {
    "inputs": [{ "internalType": "string", "name": "_address", "type": "string" }],
    "name": "addOFACSanction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Remover sanción OFAC
  {
    "inputs": [{ "internalType": "string", "name": "_address", "type": "string" }],
    "name": "removeOFACSanction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Verificar si está en blacklist
  {
    "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
    "name": "isBlacklisted",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  // Obtener transacción
  {
    "inputs": [{ "internalType": "bytes32", "name": "_txId", "type": "bytes32" }],
    "name": "getTransaction",
    "outputs": [{
      "components": [
        { "internalType": "address", "name": "sender", "type": "address" },
        { "internalType": "address", "name": "receiver", "type": "address" },
        { "internalType": "uint256", "name": "amount", "type": "uint256" },
        { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
        { "internalType": "bool", "name": "isSuspicious", "type": "bool" },
        { "internalType": "string", "name": "reason", "type": "string" }
      ],
      "internalType": "struct ComplianceModule.Transaction",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  }
];

// ============================================================================
// INCENTIVE VAULT ABI - Sistema de recompensas
// ============================================================================
const INCENTIVE_VAULT_ABI = [
  // Crear referencia
  {
    "inputs": [
      { "internalType": "address", "name": "_referrer", "type": "address" },
      { "internalType": "address", "name": "_referred", "type": "address" }
    ],
    "name": "createReferral",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Procesar transacción
  {
    "inputs": [
      { "internalType": "address", "name": "_sender", "type": "address" },
      { "internalType": "uint256", "name": "_amount", "type": "uint256" }
    ],
    "name": "processTransaction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Reclamar recompensas
  {
    "inputs": [],
    "name": "claimRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Obtener estadísticas del usuario
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "userStats",
    "outputs": [{
      "components": [
        { "internalType": "uint256", "name": "totalVolume", "type": "uint256" },
        { "internalType": "uint256", "name": "totalTransactions", "type": "uint256" },
        { "internalType": "uint256", "name": "referralCount", "type": "uint256" },
        { "internalType": "uint256", "name": "rewardsEarned", "type": "uint256" },
        { "internalType": "uint256", "name": "achievementCount", "type": "uint256" },
        { "internalType": "uint256", "name": "lastActivity", "type": "uint256" }
      ],
      "internalType": "struct IncentiveVault.UserStats",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  // Obtener recompensas del usuario
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "userRewards",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  // ============================================================================
  // FUNCIONES DE ADMINISTRACIÓN - IncentiveVault
  // ============================================================================
  // Establecer pool de remesas
  {
    "inputs": [{ "internalType": "address", "name": "_newPool", "type": "address" }],
    "name": "setRemittancePool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Establecer token de recompensas
  {
    "inputs": [{ "internalType": "address", "name": "_newToken", "type": "address" }],
    "name": "setRewardToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Actualizar tasa de referencias
  {
    "inputs": [{ "internalType": "uint256", "name": "_newRate", "type": "uint256" }],
    "name": "updateReferralRate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Retiro de emergencia
  {
    "inputs": [],
    "name": "emergencyWithdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Obtener referencia
  {
    "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
    "name": "getReferral",
    "outputs": [{
      "components": [
        { "internalType": "address", "name": "referrer", "type": "address" },
        { "internalType": "address", "name": "referred", "type": "address" },
        { "internalType": "uint256", "name": "totalVolume", "type": "uint256" },
        { "internalType": "uint256", "name": "rewardsEarned", "type": "uint256" },
        { "internalType": "uint256", "name": "lastReward", "type": "uint256" },
        { "internalType": "bool", "name": "isActive", "type": "bool" }
      ],
      "internalType": "struct IncentiveVault.Referral",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  // Obtener logro del usuario
  {
    "inputs": [
      { "internalType": "address", "name": "_user", "type": "address" },
      { "internalType": "string", "name": "_achievementId", "type": "string" }
    ],
    "name": "getUserAchievement",
    "outputs": [{
      "components": [
        { "internalType": "string", "name": "name", "type": "string" },
        { "internalType": "string", "name": "description", "type": "string" },
        { "internalType": "uint256", "name": "requirement", "type": "uint256" },
        { "internalType": "bool", "name": "isNFT", "type": "bool" },
        { "internalType": "string", "name": "metadataURI", "type": "string" },
        { "internalType": "bool", "name": "isClaimed", "type": "bool" }
      ],
      "internalType": "struct IncentiveVault.Achievement",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  // Obtener recompensas pendientes
  {
    "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
    "name": "getPendingRewards",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  // Reclamar logro
  {
    "inputs": [{ "internalType": "string", "name": "_achievementId", "type": "string" }],
    "name": "claimAchievement",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// ============================================================================
// REMITTANCE TOKEN ABI - Token de recompensas
// ============================================================================
const REMITTANCE_TOKEN_ABI = [
  // Balance del usuario
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  // Mintear tokens
  {
    "inputs": [
      { "internalType": "address", "name": "_to", "type": "address" },
      { "internalType": "uint256", "name": "_amount", "type": "uint256" },
      { "internalType": "string", "name": "_reason", "type": "string" }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Mintear en lote
  {
    "inputs": [
      { "internalType": "address[]", "name": "_recipients", "type": "address[]" },
      { "internalType": "uint256[]", "name": "_amounts", "type": "uint256[]" },
      { "internalType": "string", "name": "_reason", "type": "string" }
    ],
    "name": "mintBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Agregar minter
  {
    "inputs": [{ "internalType": "address", "name": "_minter", "type": "address" }],
    "name": "addMinter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Remover minter
  {
    "inputs": [{ "internalType": "address", "name": "_minter", "type": "address" }],
    "name": "removeMinter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Verificar si puede mintear
  {
    "inputs": [{ "internalType": "address", "name": "_address", "type": "address" }],
    "name": "canMint",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  // Total supply
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  // ============================================================================
  // FUNCIONES DE ADMINISTRACIÓN - RemittanceToken
  // ============================================================================
  // Pausar contrato
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Despausar contrato
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// ============================================================================
// EXCHANGE RATE ORACLE ABI - Oracle de tasas
// ============================================================================
const EXCHANGE_RATE_ORACLE_ABI = [
  // Obtener tasa actual
  {
    "inputs": [],
    "name": "getCurrentRate",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  // Actualizar tasa
  {
    "inputs": [
      { "internalType": "uint256", "name": "_newRate", "type": "uint256" },
      { "internalType": "string", "name": "_source", "type": "string" }
    ],
    "name": "updateRate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Actualizar tasas en lote
  {
    "inputs": [
      { "internalType": "uint256[]", "name": "_rates", "type": "uint256[]" },
      { "internalType": "string[]", "name": "_sources", "type": "string[]" }
    ],
    "name": "updateRateBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Obtener historial de tasas
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "rateHistory",
    "outputs": [{
      "components": [
        { "internalType": "uint256", "name": "rate", "type": "uint256" },
        { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
        { "internalType": "string", "name": "source", "type": "string" },
        { "internalType": "bool", "name": "isValid", "type": "bool" }
      ],
      "internalType": "struct ExchangeRateOracle.RateData",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  // ============================================================================
  // FUNCIONES DE ADMINISTRACIÓN - ExchangeRateOracle
  // ============================================================================
  // Pausar contrato
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Despausar contrato
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Establecer actualizador autorizado
  {
    "inputs": [{ "internalType": "address", "name": "_newUpdater", "type": "address" }],
    "name": "setAuthorizedUpdater",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Invalidar tasa
  {
    "inputs": [{ "internalType": "uint256", "name": "_index", "type": "uint256" }],
    "name": "invalidateRate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Verificar si la tasa está obsoleta
  {
    "inputs": [{ "internalType": "uint256", "name": "_maxAge", "type": "uint256" }],
    "name": "isRateStale",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  // Obtener edad de la tasa
  {
    "inputs": [],
    "name": "getRateAge",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  // Obtener tasas recientes
  {
    "inputs": [{ "internalType": "uint256", "name": "_count", "type": "uint256" }],
    "name": "getRecentRates",
    "outputs": [{
      "components": [
        { "internalType": "uint256", "name": "rate", "type": "uint256" },
        { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
        { "internalType": "string", "name": "source", "type": "string" },
        { "internalType": "bool", "name": "isValid", "type": "bool" }
      ],
      "internalType": "struct ExchangeRateOracle.RateData[]",
      "name": "",
      "type": "tuple[]"
    }],
    "stateMutability": "view",
    "type": "function"
  }
];

// ============================================================================
// HOOKS PRINCIPALES
// ============================================================================

export function useAztlanFiCore() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  
  const contractAddresses = getContractAddresses(chainId);
  
  // Send remittance with partner integration
  const { data: sendRemittanceData, writeContract: sendRemittance, isPending: isSendingRemittance } = useContractWrite();
  
  const executeSendRemittance = (params: any) => {
    sendRemittance({
      address: contractAddresses.AztlanFiCore as `0x${string}`,
      abi: AZTLANFI_CORE_ABI,
      functionName: 'sendRemittance',
      ...params
    });
  };
  
  return {
    userBalance: '0', // Simplified for now
    isLoadingBalance: false,
    getCorridorStats: () => ({}),
    sendRemittance: executeSendRemittance,
    isSendingRemittance,
    sendRemittanceData
  };
}

export function usePartnerIntegrations() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  
  const contractAddresses = getContractAddresses(chainId);
  
  // Process 0x transaction
  const { writeContract: processZeroXTransaction, isPending: isProcessingZeroX } = useContractWrite();
  
  const executeProcessZeroX = (params: any) => {
    processZeroXTransaction({
      address: contractAddresses.PartnerIntegrations as `0x${string}`,
      abi: PARTNER_INTEGRATIONS_ABI,
      functionName: 'processZeroXTransaction',
      ...params
    });
  };
  
  // Process Reown login
  const { writeContract: processReownLogin, isPending: isProcessingReown } = useContractWrite();
  
  const executeProcessReown = (params: any) => {
    processReownLogin({
      address: contractAddresses.PartnerIntegrations as `0x${string}`,
      abi: PARTNER_INTEGRATIONS_ABI,
      functionName: 'processReownLogin',
      ...params
    });
  };
  
  // Index analytics event
  const { writeContract: indexAnalyticsEvent, isPending: isIndexingAnalytics } = useContractWrite();
  
  const executeIndexAnalytics = (params: any) => {
    indexAnalyticsEvent({
      address: contractAddresses.PartnerIntegrations as `0x${string}`,
      abi: PARTNER_INTEGRATIONS_ABI,
      functionName: 'indexAnalyticsEvent',
      ...params
    });
  };
  
  // Create Para savings goal
  const { writeContract: createParaSavingsGoal, isPending: isCreatingParaGoal } = useContractWrite();
  
  const executeCreateParaGoal = (params: any) => {
    createParaSavingsGoal({
      address: contractAddresses.PartnerIntegrations as `0x${string}`,
      abi: PARTNER_INTEGRATIONS_ABI,
      functionName: 'createParaSavingsGoal',
      ...params
    });
  };
  
  return {
    zeroXStats: null,
    reownStats: null,
    envioStats: null,
    paraStats: null,
    isLoadingZeroX: false,
    isLoadingReown: false,
    isLoadingEnvio: false,
    isLoadingPara: false,
    processZeroXTransaction: executeProcessZeroX,
    processReownLogin: executeProcessReown,
    indexAnalyticsEvent: executeIndexAnalytics,
    createParaSavingsGoal: executeCreateParaGoal,
    isProcessingZeroX,
    isProcessingReown,
    isIndexingAnalytics,
    isCreatingParaGoal
  };
}

export function useRemittancePool() {
  const { address } = useAccount();
  const chainId = useChainId();
  const contractAddresses = getContractAddresses(chainId || 10143);

  // Obtener tasa de cambio actual
  const { data: exchangeRate, isLoading: isLoadingRate } = useContractRead({
    address: contractAddresses.ExchangeRateOracle as `0x${string}`,
    abi: EXCHANGE_RATE_ORACLE_ABI,
    functionName: 'getCurrentRate',
  });

  // Crear remesa
  const { 
    data: createRemittanceHash, 
    writeContract: createRemittance, 
    isPending: isCreatingRemittance,
    error: createRemittanceError
  } = useContractWrite();

  // Completar remesa
  const { 
    data: completeRemittanceHash, 
    writeContract: completeRemittance, 
    isPending: isCompletingRemittance,
    error: completeRemittanceError
  } = useContractWrite();

  // Agregar liquidez
  const { 
    data: addLiquidityHash, 
    writeContract: addLiquidity, 
    isPending: isAddingLiquidity,
    error: addLiquidityError
  } = useContractWrite();

  // Remover liquidez
  const { 
    data: removeLiquidityHash, 
    writeContract: removeLiquidity, 
    isPending: isRemovingLiquidity,
    error: removeLiquidityError
  } = useContractWrite();

  // Retirar balance
  const { 
    data: withdrawBalanceHash, 
    writeContract: withdrawBalance, 
    isPending: isWithdrawingBalance,
    error: withdrawBalanceError
  } = useContractWrite();

  // Calcular fee
  const { data: calculatedFee, isLoading: isLoadingFee } = useContractRead({
    address: contractAddresses.RemittancePool as `0x${string}`,
    abi: REMITTANCE_POOL_ABI,
    functionName: 'calculateFee',
    args: address ? [parseEther("100")] : undefined, // Ejemplo con 100 USD
  });

  // Obtener balance del usuario
  const { data: userBalance, isLoading: isLoadingBalance } = useContractRead({
    address: contractAddresses.RemittancePool as `0x${string}`,
    abi: REMITTANCE_POOL_ABI,
    functionName: 'getBalance',
    args: address ? [address] : undefined,
  });

  // Obtener proveedor de liquidez
  const { data: liquidityProvider, isLoading: isLoadingLiquidityProvider } = useContractRead({
    address: contractAddresses.RemittancePool as `0x${string}`,
    abi: REMITTANCE_POOL_ABI,
    functionName: 'getLiquidityProvider',
    args: address ? [address] : undefined,
  });

  // Calcular recompensas
  const { data: calculatedRewards, isLoading: isLoadingRewards } = useContractRead({
    address: contractAddresses.RemittancePool as `0x${string}`,
    abi: REMITTANCE_POOL_ABI,
    functionName: 'calculateRewards',
    args: address ? [address] : undefined,
  });

  // Esperar confirmaciones
  const { isLoading: isConfirmingCreate, isSuccess: isConfirmedCreate } = useWaitForTransactionReceipt({
    hash: createRemittanceHash,
  });

  const { isLoading: isConfirmingComplete, isSuccess: isConfirmedComplete } = useWaitForTransactionReceipt({
    hash: completeRemittanceHash,
  });

  const { isLoading: isConfirmingLiquidity, isSuccess: isConfirmedLiquidity } = useWaitForTransactionReceipt({
    hash: addLiquidityHash,
  });

  // ============================================================================
  // FUNCIONES DE ADMINISTRACIÓN - RemittancePool
  // ============================================================================
  
  // Pausar contrato
  const { 
    data: pauseHash, 
    writeContract: pause, 
    isPending: isPausing,
    error: pauseError
  } = useContractWrite();

  // Despausar contrato
  const { 
    data: unpauseHash, 
    writeContract: unpause, 
    isPending: isUnpausing,
    error: unpauseError
  } = useContractWrite();

  // Establecer Oracle
  const { 
    data: setOracleHash, 
    writeContract: setOracle, 
    isPending: isSettingOracle,
    error: setOracleError
  } = useContractWrite();

  // Establecer módulo de compliance
  const { 
    data: setComplianceModuleHash, 
    writeContract: setComplianceModule, 
    isPending: isSettingComplianceModule,
    error: setComplianceModuleError
  } = useContractWrite();

  // Retiro de emergencia
  const { 
    data: emergencyWithdrawHash, 
    writeContract: emergencyWithdraw, 
    isPending: isEmergencyWithdrawing,
    error: emergencyWithdrawError
  } = useContractWrite();

  // ============================================================================
  // FUNCIONES DE CONSULTA AVANZADAS - RemittancePool
  // ============================================================================
  
  // Obtener estadísticas globales
  const { data: totalVolume, isLoading: isLoadingTotalVolume } = useContractRead({
    address: contractAddresses.RemittancePool as `0x${string}`,
    abi: REMITTANCE_POOL_ABI,
    functionName: 'totalVolume',
  });

  const { data: totalTransactions, isLoading: isLoadingTotalTransactions } = useContractRead({
    address: contractAddresses.RemittancePool as `0x${string}`,
    abi: REMITTANCE_POOL_ABI,
    functionName: 'totalTransactions',
  });

  const { data: totalLiquidity, isLoading: isLoadingTotalLiquidity } = useContractRead({
    address: contractAddresses.RemittancePool as `0x${string}`,
    abi: REMITTANCE_POOL_ABI,
    functionName: 'totalLiquidity',
  });

  const { data: currentExchangeRate, isLoading: isLoadingCurrentExchangeRate } = useContractRead({
    address: contractAddresses.RemittancePool as `0x${string}`,
    abi: REMITTANCE_POOL_ABI,
    functionName: 'currentExchangeRate',
  });

  const { data: oracleAddress, isLoading: isLoadingOracleAddress } = useContractRead({
    address: contractAddresses.RemittancePool as `0x${string}`,
    abi: REMITTANCE_POOL_ABI,
    functionName: 'oracle',
  });

  const { data: complianceModuleAddress, isLoading: isLoadingComplianceModuleAddress } = useContractRead({
    address: contractAddresses.RemittancePool as `0x${string}`,
    abi: REMITTANCE_POOL_ABI,
    functionName: 'complianceModule',
  });

  return {
    // Datos
    exchangeRate: exchangeRate ? Number(exchangeRate) / 100 : 17.0,
    isLoadingRate,
    calculatedFee: calculatedFee ? formatEther(calculatedFee as bigint) : "0",
    isLoadingFee,
    userBalance: userBalance ? formatEther(userBalance as bigint) : "0",
    isLoadingBalance,
    liquidityProvider,
    isLoadingLiquidityProvider,
    calculatedRewards: calculatedRewards ? formatEther(calculatedRewards as bigint) : "0",
    isLoadingRewards,
    
    // Funciones
    createRemittance: (receiver: string, amount: string, phoneHash: string) => {
      if (!createRemittance) return;
      try {
      createRemittance({
        address: contractAddresses.RemittancePool as `0x${string}`,
        abi: REMITTANCE_POOL_ABI,
        functionName: 'createRemittance',
          args: [receiver as `0x${string}`, parseEther(amount), phoneHash],
        value: parseEther(amount),
      });
      } catch (error) {
        console.error('Error creating remittance:', error);
        throw error;
      }
    },
    
    completeRemittance: (remittanceId: string) => {
      if (!completeRemittance) return;
      try {
        completeRemittance({
        address: contractAddresses.RemittancePool as `0x${string}`,
        abi: REMITTANCE_POOL_ABI,
          functionName: 'completeRemittance',
        args: [remittanceId as `0x${string}`],
      });
      } catch (error) {
        console.error('Error completing remittance:', error);
        throw error;
      }
    },
    
    addLiquidity: (amount: string) => {
      if (!addLiquidity) return;
      try {
        addLiquidity({
          address: contractAddresses.RemittancePool as `0x${string}`,
          abi: REMITTANCE_POOL_ABI,
          functionName: 'addLiquidity',
          value: parseEther(amount),
        });
      } catch (error) {
        console.error('Error adding liquidity:', error);
        throw error;
      }
    },
    
    removeLiquidity: (amount: string) => {
      if (!removeLiquidity) return;
      try {
        removeLiquidity({
          address: contractAddresses.RemittancePool as `0x${string}`,
          abi: REMITTANCE_POOL_ABI,
          functionName: 'removeLiquidity',
          args: [parseEther(amount)],
        });
      } catch (error) {
        console.error('Error removing liquidity:', error);
        throw error;
      }
    },
    
    withdrawBalance: () => {
      if (!withdrawBalance) return;
      try {
        withdrawBalance({
          address: contractAddresses.RemittancePool as `0x${string}`,
          abi: REMITTANCE_POOL_ABI,
          functionName: 'withdrawBalance',
        });
      } catch (error) {
        console.error('Error withdrawing balance:', error);
        throw error;
      }
    },

    // ============================================================================
    // FUNCIONES DE ADMINISTRACIÓN - RemittancePool
    // ============================================================================
    
    pause: () => {
      if (!pause) return;
      try {
        pause({
          address: contractAddresses.RemittancePool as `0x${string}`,
          abi: REMITTANCE_POOL_ABI,
          functionName: 'pause',
        });
      } catch (error) {
        console.error('Error pausing contract:', error);
        throw error;
      }
    },

    unpause: () => {
      if (!unpause) return;
      try {
        unpause({
          address: contractAddresses.RemittancePool as `0x${string}`,
          abi: REMITTANCE_POOL_ABI,
          functionName: 'unpause',
        });
      } catch (error) {
        console.error('Error unpausing contract:', error);
        throw error;
      }
    },

    setOracle: (newOracle: string) => {
      if (!setOracle) return;
      try {
        setOracle({
          address: contractAddresses.RemittancePool as `0x${string}`,
          abi: REMITTANCE_POOL_ABI,
          functionName: 'setOracle',
          args: [newOracle as `0x${string}`],
        });
      } catch (error) {
        console.error('Error setting oracle:', error);
        throw error;
      }
    },

    setComplianceModule: (newComplianceModule: string) => {
      if (!setComplianceModule) return;
      try {
        setComplianceModule({
          address: contractAddresses.RemittancePool as `0x${string}`,
          abi: REMITTANCE_POOL_ABI,
          functionName: 'setComplianceModule',
          args: [newComplianceModule as `0x${string}`],
        });
      } catch (error) {
        console.error('Error setting compliance module:', error);
        throw error;
      }
    },

    emergencyWithdraw: () => {
      if (!emergencyWithdraw) return;
      try {
        emergencyWithdraw({
          address: contractAddresses.RemittancePool as `0x${string}`,
          abi: REMITTANCE_POOL_ABI,
          functionName: 'emergencyWithdraw',
        });
      } catch (error) {
        console.error('Error emergency withdrawing:', error);
        throw error;
      }
    },
    
    // Estados de carga
    isCreatingRemittance,
    isCompletingRemittance,
    isAddingLiquidity,
    isRemovingLiquidity,
    isWithdrawingBalance,
    isConfirmingCreate,
    isConfirmedCreate,
    isConfirmingComplete,
    isConfirmedComplete,
    isConfirmingLiquidity,
    isConfirmedLiquidity,
    
    // ============================================================================
    // DATOS DE CONSULTA AVANZADOS - RemittancePool
    // ============================================================================
    totalVolume: totalVolume ? formatEther(totalVolume as bigint) : "0",
    isLoadingTotalVolume,
    totalTransactions: totalTransactions ? Number(totalTransactions).toString() : "0",
    isLoadingTotalTransactions,
    totalLiquidity: totalLiquidity ? formatEther(totalLiquidity as bigint) : "0",
    isLoadingTotalLiquidity,
    currentExchangeRate: currentExchangeRate ? Number(currentExchangeRate) / 100 : 17.0,
    isLoadingCurrentExchangeRate,
    oracleAddress: oracleAddress as string || "",
    isLoadingOracleAddress,
    complianceModuleAddress: complianceModuleAddress as string || "",
    isLoadingComplianceModuleAddress,

    // Estados de carga adicionales
    isPausing,
    isUnpausing,
    isSettingOracle,
    isSettingComplianceModule,
    isEmergencyWithdrawing,

    // Errores adicionales
    createRemittanceError,
    completeRemittanceError,
    addLiquidityError,
    removeLiquidityError,
    withdrawBalanceError,
    pauseError,
    unpauseError,
    setOracleError,
    setComplianceModuleError,
    emergencyWithdrawError,
  };
}

export function useComplianceModule() {
  const { address } = useAccount();
  const chainId = useChainId();
  const contractAddresses = getContractAddresses(chainId || 10143);

  // Registrar usuario
  const { 
    data: registerUserHash, 
    writeContract: registerUser, 
    isPending: isRegisteringUser,
    error: registerUserError
  } = useContractWrite();

  // Verificar transacción
  const { 
    data: checkTransactionHash, 
    writeContract: checkTransaction, 
    isPending: isCheckingTransaction,
    error: checkTransactionError
  } = useContractWrite();

  // Blacklist usuario
  const { 
    data: blacklistUserHash, 
    writeContract: blacklistUser, 
    isPending: isBlacklistingUser,
    error: blacklistUserError
  } = useContractWrite();

  // Remover de blacklist
  const { 
    data: removeFromBlacklistHash, 
    writeContract: removeFromBlacklist, 
    isPending: isRemovingFromBlacklist,
    error: removeFromBlacklistError
  } = useContractWrite();

  // Mejorar KYC
  const { 
    data: upgradeKYCHash, 
    writeContract: upgradeKYC, 
    isPending: isUpgradingKYC,
    error: upgradeKYCError
  } = useContractWrite();

  // Obtener datos del usuario
  const { data: userData, isLoading: isLoadingUserData } = useContractRead({
    address: contractAddresses.ComplianceModule as `0x${string}`,
    abi: COMPLIANCE_MODULE_ABI,
    functionName: 'users',
    args: address ? [address] : undefined,
  });

  return {
    // Datos
    userData,
    isLoadingUserData,
    
    // Funciones
    registerUser: (user: string, kycLevel: number) => {
      if (!registerUser) return;
      try {
        registerUser({
          address: contractAddresses.ComplianceModule as `0x${string}`,
          abi: COMPLIANCE_MODULE_ABI,
          functionName: 'registerUser',
          args: [user as `0x${string}`, BigInt(kycLevel)],
        });
      } catch (error) {
        console.error('Error registering user:', error);
        throw error;
      }
    },
    
    checkTransaction: (sender: string, receiver: string, amount: string) => {
      if (!checkTransaction) return;
      try {
        checkTransaction({
          address: contractAddresses.ComplianceModule as `0x${string}`,
          abi: COMPLIANCE_MODULE_ABI,
          functionName: 'checkTransaction',
          args: [sender as `0x${string}`, receiver as `0x${string}`, parseEther(amount)],
        });
      } catch (error) {
        console.error('Error checking transaction:', error);
        throw error;
      }
    },
    
    blacklistUser: (user: string, reason: string) => {
      if (!blacklistUser) return;
      try {
        blacklistUser({
          address: contractAddresses.ComplianceModule as `0x${string}`,
          abi: COMPLIANCE_MODULE_ABI,
          functionName: 'blacklistUser',
          args: [user as `0x${string}`, reason],
        });
      } catch (error) {
        console.error('Error blacklisting user:', error);
        throw error;
      }
    },
    
    removeFromBlacklist: (user: string) => {
      if (!removeFromBlacklist) return;
      try {
        removeFromBlacklist({
          address: contractAddresses.ComplianceModule as `0x${string}`,
          abi: COMPLIANCE_MODULE_ABI,
          functionName: 'removeFromBlacklist',
          args: [user as `0x${string}`],
        });
      } catch (error) {
        console.error('Error removing user from blacklist:', error);
        throw error;
      }
    },
    
    upgradeKYC: (user: string, newLevel: number) => {
      if (!upgradeKYC) return;
      try {
        upgradeKYC({
          address: contractAddresses.ComplianceModule as `0x${string}`,
          abi: COMPLIANCE_MODULE_ABI,
          functionName: 'upgradeKYC',
          args: [user as `0x${string}`, BigInt(newLevel)],
        });
      } catch (error) {
        console.error('Error upgrading KYC:', error);
        throw error;
      }
    },
    
    // Estados de carga
    isRegisteringUser,
    isCheckingTransaction,
    isBlacklistingUser,
    isRemovingFromBlacklist,
    isUpgradingKYC,
    
    // Errores
    registerUserError,
    checkTransactionError,
    blacklistUserError,
    removeFromBlacklistError,
    upgradeKYCError,
  };
}

export function useIncentiveVault() {
  const { address } = useAccount();
  const chainId = useChainId();
  const contractAddresses = getContractAddresses(chainId || 10143);

  // Crear referencia
  const { 
    data: createReferralHash, 
    writeContract: createReferral, 
    isPending: isCreatingReferral,
    error: createReferralError
  } = useContractWrite();

  // Procesar transacción
  const { 
    data: processTransactionHash, 
    writeContract: processTransaction, 
    isPending: isProcessingTransaction,
    error: processTransactionError
  } = useContractWrite();

  // Reclamar recompensas
  const { 
    data: claimRewardsHash, 
    writeContract: claimRewards, 
    isPending: isClaimingRewards,
    error: claimRewardsError
  } = useContractWrite();

  // Obtener estadísticas del usuario
  const { data: userStats, isLoading: isLoadingUserStats } = useContractRead({
    address: contractAddresses.IncentiveVault as `0x${string}`,
    abi: INCENTIVE_VAULT_ABI,
    functionName: 'userStats',
    args: address ? [address] : undefined,
  });

  // Obtener recompensas del usuario
  const { data: userRewards, isLoading: isLoadingUserRewards } = useContractRead({
    address: contractAddresses.IncentiveVault as `0x${string}`,
    abi: INCENTIVE_VAULT_ABI,
    functionName: 'userRewards',
    args: address ? [address] : undefined,
  });

  return {
    // Datos
    userStats,
    isLoadingUserStats,
    userRewards: userRewards ? formatEther(userRewards as bigint) : "0",
    isLoadingUserRewards,
    
    // Funciones
    createReferral: (referrer: string, referred: string) => {
      if (!createReferral) return;
      try {
        createReferral({
          address: contractAddresses.IncentiveVault as `0x${string}`,
          abi: INCENTIVE_VAULT_ABI,
          functionName: 'createReferral',
          args: [referrer as `0x${string}`, referred as `0x${string}`],
        });
      } catch (error) {
        console.error('Error creating referral:', error);
        throw error;
      }
    },
    
    processTransaction: (sender: string, amount: string) => {
      if (!processTransaction) return;
      try {
        processTransaction({
          address: contractAddresses.IncentiveVault as `0x${string}`,
          abi: INCENTIVE_VAULT_ABI,
          functionName: 'processTransaction',
          args: [sender as `0x${string}`, parseEther(amount)],
        });
      } catch (error) {
        console.error('Error processing transaction:', error);
        throw error;
      }
    },
    
    claimRewards: () => {
      if (!claimRewards) return;
      try {
        claimRewards({
          address: contractAddresses.IncentiveVault as `0x${string}`,
          abi: INCENTIVE_VAULT_ABI,
          functionName: 'claimRewards',
        });
      } catch (error) {
        console.error('Error claiming rewards:', error);
        throw error;
      }
    },
    
    // Estados de carga
    isCreatingReferral,
    isProcessingTransaction,
    isClaimingRewards,
    
    // Errores
    createReferralError,
    processTransactionError,
    claimRewardsError,
  };
}

export function useRemittanceToken() {
  const { address } = useAccount();
  const chainId = useChainId();
  const contractAddresses = getContractAddresses(chainId || 10143);

  // Mintear tokens
  const { 
    data: mintHash, 
    writeContract: mint, 
    isPending: isMinting,
    error: mintError
  } = useContractWrite();

  // Mintear en lote
  const { 
    data: mintBatchHash, 
    writeContract: mintBatch, 
    isPending: isMintingBatch,
    error: mintBatchError
  } = useContractWrite();

  // Agregar minter
  const { 
    data: addMinterHash, 
    writeContract: addMinter, 
    isPending: isAddingMinter,
    error: addMinterError
  } = useContractWrite();

  // Obtener balance del usuario
  const { data: tokenBalance, isLoading: isLoadingTokenBalance } = useContractRead({
    address: contractAddresses.RemittanceToken as `0x${string}`,
    abi: REMITTANCE_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Verificar si puede mintear
  const { data: canMint, isLoading: isLoadingCanMint } = useContractRead({
    address: contractAddresses.RemittanceToken as `0x${string}`,
    abi: REMITTANCE_TOKEN_ABI,
    functionName: 'canMint',
    args: address ? [address] : undefined,
  });

  // Total supply
  const { data: totalSupply, isLoading: isLoadingTotalSupply } = useContractRead({
    address: contractAddresses.RemittanceToken as `0x${string}`,
    abi: REMITTANCE_TOKEN_ABI,
    functionName: 'totalSupply',
  });

  return {
    // Datos
    tokenBalance: tokenBalance ? formatEther(tokenBalance as bigint) : "0",
    isLoadingTokenBalance,
    canMint: canMint || false,
    isLoadingCanMint,
    totalSupply: totalSupply ? formatEther(totalSupply as bigint) : "0",
    isLoadingTotalSupply,
    
    // Funciones
    mint: (to: string, amount: string, reason: string) => {
      if (!mint) return;
      try {
        mint({
          address: contractAddresses.RemittanceToken as `0x${string}`,
          abi: REMITTANCE_TOKEN_ABI,
          functionName: 'mint',
          args: [to as `0x${string}`, parseEther(amount), reason],
        });
      } catch (error) {
        console.error('Error minting tokens:', error);
        throw error;
      }
    },
    
    mintBatch: (recipients: string[], amounts: string[], reason: string) => {
      if (!mintBatch) return;
      try {
        const parsedAmounts = amounts.map(amount => parseEther(amount));
        const parsedRecipients = recipients as `0x${string}`[];
        mintBatch({
          address: contractAddresses.RemittanceToken as `0x${string}`,
          abi: REMITTANCE_TOKEN_ABI,
          functionName: 'mintBatch',
          args: [parsedRecipients, parsedAmounts, reason],
        });
      } catch (error) {
        console.error('Error minting batch tokens:', error);
        throw error;
      }
    },
    
    addMinter: (minter: string) => {
      if (!addMinter) return;
      try {
        addMinter({
          address: contractAddresses.RemittanceToken as `0x${string}`,
          abi: REMITTANCE_TOKEN_ABI,
          functionName: 'addMinter',
          args: [minter as `0x${string}`],
        });
      } catch (error) {
        console.error('Error adding minter:', error);
        throw error;
      }
    },
    
    // Estados de carga
    isMinting,
    isMintingBatch,
    isAddingMinter,
    
    // Errores
    mintError,
    mintBatchError,
    addMinterError,
  };
}

export function useExchangeRateOracle() {
  const chainId = useChainId();
  const contractAddresses = getContractAddresses(chainId || 10143);

  // Actualizar tasa
  const { 
    data: updateRateHash, 
    writeContract: updateRate, 
    isPending: isUpdatingRate,
    error: updateRateError
  } = useContractWrite();

  // Actualizar tasas en lote
  const { 
    data: updateRateBatchHash, 
    writeContract: updateRateBatch, 
    isPending: isUpdatingRateBatch,
    error: updateRateBatchError
  } = useContractWrite();

  // Obtener tasa actual
  const { data: currentRate, isLoading: isLoadingCurrentRate } = useContractRead({
    address: contractAddresses.ExchangeRateOracle as `0x${string}`,
    abi: EXCHANGE_RATE_ORACLE_ABI,
    functionName: 'getCurrentRate',
  });

  return {
    // Datos
    currentRate: currentRate ? Number(currentRate) / 100 : 17.0,
    isLoadingCurrentRate,
    
    // Funciones
    updateRate: (newRate: number, source: string) => {
      if (!updateRate) return;
      try {
        updateRate({
          address: contractAddresses.ExchangeRateOracle as `0x${string}`,
          abi: EXCHANGE_RATE_ORACLE_ABI,
          functionName: 'updateRate',
          args: [BigInt(Math.floor(newRate * 100)), source],
        });
      } catch (error) {
        console.error('Error updating rate:', error);
        throw error;
      }
    },
    
    updateRateBatch: (rates: number[], sources: string[]) => {
      if (!updateRateBatch) return;
      try {
        const parsedRates = rates.map(rate => BigInt(Math.floor(rate * 100)));
        updateRateBatch({
          address: contractAddresses.ExchangeRateOracle as `0x${string}`,
          abi: EXCHANGE_RATE_ORACLE_ABI,
          functionName: 'updateRateBatch',
          args: [parsedRates, sources],
        });
      } catch (error) {
        console.error('Error updating rate batch:', error);
        throw error;
      }
    },
    
    // Estados de carga
    isUpdatingRate,
    isUpdatingRateBatch,
    
    // Errores
    updateRateError,
    updateRateBatchError,
  };
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

export function useAddressValidation() {
  const validateAddress = (address: string): boolean => {
    if (!address) return false;
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  return { validateAddress };
}

export function useAmountFormatting() {
  const formatAmount = (amount: string): string => {
    const num = parseFloat(amount);
    if (isNaN(num)) return "0";
    return num.toFixed(2);
  };

  const parseAmount = (amount: string): number => {
    const num = parseFloat(amount);
    return isNaN(num) ? 0 : num;
  };

  return { formatAmount, parseAmount };
}

// ============================================================================
// FUNCIONES DE CONSULTA AVANZADAS - EXPORTADAS DESDE advancedQueries.ts
// ============================================================================

// Los hooks de consultas avanzadas se exportan al final del archivo

// ============================================================================
// HOOKS DE VERIFICACIÓN DE ROLES
// ============================================================================

export function useRoleVerification() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const contractAddresses = getContractAddresses(chainId)

  // Verificar si el usuario es owner del RemittancePool
  const { data: isRemittancePoolOwner, isLoading: isLoadingRemittancePoolOwner } = useContractRead({
    address: contractAddresses.RemittancePool as `0x${string}`,
    abi: [
      {
        "inputs": [],
        "name": "owner",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'owner',
    query: {
      enabled: isConnected && !!address,
    },
  })

  // Verificar si el usuario es owner del ComplianceModule
  const { data: isComplianceModuleOwner, isLoading: isLoadingComplianceModuleOwner } = useContractRead({
    address: contractAddresses.ComplianceModule as `0x${string}`,
    abi: [
      {
        "inputs": [],
        "name": "owner",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'owner',
    query: {
      enabled: isConnected && !!address,
    },
  })

  // Verificar si el usuario es compliance officer
  const { data: complianceOfficer, isLoading: isLoadingComplianceOfficer } = useContractRead({
    address: contractAddresses.ComplianceModule as `0x${string}`,
    abi: [
      {
        "inputs": [],
        "name": "complianceOfficer",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'complianceOfficer',
    query: {
      enabled: isConnected && !!address,
    },
  })

  // Verificar si el usuario es owner del IncentiveVault
  const { data: isIncentiveVaultOwner, isLoading: isLoadingIncentiveVaultOwner } = useContractRead({
    address: contractAddresses.IncentiveVault as `0x${string}`,
    abi: [
      {
        "inputs": [],
        "name": "owner",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'owner',
    query: {
      enabled: isConnected && !!address,
    },
  })

  // Verificar si el usuario es owner del RemittanceToken
  const { data: isRemittanceTokenOwner, isLoading: isLoadingRemittanceTokenOwner } = useContractRead({
    address: contractAddresses.RemittanceToken as `0x${string}`,
    abi: [
      {
        "inputs": [],
        "name": "owner",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'owner',
    query: {
      enabled: isConnected && !!address,
    },
  })

  // Verificar si el usuario es owner del ExchangeRateOracle
  const { data: isExchangeRateOracleOwner, isLoading: isLoadingExchangeRateOracleOwner } = useContractRead({
    address: contractAddresses.ExchangeRateOracle as `0x${string}`,
    abi: [
      {
        "inputs": [],
        "name": "owner",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'owner',
    query: {
      enabled: isConnected && !!address,
    },
  })

  // Verificar si el usuario es authorized updater del oracle
  const { data: authorizedUpdater, isLoading: isLoadingAuthorizedUpdater } = useContractRead({
    address: contractAddresses.ExchangeRateOracle as `0x${string}`,
    abi: [
      {
        "inputs": [],
        "name": "authorizedUpdater",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'authorizedUpdater',
    query: {
      enabled: isConnected && !!address,
    },
  })

  // Estados de carga combinados
  const isLoadingRoles = isLoadingRemittancePoolOwner || 
                        isLoadingComplianceModuleOwner || 
                        isLoadingComplianceOfficer ||
                        isLoadingIncentiveVaultOwner ||
                        isLoadingRemittanceTokenOwner ||
                        isLoadingExchangeRateOracleOwner ||
                        isLoadingAuthorizedUpdater

  // Verificaciones de roles
  const isOwner = {
    remittancePool: isRemittancePoolOwner === address,
    complianceModule: isComplianceModuleOwner === address,
    incentiveVault: isIncentiveVaultOwner === address,
    remittanceToken: isRemittanceTokenOwner === address,
    exchangeRateOracle: isExchangeRateOracleOwner === address,
  }

  const isComplianceOfficer = complianceOfficer === address
  const isAuthorizedUpdater = authorizedUpdater === address

  // Verificar si tiene algún rol administrativo
  const hasAnyAdminRole = Object.values(isOwner).some(Boolean) || isComplianceOfficer || isAuthorizedUpdater

  // Verificar permisos específicos por función
  const permissions = {
    // RemittancePool functions
    canPauseRemittancePool: isOwner.remittancePool,
    canUnpauseRemittancePool: isOwner.remittancePool,
    canSetOracle: isOwner.remittancePool,
    canSetComplianceModule: isOwner.remittancePool,
    canEmergencyWithdraw: isOwner.remittancePool,

    // ComplianceModule functions
    canPauseCompliance: isOwner.complianceModule,
    canUnpauseCompliance: isOwner.complianceModule,
    canSetComplianceOfficer: isOwner.complianceModule,
    canSetRemittancePoolFromCompliance: isOwner.complianceModule,
    canSetCustomLimits: isComplianceOfficer,
    canAddOFACSanction: isComplianceOfficer,
    canRemoveOFACSanction: isComplianceOfficer,

    // IncentiveVault functions
    canSetRemittancePoolFromIncentive: isOwner.incentiveVault,
    canSetRewardToken: isOwner.incentiveVault,
    canUpdateReferralRate: isOwner.incentiveVault,
    canEmergencyWithdrawIncentive: isOwner.incentiveVault,

    // RemittanceToken functions
    canPauseToken: isOwner.remittanceToken,
    canUnpauseToken: isOwner.remittanceToken,
    canRemoveMinter: isOwner.remittanceToken,

    // ExchangeRateOracle functions
    canPauseOracle: isOwner.exchangeRateOracle,
    canUnpauseOracle: isOwner.exchangeRateOracle,
    canSetAuthorizedUpdater: isOwner.exchangeRateOracle,
    canInvalidateRate: isOwner.exchangeRateOracle,
    canUpdateRate: isAuthorizedUpdater,
  }

  return {
    // Estados de carga
    isLoadingRoles,
    
    // Verificaciones de roles
    isOwner,
    isComplianceOfficer,
    isAuthorizedUpdater,
    hasAnyAdminRole,
    
    // Permisos específicos
    permissions,
    
    // Datos raw para debugging
    roleData: {
      remittancePoolOwner: isRemittancePoolOwner,
      complianceModuleOwner: isComplianceModuleOwner,
      complianceOfficer,
      incentiveVaultOwner: isIncentiveVaultOwner,
      remittanceTokenOwner: isRemittanceTokenOwner,
      exchangeRateOracleOwner: isExchangeRateOracleOwner,
      authorizedUpdater,
    }
  }
}

// ============================================================================
// RE-EXPORTS DE HOOKS AVANZADOS
// ============================================================================

export {
  useAdvancedQueries,
  useQueryUtils,
  useDashboardQueries,
  useRemittancePoolQueries,
  useComplianceModuleQueries,
  useIncentiveVaultQueries,
  useExchangeRateOracleQueries,
} from './advancedQueries';

// ============================================================================
// RE-EXPORTS DE OPERACIONES BATCH
// ============================================================================

export {
  useBatchOperations,
  useBatchOperationUtils,
  useBatchOperationUI,
  useRemittanceTokenBatchOperations,
  useExchangeRateOracleBatchOperations,
} from './batchOperations';
