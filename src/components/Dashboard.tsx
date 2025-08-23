'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Activity,
  RefreshCw,
  ExternalLink,
  Zap,
  Users,
  BarChart3,
  Search
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { useRemittancePool, useComplianceModule, useIncentiveVault, useRemittanceToken } from '@/lib/web3/useContracts'
import { BlacklistStatusBanner } from './BlacklistStatusBanner'
import { KYCVerification } from './KYCVerification'
import { ReportsWidget } from './ReportsWidget'
import { formatEther } from 'viem'
import { getExplorerUrl } from '@/lib/web3/contracts'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export function Dashboard() {
  const { address, isConnected } = useAccount()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    setLastUpdated(new Date())
  }, [])

     // Contract hooks
   const { 
     userBalance, 
     isLoadingBalance,
     calculatedFee
   } = useRemittancePool()
   
   const { userData, isLoadingUserData } = useComplianceModule()
   const { userStats, isLoadingUserStats } = useIncentiveVault()
   const { tokenBalance, isLoadingTokenBalance } = useRemittanceToken()

  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLastUpdated(new Date())
      toast.success('Data updated')
    } catch (error) {
      toast.error('Error updating data')
    } finally {
      setIsRefreshing(false)
    }
  }

     // Functions for Quick Actions
  const handleSendMoney = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }
    toast.success('Redirecting to send page...')
    setTimeout(() => {
      router.push('/pricing')
    }, 1000)
  }

  const handleReceiveMoney = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }
    toast.success('Receive money feature coming soon')
  }

  const handleViewReports = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }
    toast.success('Redirecting to reports...')
    setTimeout(() => {
      router.push('/reports')
    }, 1000)
  }

  const handlePlanProDemo = () => {
    toast.success('Pro Plan Demo Active!', {
      duration: 4000,
      icon: '🎉',
      style: {
        background: '#10B981',
        color: 'white',
      },
    })
    
    // Show detailed information
    setTimeout(() => {
      toast.success('Daily limit: $25,000 | Monthly limit: $100,000 | Fee: 0.2%', {
        duration: 5000,
        icon: '💎',
      })
    }, 1000)
  }

     const getUserStatus = () => {
     if (!userData) {
       // For hackathon demo, simulate Pro plan
       return { kycLevel: 2, isBlacklisted: false, dailyLimit: 25000, monthlyLimit: 100000 }
     }
     
     const userDataTyped = userData as any
     const kycLevel = userDataTyped?.kycLevel || 0
     const isBlacklisted = userDataTyped?.isBlacklisted || false
     
     // For hackathon demo, simulate Pro limits if not verified
     let dailyLimit = 500
     let monthlyLimit = 2000
     
     if (kycLevel >= 1) {
       dailyLimit = userDataTyped?.dailyLimit ? parseFloat(formatEther(userDataTyped.dailyLimit as bigint)) : 5000
       monthlyLimit = userDataTyped?.monthlyLimit ? parseFloat(formatEther(userDataTyped.monthlyLimit as bigint)) : 25000
     } else {
       // Demo: simulate Pro limits
       dailyLimit = 25000
       monthlyLimit = 100000
     }
     
     return { kycLevel: kycLevel >= 1 ? kycLevel : 2, isBlacklisted, dailyLimit, monthlyLimit }
   }

  const { kycLevel, isBlacklisted, dailyLimit, monthlyLimit } = getUserStatus()

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-monad-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-monad-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="text-white" size={32} />
          </div>
                     <h2 className="text-2xl font-bold text-gray-900 mb-2">
             Loading...
           </h2>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-monad-50 to-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-monad-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Connect your Wallet
          </h2>
          <p className="text-gray-600 mb-6">
            You need to connect your wallet to view your dashboard
          </p>
          <button className="btn-primary">
            Conectar Wallet
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-monad-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Blacklist Status Banner */}
        <BlacklistStatusBanner className="mb-6" />
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                AztlanFi Dashboard
              </h1>
              <p className="text-gray-600">
                Your account status and blockchain activity
              </p>
            </div>
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="btn-secondary flex items-center gap-2"
              aria-label="Actualizar datos"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : '...'}
          </p>
        </motion.div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-gradient-to-r from-green-500 to-emerald-600 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Available Balance</p>
                <p className="text-2xl font-bold">
                  {isLoadingBalance ? '...' : `$${parseFloat(userBalance || "0").toFixed(2)}`}
                </p>
              </div>
              <DollarSign className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>

          {/* KYC Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`card ${isBlacklisted ? 'bg-red-500 text-white' : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">KYC Status</p>
                <p className="text-2xl font-bold">
                  {isBlacklisted ? 'Blocked' : `Level ${kycLevel}`}
                </p>
              </div>
              <Shield className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>

          {/* Tokens Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-gradient-to-r from-purple-500 to-pink-600 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Tokens RF</p>
                <p className="text-2xl font-bold">
                  {isLoadingTokenBalance ? '...' : parseFloat(tokenBalance || "0").toFixed(0)}
                </p>
              </div>
              <Zap className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>

          {/* Activity Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-gradient-to-r from-orange-500 to-red-600 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Transactions</p>
                <p className="text-2xl font-bold">
                  {isLoadingUserStats ? '...' : (userStats as any)?.totalTransactions || 0}
                </p>
              </div>
              <Activity className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Limits & Compliance */}
          <div className="lg:col-span-2 space-y-6">
            {/* Limits Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Transaction Limits</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Active</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Daily Limit</span>
                      <span className="font-medium">${dailyLimit.toFixed(0)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (parseFloat(userBalance || "0") / dailyLimit) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Monthly Limit</span>
                      <span className="font-medium">${monthlyLimit.toFixed(0)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (parseFloat(userBalance || "0") / monthlyLimit) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Compliance Status</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        {isBlacklisted ? (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        <span className={isBlacklisted ? 'text-red-700' : 'text-green-700'}>
                          {isBlacklisted ? 'Account blocked' : 'Account verified'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span className="text-blue-700">KYC Level {kycLevel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* KYC Status */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="card"
            >
                             <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-bold text-gray-900">KYC Status</h2>
                                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    kycLevel >= 1 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {kycLevel >= 1 ? 'Verified' : 'Pro Plan Demo'}
                  </div>
               </div>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                                                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                       <div className="text-2xl font-bold text-gray-900 mb-1">
                         {kycLevel === 0 ? 'Pro Plan Demo' : kycLevel === 1 ? 'Verified' : 'Premium'}
                       </div>
                       <div className="text-sm text-gray-600">Current Level</div>
                     </div>
                     <div className="text-center p-4 bg-gray-50 rounded-lg">
                       <div className="text-2xl font-bold text-gray-900 mb-1">
                         {kycLevel === 0 ? '$25,000' : kycLevel === 1 ? '$5,000' : '$25,000'}
                       </div>
                       <div className="text-sm text-gray-600">Daily Limit</div>
                     </div>
                     <div className="text-center p-4 bg-gray-50 rounded-lg">
                       <div className="text-2xl font-bold text-gray-900 mb-1">
                         {kycLevel === 0 ? '$100,000' : kycLevel === 1 ? '$25,000' : '$100,000'}
                       </div>
                       <div className="text-sm text-gray-600">Monthly Limit</div>
                     </div>
                </div>
                                                    {kycLevel < 1 && (
                     <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
                       <div className="flex items-center gap-3 mb-3">
                         <CheckCircle className="w-5 h-5 text-purple-600" />
                         <h3 className="font-semibold text-purple-900">Pro Plan Demo Active</h3>
                       </div>
                       <p className="text-purple-800 text-sm mb-4">
                         For this hackathon demo, the Pro plan is fully enabled! Enjoy all limits and premium features without KYC verification.
                       </p>
                       <div className="grid grid-cols-2 gap-4 text-sm">
                         <div>
                           <span className="text-purple-600 font-medium">Fee:</span>
                           <p className="text-purple-900 font-semibold">0.2%</p>
                         </div>
                         <div>
                           <span className="text-purple-600 font-medium">Support:</span>
                           <p className="text-purple-900 font-semibold">24/7 Priority</p>
                         </div>
                       </div>
                     </div>
                   )}
                                 {kycLevel >= 1 && (
                   <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                     <div className="flex items-center gap-3 mb-3">
                       <CheckCircle className="w-5 h-5 text-green-600" />
                       <h3 className="font-semibold text-green-900">Verification Completed</h3>
                     </div>
                     <p className="text-green-800 text-sm mb-4">
                       Your account is verified. Enjoy increased limits and premium features.
                     </p>
                     <div className="grid grid-cols-2 gap-4 text-sm">
                       <div>
                         <span className="text-green-600 font-medium">Fee:</span>
                         <p className="text-green-900 font-semibold">0.3%</p>
                       </div>
                       <div>
                         <span className="text-green-600 font-medium">Support:</span>
                         <p className="text-green-900 font-semibold">24/7 Priority</p>
                       </div>
                     </div>
                   </div>
                 )}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="card"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                                 {[
                   { type: 'Send', amount: '$250', status: 'completed', time: '2 hours ago' },
                   { type: 'Receive', amount: '$180', status: 'pending', time: '4 hours ago' },
                   { type: 'Send', amount: '$320', status: 'completed', time: '6 hours ago' },
                 ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        {activity.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.type}</p>
                        <p className="text-sm text-gray-600">{activity.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{activity.amount}</p>
                                             <p className={`text-sm ${
                         activity.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                       }`}>
                         {activity.status === 'completed' ? 'Completed' : 'Pending'}
                       </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Stats & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="card"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Statistics</h2>
              <div className="space-y-4">
                                                   <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Volume</span>
                    <span className="font-semibold">
                      $2.5M
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Transactions</span>
                    <span className="font-semibold">
                      15,432
                    </span>
                  </div>
                                 <div className="flex items-center justify-between">
                   <span className="text-gray-600">Average Fee</span>
                   <span className="font-semibold">
                     {calculatedFee ? `${calculatedFee}%` : '...'}
                   </span>
                 </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="card"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button 
                  onClick={handleSendMoney}
                  className={`w-full btn-primary flex items-center justify-center gap-2 hover:scale-105 transition-transform ${
                    !isConnected ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!isConnected}
                >
                  <DollarSign className="w-4 h-4" />
                  Send Money
                  {!isConnected && (
                    <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                      Wallet Required
                    </span>
                  )}
                </button>
                <button 
                  onClick={handleReceiveMoney}
                  className={`w-full btn-secondary flex items-center justify-center gap-2 hover:scale-105 transition-transform ${
                    !isConnected ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!isConnected}
                >
                  <Users className="w-4 h-4" />
                  Receive Money
                  {!isConnected && (
                    <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                      Wallet Required
                    </span>
                  )}
                </button>
                <a 
                  href="/batch-operations"
                  className="w-full btn-secondary flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                >
                  <Zap className="w-4 h-4" />
                  Batch Operations
                </a>
                <a 
                  href="/advanced-queries"
                  className="w-full btn-secondary flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                >
                  <Search className="w-4 h-4" />
                  Advanced Queries
                </a>
                <button 
                  onClick={handlePlanProDemo}
                  className="w-full btn-secondary flex items-center justify-center gap-2 hover:scale-105 transition-transform bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:bg-green-100"
                >
                  <Shield className="w-4 h-4" />
                  Plan Pro Demo
                </button>
                <button 
                  onClick={handleViewReports}
                  className={`w-full btn-secondary flex items-center justify-center gap-2 hover:scale-105 transition-transform ${
                    !isConnected ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!isConnected}
                >
                  <BarChart3 className="w-4 h-4" />
                  View Reports
                  {!isConnected && (
                    <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                      Wallet Required
                    </span>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Reports Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <ReportsWidget />
            </motion.div>

            {/* Network Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="card"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Network Status</h2>
              <div className="space-y-4">
                                 <div className="flex items-center justify-between">
                   <span className="text-gray-600">Monad Network</span>
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                     <span className="text-green-600 font-medium">Online</span>
                   </div>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-gray-600">Latest Block</span>
                   <span className="font-mono text-sm">
                     {Math.floor(Math.random() * 1000000) + 1000000}
                   </span>
                 </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Gas Price</span>
                  <span className="font-mono text-sm">
                    {Math.floor(Math.random() * 50) + 10} Gwei
                  </span>
                </div>
                                 <a
                   href={`${getExplorerUrl(10143)}/address/${address}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex items-center justify-center gap-2 text-monad-600 hover:text-monad-700 transition-colors"
                 >
                   <ExternalLink className="w-4 h-4" />
                   View in Explorer
                 </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
