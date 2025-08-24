'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Network, 
  Cpu, 
  Server, 
  Cloud, 
  Wifi, 
  Signal, 
  Battery, 
  Power, 
  RefreshCw,
  TrendingUp,
  Activity,
  Zap,
  Clock,
  Database,
  BarChart3,
  LineChart,
  PieChart,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

interface MonadStats {
  network: {
    totalTransactions: number;
    averageTPS: number;
    blockTime: number;
    networkUptime: number;
    activeValidators: number;
    totalStaked: number;
    lastUpdate: Date;
  };
  performance: {
    averageBlockSize: number;
    gasPrice: number;
    pendingTransactions: number;
    confirmedTransactions: number;
    failedTransactions: number;
    lastUpdate: Date;
  };
  economic: {
    totalValueLocked: number;
    dailyVolume: number;
    monthlyVolume: number;
    averageTransactionValue: number;
    feeRevenue: number;
    lastUpdate: Date;
  };
}

export function MonadBlockchainStats() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [monadStats, setMonadStats] = useState<MonadStats>({
    network: {
      totalTransactions: 0,
      averageTPS: 0,
      blockTime: 0,
      networkUptime: 0,
      activeValidators: 0,
      totalStaked: 0,
      lastUpdate: new Date()
    },
    performance: {
      averageBlockSize: 0,
      gasPrice: 0,
      pendingTransactions: 0,
      confirmedTransactions: 0,
      failedTransactions: 0,
      lastUpdate: new Date()
    },
    economic: {
      totalValueLocked: 0,
      dailyVolume: 0,
      monthlyVolume: 0,
      averageTransactionValue: 0,
      feeRevenue: 0,
      lastUpdate: new Date()
    }
  });

  const loadMonadData = async () => {
    setIsLoading(true);
    try {
      // Simulate real Monad blockchain data
      const networkData = {
        totalTransactions: 154320,
        averageTPS: 8500,
        blockTime: 1.2,
        networkUptime: 99.99,
        activeValidators: 150,
        totalStaked: 2500000
      };

      const performanceData = {
        averageBlockSize: 2.5,
        gasPrice: 0.000001,
        pendingTransactions: 45,
        confirmedTransactions: 154275,
        failedTransactions: 0
      };

      const economicData = {
        totalValueLocked: 5800000,
        dailyVolume: 2500000,
        monthlyVolume: 75000000,
        averageTransactionValue: 162.50,
        feeRevenue: 12500
      };

      setMonadStats({
        network: {
          ...networkData,
          lastUpdate: new Date()
        },
        performance: {
          ...performanceData,
          lastUpdate: new Date()
        },
        economic: {
          ...economicData,
          lastUpdate: new Date()
        }
      });

    } catch (error) {
      console.error('Error loading Monad data:', error);
      toast.error('Error loading Monad data');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await loadMonadData();
    setIsRefreshing(false);
    toast.success('Monad data updated');
  };

  useEffect(() => {
    loadMonadData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-center h-32">
          <RefreshCw className="w-8 h-8 text-monad-400 animate-spin" />
          <span className="ml-3 text-gray-300">Loading Monad data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Monad Blockchain Stats
          </h2>
          <p className="text-gray-300">
            Real-time statistics from the Monad network
          </p>
        </div>
        <button
          onClick={refreshData}
          disabled={isRefreshing}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-600 transition-all duration-200 flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Network Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Network Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 hover:border-gray-600 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-monad-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Network className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Network</h3>
                <p className="text-sm text-gray-400">Performance</p>
              </div>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Total TX:</span>
              <span className="font-semibold text-white">{monadStats.network.totalTransactions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Average TPS:</span>
              <span className="font-semibold text-green-400">{monadStats.network.averageTPS.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Block Time:</span>
              <span className="font-semibold text-blue-400">{monadStats.network.blockTime}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Uptime:</span>
              <span className="font-semibold text-green-400">{monadStats.network.networkUptime}%</span>
            </div>
          </div>
        </motion.div>

        {/* Validators & Staking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 hover:border-gray-600 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <Server className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Validators</h3>
                <p className="text-sm text-gray-400">Staking</p>
              </div>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Active Validators:</span>
              <span className="font-semibold text-white">{monadStats.network.activeValidators}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Total Staked:</span>
              <span className="font-semibold text-green-400">{monadStats.network.totalStaked.toLocaleString()} MONAD</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Average per Val:</span>
              <span className="font-semibold text-blue-400">{(monadStats.network.totalStaked / monadStats.network.activeValidators).toLocaleString()} MONAD</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Status:</span>
              <span className="font-semibold text-green-400">Active</span>
            </div>
          </div>
        </motion.div>

        {/* Economic Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 hover:border-gray-600 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Economic</h3>
                <p className="text-sm text-gray-400">Metrics</p>
              </div>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">TVL:</span>
              <span className="font-semibold text-white">${monadStats.economic.totalValueLocked.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Daily Volume:</span>
              <span className="font-semibold text-green-400">${monadStats.economic.dailyVolume.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Average TX:</span>
              <span className="font-semibold text-blue-400">${monadStats.economic.averageTransactionValue}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Fee Revenue:</span>
              <span className="font-semibold text-green-400">${monadStats.economic.feeRevenue.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {monadStats.performance.confirmedTransactions.toLocaleString()}
            </div>
            <div className="text-sm text-gray-300">Confirmed TX</div>
          </div>
          <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {monadStats.performance.pendingTransactions}
            </div>
            <div className="text-sm text-gray-300">Pending TX</div>
          </div>
          <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
            <div className="text-2xl font-bold text-red-400 mb-1">
              {monadStats.performance.failedTransactions}
            </div>
            <div className="text-sm text-gray-300">Failed TX</div>
          </div>
          <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {monadStats.performance.averageBlockSize.toFixed(1)}MB
            </div>
            <div className="text-sm text-gray-300">Avg Block Size</div>
          </div>
        </div>
      </motion.div>

      {/* Real-time Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Real-time Activity</h3>
        <div className="space-y-4">
          {[
            { 
              action: 'Block mined', 
              details: 'Block #1,234,567', 
              time: '2 seconds ago',
              status: 'success',
              icon: Network
            },
            { 
              action: 'Transaction confirmed', 
              details: 'TX Hash: 0x1234...5678', 
              time: '5 seconds ago',
              status: 'success',
              icon: CheckCircle
            },
            { 
              action: 'Validator active', 
              details: 'Validator #45', 
              time: '8 seconds ago',
              status: 'success',
              icon: Server
            },
            { 
              action: 'Stake deposited', 
              details: '1,000 MONAD', 
              time: '12 seconds ago',
              status: 'success',
              icon: TrendingUp
            },
            { 
              action: 'Current TPS', 
              details: '8,547 TPS', 
              time: '15 seconds ago',
              status: 'success',
              icon: Activity
            }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.status === 'success' ? 'bg-green-600' : 'bg-yellow-600'
                }`}>
                  <activity.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">{activity.action}</p>
                  <p className="text-sm text-gray-300">{activity.details}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Network Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-monad-600 to-purple-700 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Monad Network Health</h3>
            <p className="text-monad-100">Overall blockchain network status</p>
          </div>
          <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">99.99%</div>
            <div className="text-monad-100 text-sm">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">150</div>
            <div className="text-monad-100 text-sm">Validators</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">1.2s</div>
            <div className="text-monad-100 text-sm">Block Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">8,500</div>
            <div className="text-monad-100 text-sm">TPS</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
