'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import { LiquidityPool } from '@/components/web3/LiquidityPool'
import { ComplianceManager } from '@/components/web3/ComplianceManager'
import { IncentiveManager } from '@/components/web3/IncentiveManager'
import { AdminPanel } from '@/components/web3/AdminPanel'
import { useRoleVerification } from '@/lib/web3/useContracts'
import { 
  Wallet, 
  AlertCircle, 
  Settings, 
  TrendingUp, 
  Shield, 
  Gift,
  ChevronRight,
  Home,
  Crown,
  Ban,
  Loader2
} from 'lucide-react'

export default function AdminPage() {
  const { isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState('liquidity')
  const [mounted, setMounted] = useState(false)

  // Verificación de roles
  const {
    isLoadingRoles,
    isOwner,
    isComplianceOfficer,
    isAuthorizedUpdater,
    hasAnyAdminRole
  } = useRoleVerification()

  useEffect(() => {
    setMounted(true)
  }, [])

  const tabs = [
    {
      id: 'liquidity',
      name: 'Pool de Liquidez',
      icon: TrendingUp,
      description: 'Gestiona liquidez y recompensas',
      available: true // Siempre disponible para usuarios conectados
    },
    {
      id: 'compliance',
      name: 'Cumplimiento',
      icon: Shield,
      description: 'KYC, límites y blacklist',
      available: isOwner.complianceModule || isComplianceOfficer
    },
    {
      id: 'incentives',
      name: 'Recompensas',
      icon: Gift,
      description: 'Sistema de incentivos y referencias',
      available: isOwner.incentiveVault
    },
    {
      id: 'admin',
      name: 'Administración',
      icon: Settings,
      description: 'Funciones avanzadas de administración',
      available: hasAnyAdminRole
    }
  ]

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Conecta tu Wallet
          </h1>
          <p className="text-gray-600 mb-6">
            Necesitas conectar tu wallet para acceder al panel de administración
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Solo usuarios autorizados pueden acceder a esta sección
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Si está cargando los roles, mostrar loading
  if (isLoadingRoles) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 bg-monad-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-8 h-8 text-monad-600 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Verificando Permisos
          </h1>
          <p className="text-gray-600 mb-6">
            Verificando roles administrativos en la blockchain...
          </p>
        </motion.div>
      </div>
    )
  }

  // Si no tiene ningún rol administrativo, mostrar mensaje de acceso restringido
  if (!hasAnyAdminRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ban className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Restringido
          </h1>
          <p className="text-gray-600 mb-6">
            Tu wallet no tiene permisos administrativos en ningún contrato.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-2">Roles Requeridos:</h3>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Owner de RemittancePool</li>
              <li>• Owner de ComplianceModule</li>
              <li>• Owner de IncentiveVault</li>
              <li>• Owner de RemittanceToken</li>
              <li>• Owner de ExchangeRateOracle</li>
              <li>• Compliance Officer</li>
              <li>• Authorized Updater</li>
            </ul>
          </div>
        </motion.div>
      </div>
    )
  }

  // Filtrar pestañas disponibles
  const availableTabs = tabs.filter(tab => tab.available)

  // Asegurar que la pestaña activa esté disponible
  if (!availableTabs.find(tab => tab.id === activeTab)) {
    setActiveTab(availableTabs[0].id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="text-sm">Inicio</span>
              </a>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-semibold text-gray-900">Administración</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Panel de Administración
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Gestiona todas las funcionalidades on-chain de RemesaFlash: liquidez, cumplimiento y recompensas
          </p>
        </motion.div>

        {/* Información de Roles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
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
                <strong>Pestañas Disponibles:</strong> {availableTabs.length} de {tabs.length}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-4 justify-center">
            {availableTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 px-6 py-4 rounded-xl font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">{tab.name}</div>
                    <div className={`text-xs ${
                      activeTab === tab.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {tab.description}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'liquidity' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Pool de Liquidez
                </h2>
                <p className="text-gray-600">
                  Gestiona la liquidez del protocolo, agrega o remueve fondos y retira recompensas
                </p>
              </div>
              <LiquidityPool />
            </div>
          )}

          {activeTab === 'compliance' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Módulo de Cumplimiento
                </h2>
                <p className="text-gray-600">
                  Administra usuarios, niveles de KYC, límites de transacción y blacklist
                </p>
              </div>
              <ComplianceManager />
            </div>
          )}

          {activeTab === 'incentives' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Sistema de Recompensas
                </h2>
                <p className="text-gray-600">
                  Gestiona referencias, recompensas y logros del sistema de incentivos
                </p>
              </div>
              <IncentiveManager />
            </div>
          )}

          {activeTab === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AdminPanel />
            </motion.div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Liquidez Total</p>
                <p className="text-xl font-bold text-gray-900">Cargando...</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Usuarios Registrados</p>
                <p className="text-xl font-bold text-gray-900">Cargando...</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Gift className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Recompensas Distribuidas</p>
                <p className="text-xl font-bold text-gray-900">Cargando...</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Información Importante
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">Pool de Liquidez</h4>
              <ul className="space-y-1">
                <li>• Agrega liquidez para ganar recompensas</li>
                <li>• Fees dinámicos basados en volumen</li>
                <li>• Retira tu liquidez en cualquier momento</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Cumplimiento</h4>
              <ul className="space-y-1">
                <li>• 3 niveles de KYC disponibles</li>
                <li>• Límites automáticos por nivel</li>
                <li>• Sistema de blacklist para seguridad</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Recompensas</h4>
              <ul className="space-y-1">
                <li>• 0.5% de comisión por referencias</li>
                <li>• Logros desbloqueables</li>
                <li>• Tokens RFLASH como recompensa</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Seguridad</h4>
              <ul className="space-y-1">
                <li>• Todas las transacciones son on-chain</li>
                <li>• Verificación de cumplimiento automática</li>
                <li>• Auditoría completa disponible</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
