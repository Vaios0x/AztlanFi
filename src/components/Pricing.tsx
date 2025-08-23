'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Check, 
  X, 
  Zap, 
  Shield, 
  Globe, 
  Users, 
  Star,
  TrendingDown,
  DollarSign,
  Clock,
  ArrowRight,
  Crown,
  Send,
  Loader2,
  ExternalLink,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { useRemittancePool, useAddressValidation, useComplianceModule, useIncentiveVault } from '@/lib/web3/useContracts'
import { useAccount } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { keccak256, toUtf8Bytes } from 'ethers'
import toast from 'react-hot-toast'

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [showBasicPlanModal, setShowBasicPlanModal] = useState(false)
  const [transactionData, setTransactionData] = useState({
    receiver: '',
    amount: '50',
    description: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionHash, setTransactionHash] = useState('')
  const [mounted, setMounted] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { address, isConnected } = useAccount()
  const { 
    createRemittance, 
    isCreatingRemittance, 
    exchangeRate, 
    createRemittanceError, 
    isConfirmingCreate, 
    isConfirmedCreate,
    userBalance,
    isLoadingBalance,
    calculatedFee
  } = useRemittancePool()
  const { validateAddress } = useAddressValidation()
  const { userData, isLoadingUserData } = useComplianceModule()
  const { userStats, isLoadingUserStats } = useIncentiveVault()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Verificar límites del usuario en tiempo real
  const getUserLimits = () => {
    if (!userData) {
      // Para el demo del hackathon, simular límites Pro
      return { dailyLimit: 25000, monthlyLimit: 100000, kycLevel: 2 }
    }
    
    const userDataTyped = userData as any
    const kycLevel = userDataTyped?.kycLevel || 0
    let dailyLimit = userDataTyped?.dailyLimit ? parseFloat(formatEther(userDataTyped.dailyLimit as bigint)) : 500
    let monthlyLimit = userDataTyped?.monthlyLimit ? parseFloat(formatEther(userDataTyped.monthlyLimit as bigint)) : 2000
    
    // Para el demo del hackathon, simular límites Pro si no está verificado
    if (kycLevel < 1) {
      dailyLimit = 25000
      monthlyLimit = 100000
    }
    
    return { dailyLimit, monthlyLimit, kycLevel: kycLevel >= 1 ? kycLevel : 2 }
  }

  const { dailyLimit, monthlyLimit, kycLevel } = getUserLimits()

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Perfect for occasional transfers',
      price: isAnnual ? 0 : 0,
      originalPrice: 0,
      features: [
        `Transfers up to $${dailyLimit.toFixed(0)} USD`,
        '0.5% commission',
        'Email support',
        'Mobile PWA app',
        'Delivery time: 1 second'
      ],
      limitations: [
        'No priority transfers',
        'No phone support',
        'No premium benefits'
      ],
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Ideal for regular transfers',
      price: isAnnual ? 9.99 : 12.99,
      originalPrice: isAnnual ? 15.99 : 19.99,
      features: [
        `Transfers up to $${monthlyLimit.toFixed(0)} USD`,
        '0.3% commission',
        '24/7 priority support',
        'Priority transfers',
        'Mobile PWA app',
        'Delivery time: 1 second',
        'Premium benefits',
        'No monthly limits'
      ],
      limitations: [],
      color: 'from-monad-600 to-purple-700',
      bgColor: 'bg-gradient-to-br from-monad-50 to-purple-50',
      borderColor: 'border-monad-300',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For businesses and high volumes',
      price: isAnnual ? 29.99 : 39.99,
      originalPrice: isAnnual ? 47.99 : 59.99,
      features: [
        'Transferencias ilimitadas',
        '0.1% comisión',
        'Soporte dedicado',
        'API personalizada',
        'Dashboard empresarial',
        'Reportes avanzados',
        'Integración de sistemas',
        'Tiempo de entrega: 1 segundo',
        'Gerente de cuenta dedicado'
      ],
      limitations: [],
      color: 'from-purple-600 to-pink-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      popular: false
    }
  ]

  const competitors = [
    {
      name: 'Western Union',
      fee: '8%',
      minFee: '$15',
      time: '1-3 días',
      color: 'text-red-600'
    },
    {
      name: 'MoneyGram',
      fee: '7%',
      minFee: '$12',
      time: '1-2 días',
      color: 'text-orange-600'
    },
    {
              name: 'AztlanFi Pro',
      fee: '0.3%',
      minFee: '$0.30',
      time: '1 segundo',
      color: 'text-green-600'
    }
  ]

  const handleStartNow = (planId: string) => {
    if (planId === 'pro') {
      if (!isConnected) {
        toast.error('Por favor conecta tu wallet primero para hacer una transacción')
        return
      }
      
      // Para el demo del hackathon, no se requiere KYC
      // if (kycLevel < 1) {
      //   toast.error('Necesitas completar la verificación KYC básica para usar el plan Pro. Por favor visita el panel de administración para verificar tu identidad.')
      //   return
      // }
      
      setShowTransactionModal(true)
    } else if (planId === 'basic') {
      setShowBasicPlanModal(true)
    } else {
      // Para el plan enterprise, abrir WhatsApp con mensaje predefinido
      const phoneNumber = '+14155238886'
              const message = '¡Hola! Estoy interesado en el plan Enterprise de AztlanFi. ¿Pueden proporcionarme más información sobre asociaciones comerciales y soluciones personalizadas?'
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
      window.open(url, '_blank')
    }
  }

  const handleTransactionSubmit = async () => {
    if (!transactionData.receiver || !transactionData.amount) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    if (!address) {
      toast.error('Por favor conecta tu wallet')
      return
    }

    // Validar dirección del destinatario
    if (!validateAddress(transactionData.receiver)) {
      toast.error('Por favor ingresa una dirección de wallet Monad válida')
      return
    }

    // Validar que no se envíe a la misma dirección
    if (transactionData.receiver.toLowerCase() === address.toLowerCase()) {
      toast.error('No puedes enviar dinero a tu propia dirección. Por favor ingresa una dirección de destinatario diferente.')
      return
    }

    // Validar cantidad
    const amount = parseFloat(transactionData.amount)
    if (isNaN(amount) || amount <= 0 || amount > monthlyLimit) {
      toast.error(`Por favor ingresa una cantidad válida entre $1 y $${monthlyLimit.toFixed(0)}`)
      return
    }

    // Verificar saldo
    const userBalanceNum = parseFloat(userBalance || "0")
    if (amount > userBalanceNum) {
      toast.error(`Saldo insuficiente. Disponible: $${userBalanceNum.toFixed(2)}`)
      return
    }

    setIsProcessing(true)
    try {
      // Generate a simple phone hash for demo purposes
      const phoneHash = keccak256(toUtf8Bytes(transactionData.receiver + Date.now().toString()))
      createRemittance(transactionData.receiver, transactionData.amount, phoneHash)
      setTransactionHash('¡Transacción enviada! Revisa tu wallet para confirmación.')
    } catch (error) {
      console.error('Transaction failed:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      toast.error(`Error en la transacción: ${errorMessage}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const refreshUserData = async () => {
    setIsRefreshing(true)
    try {
      // Simular actualización de datos
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Datos de usuario actualizados')
    } catch (error) {
      toast.error('Error al actualizar datos')
    } finally {
      setIsRefreshing(false)
    }
  }

  const BasicPlanModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Zap className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Plan Basic</h3>
              <p className="text-gray-600">Completamente Gratis</p>
            </div>
          </div>
          <button
            onClick={() => setShowBasicPlanModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* User Status */}
          {isConnected && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Estado de tu Cuenta</h4>
                  <p className="text-sm text-blue-700">
                    KYC Level: {kycLevel} | Límite Diario: ${dailyLimit.toFixed(0)}
                  </p>
                </div>
                <button
                  onClick={refreshUserData}
                  disabled={isRefreshing}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
                  aria-label="Actualizar datos"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          )}

          {/* Features Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Características del Plan</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">Transferencias hasta ${dailyLimit.toFixed(0)} USD</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">0.5% comisión</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">Soporte por email</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">App PWA móvil</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">Tiempo de entrega: 1 segundo</span>
              </div>
            </div>
          </div>

          {/* Getting Started Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Cómo Comenzar</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <span className="text-gray-700">Conecta tu wallet</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <span className="text-gray-700">Navega a la sección Enviar Dinero</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <span className="text-gray-700">¡Comienza tu primera transferencia!</span>
              </div>
            </div>
          </div>

          {/* Free Badge */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            <div className="relative text-white">
              <div className="text-3xl font-bold mb-1">🎉 ¡GRATIS!</div>
              <div className="text-sm opacity-90">Sin tarifas mensuales, sin cargos ocultos</div>
              <div className="text-xs opacity-75 mt-1">Comienza a enviar dinero instantáneamente</div>
            </div>
          </div>

          {/* Comparison with Pro */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">vs Plan Pro</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Límite de Transferencia:</span>
                <span className="font-medium">${dailyLimit.toFixed(0)} vs ${monthlyLimit.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Comisión:</span>
                <span className="font-medium">0.5% vs 0.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Soporte:</span>
                <span className="font-medium">Email vs 24/7</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowBasicPlanModal(false)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Tal Vez Después
            </button>
            <button
              onClick={() => {
                setShowBasicPlanModal(false)
                // Always navigate to home page and scroll to wallet connect
                window.location.href = '/#wallet-connect'
              }}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
            >
              <Zap size={16} />
              Comenzar Ahora
            </button>
          </div>

          {/* Additional Info */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              💡 Puedes actualizar a Pro en cualquier momento para mejores tarifas y soporte
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )

  const TransactionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Enviar Dinero a México</h3>
          <button
            onClick={() => setShowTransactionModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* User Status */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-900">Verificación KYC</h4>
                <p className="text-sm text-green-700">
                  Nivel {kycLevel} | Límite: ${monthlyLimit.toFixed(0)} USD
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección del Destinatario (Monad)
            </label>
            <input
              type="text"
              value={transactionData.receiver}
              onChange={(e) => setTransactionData({...transactionData, receiver: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent"
              placeholder="0x1234567890abcdef1234567890abcdef12345678"
              aria-label="Dirección de wallet del destinatario"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ingresa una dirección de wallet Monad diferente (no la tuya)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad (USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="number"
                value={transactionData.amount}
                onChange={(e) => setTransactionData({...transactionData, amount: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent"
                placeholder="50"
                min="1"
                max={monthlyLimit}
                aria-label="Cantidad en USD"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Tasa de cambio: 1 USD = {exchangeRate.toFixed(2)} MXN
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (Opcional)
            </label>
            <textarea
              value={transactionData.description}
              onChange={(e) => setTransactionData({...transactionData, description: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent"
              placeholder="¿Para qué es esto?"
              rows={3}
              aria-label="Descripción de la transacción"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Resumen de la Transacción</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Cantidad:</span>
                <span>${transactionData.amount} USD</span>
              </div>
              <div className="flex justify-between">
                <span>Comisión (0.3%):</span>
                <span>${(Number(transactionData.amount) * 0.003).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total:</span>
                <span>${(Number(transactionData.amount) * 1.003).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowTransactionModal(false)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isProcessing}
            >
              Cancelar
            </button>
            <button
              onClick={handleTransactionSubmit}
              disabled={isProcessing || isCreatingRemittance}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-monad-600 to-purple-700 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing || isCreatingRemittance ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Enviar Transacción
                </>
              )}
            </button>
          </div>

          {createRemittanceError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm font-semibold mb-2">Transacción Fallida</p>
              <p className="text-red-700 text-sm mb-2">Error: {createRemittanceError.message}</p>
              <p className="text-red-600 text-xs">
                Causas comunes: saldo insuficiente, dirección de destinatario inválida, o error del contrato.
                Por favor verifica el saldo de tu wallet e intenta de nuevo con una dirección de destinatario diferente.
              </p>
            </div>
          )}

          {isCreatingRemittance && !isConfirmedCreate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">¡Transacción enviada! Esperando confirmación...</p>
            </div>
          )}

          {isConfirmedCreate && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">¡Transacción confirmada! Tu remesa ha sido creada exitosamente.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse mb-6"></div>
            <div className="h-6 bg-gray-200 rounded-lg animate-pulse mb-8"></div>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Plans and Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Elige el plan perfecto para tus necesidades. Todos incluyen la tecnología blockchain más avanzada y soporte en español.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Mensual
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-monad-500 focus:ring-offset-2 ${
                isAnnual ? 'bg-monad-600' : 'bg-gray-200'
              }`}
              aria-label={`Cambiar a plan ${isAnnual ? 'mensual' : 'anual'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Anual
              <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                -25%
              </span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-8 rounded-3xl border-2 ${plan.bgColor} ${plan.borderColor} ${
                plan.popular ? 'ring-2 ring-monad-500 shadow-xl scale-105' : 'shadow-lg'
              } hover:shadow-2xl transition-all duration-300`}
              tabIndex={0}
              role="button"
              aria-label={`Seleccionar plan ${plan.name}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setSelectedPlan(plan.id)
                }
              }}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-monad-600 to-purple-700 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Crown size={16} />
                    Más Popular
                  </div>
                </div>
              )}
              
              {/* Demo Badge for Pro Plan */}
              {plan.id === 'pro' && (
                <div className="absolute -top-4 right-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Demo Hackathon - Sin KYC
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    {plan.originalPrice > plan.price && (
                      <span className="text-lg text-gray-500 line-through">
                        ${plan.originalPrice}
                      </span>
                    )}
                    <span className="text-gray-600">/mes</span>
                  </div>
                  {isAnnual && plan.price > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      Ahorras ${((plan.originalPrice - plan.price) * 12).toFixed(0)} por año
                    </p>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
                {plan.limitations.map((limitation, limitationIndex) => (
                  <div key={limitationIndex} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-500">{limitation}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleStartNow(plan.id)}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-monad-600 to-purple-700 text-white hover:shadow-lg'
                    : 'bg-white text-monad-600 border-2 border-monad-600 hover:bg-monad-50'
                }`}
                aria-label={`Comenzar con plan ${plan.name}`}
              >
                {plan.price === 0 ? 'Comenzar Gratis' : 'Comenzar Ahora'}
                <ArrowRight size={16} className="inline ml-2" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Comparison Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Comparación con Competidores
            </h3>
            <p className="text-xl text-gray-600">
              Ve por qué AztlanFi es la opción más económica y rápida
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Servicio</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Comisión</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Tarifa Mínima</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Tiempo de Entrega</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((competitor, index) => (
                  <tr key={competitor.name} className="border-b border-gray-100">
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {competitor.name}
                    </td>
                    <td className={`py-4 px-6 text-center font-semibold ${competitor.color}`}>
                      {competitor.fee}
                    </td>
                    <td className="py-4 px-6 text-center text-gray-600">
                      {competitor.minFee}
                    </td>
                    <td className="py-4 px-6 text-center text-gray-600">
                      {competitor.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Savings Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-monad-600 to-purple-700 rounded-3xl p-12 text-white text-center"
        >
          <h3 className="text-3xl font-bold mb-4">
            ¿Cuánto puedes ahorrar?
          </h3>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Con AztlanFi Pro, en una transferencia de $500 USD ahorras hasta $35 
            comparado con servicios tradicionales
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">$35</div>
              <div className="opacity-90">Ahorros por transferencia</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="opacity-90">Menos en comisiones</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">1s</div>
              <div className="opacity-90">Tiempo de entrega</div>
            </div>
          </div>

          <button 
            onClick={() => {
              // Always navigate to home page and scroll to calculator
              window.location.href = '/#calculator'
            }}
            className="bg-white text-monad-600 font-semibold py-4 px-8 rounded-xl hover:bg-gray-50 transition-colors duration-200 transform hover:scale-105"
          >
            Calcular Mis Ahorros
            <TrendingDown size={20} className="inline ml-2" />
          </button>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Preguntas Frecuentes
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2">
                  ¿Puedo cambiar de plan en cualquier momento?
                </h4>
                <p className="text-gray-600">
                  Sí, puedes actualizar o degradar tu plan en cualquier momento. Los cambios se aplican inmediatamente.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2">
                  ¿Hay cargos ocultos?
                </h4>
                <p className="text-gray-600">
                  No, todos nuestros precios son transparentes. Solo pagas la comisión mostrada, sin cargos adicionales.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2">
                  ¿Qué incluye el soporte prioritario?
                </h4>
                <p className="text-gray-600">
                  Chat en vivo 24/7, WhatsApp directo y respuesta garantizada en menos de 5 minutos.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2">
                  ¿Puedo cancelar mi suscripción?
                </h4>
                <p className="text-gray-600">
                  Sí, puedes cancelar en cualquier momento sin penalización. Tu cuenta permanece activa hasta el final del período pagado.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Admin Panel Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="bg-gradient-to-r from-monad-600 to-purple-700 rounded-2xl p-8 text-white text-center">
            <h3 className="text-3xl font-bold mb-4">
              Características Avanzadas
            </h3>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Accede a nuestro panel de administración completo para gestionar liquidez, cumplimiento, incentivos y más
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 rounded-xl p-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="text-white" size={24} />
                </div>
                <h4 className="font-semibold mb-2">Gestión de Liquidez</h4>
                <p className="text-sm opacity-80">Agregar/remover liquidez, gestionar pools y rastrear recompensas</p>
              </div>
              
              <div className="bg-white/10 rounded-xl p-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-white" size={24} />
                </div>
                <h4 className="font-semibold mb-2">Herramientas de Cumplimiento</h4>
                <p className="text-sm opacity-80">Registro de usuarios, gestión KYC y listas negras</p>
              </div>
              
              <div className="bg-white/10 rounded-xl p-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Star className="text-white" size={24} />
                </div>
                <h4 className="font-semibold mb-2">Sistema de Incentivos</h4>
                <p className="text-sm opacity-80">Programas de referidos, recompensas y estadísticas de usuarios</p>
              </div>
            </div>

            <button 
              onClick={() => {
                window.location.href = '/admin'
              }}
              className="bg-white text-monad-600 font-semibold py-4 px-8 rounded-xl hover:bg-gray-50 transition-colors duration-200 transform hover:scale-105"
            >
              Acceder al Panel de Administración
              <ExternalLink size={20} className="inline ml-2" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Transaction Modal */}
      {showTransactionModal && <TransactionModal />}
      
      {/* Basic Plan Modal */}
      {showBasicPlanModal && <BasicPlanModal />}
    </section>
  )
}
