'use client'

import React, { useEffect, useState } from 'react'
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi'
import { motion } from 'framer-motion'
import { Wallet, LogOut, ChevronRight } from 'lucide-react'
import { monadTestnet } from '@/lib/web3/chains'

export function ReownWalletConnect() {
  const { address, isConnected, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const switchToMonadTestnet = async () => {
    try {
      // Try to switch using Wagmi's switchChain
      await switchChain({ chainId: monadTestnet.id })
    } catch (error: any) {
      console.log('Failed to switch chain with Wagmi, trying direct wallet call...')
      
      // Fallback: try to add the chain directly to the wallet
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${monadTestnet.id.toString(16)}`,
              chainName: monadTestnet.name,
              nativeCurrency: monadTestnet.nativeCurrency,
              rpcUrls: ['https://testnet-rpc.monad.xyz'],
              blockExplorerUrls: [monadTestnet.blockExplorers.default.url]
            }]
          })
        } catch (addError) {
          console.error('Failed to add Monad Testnet:', addError)
        }
      }
    }
  }

  const handleSwitchToMonad = async () => {
    if (chainId !== monadTestnet.id) {
      await switchToMonadTestnet()
    }
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <button
          disabled
          className="btn-primary-compact w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Cargando conexión de wallet"
        >
          <Wallet size={14} />
          <span className="hidden sm:inline">Cargando...</span>
          <span className="sm:hidden">...</span>
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {!isConnected ? (
        <div className="space-y-2 w-full">
          {/* Usar el web component de Reown AppKit con estilos responsive */}
          <div className="w-full reown-mobile-optimized">
            <appkit-button />
          </div>
          {/* Fallback button for accessibility */}
          <noscript>
            <button
              className="btn-primary-compact w-full sm:w-auto flex items-center justify-center gap-2"
              aria-label="Conectar wallet con Reown AppKit"
              disabled
            >
              <Wallet size={14} />
              <span className="hidden sm:inline">Conectar Wallet</span>
              <span className="sm:hidden">Conectar</span>
            </button>
          </noscript>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
          {chainId !== monadTestnet.id && (
            <button
              onClick={handleSwitchToMonad}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-3 sm:py-1.5 sm:px-2 rounded-lg transition-colors text-xs w-full sm:w-auto text-center"
              aria-label="Cambiar a red Monad Testnet"
            >
              <span className="hidden sm:inline">Monad</span>
              <span className="sm:hidden">Cambiar a Monad</span>
            </button>
          )}
          <button
            onClick={() => disconnect()}
            className="bg-monad-600 hover:bg-monad-700 text-white font-medium py-2 px-3 sm:py-1.5 sm:px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs w-full sm:w-auto"
            aria-label="Desconectar wallet"
          >
            <span className="hidden sm:inline">{address?.slice(0, 4)}...{address?.slice(-4)}</span>
            <span className="sm:hidden">Desconectar</span>
            <ChevronRight size={12} className="hidden sm:inline" />
          </button>
        </div>
      )}
    </motion.div>
  )
}
