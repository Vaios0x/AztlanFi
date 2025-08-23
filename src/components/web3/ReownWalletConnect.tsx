'use client'

import React, { useEffect, useState } from 'react'
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi'
import { motion } from 'framer-motion'
import { Wallet, LogOut } from 'lucide-react'
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
      >
        <button
          disabled
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Cargando conexión de wallet"
        >
          <Wallet size={16} />
          Cargando...
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {!isConnected ? (
        <div className="space-y-2">
          {/* Usar el web component de Reown AppKit */}
          <appkit-button 
            className="btn-primary flex items-center gap-2"
            aria-label="Conectar wallet con Reown AppKit"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {chainId !== monadTestnet.id && (
            <button
              onClick={handleSwitchToMonad}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
              aria-label="Cambiar a red Monad Testnet"
            >
              Cambiar a Monad
            </button>
          )}
          <div className="bg-gray-100 text-gray-700 font-medium py-2 px-3 rounded-lg">
            {chainId === monadTestnet.id ? 'Monad Testnet' : 'Red Incorrecta'}
          </div>
          <button
            onClick={() => disconnect()}
            className="bg-monad-600 hover:bg-monad-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
            aria-label="Desconectar wallet"
          >
            <LogOut size={16} />
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </button>
        </div>
      )}
    </motion.div>
  )
}
