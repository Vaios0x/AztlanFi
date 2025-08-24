'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, TrendingDown, Zap, X, Download, Share2, Calculator as CalculatorIcon, RefreshCw, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export function Calculator() {
  const [amount, setAmount] = useState(500)
  const [showSavingsModal, setShowSavingsModal] = useState(false)
  const [fees, setFees] = useState({
    aztlanfi: 0,
    westernUnion: 0,
    moneyGram: 0
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)

  // Tasa de cambio simulada (en producción vendría de una API real)
  const exchangeRate = 17.25

  useEffect(() => {
    setMounted(true)
    setLastUpdated(new Date())
  }, [])

  // Calcular fees en tiempo real
  useEffect(() => {
    if (amount > 0) {
      // Fee de AztlanFi (muy bajo)
      const aztlanfiFee = Math.max(amount * 0.005, 2) // 0.5% o mínimo $2
      
      // Fees de competidores (datos reales aproximados)
      const westernUnionFee = Math.max(amount * 0.08, 15) // 8% o mínimo $15
      const moneyGramFee = Math.max(amount * 0.07, 12) // 7% o mínimo $12

      setFees({
        aztlanfi: aztlanfiFee,
        westernUnion: westernUnionFee,
        moneyGram: moneyGramFee
      })
    }
  }, [amount])

  // Actualizar datos
  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      // Simular actualización de datos
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLastUpdated(new Date())
      toast.success('Datos actualizados')
    } catch (error) {
      toast.error('Error al actualizar datos')
    } finally {
      setIsRefreshing(false)
    }
  }

  const savings = Math.max(fees.westernUnion, fees.moneyGram) - fees.aztlanfi
  const savingsPercentage = ((savings / Math.max(fees.westernUnion, fees.moneyGram)) * 100).toFixed(1)

  if (!mounted) {
    return (
      <div className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 animate-pulse"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Cargando calculadora...</h2>
          </div>
        </div>
      </div>
    )
  }

  const handleCalculateSavings = () => {
    setShowSavingsModal(true)
  }

  const downloadSavingsReport = () => {
    const report = `
        Reporte de Ahorros AztlanFi
===============================
Cantidad: $${amount} USD
Fecha: ${new Date().toLocaleDateString()}
Hora: ${new Date().toLocaleTimeString()}

Tasa de Cambio: 1 USD = ${exchangeRate.toFixed(2)} MXN
Cantidad en MXN: ${(amount * exchangeRate).toFixed(2)} MXN

Comparación de Comisiones:
- AztlanFi: $${fees.aztlanfi.toFixed(2)} (${((fees.aztlanfi / amount) * 100).toFixed(2)}%)
- Western Union: $${fees.westernUnion.toFixed(2)} (${((fees.westernUnion / amount) * 100).toFixed(2)}%)
- MoneyGram: $${fees.moneyGram.toFixed(2)} (${((fees.moneyGram / amount) * 100).toFixed(2)}%)

Tus Ahorros: $${savings.toFixed(2)} (${savingsPercentage}% de ahorro)

Esto representa una reducción significativa de costos comparado con servicios tradicionales.

Última actualización: ${lastUpdated ? lastUpdated.toLocaleString() : 'N/A'}
    `
    
    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aztlanfi-ahorros-${amount}-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareSavings = () => {
    const text = `¡Ahorré $${savings.toFixed(2)} (${savingsPercentage}%) en mi envío de $${amount} usando AztlanFi! Míralo aquí: https://aztlanfi.com`
    
    if (navigator.share) {
      navigator.share({
        title: 'Ahorros con AztlanFi',
        text: text,
        url: 'https://aztlanfi.com'
      })
    } else {
      navigator.clipboard.writeText(text)
      toast.success('Información de ahorros copiada al portapapeles!')
    }
  }

  const SavingsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white border border-gray-200 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl flex items-center justify-center">
              <CalculatorIcon className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Tu Reporte de Ahorros</h3>
              <p className="text-gray-600">Desglose detallado de tus ahorros</p>
            </div>
          </div>
          <button
            onClick={() => setShowSavingsModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar ventana"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Exchange Rate Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Tasa de Cambio Actual</h4>
                <p className="text-sm text-blue-700">
                  1 USD = {exchangeRate.toFixed(2)} MXN
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-900">
                  ${(amount * exchangeRate).toFixed(2)} MXN
                </p>
                <p className="text-xs text-blue-600">Recibirás en México</p>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">${savings.toFixed(2)}</div>
              <div className="text-lg text-green-700 mb-1">Total de Ahorros</div>
              <div className="text-sm text-green-600">{savingsPercentage}% menos que servicios tradicionales</div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Desglose Detallado de Comisiones</h4>
            
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <Zap className="text-green-600" size={20} />
                  <div>
                    <p className="font-semibold text-green-800">AztlanFi</p>
                    <p className="text-sm text-green-600">
                      Solo 0.5% de comisión
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-green-800">${fees.aztlanfi.toFixed(2)}</span>
                  <p className="text-sm text-green-600">Mejor opción</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="font-semibold text-red-800">Western Union</p>
                  <p className="text-sm text-red-600">8% de comisión</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-red-800">${fees.westernUnion.toFixed(2)}</span>
                  <p className="text-sm text-red-600">${(fees.westernUnion - fees.aztlanfi).toFixed(2)} más</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <p className="font-semibold text-orange-800">MoneyGram</p>
                  <p className="text-sm text-orange-600">7% de comisión</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-orange-800">${fees.moneyGram.toFixed(2)}</span>
                  <p className="text-sm text-orange-600">${(fees.moneyGram - fees.aztlanfi).toFixed(2)} más</p>
                </div>
              </div>
            </div>
          </div>

          {/* Annual Savings Projection */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">Proyección de Ahorros Anuales</h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">${(savings * 12).toFixed(0)}</div>
                <div className="text-sm text-blue-700">Ahorros anuales (envíos mensuales)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">${(savings * 52).toFixed(0)}</div>
                <div className="text-sm text-blue-700">Ahorros anuales (envíos semanales)</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={downloadSavingsReport}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Descargar Reporte
            </button>
            <button
              onClick={shareSavings}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Share2 size={16} />
              Compartir Ahorros
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )

  return (
    <section id="calculator" className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Cuánto Puedes Ahorrar?
          </h2>
          <p className="text-lg text-gray-300">
            Compara nuestras comisiones con servicios tradicionales de envío de dinero
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cantidad a Enviar (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-monad-500 focus:border-transparent text-lg"
                    placeholder="500"
                    min="10"
                    max="10000"
                    aria-label="Cantidad a enviar en USD"
                  />
                </div>
              </div>

              {/* Exchange Rate Display */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">Tasa de Cambio</h3>
                    <p className="text-sm text-gray-300">
                      1 USD = {exchangeRate.toFixed(2)} MXN
                    </p>
                  </div>
                  <button
                    onClick={refreshData}
                    disabled={isRefreshing}
                    className="p-2 text-monad-400 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    aria-label="Actualizar datos"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="mt-2 text-right">
                  <p className="text-lg font-bold text-white">
                    ${(amount * exchangeRate).toFixed(2)} MXN
                  </p>
                  <p className="text-xs text-monad-400">Recibirás en México</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-900/20 rounded-lg border border-green-600">
                  <div className="flex items-center space-x-3">
                    <Zap className="text-green-400" size={20} />
                    <div>
                      <p className="font-semibold text-green-400">Comisión AztlanFi</p>
                      <p className="text-sm text-green-300">
                        Solo 0.5%
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-green-400">
                    ${fees.aztlanfi.toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Comparison Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Compara con Servicios Tradicionales</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-red-900/20 rounded-lg border border-red-600">
                  <div>
                    <p className="font-semibold text-red-400">Western Union</p>
                    <p className="text-sm text-red-300">8% de comisión</p>
                  </div>
                  <span className="text-xl font-bold text-red-400">
                    ${fees.westernUnion.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-900/20 rounded-lg border border-orange-600">
                  <div>
                    <p className="font-semibold text-orange-400">MoneyGram</p>
                    <p className="text-sm text-orange-300">7% de comisión</p>
                  </div>
                  <span className="text-xl font-bold text-orange-400">
                    ${fees.moneyGram.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Savings */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-6 bg-gradient-to-r from-monad-600 to-purple-700 rounded-xl text-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingDown size={24} />
                    <div>
                      <p className="font-semibold">Tus Ahorros</p>
                      <p className="text-sm opacity-90">vs servicios tradicionales</p>
                    </div>
                  </div>
                  <span className="text-3xl font-bold">
                    ${savings.toFixed(2)}
                  </span>
                </div>
              </motion.div>

              {/* Calculate Button */}
              <button
                onClick={handleCalculateSavings}
                className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                aria-label="Calcular ahorros detallados"
              >
                <CalculatorIcon size={20} />
                Ver Ahorros Detallados
              </button>

              {/* Last Updated */}
              <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Última actualización:</span>
                  <span className="text-gray-100">
                    {lastUpdated ? lastUpdated.toLocaleTimeString() : '...'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Savings Modal */}
      {showSavingsModal && <SavingsModal />}
    </section>
  )
}
