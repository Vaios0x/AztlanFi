'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { QRCodeSVG } from 'qrcode.react'
import { Download, Share2, Copy, MessageCircle, DollarSign, Clock, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { Header } from '@/components/Header'
import { useRemittancePool, useComplianceModule, useIncentiveVault } from '@/lib/web3/useContracts'
import { getExplorerUrl } from '@/lib/web3/contracts'
import { formatEther, parseEther } from 'viem'
import toast from 'react-hot-toast'

interface PendingRemittance {
  id: string
  sender: string
  amount: string
  fee: string
  timestamp: number
  phoneHash: string
}

export default function ReceiveMoney() {
  const { isConnected, address } = useAccount()
  const [selectedMethod, setSelectedMethod] = useState('qr')
  const [amount, setAmount] = useState('')
  const [pendingRemittances, setPendingRemittances] = useState<PendingRemittance[]>([])
  const [isCompletingRemittance, setIsCompletingRemittance] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Hooks de contratos
  const { 
    userBalance, 
    isLoadingBalance,
    completeRemittance,
    isCompletingRemittance: isCompletingGlobal,
    isConfirmedComplete,
    completeRemittanceError
  } = useRemittancePool()
  
  const { userData, isLoadingUserData } = useComplianceModule()
  const { userStats, isLoadingUserStats } = useIncentiveVault()

  // Simular remesas pendientes (en producción esto vendría del contrato)
  useEffect(() => {
    if (address) {
      // Simular datos de remesas pendientes
      const mockPendingRemittances: PendingRemittance[] = [
        {
          id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          sender: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          amount: '250.00',
          fee: '1.25',
          timestamp: Date.now() - 120000, // 2 minutos atrás
          phoneHash: '0xabc123...'
        },
        {
          id: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          sender: '0x8ba1f109551bD432803012645Hac136c772c3e',
          amount: '180.00',
          fee: '0.90',
          timestamp: Date.now() - 240000, // 4 minutos atrás
          phoneHash: '0xdef456...'
        }
      ]
      setPendingRemittances(mockPendingRemittances)
    }
  }, [address])

  // Manejar completar remesa
  const handleCompleteRemittance = async (remittanceId: string) => {
    if (!address) {
      toast.error('Debes conectar tu wallet')
      return
    }

    setIsCompletingRemittance(remittanceId)
    
    try {
      completeRemittance(remittanceId)
      toast.success('Procesando remesa...')
    } catch (error) {
      console.error('Error al completar remesa:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      toast.error(`Error: ${errorMessage}`)
    } finally {
      setIsCompletingRemittance(null)
    }
  }

  // Copiar al portapapeles
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Copiado al portapapeles')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Error al copiar')
    }
  }

  // Descargar QR
  const downloadQR = () => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const link = document.createElement('a')
      link.download = 'remesaflash-qr.png'
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-monad-50 to-white">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card max-w-md text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Conecta tu Wallet
            </h2>
            <p className="text-gray-600 mb-6">
              Necesitas conectar tu wallet para recibir dinero
            </p>
            <button className="btn-primary">
              Conectar Wallet
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  const qrData = JSON.stringify({
    address: address,
    amount: amount,
    network: 'monad',
    timestamp: Date.now()
  })

  const shareLink = `https://remesaflash.com/receive?address=${address}&amount=${amount}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-monad-50 to-white">
      <Header />
      
      <div className="pt-20 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Recibir Dinero
            </h1>
            <p className="text-lg text-gray-600">
              Comparte tu código QR o enlace para recibir dinero instantáneamente
            </p>
          </motion.div>

          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-gradient-to-r from-monad-600 to-purple-700 text-white mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Balance Disponible</h3>
                <p className="text-2xl font-bold">
                  {isLoadingBalance ? (
                    <div className="animate-pulse">Cargando...</div>
                  ) : (
                    `$${parseFloat(userBalance || "0").toFixed(2)} USD`
                  )}
                </p>
              </div>
              <DollarSign className="w-12 h-12 opacity-80" />
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="opacity-80">KYC Level:</span>
                  <span className="ml-2 font-semibold">
                    {isLoadingUserData ? '...' : (userData as any)?.kycLevel || 0}
                  </span>
                </div>
                <div>
                  <span className="opacity-80">Total Transacciones:</span>
                  <span className="ml-2 font-semibold">
                    {isLoadingUserStats ? '...' : (userStats as any)?.totalTransactions || 0}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* QR Code Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card text-center"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Código QR
              </h2>

              <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300 mb-6">
                <QRCodeSVG
                  value={qrData}
                  size={200}
                  level="H"
                  includeMargin={true}
                  className="mx-auto"
                />
              </div>

              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <strong>Dirección:</strong> {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
                
                {amount && (
                  <div className="text-lg font-semibold text-monad-600">
                    ${amount} USD
                  </div>
                )}

                <div className="flex justify-center space-x-3">
                  <button 
                    onClick={downloadQR}
                    className="btn-secondary flex items-center space-x-2"
                    aria-label="Descargar código QR"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar QR</span>
                  </button>
                  <button 
                    onClick={() => copyToClipboard(shareLink)}
                    className="btn-primary flex items-center space-x-2"
                    aria-label="Compartir enlace"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Compartir</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Options Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Amount Input */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Cantidad (Opcional)
                </h3>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field"
                  aria-label="Cantidad opcional"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Deja vacío para recibir cualquier cantidad
                </p>
              </div>

              {/* Withdrawal Methods */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Métodos de Retiro
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">SP</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">SPEI</div>
                      <div className="text-sm text-gray-600">Transferencia bancaria</div>
                    </div>
                    <div className="text-sm text-green-600 font-medium">Gratis</div>
                  </div>

                  <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">CD</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">CoDi</div>
                      <div className="text-sm text-gray-600">Pago móvil</div>
                    </div>
                    <div className="text-sm text-green-600 font-medium">Gratis</div>
                  </div>

                  <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">OX</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">OXXO</div>
                      <div className="text-sm text-gray-600">Efectivo en tienda</div>
                    </div>
                    <div className="text-sm text-gray-600">$15 MXN</div>
                  </div>
                </div>
              </div>

              {/* Share Link */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Enlace de Pago
                </h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="input-field flex-1"
                    aria-label="Enlace de pago"
                  />
                  <button 
                    onClick={() => copyToClipboard(shareLink)}
                    className="btn-secondary px-4"
                    aria-label="Copiar enlace"
                  >
                    <Copy className={`w-4 h-4 ${copied ? 'text-green-600' : ''}`} />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Comparte este enlace para recibir pagos
                </p>
              </div>

              {/* WhatsApp Integration */}
              <div className="card bg-gradient-to-r from-green-600 to-green-700 text-white">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold">WhatsApp Bot</h3>
                    <p className="text-sm opacity-90">
                      Recibe notificaciones instantáneas
                    </p>
                  </div>
                </div>
                <button className="w-full mt-4 bg-white text-green-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                  Activar Notificaciones
                </button>
              </div>
            </motion.div>
          </div>

          {/* Pending Remittances */}
          {pendingRemittances.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12"
            >
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Remesas Pendientes
                </h3>
                <div className="space-y-4">
                  {pendingRemittances.map((remittance, index) => (
                    <div key={remittance.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-monad-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            ${remittance.amount}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            De: {remittance.sender.slice(0, 6)}...{remittance.sender.slice(-4)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(remittance.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">${remittance.amount}</div>
                        <div className="text-sm text-gray-600">Fee: ${remittance.fee}</div>
                        <button
                          onClick={() => handleCompleteRemittance(remittance.id)}
                          disabled={isCompletingRemittance === remittance.id || isCompletingGlobal}
                          className="mt-2 px-4 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                          aria-label="Completar remesa"
                        >
                          {isCompletingRemittance === remittance.id || isCompletingGlobal ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                              <span>Procesando...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              <span>Completar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Transacciones Recientes
              </h3>
              <div className="space-y-4">
                {[
                  { from: 'Juan P.', amount: '$500', time: 'Hace 2 min', status: 'completed' },
                  { from: 'María G.', amount: '$200', time: 'Hace 15 min', status: 'pending' },
                  { from: 'Carlos R.', amount: '$750', time: 'Hace 1 hora', status: 'completed' },
                ].map((tx, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-monad-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {tx.from.split(' ')[0][0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{tx.from}</div>
                        <div className="text-sm text-gray-600">{tx.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{tx.amount}</div>
                      <div className={`text-sm flex items-center ${
                        tx.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {tx.status === 'completed' ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completado
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            Pendiente
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
