'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ExternalLink,
  RefreshCw,
  DollarSign,
  Shield,
  Activity
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { getExplorerUrl } from '@/lib/web3/contracts'
import toast from 'react-hot-toast'

interface Transaction {
  id: string
  type: 'send' | 'receive'
  amount: string
  recipient?: string
  status: 'pending' | 'confirmed' | 'failed'
  hash?: string
  timestamp: Date
  fee?: string
  exchangeRate?: string
}

interface TransactionStatusProps {
  transactions?: Transaction[]
  onRefresh?: () => void
  isRefreshing?: boolean
}

export function TransactionStatus({ transactions = [], onRefresh, isRefreshing = false }: TransactionStatusProps) {
  const { address, isConnected } = useAccount()
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'failed'>('all')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredTransactions = transactions.filter(tx => 
    filter === 'all' ? true : tx.status === filter
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600 animate-pulse" />
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente'
      case 'confirmed':
        return 'Confirmado'
      case 'failed':
        return 'Fallido'
      default:
        return 'Desconocido'
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Hash copiado al portapapeles')
  }

  if (!mounted) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Cargando...
          </h3>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Conecta tu Wallet
          </h3>
          <p className="text-gray-600">
            Necesitas conectar tu wallet para ver el estado de transacciones
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-monad-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Estado de Transacciones
          </h2>
        </div>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="btn-secondary flex items-center gap-2"
          aria-label="Actualizar transacciones"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'all', label: 'Todas', count: transactions.length },
          { key: 'pending', label: 'Pendientes', count: transactions.filter(t => t.status === 'pending').length },
          { key: 'confirmed', label: 'Confirmadas', count: transactions.filter(t => t.status === 'confirmed').length },
          { key: 'failed', label: 'Fallidas', count: transactions.filter(t => t.status === 'failed').length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-white text-monad-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            <span className="ml-1 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredTransactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay transacciones
              </h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'Aún no has realizado transacciones'
                  : `No hay transacciones ${filter === 'pending' ? 'pendientes' : filter === 'confirmed' ? 'confirmadas' : 'fallidas'}`
                }
              </p>
            </motion.div>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Status Icon */}
                    <div className="mt-1">
                      {getStatusIcon(transaction.status)}
                    </div>

                    {/* Transaction Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {transaction.type === 'send' ? 'Envío' : 'Recepción'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {getStatusText(transaction.status)}
                        </span>
                      </div>
                      
                      <p className="text-lg font-bold text-gray-900 mb-1">
                        ${transaction.amount}
                      </p>
                      
                      {transaction.recipient && (
                        <p className="text-sm text-gray-600 mb-1">
                          Para: {transaction.recipient.slice(0, 6)}...{transaction.recipient.slice(-4)}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          {transaction.timestamp.toLocaleString()}
                        </span>
                        {transaction.fee && (
                          <span>Fee: ${transaction.fee}</span>
                        )}
                        {transaction.exchangeRate && (
                          <span>Tasa: {transaction.exchangeRate}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    {transaction.hash && (
                      <>
                        <button
                          onClick={() => copyToClipboard(transaction.hash!)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label="Copiar hash"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <a
                          href={`${getExplorerUrl(10143)}/tx/${transaction.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label="Ver en explorador"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {/* Progress Bar for Pending Transactions */}
                {transaction.status === 'pending' && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <motion.div
                        className="bg-yellow-500 h-1 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "60%" }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Confirmando en la blockchain...
                    </p>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Summary Stats */}
      {transactions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {transactions.filter(t => t.status === 'confirmed').length}
              </p>
              <p className="text-sm text-gray-600">Confirmadas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {transactions.filter(t => t.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Pendientes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {transactions.filter(t => t.status === 'failed').length}
              </p>
              <p className="text-sm text-gray-600">Fallidas</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
