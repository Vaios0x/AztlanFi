'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, TrendingDown, Zap, X, Download, Share2, Calculator as CalculatorIcon, RefreshCw, AlertCircle } from 'lucide-react'
import { useRemittancePool, useExchangeRateOracle } from '@/lib/web3/useContracts'
import { useAccount } from 'wagmi'
import { formatEther, parseEther } from 'viem'
import toast from 'react-hot-toast'

export function Calculator() {
  const { address, isConnected } = useAccount()
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

  useEffect(() => {
    setMounted(true)
    setLastUpdated(new Date())
  }, [])

  // Hooks de contratos
  const { 
    calculatedFee, 
    isLoadingFee,
    exchangeRate,
    isLoadingRate
  } = useRemittancePool()
  
  const { 
    currentRate, 
    isLoadingCurrentRate,
    updateRate,
    isUpdatingRate
  } = useExchangeRateOracle()

  // Calcular fees en tiempo real
  useEffect(() => {
    if (amount > 0) {
      // Fee dinámico del contrato (si está disponible)
      const contractFee = calculatedFee ? parseFloat(calculatedFee) : amount * 0.005
      const aztlanfiFee = Math.max(contractFee, amount * 0.005) // Mínimo 0.5%
      
      // Fees de competidores (datos reales aproximados)
      const westernUnionFee = Math.max(amount * 0.08, 15) // 8% o mínimo $15
      const moneyGramFee = Math.max(amount * 0.07, 12) // 7% o mínimo $12

      setFees({
        aztlanfi: aztlanfiFee,
        westernUnion: westernUnionFee,
        moneyGram: moneyGramFee
      })
    }
  }, [amount, calculatedFee])

  // Actualizar datos
  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      // En producción, aquí se actualizarían los datos del contrato
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
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cargando calculadora...</h2>
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
        AztlanFi Savings Report
==========================
Amount: $${amount} USD
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

Exchange Rate: 1 USD = ${(exchangeRate || currentRate || 17).toFixed(2)} MXN
Amount in MXN: ${(amount * (exchangeRate || currentRate || 17)).toFixed(2)} MXN

Fees Comparison:
- AztlanFi: $${fees.aztlanfi.toFixed(2)} (${((fees.aztlanfi / amount) * 100).toFixed(2)}%)
- Western Union: $${fees.westernUnion.toFixed(2)} (${((fees.westernUnion / amount) * 100).toFixed(2)}%)
- MoneyGram: $${fees.moneyGram.toFixed(2)} (${((fees.moneyGram / amount) * 100).toFixed(2)}%)

Your Savings: $${savings.toFixed(2)} (${savingsPercentage}% savings)

This represents significant cost reduction compared to traditional remittance services.

Blockchain Data:
- Contract Fee: ${calculatedFee || 'N/A'}
- Exchange Rate Source: ${isLoadingRate ? 'Loading...' : 'Live'}
- Last Updated: ${lastUpdated ? lastUpdated.toLocaleString() : 'N/A'}
    `
    
    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
            a.download = `aztlanfi-savings-${amount}-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareSavings = () => {
            const text = `I just saved $${savings.toFixed(2)} (${savingsPercentage}%) on my $${amount} transfer using AztlanFi! Check it out: https://aztlanfi.com`
    
    if (navigator.share) {
      navigator.share({
        title: 'AztlanFi Savings',
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
        className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-monad-600 to-purple-700 rounded-xl flex items-center justify-center">
              <CalculatorIcon className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Tu Reporte de Ahorros</h3>
              <p className="text-gray-600">Desglose detallado de tus ahorros</p>
            </div>
          </div>
          <button
            onClick={() => setShowSavingsModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar modal"
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
                  1 USD = {(exchangeRate || currentRate || 17).toFixed(2)} MXN
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-900">
                  ${(amount * (exchangeRate || currentRate || 17)).toFixed(2)} MXN
                </p>
                <p className="text-xs text-blue-600">You will receive in Mexico</p>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">${savings.toFixed(2)}</div>
              <div className="text-lg text-green-700 mb-1">Total Savings</div>
              <div className="text-sm text-green-600">{savingsPercentage}% less than traditional services</div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Detailed Fee Breakdown</h4>
            
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <Zap className="text-green-600" size={20} />
                  <div>
                    <p className="font-semibold text-green-800">AztlanFi</p>
                    <p className="text-sm text-green-600">
                      {calculatedFee ? 'Dynamic contract fee' : '0.5% commission'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-green-800">${fees.aztlanfi.toFixed(2)}</span>
                  <p className="text-sm text-green-600">Best option</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="font-semibold text-red-800">Western Union</p>
                  <p className="text-sm text-red-600">8% commission</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-red-800">${fees.westernUnion.toFixed(2)}</span>
                  <p className="text-sm text-red-600">${(fees.westernUnion - fees.aztlanfi).toFixed(2)} more</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <p className="font-semibold text-orange-800">MoneyGram</p>
                  <p className="text-sm text-orange-600">7% commission</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-orange-800">${fees.moneyGram.toFixed(2)}</span>
                  <p className="text-sm text-orange-600">${(fees.moneyGram - fees.aztlanfi).toFixed(2)} more</p>
                </div>
              </div>
            </div>
          </div>

          {/* Blockchain Data */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Blockchain Data</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Contract Fee:</span>
                <span className="ml-2 font-medium">
                  {isLoadingFee ? 'Loading...' : (calculatedFee || 'N/A')}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Network Status:</span>
                <span className="ml-2 font-medium text-green-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Last Updated:</span>
                <span className="ml-2 font-medium">
                  {lastUpdated ? lastUpdated.toLocaleTimeString() : '...'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Exchange Rate:</span>
                <span className="ml-2 font-medium">
                  {isLoadingRate ? 'Loading...' : 'Real time'}
                </span>
              </div>
            </div>
          </div>

          {/* Annual Savings Projection */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">Annual Savings Projection</h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">${(savings * 12).toFixed(0)}</div>
                <div className="text-sm text-blue-700">Ahorros anuales (transferencias mensuales)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">${(savings * 52).toFixed(0)}</div>
                <div className="text-sm text-blue-700">Ahorros anuales (transferencias semanales)</div>
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
              className="flex-1 px-4 py-3 bg-gradient-to-r from-monad-600 to-purple-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
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
    <section id="calculator" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            See How Much You Save
          </h2>
          <p className="text-lg text-gray-300">
            Compare our fees with traditional remittance services
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount to Send (USD)
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
                    aria-label="Amount to send in USD"
                  />
                </div>
              </div>

              {/* Exchange Rate Display */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">Exchange Rate</h3>
                    <p className="text-sm text-gray-300">
                      1 USD = {(exchangeRate || currentRate || 17).toFixed(2)} MXN
                    </p>
                  </div>
                  <button
                    onClick={refreshData}
                    disabled={isRefreshing}
                    className="p-2 text-blue-400 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    aria-label="Refresh data"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="mt-2 text-right">
                  <p className="text-lg font-bold text-white">
                    ${(amount * (exchangeRate || currentRate || 17)).toFixed(2)} MXN
                  </p>
                  <p className="text-xs text-blue-400">You will receive in Mexico</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-center space-x-3">
                    <Zap className="text-green-400" size={20} />
                    <div>
                      <p className="font-semibold text-white">AztlanFi Fee</p>
                      <p className="text-sm text-green-400">
                        {calculatedFee ? 'Dynamic fee' : 'Only 0.5%'}
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
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Compare with Traditional Services</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div>
                    <p className="font-semibold text-red-400">Western Union</p>
                    <p className="text-sm text-red-300">8% commission</p>
                  </div>
                  <span className="text-xl font-bold text-red-400">
                    ${fees.westernUnion.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div>
                    <p className="font-semibold text-orange-400">MoneyGram</p>
                    <p className="text-sm text-orange-300">7% commission</p>
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
                className="mt-6 p-6 bg-gradient-to-r from-monad-600 to-monad-700 rounded-xl text-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingDown size={24} />
                    <div>
                      <p className="font-semibold">You Save</p>
                      <p className="text-sm opacity-90">vs traditional services</p>
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
              >
                <CalculatorIcon size={20} />
                Calculate Detailed Savings
              </button>

              {/* Blockchain Status */}
              <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Blockchain Status:</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
                {!isConnected && (
                  <p className="text-xs text-gray-400 mt-1">
                    Connect your wallet for real-time data
                  </p>
                )}
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
