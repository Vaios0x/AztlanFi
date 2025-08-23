'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  TrendingUp,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RefreshCw,
  Info
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { useComplianceModule } from '@/lib/web3/useContracts'
import { formatEther } from 'viem'
import toast from 'react-hot-toast'

interface ComplianceIndicatorsProps {
  onRefresh?: () => void
  isRefreshing?: boolean
}

export function ComplianceIndicators({ onRefresh, isRefreshing = false }: ComplianceIndicatorsProps) {
  const { address, isConnected } = useAccount()
  const { userData, isLoadingUserData } = useComplianceModule()
  const [showDetails, setShowDetails] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getUserComplianceData = () => {
    if (!userData) {
      return {
        kycLevel: 0,
        isBlacklisted: false,
        dailyLimit: 500,
        monthlyLimit: 2000,
        dailyUsed: 0,
        monthlyUsed: 0,
        isVerified: false,
        verificationStatus: 'unverified'
      }
    }

    const userDataTyped = userData as any
    const kycLevel = userDataTyped?.kycLevel || 0
    const isBlacklisted = userDataTyped?.isBlacklisted || false
    const dailyLimit = userDataTyped?.dailyLimit ? parseFloat(formatEther(userDataTyped.dailyLimit as bigint)) : 500
    const monthlyLimit = userDataTyped?.monthlyLimit ? parseFloat(formatEther(userDataTyped.monthlyLimit as bigint)) : 2000
    const dailyUsed = userDataTyped?.dailyUsed ? parseFloat(formatEther(userDataTyped.dailyUsed as bigint)) : 0
    const monthlyUsed = userDataTyped?.monthlyUsed ? parseFloat(formatEther(userDataTyped.monthlyUsed as bigint)) : 0

    return {
      kycLevel,
      isBlacklisted,
      dailyLimit,
      monthlyLimit,
      dailyUsed,
      monthlyUsed,
      isVerified: kycLevel > 0,
      verificationStatus: kycLevel === 0 ? 'unverified' : kycLevel === 1 ? 'basic' : kycLevel === 2 ? 'verified' : 'premium'
    }
  }

  const { 
    kycLevel, 
    isBlacklisted, 
    dailyLimit, 
    monthlyLimit, 
    dailyUsed, 
    monthlyUsed,
    isVerified,
    verificationStatus 
  } = getUserComplianceData()

  const getKYCStatusColor = () => {
    if (isBlacklisted) return 'text-red-600'
    switch (kycLevel) {
      case 0: return 'text-red-600'
      case 1: return 'text-orange-600'
      case 2: return 'text-blue-600'
      case 3: return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getKYCStatusText = () => {
    if (isBlacklisted) return 'Bloqueado'
    switch (kycLevel) {
      case 0: return 'Sin Verificar'
      case 1: return 'Básico'
      case 2: return 'Verificado'
      case 3: return 'Premium'
      default: return 'Desconocido'
    }
  }

  const getKYCStatusIcon = () => {
    if (isBlacklisted) return <XCircle className="w-5 h-5 text-red-600 animate-pulse" />
    switch (kycLevel) {
      case 0: return <AlertCircle className="w-5 h-5 text-red-600" />
      case 1: return <Shield className="w-5 h-5 text-orange-600" />
      case 2: return <CheckCircle className="w-5 h-5 text-blue-600" />
      case 3: return <CheckCircle className="w-5 h-5 text-green-600" />
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />
    }
  }

  const getDailyUsagePercentage = () => Math.min(100, (dailyUsed / dailyLimit) * 100)
  const getMonthlyUsagePercentage = () => Math.min(100, (monthlyUsed / monthlyLimit) * 100)

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 75) return 'text-orange-600'
    if (percentage >= 50) return 'text-yellow-600'
    return 'text-green-600'
  }

  if (!mounted) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Cargando...
          </h3>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Connect your Wallet
          </h3>
          <p className="text-gray-600">
            You need to connect your wallet to view compliance status
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-monad-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Compliance Status
          </h2>
        </div>
        <div className="flex items-center gap-2">
                     <button
             onClick={() => setShowDetails(!showDetails)}
             className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
             aria-label={showDetails ? 'Hide details' : 'Show details'}
           >
            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
                     <button
             onClick={onRefresh}
             disabled={isRefreshing}
             className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
             aria-label="Refresh compliance"
           >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Status */}
      <div className={`rounded-lg p-6 mb-6 ${
        isBlacklisted 
          ? 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200' 
          : 'bg-gradient-to-r from-blue-50 to-indigo-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getKYCStatusIcon()}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                KYC {getKYCStatusText()}
              </h3>
                             <p className="text-sm text-gray-600">
                 Level {kycLevel} - {verificationStatus === 'unverified' ? 'Unverified' : 
                   verificationStatus === 'basic' ? 'Basic verification' :
                   verificationStatus === 'verified' ? 'Complete verification' : 'Premium verification'}
               </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getKYCStatusColor()}`}>
              {isBlacklisted ? 'BLOQUEADO' : `NIVEL ${kycLevel}`}
            </div>
                         <div className="text-sm text-gray-600">
               {isBlacklisted ? 'Account suspended' : 'Active status'}
             </div>
          </div>
        </div>
        
        {/* Blacklist Warning */}
        {isBlacklisted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-red-100 border border-red-300 rounded-lg p-3"
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
                             <span className="text-sm text-red-800 font-medium">
                 Your account has been blocked by the compliance team
               </span>
             </div>
             <p className="text-xs text-red-700 mt-1 ml-6">
               Contact support to request a review of your case
             </p>
          </motion.div>
        )}
      </div>

      {/* Limits Overview */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Daily Limit */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
                       <h4 className="font-semibold text-gray-900">Daily Limit</h4>
           <span className={`text-sm font-medium ${getUsageColor(getDailyUsagePercentage())}`}>
             {getDailyUsagePercentage().toFixed(1)}% used
           </span>
          </div>
          <div className="space-y-2">
                         <div className="flex justify-between text-sm">
               <span className="text-gray-600">Used today:</span>
               <span className="font-medium">${dailyUsed.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-gray-600">Limit:</span>
               <span className="font-medium">${dailyLimit.toFixed(2)}</span>
             </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${
                  getDailyUsagePercentage() >= 90 ? 'bg-red-500' :
                  getDailyUsagePercentage() >= 75 ? 'bg-orange-500' :
                  getDailyUsagePercentage() >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${getDailyUsagePercentage()}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>
        </div>

        {/* Monthly Limit */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
                       <h4 className="font-semibold text-gray-900">Monthly Limit</h4>
           <span className={`text-sm font-medium ${getUsageColor(getMonthlyUsagePercentage())}`}>
             {getMonthlyUsagePercentage().toFixed(1)}% used
           </span>
          </div>
          <div className="space-y-2">
                         <div className="flex justify-between text-sm">
               <span className="text-gray-600">Used this month:</span>
               <span className="font-medium">${monthlyUsed.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-gray-600">Limit:</span>
               <span className="font-medium">${monthlyLimit.toFixed(2)}</span>
             </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${
                  getMonthlyUsagePercentage() >= 90 ? 'bg-red-500' :
                  getMonthlyUsagePercentage() >= 75 ? 'bg-orange-500' :
                  getMonthlyUsagePercentage() >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${getMonthlyUsagePercentage()}%` }}
                transition={{ duration: 1, delay: 0.4 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-200 pt-6"
        >
                     <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
             <Info className="w-4 h-4 text-blue-600" />
             Detailed Information
           </h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* KYC Benefits */}
                         <div className="space-y-3">
               <h5 className="font-medium text-gray-900">Benefits by KYC Level</h5>
               <div className="space-y-2 text-sm">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                   <span className="text-gray-600">Level 0:</span>
                   <span>Limit $500/day, $2,000/month</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                   <span className="text-gray-600">Level 1:</span>
                   <span>Limit $1,000/day, $5,000/month</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                   <span className="text-gray-600">Level 2:</span>
                   <span>Limit $5,000/day, $25,000/month</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                   <span className="text-gray-600">Level 3:</span>
                   <span>Limit $10,000/day, $50,000/month</span>
                 </div>
               </div>
             </div>

            {/* Current Status */}
                         <div className="space-y-3">
               <h5 className="font-medium text-gray-900">Current Status</h5>
               <div className="space-y-2 text-sm">
                 <div className="flex justify-between">
                   <span className="text-gray-600">Verification:</span>
                   <span className={isVerified ? 'text-green-600' : 'text-red-600'}>
                     {isVerified ? 'Completed' : 'Pending'}
                   </span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-600">Account status:</span>
                   <span className={isBlacklisted ? 'text-red-600' : 'text-green-600'}>
                     {isBlacklisted ? 'Blocked' : 'Active'}
                   </span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-600">Last updated:</span>
                   <span>{new Date().toLocaleDateString()}</span>
                 </div>
               </div>
             </div>
          </div>

          {/* Action Buttons */}
          {kycLevel === 0 && !isBlacklisted && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                                         <h5 className="font-medium text-orange-900 mb-1">
                       Verification Required
                     </h5>
                     <p className="text-sm text-orange-700 mb-3">
                       Complete your KYC verification to unlock higher limits and better exchange rates.
                     </p>
                     <button className="btn-primary text-sm">
                       Start KYC Verification
                     </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blacklist Action */}
          {isBlacklisted && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                                         <h5 className="font-medium text-red-900 mb-1">
                       Account Blocked
                     </h5>
                     <p className="text-sm text-red-700 mb-3">
                       Your account has been blocked by the compliance team. Contact support to request a review.
                     </p>
                     <div className="flex gap-2">
                       <button className="btn-secondary text-sm">
                         Contact Support
                       </button>
                       <button className="btn-primary text-sm">
                         Request Review
                       </button>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
