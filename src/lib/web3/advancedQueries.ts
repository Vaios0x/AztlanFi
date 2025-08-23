import { useAccount, useContractRead, useChainId } from 'wagmi';
import { formatEther } from 'viem';
import { getContractAddresses } from './contracts';

// ============================================================================
// TIPOS PARA LAS FUNCIONES DE CONSULTA AVANZADAS
// ============================================================================

export interface Remittance {
  sender: string;
  receiver: string;
  amount: bigint;
  fee: bigint;
  timestamp: bigint;
  completed: boolean;
  phoneHash: string;
  id: string;
}

export interface Transaction {
  sender: string;
  receiver: string;
  amount: bigint;
  timestamp: bigint;
  isSuspicious: boolean;
  reason: string;
}

export interface Achievement {
  name: string;
  description: string;
  requirement: bigint;
  isNFT: boolean;
  metadataURI: string;
  isClaimed: boolean;
}

export interface RateData {
  rate: bigint;
  timestamp: bigint;
  source: string;
  isValid: boolean;
}

// ============================================================================
// REMITTANCE POOL - FUNCIONES DE CONSULTA AVANZADAS
// ============================================================================

export function useRemittancePoolQueries() {
  const { address } = useAccount();
  const chainId = useChainId();
  const contractAddresses = getContractAddresses(chainId || 10143);

  // Función para obtener una remesa específica
  const useGetRemittance = (remittanceId: string) => {
    return useContractRead({
      address: contractAddresses.RemittancePool as `0x${string}`,
      abi: [
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
        }
      ],
      functionName: 'getRemittance',
      args: [remittanceId as `0x${string}`],
      query: {
        enabled: !!remittanceId && remittanceId.length === 66, // 0x + 64 hex chars
      },
    });
  };

  // Función para obtener el volumen total
  const { data: totalVolume, isLoading: isLoadingTotalVolume, error: totalVolumeError } = useContractRead({
    address: contractAddresses.RemittancePool as `0x${string}`,
    abi: [
      {
        "inputs": [],
        "name": "totalVolume",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'totalVolume',
  });

  // Función para obtener el total de transacciones
  const { data: totalTransactions, isLoading: isLoadingTotalTransactions, error: totalTransactionsError } = useContractRead({
    address: contractAddresses.RemittancePool as `0x${string}`,
    abi: [
      {
        "inputs": [],
        "name": "totalTransactions",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'totalTransactions',
  });

  return {
    // Funciones
    useGetRemittance,
    
    // Datos formateados
    totalVolume: totalVolume ? formatEther(totalVolume as bigint) : "0",
    totalTransactions: totalTransactions ? Number(totalTransactions).toString() : "0",
    
    // Estados de carga
    isLoadingTotalVolume,
    isLoadingTotalTransactions,
    
    // Errores
    totalVolumeError,
    totalTransactionsError,
  };
}

// ============================================================================
// COMPLIANCE MODULE - FUNCIONES DE CONSULTA AVANZADAS
// ============================================================================

export function useComplianceModuleQueries() {
  const { address } = useAccount();
  const chainId = useChainId();
  const contractAddresses = getContractAddresses(chainId || 10143);

  // Función para verificar si un usuario está en blacklist
  const useIsBlacklisted = (userAddress: string) => {
    return useContractRead({
      address: contractAddresses.ComplianceModule as `0x${string}`,
      abi: [
        {
          "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
          "name": "isBlacklisted",
          "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
          "stateMutability": "view",
          "type": "function"
        }
      ],
      functionName: 'isBlacklisted',
      args: [userAddress as `0x${string}`],
      query: {
        enabled: !!userAddress && userAddress.length === 42, // 0x + 40 hex chars
      },
    });
  };

  // Función para obtener una transacción específica
  const useGetTransaction = (txId: string) => {
    return useContractRead({
      address: contractAddresses.ComplianceModule as `0x${string}`,
      abi: [
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
      ],
      functionName: 'getTransaction',
      args: [txId as `0x${string}`],
      query: {
        enabled: !!txId && txId.length === 66, // 0x + 64 hex chars
      },
    });
  };

  // Verificar si el usuario actual está en blacklist
  const { data: isCurrentUserBlacklisted, isLoading: isLoadingCurrentUserBlacklist } = useIsBlacklisted(address || "");

  return {
    // Funciones
    useIsBlacklisted,
    useGetTransaction,
    
    // Datos del usuario actual
    isCurrentUserBlacklisted: isCurrentUserBlacklisted || false,
    isLoadingCurrentUserBlacklist,
  };
}

// ============================================================================
// INCENTIVE VAULT - FUNCIONES DE CONSULTA AVANZADAS
// ============================================================================

export function useIncentiveVaultQueries() {
  const { address } = useAccount();
  const chainId = useChainId();
  const contractAddresses = getContractAddresses(chainId || 10143);

  // Función para obtener un logro específico del usuario
  const useGetUserAchievement = (userAddress: string, achievementId: string) => {
    return useContractRead({
      address: contractAddresses.IncentiveVault as `0x${string}`,
      abi: [
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
        }
      ],
      functionName: 'getUserAchievement',
      args: [userAddress as `0x${string}`, achievementId],
      query: {
        enabled: !!userAddress && !!achievementId,
      },
    });
  };

  // Función para obtener recompensas pendientes del usuario
  const useGetPendingRewards = (userAddress: string) => {
    return useContractRead({
      address: contractAddresses.IncentiveVault as `0x${string}`,
      abi: [
        {
          "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
          "name": "getPendingRewards",
          "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
          "stateMutability": "view",
          "type": "function"
        }
      ],
      functionName: 'getPendingRewards',
      args: [userAddress as `0x${string}`],
      query: {
        enabled: !!userAddress,
      },
    });
  };

  // Obtener recompensas pendientes del usuario actual
  const { data: currentUserPendingRewards, isLoading: isLoadingCurrentUserPendingRewards } = useGetPendingRewards(address || "");

  // Obtener logros específicos del usuario actual
  const useGetCurrentUserAchievement = (achievementId: string) => {
    return useGetUserAchievement(address || "", achievementId);
  };

  return {
    // Funciones
    useGetUserAchievement,
    useGetPendingRewards,
    useGetCurrentUserAchievement,
    
    // Datos del usuario actual
    currentUserPendingRewards: currentUserPendingRewards ? formatEther(currentUserPendingRewards as bigint) : "0",
    isLoadingCurrentUserPendingRewards,
  };
}

// ============================================================================
// EXCHANGE RATE ORACLE - FUNCIONES DE CONSULTA AVANZADAS
// ============================================================================

export function useExchangeRateOracleQueries() {
  const chainId = useChainId();
  const contractAddresses = getContractAddresses(chainId || 10143);

  // Función para obtener un historial de tasa específico
  const useGetRateHistory = (index: number) => {
    return useContractRead({
      address: contractAddresses.ExchangeRateOracle as `0x${string}`,
      abi: [
        {
          "inputs": [{ "internalType": "uint256", "name": "_index", "type": "uint256" }],
          "name": "getRateHistory",
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
        }
      ],
      functionName: 'getRateHistory',
      args: [BigInt(index)],
      query: {
        enabled: index >= 0,
      },
    });
  };

  // Función para obtener tasas recientes
  const useGetRecentRates = (count: number) => {
    return useContractRead({
      address: contractAddresses.ExchangeRateOracle as `0x${string}`,
      abi: [
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
      ],
      functionName: 'getRecentRates',
      args: [BigInt(count)],
      query: {
        enabled: count > 0 && count <= 100, // Límite razonable
      },
    });
  };

  // Función para verificar si la tasa está obsoleta
  const useIsRateStale = (maxAge: number) => {
    return useContractRead({
      address: contractAddresses.ExchangeRateOracle as `0x${string}`,
      abi: [
        {
          "inputs": [{ "internalType": "uint256", "name": "_maxAge", "type": "uint256" }],
          "name": "isRateStale",
          "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
          "stateMutability": "view",
          "type": "function"
        }
      ],
      functionName: 'isRateStale',
      args: [BigInt(maxAge)],
      query: {
        enabled: maxAge > 0,
      },
    });
  };

  // Función para obtener la edad de la tasa
  const { data: rateAge, isLoading: isLoadingRateAge, error: rateAgeError } = useContractRead({
    address: contractAddresses.ExchangeRateOracle as `0x${string}`,
    abi: [
      {
        "inputs": [],
        "name": "getRateAge",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'getRateAge',
  });

  // Verificar si la tasa está obsoleta (más de 1 hora)
  const { data: isRateStale1Hour, isLoading: isLoadingRateStale1Hour } = useIsRateStale(3600);

  // Verificar si la tasa está obsoleta (más de 24 horas)
  const { data: isRateStale24Hours, isLoading: isLoadingRateStale24Hours } = useIsRateStale(86400);

  return {
    // Funciones
    useGetRateHistory,
    useGetRecentRates,
    useIsRateStale,
    
    // Datos formateados
    rateAge: rateAge ? Number(rateAge) : 0,
    isRateStale1Hour: isRateStale1Hour || false,
    isRateStale24Hours: isRateStale24Hours || false,
    
    // Estados de carga
    isLoadingRateAge,
    isLoadingRateStale1Hour,
    isLoadingRateStale24Hours,
    
    // Errores
    rateAgeError,
  };
}

// ============================================================================
// HOOKS COMPUESTOS PARA CONSULTAS AVANZADAS
// ============================================================================

export function useAdvancedQueries() {
  const remittancePoolQueries = useRemittancePoolQueries();
  const complianceModuleQueries = useComplianceModuleQueries();
  const incentiveVaultQueries = useIncentiveVaultQueries();
  const exchangeRateOracleQueries = useExchangeRateOracleQueries();

  return {
    // RemittancePool
    ...remittancePoolQueries,
    
    // ComplianceModule
    ...complianceModuleQueries,
    
    // IncentiveVault
    ...incentiveVaultQueries,
    
    // ExchangeRateOracle
    ...exchangeRateOracleQueries,
  };
}

// ============================================================================
// UTILIDADES PARA CONSULTAS AVANZADAS
// ============================================================================

export function useQueryUtils() {
  // Función para formatear fechas de timestamps
  const formatTimestamp = (timestamp: bigint): string => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Función para formatear tasas de cambio
  const formatExchangeRate = (rate: bigint): string => {
    return (Number(rate) / 100).toFixed(2);
  };

  // Función para formatear cantidades en USD
  const formatUSD = (amount: bigint): string => {
    return `$${formatEther(amount)}`;
  };

  // Función para formatear cantidades en MXN
  const formatMXN = (amount: bigint, exchangeRate: bigint): string => {
    const usdAmount = Number(formatEther(amount));
    const mxnRate = Number(exchangeRate) / 100;
    return `$${(usdAmount * mxnRate).toFixed(2)} MXN`;
  };

  // Función para verificar si una dirección es válida
  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Función para verificar si un hash es válido
  const isValidHash = (hash: string): boolean => {
    return /^0x[a-fA-F0-9]{64}$/.test(hash);
  };

  // Función para truncar direcciones
  const truncateAddress = (address: string, start: number = 6, end: number = 4): string => {
    if (!address) return '';
    return `${address.slice(0, start)}...${address.slice(-end)}`;
  };

  // Función para obtener el estado de una remesa
  const getRemittanceStatus = (completed: boolean): { status: string; color: string } => {
    return completed 
      ? { status: 'Completada', color: 'text-green-600' }
      : { status: 'Pendiente', color: 'text-yellow-600' };
  };

  // Función para obtener el nivel de KYC
  const getKYCLevel = (level: number): { name: string; color: string } => {
    switch (level) {
      case 1:
        return { name: 'Básico', color: 'text-blue-600' };
      case 2:
        return { name: 'Verificado', color: 'text-green-600' };
      case 3:
        return { name: 'Premium', color: 'text-purple-600' };
      default:
        return { name: 'No registrado', color: 'text-gray-600' };
    }
  };

  return {
    formatTimestamp,
    formatExchangeRate,
    formatUSD,
    formatMXN,
    isValidAddress,
    isValidHash,
    truncateAddress,
    getRemittanceStatus,
    getKYCLevel,
  };
}

// ============================================================================
// HOOKS ESPECIALIZADOS PARA DASHBOARD
// ============================================================================

export function useDashboardQueries() {
  const { address } = useAccount();
  const chainId = useChainId();
  const contractAddresses = getContractAddresses(chainId || 10143);

  // Obtener todas las estadísticas del dashboard
  const { data: totalVolume, isLoading: isLoadingTotalVolume } = useContractRead({
    address: contractAddresses.RemittancePool as `0x${string}`,
    abi: [{ "inputs": [], "name": "totalVolume", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }],
    functionName: 'totalVolume',
  });

  const { data: totalTransactions, isLoading: isLoadingTotalTransactions } = useContractRead({
    address: contractAddresses.RemittancePool as `0x${string}`,
    abi: [{ "inputs": [], "name": "totalTransactions", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }],
    functionName: 'totalTransactions',
  });

  const { data: totalLiquidity, isLoading: isLoadingTotalLiquidity } = useContractRead({
    address: contractAddresses.RemittancePool as `0x${string}`,
    abi: [{ "inputs": [], "name": "totalLiquidity", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }],
    functionName: 'totalLiquidity',
  });

  const { data: currentRate, isLoading: isLoadingCurrentRate } = useContractRead({
    address: contractAddresses.ExchangeRateOracle as `0x${string}`,
    abi: [{ "inputs": [], "name": "getCurrentRate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }],
    functionName: 'getCurrentRate',
  });

  // Obtener estadísticas del usuario actual
  const { data: userStats, isLoading: isLoadingUserStats } = useContractRead({
    address: contractAddresses.IncentiveVault as `0x${string}`,
    abi: [
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
      }
    ],
    functionName: 'userStats',
    args: address ? [address] : undefined,
  });

  // Obtener recompensas pendientes del usuario
  const { data: pendingRewards, isLoading: isLoadingPendingRewards } = useContractRead({
    address: contractAddresses.IncentiveVault as `0x${string}`,
    abi: [{ "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }], "name": "getPendingRewards", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }],
    functionName: 'getPendingRewards',
    args: address ? [address] : undefined,
  });

  return {
    // Estadísticas globales
    totalVolume: totalVolume ? formatEther(totalVolume as bigint) : "0",
    totalTransactions: totalTransactions ? Number(totalTransactions).toString() : "0",
    totalLiquidity: totalLiquidity ? formatEther(totalLiquidity as bigint) : "0",
    currentRate: currentRate ? Number(currentRate) / 100 : 17.0,
    
    // Estadísticas del usuario
    userStats,
    pendingRewards: pendingRewards ? formatEther(pendingRewards as bigint) : "0",
    
    // Estados de carga
    isLoadingTotalVolume,
    isLoadingTotalTransactions,
    isLoadingTotalLiquidity,
    isLoadingCurrentRate,
    isLoadingUserStats,
    isLoadingPendingRewards,
    
    // Estado de carga combinado
    isLoading: isLoadingTotalVolume || isLoadingTotalTransactions || isLoadingTotalLiquidity || 
               isLoadingCurrentRate || isLoadingUserStats || isLoadingPendingRewards,
  };
}
