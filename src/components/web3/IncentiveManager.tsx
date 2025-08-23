'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useIncentiveVault } from '@/lib/web3/useContracts'
import { useAccount } from 'wagmi'
import { 
  Gift, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Loader2,
  Star,
  Trophy,
  Target,
  Activity,
  Share2,
  AlertCircle,
  DollarSign,
  Clock
} from 'lucide-react'

export function IncentiveManager(): React.ReactElement {
  const { address, isConnected } = useAccount()
  const {
    createReferral,
    processTransaction,
    claimRewards,
    userStats,
    userRewards,
    isLoadingUserStats,
    isLoadingUserRewards,
    isCreatingReferral,
    isProcessingTransaction,
    isClaimingRewards,
    createReferralError,
    processTransactionError,
    claimRewardsError
  } = useIncentiveVault()

  const [referrer, setReferrer] = useState('')
  const [referred, setReferred] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  // Crear una versión tipada de userStats para evitar problemas de tipos
  const userStatsTyped = userStats as any

  const handleCreateReferral = async () => {
    if (!referrer || !referred) return
    
    try {
      await createReferral(referrer, referred)
      setReferrer('')
      setReferred('')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error creating referral:', error)
    }
  }

  const handleClaimRewards = async () => {
    try {
      await claimRewards()
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error claiming rewards:', error)
    }
  }

  if (!isConnected) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="text-center">
          <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Connect Your Wallet
          </h3>
          <p className="text-gray-600">
            You need to connect your wallet to access the rewards system
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Rewards System</h2>
          <Gift className="w-8 h-8" />
        </div>
        <p className="text-yellow-100">
          Earn rewards for referrals, transactions and achievements
        </p>
      </div>

      {/* User Stats */}
      {userStatsTyped ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Activity className="w-5 h-5 text-blue-600 mr-2" />
            Your Statistics
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Volume</p>
              <p className="text-xl font-bold text-gray-900">
                {userStatsTyped?.totalVolume ? `${Number(userStatsTyped.totalVolume) / 1e18} USD` : '0 USD'}
              </p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Transacciones</p>
              <p className="text-xl font-bold text-gray-900">
                {userStatsTyped?.totalTransactions || 0}
              </p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Referencias</p>
              <p className="text-xl font-bold text-gray-900">
                {userStatsTyped?.referralCount || 0}
              </p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Recompensas Ganadas</p>
              <p className="text-xl font-bold text-gray-900">
                {userStatsTyped?.rewardsEarned ? `${Number(userStatsTyped.rewardsEarned) / 1e18} RFLASH` : '0 RFLASH'}
              </p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Logros</p>
              <p className="text-xl font-bold text-gray-900">
                {userStatsTyped?.achievementCount || 0}
              </p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
              <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Última Actividad</p>
              <p className="text-sm font-semibold text-gray-900">
                {userStatsTyped?.lastActivity ? new Date(Number(userStatsTyped.lastActivity) * 1000).toLocaleDateString() : 'Nunca'}
              </p>
            </div>
          </div>
        </motion.div>
      ) : null}

      {/* Rewards Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Gift className="w-5 h-5 text-yellow-600 mr-2" />
          Recompensas Disponibles
        </h3>
        
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-800 mb-1">Recompensas Pendientes</p>
              <p className="text-2xl font-bold text-yellow-900">
                {userRewards} RFLASH
              </p>
            </div>
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
              <Gift className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <button
          onClick={handleClaimRewards}
          disabled={isClaimingRewards || parseFloat(userRewards) <= 0}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isClaimingRewards ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Reclamando...
            </>
          ) : (
            <>
              <Gift className="w-5 h-5 mr-2" />
              Reclamar Recompensas
            </>
          )}
        </button>
      </motion.div>

      {/* Create Referral */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Share2 className="w-5 h-5 text-green-600 mr-2" />
          Crear Referencia
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección del Referidor
            </label>
            <input
              type="text"
              value={referrer}
              onChange={(e) => setReferrer(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isCreatingReferral}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección del Referido
            </label>
            <input
              type="text"
              value={referred}
              onChange={(e) => setReferred(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isCreatingReferral}
            />
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-blue-800">
                Gana 0.5% del volumen de transacciones de tus referidos
              </p>
            </div>
          </div>
          
          <button
            onClick={handleCreateReferral}
            disabled={isCreatingReferral || !referrer || !referred}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isCreatingReferral ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5 mr-2" />
                Crear Referencia
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Achievements Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Trophy className="w-5 h-5 text-yellow-600 mr-2" />
          Logros Disponibles
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Primera Transacción</h4>
                <p className="text-sm text-gray-600">Completa tu primera remesa</p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Referidor</h4>
                <p className="text-sm text-gray-600">Invita a 5 amigos</p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Volumen Alto</h4>
                <p className="text-sm text-gray-600">Envía más de $10,000</p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Frecuente</h4>
                <p className="text-sm text-gray-600">10 transacciones en un mes</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Success Message */}
      {showSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50"
        >
          <CheckCircle className="w-5 h-5" />
          <span>¡Operación completada exitosamente!</span>
        </motion.div>
      ) : null}

      {/* Error Messages */}
      {createReferralError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">
              Error al crear referencia: {createReferralError.message}
            </p>
          </div>
        </div>
      ) : null}

      {claimRewardsError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">
              Error al reclamar recompensas: {claimRewardsError.message}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
