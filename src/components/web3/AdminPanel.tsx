'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRemittancePool, useComplianceModule, useIncentiveVault, useRemittanceToken, useExchangeRateOracle, useRoleVerification } from '@/lib/web3/useContracts'
import { useAccount } from 'wagmi'
import { 
  Shield, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  Pause,
  Play,
  DollarSign,
  Users,
  Database,
  Zap,
  RefreshCw,
  AlertCircle,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  Target,
  Award,
  Clock,
  TrendingUp,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Minus,
  Key,
  Globe,
  BarChart3,
  Crown,
  UserCog,
  Ban
} from 'lucide-react'
import toast from 'react-hot-toast'

export function AdminPanel() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState('remittance')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null)
  const [confirmMessage, setConfirmMessage] = useState('')

  // Estados locales para formularios
  const [newOracle, setNewOracle] = useState('')
  const [newComplianceModule, setNewComplianceModule] = useState('')
  const [newRemittancePool, setNewRemittancePool] = useState('')
  const [newRewardToken, setNewRewardToken] = useState('')
  const [newReferralRate, setNewReferralRate] = useState('')
  const [newAuthorizedUpdater, setNewAuthorizedUpdater] = useState('')
  const [rateIndex, setRateIndex] = useState('')
  const [userAddress, setUserAddress] = useState('')
  const [dailyLimit, setDailyLimit] = useState('')
  const [monthlyLimit, setMonthlyLimit] = useState('')
  const [ofacAddress, setOfacAddress] = useState('')
  const [minterAddress, setMinterAddress] = useState('')

  // Verificación de roles
  const {
    isLoadingRoles,
    isOwner,
    isComplianceOfficer,
    isAuthorizedUpdater,
    hasAnyAdminRole,
    permissions
  } = useRoleVerification()

  // Hooks de contratos
  const {
    // RemittancePool
    totalVolume,
    totalTransactions,
    totalLiquidity,
    currentExchangeRate,
    oracleAddress,
    complianceModuleAddress,
    isLoadingTotalVolume,
    isLoadingTotalTransactions,
    isLoadingTotalLiquidity,
    isLoadingCurrentExchangeRate,
    isLoadingOracleAddress,
    isLoadingComplianceModuleAddress
  } = useRemittancePool()

  const {
    // ComplianceModule
    userData,
    isLoadingUserData,
    registerUser,
    checkTransaction,
    blacklistUser,
    removeFromBlacklist,
    upgradeKYC,
    isRegisteringUser,
    isCheckingTransaction,
    isBlacklistingUser,
    isRemovingFromBlacklist,
    isUpgradingKYC
  } = useComplianceModule()

  const {
    // IncentiveVault
    userStats,
    isLoadingUserStats,
    userRewards,
    isLoadingUserRewards,
    createReferral,
    claimRewards,
    isCreatingReferral,
    isClaimingRewards
  } = useIncentiveVault()

  const {
    // RemittanceToken
    tokenBalance,
    totalSupply,
    isLoadingTokenBalance,
    isLoadingTotalSupply
  } = useRemittanceToken()

  const {
    // ExchangeRateOracle
    currentRate,
    isLoadingCurrentRate,
    updateRate,
    isUpdatingRate
  } = useExchangeRateOracle()

  // Funciones de confirmación
  const showConfirmation = (action: () => void, message: string) => {
    setConfirmAction(() => action)
    setConfirmMessage(message)
    setShowConfirmDialog(true)
  }

  const executeConfirmedAction = () => {
    if (confirmAction) {
      confirmAction()
    }
    setShowConfirmDialog(false)
    setConfirmAction(null)
    setConfirmMessage('')
  }

  // Funciones de manejo
  const handleRegisterUser = async () => {
    if (!userAddress) {
      toast.error('Ingresa una dirección de usuario')
      return
    }
    try {
      await registerUser(userAddress, 1) // Nivel básico por defecto
      toast.success('Usuario registrado exitosamente')
      setUserAddress('')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      toast.error('Error al registrar usuario')
    }
  }

  const handleBlacklistUser = async () => {
    if (!userAddress) {
      toast.error('Ingresa una dirección de usuario')
      return
    }
    try {
      await blacklistUser(userAddress, 'Sancionado por administrador')
      toast.success('Usuario agregado a blacklist')
      setUserAddress('')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      toast.error('Error al agregar usuario a blacklist')
    }
  }

  const handleRemoveFromBlacklist = async () => {
    if (!userAddress) {
      toast.error('Ingresa una dirección de usuario')
      return
    }
    try {
      await removeFromBlacklist(userAddress)
      toast.success('Usuario removido de blacklist')
      setUserAddress('')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      toast.error('Error al remover usuario de blacklist')
    }
  }



  const handleUpgradeKYC = async () => {
    if (!userAddress) {
      toast.error('Ingresa una dirección de usuario')
      return
    }
    try {
      await upgradeKYC(userAddress, 2) // Nivel verificado
      toast.success('KYC actualizado exitosamente')
      setUserAddress('')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      toast.error('Error al actualizar KYC')
    }
  }

  const handleCreateReferral = async () => {
    if (!userAddress) {
      toast.error('Ingresa una dirección de usuario')
      return
    }
    if (!address) {
      toast.error('No hay dirección de wallet conectada')
      return
    }
    try {
      await createReferral(address, userAddress)
      toast.success('Referencia creada exitosamente')
      setUserAddress('')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      toast.error('Error al crear referencia')
    }
  }

  const handleClaimRewards = async () => {
    try {
      await claimRewards()
      toast.success('Recompensas reclamadas exitosamente')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      toast.error('Error al reclamar recompensas')
    }
  }

  const handleUpdateRate = async () => {
    if (!newReferralRate) {
      toast.error('Ingresa una tasa válida')
      return
    }
    try {
      await updateRate(parseInt(newReferralRate), 'Admin Panel')
      toast.success('Tasa actualizada exitosamente')
      setNewReferralRate('')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      toast.error('Error al actualizar tasa')
    }
  }

  // Función helper para verificar permisos
  const checkPermission = (permission: boolean, requiredRole: string) => {
    if (!permission) {
      toast.error(`No tienes permisos para esta acción. Requiere: ${requiredRole}`)
      return false
    }
    return true
  }

  // Función helper para renderizar botón con verificación de permisos
  const renderButton = (
    onClick: () => void,
    disabled: boolean,
    children: React.ReactNode,
    permission: boolean,
    requiredRole: string,
    className: string = "btn-primary"
  ) => {
    const hasPermission = checkPermission(permission, requiredRole)
    
    return (
      <button
        onClick={hasPermission ? onClick : () => {}}
        disabled={disabled || !hasPermission}
        className={`${className} ${!hasPermission ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={!hasPermission ? `Requiere: ${requiredRole}` : ''}
      >
        {children}
      </button>
    )
  }

  // Definir pestañas disponibles según permisos
  const availableTabs = [
    {
      id: 'remittance',
      name: 'RemittancePool',
      icon: DollarSign,
      description: 'Gestión del pool principal',
      available: isOwner.remittancePool,
      requiredRole: 'Owner de RemittancePool'
    },
    {
      id: 'compliance',
      name: 'Compliance',
      icon: Shield,
      description: 'KYC y cumplimiento',
      available: isOwner.complianceModule || isComplianceOfficer,
      requiredRole: 'Owner de ComplianceModule o Compliance Officer'
    },
    {
      id: 'incentive',
      name: 'IncentiveVault',
      icon: Award,
      description: 'Sistema de recompensas',
      available: isOwner.incentiveVault,
      requiredRole: 'Owner de IncentiveVault'
    },
    {
      id: 'token',
      name: 'RemittanceToken',
      icon: Zap,
      description: 'Gestión del token',
      available: isOwner.remittanceToken,
      requiredRole: 'Owner de RemittanceToken'
    },
    {
      id: 'oracle',
      name: 'ExchangeRateOracle',
      icon: Globe,
      description: 'Oracle de tasas de cambio',
      available: isOwner.exchangeRateOracle || isAuthorizedUpdater,
      requiredRole: 'Owner de ExchangeRateOracle o Authorized Updater'
    }
  ].filter(tab => tab.available)

  // Si no hay pestañas disponibles, mostrar mensaje
  if (availableTabs.length === 0) {
    return (
      <div className="card bg-yellow-50 border-yellow-200">
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-yellow-900 mb-4">
            Sin Permisos Específicos
          </h2>
          <p className="text-yellow-700">
            Tienes acceso administrativo pero no a funciones específicas.
          </p>
        </div>
      </div>
    )
  }

  // Asegurar que la pestaña activa esté disponible
  if (!availableTabs.find(tab => tab.id === activeTab)) {
    setActiveTab(availableTabs[0].id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Panel de Administración</h2>
          <Shield className="w-8 h-8" />
        </div>
        <p className="text-red-100">
          Funciones avanzadas de administración del sistema
        </p>
      </div>

      {/* Información de Roles */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Tus Roles Administrativos
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {isOwner.remittancePool && (
              <span className="badge bg-blue-100 text-blue-800 text-xs">
                Owner RemittancePool
              </span>
            )}
            {isOwner.complianceModule && (
              <span className="badge bg-green-100 text-green-800 text-xs">
                Owner ComplianceModule
              </span>
            )}
            {isOwner.incentiveVault && (
              <span className="badge bg-purple-100 text-purple-800 text-xs">
                Owner IncentiveVault
              </span>
            )}
            {isOwner.remittanceToken && (
              <span className="badge bg-orange-100 text-orange-800 text-xs">
                Owner RemittanceToken
              </span>
            )}
            {isOwner.exchangeRateOracle && (
              <span className="badge bg-red-100 text-red-800 text-xs">
                Owner ExchangeRateOracle
              </span>
            )}
            {isComplianceOfficer && (
              <span className="badge bg-yellow-100 text-yellow-800 text-xs">
                Compliance Officer
              </span>
            )}
            {isAuthorizedUpdater && (
              <span className="badge bg-cyan-100 text-cyan-800 text-xs">
                Authorized Updater
              </span>
            )}
          </div>
        </div>
        <div className="text-sm text-blue-700">
          <p>
            <strong>Wallet:</strong> {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
          <p className="mt-1">
            <strong>Permisos:</strong> {hasAnyAdminRole ? 'Administrador' : 'Sin permisos'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {availableTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === tab.id
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* RemittancePool Tab */}
      {activeTab === 'remittance' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Estadísticas */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Volumen Total</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {isLoadingTotalVolume ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      `$${totalVolume ? parseFloat(totalVolume).toLocaleString() : '0'}`
                    )}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="card bg-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Transacciones</p>
                  <p className="text-2xl font-bold text-green-900">
                    {isLoadingTotalTransactions ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      totalTransactions ? parseInt(totalTransactions).toLocaleString() : '0'
                    )}
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="card bg-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">Liquidez Total</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {isLoadingTotalLiquidity ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      `$${totalLiquidity ? parseFloat(totalLiquidity).toLocaleString() : '0'}`
                    )}
                  </p>
                </div>
                <Database className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="card bg-orange-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600">Tasa de Cambio</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {isLoadingCurrentExchangeRate ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      `$${currentExchangeRate?.toFixed(2) || '17.00'}`
                    )}
                  </p>
                </div>
                <RefreshCw className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Direcciones de Contratos */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Oracle Address
              </h4>
              <p className="text-sm text-gray-600 font-mono break-all">
                {isLoadingOracleAddress ? 'Cargando...' : oracleAddress || 'No configurado'}
              </p>
            </div>
            <div className="card bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Compliance Module
              </h4>
              <p className="text-sm text-gray-600 font-mono break-all">
                {isLoadingComplianceModuleAddress ? 'Cargando...' : complianceModuleAddress || 'No configurado'}
              </p>
            </div>
          </div>

          {/* Información del Sistema */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Información del Sistema
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Estado del Pool:</span>
                <span className="ml-2 font-medium text-green-600">Activo</span>
              </div>
              <div>
                <span className="text-gray-600">Última Transacción:</span>
                <span className="ml-2 font-medium">Hace 2 minutos</span>
              </div>
              <div>
                <span className="text-gray-600">Usuarios Activos:</span>
                <span className="ml-2 font-medium">1,247</span>
              </div>
              <div>
                <span className="text-gray-600">Tiempo de Confirmación:</span>
                <span className="ml-2 font-medium">~1.2 segundos</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Gestión de Usuarios */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Gestión de Usuarios
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección del Usuario
                </label>
                <input
                  type="text"
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  placeholder="0x..."
                  className="input-field"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={handleRegisterUser}
                  disabled={isRegisteringUser || !userAddress}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  {isRegisteringUser ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserCheck className="w-4 h-4" />
                  )}
                  {isRegisteringUser ? 'Registrando...' : 'Registrar Usuario'}
                </button>
                <button
                  onClick={handleUpgradeKYC}
                  disabled={isUpgradingKYC || !userAddress}
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  {isUpgradingKYC ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Award className="w-4 h-4" />
                  )}
                  {isUpgradingKYC ? 'Actualizando...' : 'Upgrade KYC'}
                </button>
              </div>
            </div>
          </div>

          {/* Blacklist/Whitelist */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserX className="w-5 h-5" />
              Gestión de Blacklist
            </h3>
            <p className="text-gray-600 mb-4">
              Agrega o remueve usuarios de la lista negra para control de compliance
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección del Usuario
                </label>
                <input
                  type="text"
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  placeholder="0x..."
                  className="input-field"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={handleBlacklistUser}
                  disabled={isBlacklistingUser || !userAddress}
                  className="btn-secondary flex items-center justify-center gap-2 group"
                  title="Agregar usuario a la lista negra"
                >
                  {isBlacklistingUser ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserX className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  )}
                  {isBlacklistingUser ? 'Agregando...' : 'Agregar a Blacklist'}
                </button>
                <button
                  onClick={handleRemoveFromBlacklist}
                  disabled={isRemovingFromBlacklist || !userAddress}
                  className="btn-primary flex items-center justify-center gap-2 group"
                  title="Remover usuario de la lista negra"
                >
                  {isRemovingFromBlacklist ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  )}
                  {isRemovingFromBlacklist ? 'Removiendo...' : 'Remover de Blacklist'}
                </button>
              </div>
            </div>
          </div>

          {/* Verificación de Transacciones */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Verificación de Transacciones
            </h3>
            <p className="text-gray-600 mb-4">
              Verifica si una transacción cumple con los requisitos de compliance
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remitente
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destinatario
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto (USD)
                </label>
                <input
                  type="number"
                  placeholder="100"
                  className="input-field"
                />
              </div>
            </div>
            <button
              onClick={() => checkTransaction('0x...', '0x...', '100')}
              disabled={isCheckingTransaction}
              className="w-full mt-4 btn-primary flex items-center justify-center gap-2"
            >
              {isCheckingTransaction ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
              {isCheckingTransaction ? 'Verificando...' : 'Verificar Transacción'}
            </button>
          </div>
        </motion.div>
      )}

      {/* IncentiveVault Tab */}
      {activeTab === 'incentive' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Gestión de Referencias */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Gestión de Referencias
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección del Usuario
                </label>
                <input
                  type="text"
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  placeholder="0x..."
                  className="input-field"
                />
              </div>
              <button
                onClick={handleCreateReferral}
                disabled={isCreatingReferral || !userAddress}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                {isCreatingReferral ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                {isCreatingReferral ? 'Creando...' : 'Crear Referencia'}
              </button>
            </div>
          </div>

          {/* Recompensas */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Gestión de Recompensas
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Recompensas Pendientes</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {isLoadingUserRewards ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        `${userRewards || '0'} RFLASH`
                      )}
                    </p>
                  </div>
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <button
                onClick={handleClaimRewards}
                disabled={isClaimingRewards}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                {isClaimingRewards ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Award className="w-4 h-4" />
                )}
                {isClaimingRewards ? 'Reclamando...' : 'Reclamar Recompensas'}
              </button>
            </div>
          </div>

          {/* Estadísticas de Usuario */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Estadísticas de Usuario
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Referencias Creadas</p>
                    <p className="text-2xl font-bold text-green-900">
                      {isLoadingUserStats ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        '0'
                      )}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600">Volumen Generado</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {isLoadingUserStats ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        '$0'
                      )}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Token Tab */}
      {activeTab === 'token' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Información del Token */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Balance de Tokens</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {isLoadingTokenBalance ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      `${tokenBalance || '0'} RFLASH`
                    )}
                  </p>
                </div>
                <Database className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="card bg-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Supply Total</p>
                  <p className="text-2xl font-bold text-green-900">
                    {isLoadingTotalSupply ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      `${totalSupply ? parseFloat(totalSupply).toLocaleString() : '0'} RFLASH`
                    )}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Información del Token */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Información del Token RFLASH
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Símbolo:</span>
                <span className="ml-2 font-medium">RFLASH</span>
              </div>
              <div>
                <span className="text-gray-600">Decimales:</span>
                <span className="ml-2 font-medium">18</span>
              </div>
              <div>
                <span className="text-gray-600">Estado:</span>
                <span className="ml-2 font-medium text-green-600">Activo</span>
              </div>
              <div>
                <span className="text-gray-600">Tipo:</span>
                <span className="ml-2 font-medium">ERC-20</span>
              </div>
            </div>
          </div>

          {/* Funciones del Token */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Funciones del Token
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Transferir Tokens</h4>
                <p className="text-sm text-yellow-700 mb-3">
                  Transfiere tokens RFLASH a otra dirección
                </p>
                <button className="btn-secondary w-full">
                  Ir a Transferencia
                </button>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Ver Balance</h4>
                <p className="text-sm text-purple-700 mb-3">
                  Consulta el balance de cualquier dirección
                </p>
                <button className="btn-secondary w-full">
                  Consultar Balance
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Oracle Tab */}
      {activeTab === 'oracle' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Tasa Actual */}
          <div className="card bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Tasa de Cambio Actual</p>
                <p className="text-2xl font-bold text-blue-900">
                  {isLoadingCurrentRate ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    `$${currentRate?.toFixed(2) || '17.00'} MXN/USD`
                  )}
                </p>
              </div>
              <RefreshCw className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Actualizar Tasa */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Actualizar Tasa de Cambio
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva Tasa (MXN/USD)
                </label>
                <input
                  type="number"
                  value={newReferralRate}
                  onChange={(e) => setNewReferralRate(e.target.value)}
                  placeholder="17.25"
                  step="0.01"
                  className="input-field"
                />
              </div>
              <button
                onClick={handleUpdateRate}
                disabled={isUpdatingRate || !newReferralRate}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                {isUpdatingRate ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {isUpdatingRate ? 'Actualizando...' : 'Actualizar Tasa'}
              </button>
            </div>
          </div>

          {/* Información del Oracle */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Información del Oracle
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Estado:</span>
                <span className="ml-2 font-medium text-green-600">Activo</span>
              </div>
              <div>
                <span className="text-gray-600">Última Actualización:</span>
                <span className="ml-2 font-medium">Hace 5 minutos</span>
              </div>
              <div>
                <span className="text-gray-600">Fuente de Datos:</span>
                <span className="ml-2 font-medium">API Externa</span>
              </div>
              <div>
                <span className="text-gray-600">Frecuencia:</span>
                <span className="ml-2 font-medium">Cada 30 segundos</span>
              </div>
            </div>
          </div>

          {/* Historial de Tasas */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Historial de Tasas
            </h3>
            <div className="space-y-2">
              {[17.25, 17.30, 17.20, 17.35, 17.15].map((rate, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">${rate.toFixed(2)}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Hace {index + 1} hora{index > 0 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>Operación completada exitosamente</span>
          </div>
        </motion.div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Confirmar Acción</h3>
            </div>
            <p className="text-gray-600 mb-6">{confirmMessage}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={executeConfirmedAction}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirmar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
