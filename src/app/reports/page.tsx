'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LineChart,
  Target,
  Zap,
  Globe
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { useRemittancePool, useComplianceModule, useIncentiveVault, useRemittanceToken } from '@/lib/web3/useContracts'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import toast from 'react-hot-toast'

export default function ReportsPage() {
  const { address, isConnected } = useAccount()
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

     // Contract hooks
   const { userBalance, isLoadingBalance } = useRemittancePool()
   const { userData } = useComplianceModule()
   const { userStats, isLoadingUserStats } = useIncentiveVault()
   const { tokenBalance, isLoadingTokenBalance } = useRemittanceToken()

  useEffect(() => {
    setMounted(true)
  }, [])

     // Mock data for reports
  const mockData = {
    totalVolume: 1250000,
    totalTransactions: 15432,
    averageTransaction: 81.25,
    successRate: 98.5,
    monthlyGrowth: 12.5,
    dailyTransactions: [45, 52, 38, 67, 89, 76, 54, 43, 65, 78, 92, 85, 67, 54, 43, 65, 78, 92, 85, 67, 54, 43, 65, 78, 92, 85, 67, 54, 43, 65],
    volumeByMonth: [85000, 92000, 78000, 105000, 125000, 118000, 132000, 145000, 138000, 152000, 168000, 175000],
    topDestinations: [
      { country: 'México', volume: 450000, transactions: 5432, percentage: 36 },
      { country: 'Colombia', volume: 280000, transactions: 3245, percentage: 22 },
      { country: 'Perú', volume: 195000, transactions: 2341, percentage: 16 },
      { country: 'Ecuador', volume: 168000, transactions: 1987, percentage: 13 },
      { country: 'Argentina', volume: 157000, transactions: 1427, percentage: 13 }
    ],
         transactionTypes: [
       { type: 'Sends', count: 10824, percentage: 70 },
       { type: 'Received', count: 3245, percentage: 21 },
       { type: 'Batch', count: 1363, percentage: 9 }
     ]
  }

  const handleExportReport = () => {
    toast.success('Report exported successfully')
  }

  const handleRefreshData = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Data updated')
    } catch (error) {
      toast.error('Error updating data')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-monad-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <BarChart3 className="text-white" size={32} />
          </div>
                     <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading reports...</h2>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-monad-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="text-white" size={32} />
            </div>
                         <h2 className="text-2xl font-bold text-gray-900 mb-2">
               Connect your Wallet
             </h2>
             <p className="text-gray-600 mb-6">
               You need to connect your wallet to view reports
             </p>
             <button className="btn-primary">
               Connect Wallet
             </button>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
                             <h1 className="text-3xl font-bold text-gray-900 mb-2">
                 Reports & Analytics
               </h1>
               <p className="text-gray-600">
                 Detailed analysis of transactions and performance metrics
               </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent"
              >
                                 <option value="7d">Last 7 days</option>
                 <option value="30d">Last 30 days</option>
                 <option value="90d">Last 90 days</option>
                 <option value="1y">Last year</option>
              </select>
              <button
                onClick={handleRefreshData}
                disabled={isLoading}
                className="btn-secondary flex items-center gap-2"
              >
                                 <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                 Refresh
               </button>
               <button
                 onClick={handleExportReport}
                 className="btn-primary flex items-center gap-2"
               >
                 <Download className="w-4 h-4" />
                 Export
               </button>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-gradient-to-r from-blue-500 to-cyan-600 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                                 <p className="text-sm opacity-90 mb-1">Total Volume</p>
                <p className="text-2xl font-bold">
                  ${(mockData.totalVolume / 1000000).toFixed(1)}M
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-300" />
                  <span className="text-sm text-green-300">+{mockData.monthlyGrowth}%</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-gradient-to-r from-green-500 to-emerald-600 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                                 <p className="text-sm opacity-90 mb-1">Transactions</p>
                <p className="text-2xl font-bold">
                  {mockData.totalTransactions.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-300" />
                  <span className="text-sm text-green-300">+8.2%</span>
                </div>
              </div>
              <Activity className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-gradient-to-r from-purple-500 to-pink-600 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                                 <p className="text-sm opacity-90 mb-1">Average/Tx</p>
                <p className="text-2xl font-bold">
                  ${mockData.averageTransaction}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowDownRight className="w-4 h-4 text-red-300" />
                  <span className="text-sm text-red-300">-2.1%</span>
                </div>
              </div>
              <Target className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-gradient-to-r from-orange-500 to-red-600 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                                 <p className="text-sm opacity-90 mb-1">Success Rate</p>
                <p className="text-2xl font-bold">
                  {mockData.successRate}%
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-300" />
                  <span className="text-sm text-green-300">+0.5%</span>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Transactions Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
                             <h3 className="text-lg font-semibold text-gray-900">Daily Transactions</h3>
              <LineChart className="w-5 h-5 text-monad-600" />
            </div>
            <div className="h-64 flex items-end justify-between gap-1">
              {mockData.dailyTransactions.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-monad-600 to-monad-400 rounded-t"
                  style={{ height: `${(value / 100) * 100}%` }}
                />
              ))}
            </div>
                         <div className="mt-4 text-sm text-gray-600">
               Last 30 days - Average: {Math.round(mockData.dailyTransactions.reduce((a, b) => a + b, 0) / mockData.dailyTransactions.length)} tx/day
             </div>
          </motion.div>

          {/* Volume by Month */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
                             <h3 className="text-lg font-semibold text-gray-900">Monthly Volume</h3>
              <BarChart3 className="w-5 h-5 text-monad-600" />
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {mockData.volumeByMonth.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t"
                    style={{ height: `${(value / 200000) * 100}%` }}
                  />
                                     <span className="text-xs text-gray-500 mt-2">
                     {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                   </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Detailed Analysis */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Top Destinations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
                             <h3 className="text-lg font-semibold text-gray-900">Top Destinations</h3>
              <Globe className="w-5 h-5 text-monad-600" />
            </div>
            <div className="space-y-4">
              {mockData.topDestinations.map((destination, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-monad-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-monad-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{destination.country}</p>
                      <p className="text-sm text-gray-600">{destination.transactions.toLocaleString()} tx</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${(destination.volume / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-gray-600">{destination.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Transaction Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
                             <h3 className="text-lg font-semibold text-gray-900">Transaction Types</h3>
              <PieChart className="w-5 h-5 text-monad-600" />
            </div>
            <div className="space-y-4">
              {mockData.transactionTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${
                      index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500'
                    }`} />
                                         <span className="font-medium text-gray-900">{type.type === 'Envíos' ? 'Sends' : type.type === 'Recibidos' ? 'Received' : type.type}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{type.count.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{type.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-monad-600" />
                                 <span className="font-medium text-gray-900">System Efficiency</span>
               </div>
               <p className="text-sm text-gray-600">
                 98.5% of transactions complete in less than 1 second
               </p>
            </div>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
                             <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
              <Target className="w-5 h-5 text-monad-600" />
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                                     <span className="text-gray-600">Average Transaction Time</span>
                  <span className="font-medium">0.8s</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                                     <span className="text-gray-600">System Uptime</span>
                  <span className="font-medium">99.9%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                                     <span className="text-gray-600">Customer Satisfaction</span>
                  <span className="font-medium">4.8/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-monad-50 to-purple-50 p-4 rounded-lg">
                                 <h4 className="font-semibold text-gray-900 mb-2">Period Summary</h4>
                 <div className="space-y-2 text-sm">
                   <div className="flex justify-between">
                     <span className="text-gray-600">Growth:</span>
                     <span className="text-green-600 font-medium">+12.5%</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-600">New users:</span>
                     <span className="font-medium">+2,847</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-600">Average savings:</span>
                     <span className="text-green-600 font-medium">$35/tx</span>
                   </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
