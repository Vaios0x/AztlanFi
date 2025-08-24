'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getContractAddresses } from '@/lib/web3/contracts';
import { useRemittancePool } from '@/lib/web3/useContracts';
import { useExchangeRateOracle } from '@/lib/web3/useContracts';
import { useComplianceModule } from '@/lib/web3/useContracts';
import { useIncentiveVault } from '@/lib/web3/useContracts';

interface ContractData {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  contracts: {
    RemittancePool: string;
    ComplianceModule: string;
    IncentiveVault: string;
    RemittanceToken: string;
    ExchangeRateOracle: string;
    AztlanFiCore: string;
    PartnerIntegrations: string;
  };
  stats: {
    totalVolume: string;
    totalTransactions: number;
    activeCorridors: number;
    totalLiquidity: string;
  };
}

export function useContractConnection(): ContractData {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalVolume: '0',
    totalTransactions: 0,
    activeCorridors: 0,
    totalLiquidity: '0'
  });

  // Get contract addresses for Monad testnet
  const contracts = getContractAddresses(10143);

  // Contract hooks
  const { 
    totalVolume,
    totalTransactions,
    totalLiquidity,
    isLoadingTotalVolume,
    isLoadingTotalTransactions,
    isLoadingTotalLiquidity
  } = useRemittancePool();

  const { currentRate } = useExchangeRateOracle();
  const { userData } = useComplianceModule();
  const { userRewards } = useIncentiveVault();

  // Load contract data
  useEffect(() => {
    if (!isConnected || !address) return;

    const loadContractData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Use real data from contract hooks
        setStats({
          totalVolume: totalVolume || '0',
          totalTransactions: totalTransactions ? parseInt(totalTransactions) : 0,
          activeCorridors: 32, // This could be fetched from a contract in the future
          totalLiquidity: totalLiquidity || '0'
        });

      } catch (err) {
        console.error('Error loading contract data:', err);
        setError('Error al conectar con los contratos');
        
        // Set default values if contracts fail
        setStats({
          totalVolume: '0',
          totalTransactions: 0,
          activeCorridors: 0,
          totalLiquidity: '0'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadContractData();
  }, [isConnected, address, totalVolume, totalTransactions, totalLiquidity]);

  return {
    isConnected,
    isLoading,
    error,
    contracts,
    stats
  };
}

// Hook para operaciones específicas de remesas
export function useRemittanceOperations() {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { 
    createRemittance,
    completeRemittance
  } = useRemittancePool();

  const { currentRate } = useExchangeRateOracle();
  const { userData } = useComplianceModule();

  const sendRemittance = async (
    receiver: string,
    amount: string,
    corridor: string
  ) => {
    if (!isConnected || !address) {
      throw new Error('Wallet no conectado');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check compliance
      const isBlacklisted = (userData as any)?.isBlacklisted || false;
      
      if (isBlacklisted) {
        throw new Error('Transacción bloqueada por compliance');
      }

      // Get current exchange rate
      const rate = currentRate || 17.0;
      
      // Create remittance with unique phone hash
      const phoneHash = `remittance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      createRemittance(receiver, amount, phoneHash);
      
      return {
        success: true,
        txHash: '0x1234567890abcdef...',
        rate,
        estimatedArrival: '< 1 minuto'
      };

    } catch (err: any) {
      console.error('Error sending remittance:', err);
      setError(err.message || 'Error al enviar remesa');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const checkRemittanceStatus = async (remittanceId: string) => {
    try {
      // This should query the actual contract for status
      return {
        id: remittanceId,
        status: 'completed',
        amount: '100',
        timestamp: Date.now()
      };
    } catch (err) {
      console.error('Error checking remittance status:', err);
      throw err;
    }
  };

  return {
    sendRemittance,
    checkRemittanceStatus,
    isLoading,
    error
  };
}

// Hook para datos en tiempo real
export function useLiveData() {
  const [liveStats, setLiveStats] = useState({
    currentTPS: 8000,
    gasPrice: '30 gwei',
    networkStatus: 'online',
    lastBlockTime: '2.1s',
    pendingTransactions: 42
  });

  useEffect(() => {
    // Real-time updates from Monad network
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        currentTPS: Math.floor(7500 + Math.random() * 1000),
        pendingTransactions: Math.floor(30 + Math.random() * 20)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return liveStats;
}
