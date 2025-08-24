'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Wallet } from 'lucide-react'
import { ReownWalletConnect } from './ReownWalletConnect'

interface MobileWalletConnectProps {
  className?: string
}

export function MobileWalletConnect({ className = '' }: MobileWalletConnectProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full ${className}`}
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Wallet size={16} className="text-monad-600" />
            <span className="text-sm font-medium text-gray-700">Conectar Wallet</span>
          </div>
        </div>
        
        <div className="w-full">
          <ReownWalletConnect />
        </div>
        
        <div className="mt-3 text-xs text-gray-500 text-center">
          Conecta tu wallet para acceder a todas las funciones
        </div>
      </div>
    </motion.div>
  )
}
