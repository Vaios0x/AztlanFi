'use client'

import React from 'react'
import { useAccount, useBalance, useReadContract } from 'wagmi'
import { motion } from 'framer-motion'
import { Wallet, Coins, Activity } from 'lucide-react'

export function ReownHooksDemo() {
  const { address, isConnected, chainId } = useAccount()
  
  // Ejemplo de uso de balance (esto funcionará cuando tengas tokens en Monad)
  const { data: balance } = useBalance({
    address,
    chainId: 10143, // Monad Testnet
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Activity size={20} />
        Wallet Status (Reown AppKit)
      </h3>
      
      {!isConnected ? (
        <div className="text-center py-8">
          <Wallet size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Connect your wallet to view status</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Connection Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Address:</span>
                <span className="font-mono text-gray-900">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Network:</span>
                <span className="font-medium text-gray-900">
                  {chainId === 10143 ? 'Monad Testnet' : `Chain ID: ${chainId}`}
                </span>
              </div>
            </div>
          </div>
          
          {balance && (
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Coins size={16} />
                Balance
              </h4>
              <div className="text-2xl font-bold text-green-600">
                {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
              </div>
            </div>
          )}
          
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Reown AppKit Features</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Multi-wallet connection (WalletConnect, MetaMask, etc.)</li>
              <li>• Support for multiple networks</li>
              <li>• Unified and modern interface</li>
              <li>• Native integration with Wagmi v2</li>
              <li>• Support for SSR and PWA</li>
            </ul>
          </div>
        </div>
      )}
    </motion.div>
  )
}
