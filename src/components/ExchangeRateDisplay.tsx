'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle } from 'lucide-react'
import { useExchangeRateOracle } from '@/lib/web3/useContracts'
import { useAccount } from 'wagmi'

export function ExchangeRateDisplay() {
  const { address, isConnected } = useAccount()
  const { currentRate: exchangeRate, isLoadingCurrentRate: isLoading } = useExchangeRateOracle()
  const formattedRate = exchangeRate.toFixed(2)
  const [previousRate, setPreviousRate] = useState(17.20)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setLastUpdated(new Date())
  }, [])

  const rateChange = exchangeRate - previousRate
  const rateChangePercent = (rateChange / previousRate) * 100
  const isPositive = rateChange >= 0

  // Actualizar previousRate cuando cambie el exchangeRate
  useEffect(() => {
    if (exchangeRate !== previousRate) {
      setPreviousRate(exchangeRate)
      setLastUpdated(new Date())
    }
  }, [exchangeRate, previousRate])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Exchange Rate
        </h3>
        <div className="flex items-center space-x-2">
          {!isConnected && (
            <div className="flex items-center text-orange-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              Connect wallet
            </div>
          )}
          <div className="text-xs text-gray-500">
            {lastUpdated ? lastUpdated.toLocaleTimeString() : '...'}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Main Rate Display */}
        <div className="text-center">
          {isLoading ? (
            <div className="text-3xl font-bold text-gray-900 mb-1">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto" />
            </div>
          ) : (
            <>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ${formattedRate}
              </div>
              <div className="text-sm text-gray-600">
                1 USD = {formattedRate} MXN
              </div>
            </>
          )}
        </div>

        {/* Rate Change */}
        <div className="flex items-center justify-center space-x-2">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )}
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{rateChange.toFixed(3)} ({rateChangePercent.toFixed(2)}%)
          </span>
        </div>

        {/* Rate Info */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Buy</div>
              <div className="font-semibold text-gray-900">
                ${(exchangeRate - 0.05).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Sell</div>
              <div className="font-semibold text-gray-900">
                ${(exchangeRate + 0.05).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-gray-500 text-center">
          Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : '...'}
        </div>

        {/* Rate Alert */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="text-sm text-yellow-800">
            <strong>Note:</strong> Exchange rate updates automatically every 30 seconds.
          </div>
        </div>
      </div>
    </motion.div>
  )
}
