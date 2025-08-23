'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { useRemittancePool, useRemittanceToken, useExchangeRateOracle } from '@/lib/web3/useContracts'
import { getExplorerUrl } from '@/lib/web3/contracts'
import { 
  Send, 
  Download, 
  DollarSign, 
  Coins, 
  ExternalLink, 
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

export function ContractTester() {
  const { address, isConnected } = useAccount()
  const { 
    exchangeRate, 
    isLoadingRate, 
    createRemittance, 
    isCreatingRemittance
  } = useRemittancePool()
  
  const { 
    tokenBalance, 
    totalSupply, 
    isLoadingTokenBalance 
  } = useRemittanceToken()
  
  const { currentRate: oracleRate, isLoadingCurrentRate } = useExchangeRateOracle()
  
  const [testAmount, setTestAmount] = useState('0.01')
  const [testReceiver, setTestReceiver] = useState('')

  const handleCreateRemittance = () => {
    if (!isConnected || !address) {
      toast.error('Conecta tu wallet primero')
      return
    }
    
    if (!testReceiver) {
      toast.error('Ingresa una dirección de destinatario')
      return
    }
    
    if (parseFloat(testAmount) <= 0) {
      toast.error('El monto debe ser mayor a 0')
      return
    }

    try {
      createRemittance(testReceiver, testAmount, 'test-phone-hash')
      toast.success('Remesa creada! Revisa la transacción en el explorador.')
    } catch (error) {
      console.error('Error al crear remesa:', error)
      toast.error('Error al crear remesa')
    }
  }

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-orange-50 border-orange-200"
      >
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-orange-600" />
          <div>
            <h3 className="font-semibold text-orange-900">
              Conecta tu Wallet
            </h3>
            <p className="text-sm text-orange-700">
              Necesitas conectar tu wallet para probar los contratos
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Contract Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Estado de Contratos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Exchange Rate */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Tasa de Cambio</span>
            </div>
            {isLoadingCurrentRate ? (
              <div className="flex items-center">
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                <span className="text-sm text-blue-700">Cargando...</span>
              </div>
            ) : (
              <div className="text-2xl font-bold text-blue-900">
                ${oracleRate?.toFixed(2) || '17.00'}
              </div>
            )}
            <div className="text-xs text-blue-600">USD/MXN</div>
          </div>

          {/* Token Balance */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Coins className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-900">RFLASH Tokens</span>
            </div>
            {isLoadingTokenBalance ? (
              <div className="flex items-center">
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                <span className="text-sm text-green-700">Cargando...</span>
              </div>
            ) : (
              <div className="text-2xl font-bold text-green-900">
                {parseFloat(tokenBalance).toFixed(2)}
              </div>
            )}
            <div className="text-xs text-green-600">Tu balance</div>
          </div>

          {/* Total Supply */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Coins className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-900">Supply Total</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {parseFloat(totalSupply).toLocaleString()}
            </div>
            <div className="text-xs text-purple-600">RFLASH tokens</div>
          </div>
        </div>
      </motion.div>

      {/* Test Functions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Probar Funciones
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Remittance */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Send className="w-5 h-5 mr-2" />
              Crear Remesa
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destinatario (Address)
              </label>
              <input
                type="text"
                value={testReceiver}
                onChange={(e) => setTestReceiver(e.target.value)}
                placeholder="0x..."
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto (ETH)
              </label>
              <input
                type="number"
                value={testAmount}
                onChange={(e) => setTestAmount(e.target.value)}
                placeholder="0.01"
                step="0.001"
                min="0.001"
                className="input-field"
              />
            </div>

            <button
              onClick={handleCreateRemittance}
              disabled={isCreatingRemittance || !testReceiver || !testAmount}
              className="w-full btn-primary disabled:opacity-50"
            >
              {isCreatingRemittance ? (
                <div className="flex items-center">
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Creando...
                </div>
              ) : (
                'Crear Remesa'
              )}
            </button>


          </div>


        </div>
      </motion.div>

      {/* Contract Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card bg-gray-50"
      >
        <h3 className="font-semibold text-gray-900 mb-4">
          Enlaces de Contratos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <a
            href={`${getExplorerUrl(10143)}/address/0x138ad2d0d48070dffD6C6DaeaEbADc483CbeE29a`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            RemittancePool
          </a>
          <a
            href={`${getExplorerUrl(10143)}/address/0x2e2e47ab692b8A29c16a38bca3A8523fA520853b`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            RemittanceToken
          </a>
          <a
            href={`${getExplorerUrl(10143)}/address/0xFFdCc99Cc7A9DE930716e3fB4a1b153caa740AfC`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            ExchangeRateOracle
          </a>
          <a
            href={`${getExplorerUrl(10143)}/address/0x025434d9Cd4c77F7acC24f8DF90F07b425eFA953`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            ComplianceModule
          </a>
        </div>
      </motion.div>
    </div>
  )
}
