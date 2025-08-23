'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useComplianceModule } from '@/lib/web3/useContracts'
import { useAccount } from 'wagmi'
import { 
  Shield, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  Users,
  Clock,
  DollarSign,
  Ban,
  UserPlus,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

export function ComplianceManager(): React.ReactElement {
  const { address, isConnected } = useAccount()
  const {
    registerUser,
    checkTransaction,
    blacklistUser,
    removeFromBlacklist,
    upgradeKYC,
    userData,
    isLoadingUserData,
    isRegisteringUser,
    isCheckingTransaction,
    isBlacklistingUser,
    isRemovingFromBlacklist,
    isUpgradingKYC,
    registerUserError,
    checkTransactionError,
    blacklistUserError,
    removeFromBlacklistError,
    upgradeKYCError
  } = useComplianceModule()

  // Verificar si userData es válido y tiene la estructura esperada
  const isValidUserData = userData && 
    typeof userData === 'object' && 
    userData !== null && 
    'isRegistered' in userData

  // Crear una versión tipada de userData para evitar problemas de tipos
  const userDataTyped = userData as any

  const [newUser, setNewUser] = useState('')
  const [kycLevel, setKycLevel] = useState(1)
  const [blacklistAddress, setBlacklistAddress] = useState('')
  const [blacklistReason, setBlacklistReason] = useState('')
  const [upgradeAddress, setUpgradeAddress] = useState('')
  const [newKycLevel, setNewKycLevel] = useState(2)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleRegisterUser = async () => {
    if (!newUser) return
    
    try {
      await registerUser(newUser, kycLevel)
      setNewUser('')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error registering user:', error)
    }
  }

  const handleBlacklistUser = async () => {
    if (!blacklistAddress || !blacklistReason) return
    
    try {
      await blacklistUser(blacklistAddress, blacklistReason)
      setBlacklistAddress('')
      setBlacklistReason('')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error blacklisting user:', error)
    }
  }

  const handleRemoveFromBlacklist = async () => {
    if (!blacklistAddress) return
    
    try {
      await removeFromBlacklist(blacklistAddress)
      setBlacklistAddress('')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error removing user from blacklist:', error)
    }
  }

  const handleUpgradeKYC = async () => {
    if (!upgradeAddress) return
    
    try {
      await upgradeKYC(upgradeAddress, newKycLevel)
      setUpgradeAddress('')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error upgrading KYC:', error)
    }
  }

  const getKycLevelName = (level: number) => {
    switch (level) {
      case 1: return 'Básico'
      case 2: return 'Verificado'
      case 3: return 'Premium'
      default: return 'Desconocido'
    }
  }

  const getDailyLimit = (level: number) => {
    switch (level) {
      case 1: return '1,000 USD'
      case 2: return '5,000 USD'
      case 3: return '50,000 USD'
      default: return '0 USD'
    }
  }

  const getMonthlyLimit = (level: number) => {
    switch (level) {
      case 1: return '10,000 USD'
      case 2: return '50,000 USD'
      case 3: return '500,000 USD'
      default: return '0 USD'
    }
  }

  if (!isConnected) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Conecta tu Wallet
          </h3>
          <p className="text-gray-600">
            Necesitas conectar tu wallet para acceder al módulo de cumplimiento
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Módulo de Cumplimiento</h2>
          <Shield className="w-8 h-8" />
        </div>
        <p className="text-purple-100">
          Gestión de KYC, límites de transacción y cumplimiento regulatorio
        </p>
      </div>

      {/* User Status */}
      {isValidUserData ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <UserCheck className="w-5 h-5 text-blue-600 mr-2" />
            Estado de tu Cuenta
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Estado:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  userDataTyped?.isRegistered 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {userDataTyped?.isRegistered ? 'Registrado' : 'No Registrado'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Nivel KYC:</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {getKycLevelName(Number(userDataTyped?.kycLevel))}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Límite Diario:</span>
                <span className="font-semibold text-gray-900">
                  {getDailyLimit(Number(userDataTyped?.kycLevel))}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Límite Mensual:</span>
                <span className="font-semibold text-gray-900">
                  {getMonthlyLimit(Number(userDataTyped?.kycLevel))}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Usado Hoy:</span>
                <span className="font-semibold text-gray-900">
                  {userDataTyped?.dailyUsed ? `${Number(userDataTyped?.dailyUsed) / 1e18} USD` : '0 USD'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Usado Este Mes:</span>
                <span className="font-semibold text-gray-900">
                  {userDataTyped?.monthlyUsed ? `${Number(userDataTyped?.monthlyUsed) / 1e18} USD` : '0 USD'}
                </span>
              </div>
              
                             <div className="flex items-center justify-between">
                 <span className="text-gray-600">Estado:</span>
                 <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                   userDataTyped?.isBlacklisted 
                     ? 'bg-red-100 text-red-800' 
                     : 'bg-green-100 text-green-800'
                 }`}>
                   {userDataTyped?.isBlacklisted ? (
                     <>
                       <Ban className="w-3 h-3" />
                       En Blacklist
                     </>
                   ) : (
                     <>
                       <UserCheck className="w-3 h-3" />
                       Activo
                     </>
                   )}
                 </span>
               </div>
            </div>
          </div>
        </motion.div>
      ) : null}

      {/* Register User */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <UserPlus className="w-5 h-5 text-green-600 mr-2" />
          Registrar Usuario
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección del Usuario
            </label>
            <input
              type="text"
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isRegisteringUser}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nivel KYC
            </label>
            <select
              value={kycLevel}
              onChange={(e) => setKycLevel(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isRegisteringUser}
            >
              <option value={1}>Básico - $1,000/día</option>
              <option value={2}>Verificado - $5,000/día</option>
              <option value={3}>Premium - $50,000/día</option>
            </select>
          </div>
          
          <button
            onClick={handleRegisterUser}
            disabled={isRegisteringUser || !newUser}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isRegisteringUser ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Registrando...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Registrar Usuario
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Blacklist User */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Ban className="w-5 h-5 text-red-600 mr-2" />
          Gestión de Blacklist
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección del Usuario
            </label>
            <input
              type="text"
              value={blacklistAddress}
              onChange={(e) => setBlacklistAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isBlacklistingUser}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Razón
            </label>
            <textarea
              value={blacklistReason}
              onChange={(e) => setBlacklistReason(e.target.value)}
              placeholder="Razón para blacklist..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isBlacklistingUser}
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={handleBlacklistUser}
              disabled={isBlacklistingUser || !blacklistAddress || !blacklistReason}
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
              title="Agregar usuario a la lista negra"
            >
              {isBlacklistingUser ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Blacklist...
                </>
              ) : (
                <>
                  <Ban className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Agregar a Blacklist
                </>
              )}
            </button>
            
            <button
              onClick={handleRemoveFromBlacklist}
              disabled={isRemovingFromBlacklist || !blacklistAddress}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
              title="Remover usuario de la lista negra"
            >
              {isRemovingFromBlacklist ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Removiendo...
                </>
              ) : (
                <>
                  <UserCheck className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Remover de Blacklist
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Upgrade KYC */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
          Mejorar KYC
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección del Usuario
            </label>
            <input
              type="text"
              value={upgradeAddress}
              onChange={(e) => setUpgradeAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isUpgradingKYC}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nuevo Nivel KYC
            </label>
            <select
              value={newKycLevel}
              onChange={(e) => setNewKycLevel(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isUpgradingKYC}
            >
              <option value={1}>Básico - $1,000/día</option>
              <option value={2}>Verificado - $5,000/día</option>
              <option value={3}>Premium - $50,000/día</option>
            </select>
          </div>
          
          <button
            onClick={handleUpgradeKYC}
            disabled={isUpgradingKYC || !upgradeAddress}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isUpgradingKYC ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Mejorando...
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5 mr-2" />
                Mejorar KYC
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
      {registerUserError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">
              Error al registrar usuario: {registerUserError.message}
            </p>
          </div>
        </div>
      )}

      {blacklistUserError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">
              Error al blacklist usuario: {blacklistUserError.message}
            </p>
          </div>
        </div>
      )}

      {removeFromBlacklistError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">
              Error al remover usuario de blacklist: {removeFromBlacklistError.message}
            </p>
          </div>
        </div>
      )}

      {upgradeKYCError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">
              Error al mejorar KYC: {upgradeKYCError.message}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
