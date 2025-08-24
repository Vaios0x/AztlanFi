'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  AlertCircle, 
  Activity,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useAccount, useChainId } from 'wagmi';
import { useContractConnection, useLiveData } from '@/hooks/useContractConnection';
import { getExplorerUrl } from '@/lib/web3/contracts';

interface ContractConnectionProps {
  showDetails?: boolean;
  className?: string;
}

export function ContractConnection({ 
  showDetails = false, 
  className = '' 
}: ContractConnectionProps) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [showExpanded, setShowExpanded] = useState(false);
  
  const {
    isConnected: contractsConnected,
    isLoading,
    error,
    contracts,
    stats
  } = useContractConnection();

  const liveData = useLiveData();

  const getConnectionStatus = () => {
    if (!isConnected) return { status: 'disconnected', color: 'red', text: 'Wallet Disconnected' };
    if (isLoading) return { status: 'connecting', color: 'yellow', text: 'Connecting...' };
    if (error) return { status: 'error', color: 'red', text: 'Connection Error' };
    if (contractsConnected) return { status: 'connected', color: 'green', text: 'Connected to Monad' };
    return { status: 'unknown', color: 'gray', text: 'Unknown Status' };
  };

  const connectionStatus = getConnectionStatus();

  const formatNumber = (num: number | string) => {
    const n = typeof num === 'string' ? parseFloat(num) : num;
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  const contractList = [
    { name: 'AztlanFi Core', address: contracts.AztlanFiCore, description: 'Main contract' },
    { name: 'Remittance Pool', address: contracts.RemittancePool, description: 'Liquidity pool' },
    { name: 'Compliance Module', address: contracts.ComplianceModule, description: 'Compliance module' },
    { name: 'Exchange Rate Oracle', address: contracts.ExchangeRateOracle, description: 'Rate oracle' },
    { name: 'Incentive Vault', address: contracts.IncentiveVault, description: 'Incentive vault' },
    { name: 'Partner Integrations', address: contracts.PartnerIntegrations, description: 'Partner integrations' }
  ];

  if (!showDetails) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className={`w-2 h-2 rounded-full ${
          connectionStatus.status === 'connected' ? 'bg-green-500 animate-pulse' : 
          connectionStatus.status === 'connecting' ? 'bg-yellow-500 animate-pulse' :
          'bg-red-500'
        }`} />
        <span className="text-sm text-gray-600">{connectionStatus.text}</span>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Status Header */}
      <div 
        className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setShowExpanded(!showExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {connectionStatus.status === 'connected' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : connectionStatus.status === 'connecting' ? (
              <RefreshCw className="w-5 h-5 text-yellow-600 animate-spin" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <div>
              <h3 className="font-medium text-gray-900">{connectionStatus.text}</h3>
              <p className="text-sm text-gray-500">
                {isConnected ? `Chain ID: ${chainId}` : 'Connect your wallet to continue'}
              </p>
            </div>
          </div>
          
          {isConnected && (
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Activity className="w-4 h-4" />
                <span>{liveData.currentTPS} TPS</span>
              </div>
              <div className="flex items-center space-x-1">
                <Wifi className="w-4 h-4" />
                <span>{liveData.networkStatus}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {showExpanded && isConnected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          {/* Network Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  ${formatNumber(stats.totalVolume)}
                </p>
                <p className="text-sm text-gray-600">Total Volume</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {formatNumber(stats.totalTransactions)}
                </p>
                <p className="text-sm text-gray-600">Transactions</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {stats.activeCorridors}
                </p>
                <p className="text-sm text-gray-600">Active Corridors</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  ${formatNumber(stats.totalLiquidity)}
                </p>
                <p className="text-sm text-gray-600">Total Liquidity</p>
              </div>
            </div>
          </div>

          {/* Contract Addresses */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-3">Deployed Contracts</h4>
            <div className="space-y-2">
              {contractList.map((contract) => (
                <div key={contract.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{contract.name}</p>
                    <p className="text-sm text-gray-500">{contract.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {contract.address.slice(0, 6)}...{contract.address.slice(-4)}
                    </code>
                    <a
                      href={`${getExplorerUrl(chainId)}/address/${contract.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <div>
                  <h4 className="font-medium text-red-800">Connection Error</h4>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// Componente simplificado para mostrar solo el estado
export function ConnectionStatus() {
  const { isConnected } = useAccount();
  const { isConnected: contractsConnected, isLoading, error } = useContractConnection();
  const liveData = useLiveData();

  const getStatusColor = () => {
    if (!isConnected) return 'bg-red-500';
    if (isLoading) return 'bg-yellow-500 animate-pulse';
    if (error) return 'bg-red-500';
    if (contractsConnected) return 'bg-green-500 animate-pulse';
    return 'bg-gray-500';
  };

  const getStatusText = () => {
    if (!isConnected) return 'Disconnected';
    if (isLoading) return 'Connecting...';
    if (error) return 'Error';
    if (contractsConnected) return 'Connected';
    return 'Unknown';
  };

  return (
    <div className="flex items-center space-x-1.5">
      <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor()}`} />
      <span className="text-xs text-gray-600">{getStatusText()}</span>
      {contractsConnected && (
        <span className="text-xs text-gray-500">
          {liveData.currentTPS} TPS
        </span>
      )}
    </div>
  );
}
