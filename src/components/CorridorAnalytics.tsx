'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Clock, 
  MapPin,
  Globe,
  ArrowRight,
  RefreshCw,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  Target,
  Zap,
  Database
} from 'lucide-react';
import { corridors } from '@/lib/constants/corridors';
import toast from 'react-hot-toast';

interface CorridorData {
  id: string;
  name: string;
  fromFlag: string;
  toFlag: string;
  volume: number;
  transactions: number;
  successRate: number;
  averageAmount: number;
  feeRevenue: number;
  growthRate: number;
  lastUpdate: Date;
}

export function CorridorAnalytics() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [corridorData, setCorridorData] = useState<CorridorData[]>([]);
  const [selectedCorridor, setSelectedCorridor] = useState<string>('');

  const loadCorridorData = async () => {
    setIsLoading(true);
    try {
      // Simulate real corridor data
      const data = corridors.map(corridor => ({
        id: corridor.id,
        name: corridor.name,
        fromFlag: corridor.fromFlag,
        toFlag: corridor.toFlag,
        volume: Math.floor(Math.random() * 500000) + 100000,
        transactions: Math.floor(Math.random() * 5000) + 500,
        successRate: 98 + Math.random() * 2,
        averageAmount: Math.floor(Math.random() * 200) + 50,
        feeRevenue: Math.floor(Math.random() * 50000) + 10000,
        growthRate: (Math.random() - 0.5) * 20, // -10% to +10%
        lastUpdate: new Date()
      }));

      setCorridorData(data);
    } catch (error) {
      console.error('Error loading corridor data:', error);
      toast.error('Error loading corridor data');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await loadCorridorData();
    setIsRefreshing(false);
    toast.success('Corridor data updated');
  };

  useEffect(() => {
    loadCorridorData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-center h-32">
          <RefreshCw className="w-8 h-8 text-monad-400 animate-spin" />
          <span className="ml-3 text-gray-300">Loading corridor data...</span>
        </div>
      </div>
    );
  }

  const totalVolume = corridorData.reduce((sum, corridor) => sum + corridor.volume, 0);
  const totalTransactions = corridorData.reduce((sum, corridor) => sum + corridor.transactions, 0);
  const averageSuccessRate = corridorData.reduce((sum, corridor) => sum + corridor.successRate, 0) / corridorData.length;
  const totalFeeRevenue = corridorData.reduce((sum, corridor) => sum + corridor.feeRevenue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Corridor Analytics
          </h2>
          <p className="text-gray-300">
            Real-time data from 32 remittance corridors
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

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Total Volume</h3>
              <p className="text-sm text-gray-400">32 corridors</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            ${(totalVolume / 1000000).toFixed(1)}M
          </div>
          <div className="text-sm text-green-400">+15.3% vs last month</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Transactions</h3>
              <p className="text-sm text-gray-400">Total processed</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {totalTransactions.toLocaleString()}
          </div>
          <div className="text-sm text-blue-400">+8.7% vs last month</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Success Rate</h3>
              <p className="text-sm text-gray-400">Global average</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {averageSuccessRate.toFixed(1)}%
          </div>
          <div className="text-sm text-purple-400">+0.5% vs last month</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Fee Revenue</h3>
              <p className="text-sm text-gray-400">Commission income</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            ${(totalFeeRevenue / 1000).toFixed(0)}K
          </div>
          <div className="text-sm text-orange-400">+12.1% vs last month</div>
        </motion.div>
      </div>

      {/* Top Corridors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Top 10 Corridors by Volume</h3>
        <div className="space-y-4">
          {corridorData
            .sort((a, b) => b.volume - a.volume)
            .slice(0, 10)
            .map((corridor, index) => (
              <div key={corridor.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{corridor.fromFlag}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="text-2xl">{corridor.toFlag}</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{corridor.name}</p>
                    <p className="text-sm text-gray-400">{corridor.transactions.toLocaleString()} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">${(corridor.volume / 1000).toFixed(0)}K</p>
                  <p className={`text-sm ${corridor.growthRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {corridor.growthRate >= 0 ? '+' : ''}{corridor.growthRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
        </div>
      </motion.div>

      {/* Corridor Performance Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {corridorData.slice(0, 6).map((corridor) => (
          <div key={corridor.id} className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 hover:border-gray-600 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{corridor.fromFlag}</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span className="text-2xl">{corridor.toFlag}</span>
              </div>
              <div className={`w-2 h-2 rounded-full ${corridor.successRate >= 99 ? 'bg-green-500' : corridor.successRate >= 95 ? 'bg-yellow-500' : 'bg-red-500'}`} />
            </div>
            
            <h4 className="font-semibold text-white mb-3">{corridor.name}</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Volume:</span>
                <span className="font-semibold text-white">${(corridor.volume / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Transactions:</span>
                <span className="font-semibold text-blue-400">{corridor.transactions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Success Rate:</span>
                <span className="font-semibold text-green-400">{corridor.successRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Average:</span>
                <span className="font-semibold text-purple-400">${corridor.averageAmount}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-600">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Growth:</span>
                <span className={`font-semibold ${corridor.growthRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {corridor.growthRate >= 0 ? '+' : ''}{corridor.growthRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Real-time Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">Real-time Activity</h3>
        <div className="space-y-4">
          {[
            { 
              corridor: 'USA → Mexico', 
              action: 'Remittance completed', 
              amount: '$250', 
              time: '2 min ago',
              status: 'success',
              icon: CheckCircle
            },
            { 
              corridor: 'China → Mexico', 
              action: 'Business payment', 
              amount: '$1,200', 
              time: '5 min ago',
              status: 'success',
              icon: DollarSign
            },
            { 
              corridor: 'Brazil → Mexico', 
              action: 'Transfer initiated', 
              amount: '$180', 
              time: '8 min ago',
              status: 'pending',
              icon: Clock
            },
            { 
              corridor: 'Japan → Mexico', 
              action: 'Remittance completed', 
              amount: '$320', 
              time: '12 min ago',
              status: 'success',
              icon: CheckCircle
            },
            { 
              corridor: 'Korea → LatAm', 
              action: 'Payment processed', 
              amount: '$450', 
              time: '15 min ago',
              status: 'success',
              icon: Zap
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
                  <p className="font-medium text-white">{activity.corridor}</p>
                  <p className="text-sm text-gray-300">{activity.action}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">{activity.amount}</p>
                <p className="text-sm text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
