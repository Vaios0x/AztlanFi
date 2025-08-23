'use client'

import React, { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { motion } from 'framer-motion'
import { Wallet, LogOut } from 'lucide-react'
import { monadTestnet } from '@/lib/web3/chains'

export function WalletConnect() {
  const { address, isConnected, chainId } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const [isReownAvailable, setIsReownAvailable] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [availableWallets, setAvailableWallets] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Check for available wallets only after mounting
    if (mounted && typeof window !== 'undefined') {
      const wallets = []
      
      // Check for Reown
      if ('reown' in window) {
        wallets.push('Reown')
        setIsReownAvailable(true)
      }
      
      // Check for MetaMask
      if ('ethereum' in window) {
        wallets.push('MetaMask/Injected')
      }
      
      // Check for other wallets
      if ('phantom' in window) wallets.push('Phantom')
      if ('solana' in window) wallets.push('Solana')
      
      setAvailableWallets(wallets)
      
      console.log('Available wallets:', wallets)
      console.log('Window ethereum:', window.ethereum)
      console.log('Connectors:', connectors.map(c => ({ 
        id: c.id, 
        name: c.name, 
        ready: c.ready,
        type: c.type 
      })))
    }
  }, [connectors, mounted])

  const handleConnect = async () => {
    if (isConnecting) return
    
    setIsConnecting(true)
    console.log('Starting connection process...')
    console.log('Available connectors:', connectors)
    
    try {
      // Try to find a ready connector
      let availableConnector = connectors.find(c => c.ready)
      
      // If no ready connector, try to find any connector
      if (!availableConnector) {
        availableConnector = connectors[0]
        console.log('No ready connector found, using first available:', availableConnector)
      }
      
      if (!availableConnector) {
        console.error('No connectors available')
        alert(`No wallet found. Available wallets detected: ${availableWallets.join(', ') || 'None'}. Please install MetaMask or Reown extension.`)
        return
      }

      console.log('Connecting with connector:', availableConnector.name, availableConnector.id)
      
      // Connect with the available connector
      await connect({ connector: availableConnector })
      
      // After successful connection, try to switch to Monad Testnet
      setTimeout(async () => {
        try {
          await switchToMonadTestnet()
        } catch (error) {
          console.error('Failed to switch to Monad Testnet:', error)
        }
      }, 1000)
      
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      alert(`Failed to connect wallet: ${errorMessage}. Please try again.`)
    } finally {
      setIsConnecting(false)
    }
  }

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
        >
          <Wallet size={16} />
          Loading...
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
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            data-wallet-connect
            id="wallet-connect"
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wallet size={16} />
            {isConnecting ? 'Connecting...' : (isReownAvailable ? 'Connect Reown' : 'Connect Wallet')}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {chainId !== monadTestnet.id && (
            <button
              onClick={handleSwitchToMonad}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
            >
              Switch to Monad
            </button>
          )}
          <div className="bg-gray-100 text-gray-700 font-medium py-2 px-3 rounded-lg">
            {chainId === monadTestnet.id ? 'Monad Testnet' : 'Wrong Network'}
          </div>
          <button
            onClick={() => disconnect()}
            className="bg-monad-600 hover:bg-monad-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            <LogOut size={16} />
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </button>
        </div>
      )}
    </motion.div>
  )
}
