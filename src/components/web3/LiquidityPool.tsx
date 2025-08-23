'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRemittancePool } from '@/lib/web3/useContracts'
import { useAccount } from 'wagmi'
import { 
  Plus, 
  Minus, 
  Wallet, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  DollarSign,
  Users,
  Clock
} from 'lucide-react'

export function LiquidityPool(): React.ReactElement {
  const { address, isConnected } = useAccount()
  const {
    addLiquidity,
    removeLiquidity,
    withdrawBalance,
    userBalance,
    liquidityProvider,
    calculatedRewards,
    isAddingLiquidity,
    isRemovingLiquidity,
    isWithdrawingBalance,
    isConfirmedLiquidity,
    addLiquidityError,
    removeLiquidityError,
    withdrawBalanceError
  } = useRemittancePool()

  const [addAmount, setAddAmount] = useState('')
  const [removeAmount, setRemoveAmount] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  // Crear una versión tipada para evitar problemas de tipos
  const liquidityProviderTyped = liquidityProvider as any

  const handleAddLiquidity = async () => {
    if (!addAmount || parseFloat(addAmount) <= 0) return
    
    try {
      await addLiquidity(addAmount)
      setAddAmount('')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error adding liquidity:', error)
    }
  }

  const handleRemoveLiquidity = async () => {
    if (!removeAmount || parseFloat(removeAmount) <= 0) return
    
    try {
      await removeLiquidity(removeAmount)
      setRemoveAmount('')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error removing liquidity:', error)
    }
  }

  const handleWithdrawBalance = async () => {
    try {
      await withdrawBalance()
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error withdrawing balance:', error)
    }
  }

  if (!isConnected) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="text-center">
          <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Conecta tu Wallet
          </h3>
          <p className="text-gray-600">
            Necesitas conectar tu wallet para acceder al pool de liquidez
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Pool de Liquidez</h2>
          <TrendingUp className="w-8 h-8" />
        </div>
        <p className="text-blue-100">
          Proporciona liquidez y gana recompensas por cada transacción
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tu Liquidez</p>
              <p className="text-lg font-semibold text-gray-900">
                {liquidityProviderTyped?.amount ? `${parseFloat(liquidityProviderTyped.amount.toString()) / 1e18} MON` : '0 MON'}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Recompensas</p>
              <p className="text-lg font-semibold text-gray-900">
                {calculatedRewards} MON
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Balance</p>
              <p className="text-lg font-semibold text-gray-900">
                {userBalance} MON
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add Liquidity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Plus className="w-5 h-5 text-green-600 mr-2" />
          Agregar Liquidez
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad (MON)
            </label>
            <input
              type="number"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isAddingLiquidity}
            />
          </div>
          
          <button
            onClick={handleAddLiquidity}
            disabled={isAddingLiquidity || !addAmount || parseFloat(addAmount) <= 0}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isAddingLiquidity ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Agregando...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                Agregar Liquidez
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Remove Liquidity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Minus className="w-5 h-5 text-red-600 mr-2" />
          Remover Liquidez
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad (MON)
            </label>
            <input
              type="number"
              value={removeAmount}
              onChange={(e) => setRemoveAmount(e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isRemovingLiquidity}
            />
          </div>
          
          <button
            onClick={handleRemoveLiquidity}
            disabled={isRemovingLiquidity || !removeAmount || parseFloat(removeAmount) <= 0}
            className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isRemovingLiquidity ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Removiendo...
              </>
            ) : (
              <>
                <Minus className="w-5 h-5 mr-2" />
                Remover Liquidez
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Withdraw Balance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Wallet className="w-5 h-5 text-blue-600 mr-2" />
          Retirar Balance
        </h3>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-blue-800">
                Balance disponible: <span className="font-semibold">{userBalance} MON</span>
              </p>
            </div>
          </div>
          
          <button
            onClick={handleWithdrawBalance}
            disabled={isWithdrawingBalance || parseFloat(userBalance) <= 0}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isWithdrawingBalance ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Retirando...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5 mr-2" />
                Retirar Balance
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50"
        >
          <CheckCircle className="w-5 h-5" />
          <span>¡Operación completada exitosamente!</span>
        </motion.div>
      )}

      {/* Error Messages */}
      {addLiquidityError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">
              Error al agregar liquidez: {addLiquidityError.message}
            </p>
          </div>
        </div>
      )}

      {removeLiquidityError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">
              Error al remover liquidez: {removeLiquidityError.message}
            </p>
          </div>
        </div>
      )}

      {withdrawBalanceError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">
              Error al retirar balance: {withdrawBalanceError.message}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
