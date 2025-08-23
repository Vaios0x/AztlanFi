'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap, Shield, Activity, Wifi, Battery } from 'lucide-react'
import { ReownWalletConnect } from './web3/ReownWalletConnect'
import { useAccount } from 'wagmi'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentPath, setCurrentPath] = useState('/')
  const [networkStatus, setNetworkStatus] = useState({
    isOnline: true,
    tps: 8247,
    gasPrice: 23,
    lastBlock: 1247892
  })
  const { isConnected } = useAccount()

  useEffect(() => {
    setMounted(true)
    setCurrentPath(window.location.pathname)
    
    // Simular actualizaciones de estado de red
    const interval = setInterval(() => {
      setNetworkStatus(prev => ({
        ...prev,
        tps: Math.floor(Math.random() * 2000) + 7000,
        gasPrice: Math.floor(Math.random() * 20) + 15,
        lastBlock: prev.lastBlock + Math.floor(Math.random() * 10) + 1
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleNavigation = (section: string) => {
    setIsMenuOpen(false)
    
    if (section === 'home') {
      if (currentPath !== '/') {
        window.location.href = '/'
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else if (section === 'pricing') {
      if (currentPath !== '/pricing') {
        window.location.href = '/pricing'
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else if (section === 'about') {
      if (currentPath !== '/about') {
        window.location.href = '/about'
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else if (section === 'dashboard') {
      if (currentPath !== '/dashboard') {
        window.location.href = '/dashboard'
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else if (section === 'reports') {
      if (currentPath !== '/reports') {
        window.location.href = '/reports'
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else if (section === 'contact') {
      if (currentPath !== '/contact') {
        window.location.href = '/contact'
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <header className="bg-gradient-to-r from-white/95 via-blue-50/95 to-purple-50/95 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-monad-600 via-purple-600 to-monad-700 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-white font-bold text-sm">AF</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-monad-600 to-purple-600 bg-clip-text text-transparent">
                AztlanFi
              </span>
            </div>
            <div className="hidden md:block">
              <div className="w-40 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-gradient-to-r from-white/95 via-blue-50/95 to-purple-50/95 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavigation('home')}
            role="button"
            tabIndex={0}
            aria-label="Go to home page"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleNavigation('home')
              }
            }}
          >
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-monad-600 via-purple-600 to-monad-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110"
              whileHover={{ rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white font-bold text-sm">AF</span>
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-monad-600 to-purple-600 bg-clip-text text-transparent group-hover:from-monad-600 group-hover:to-purple-600 transition-all duration-300">
              AztlanFi
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {[
              { id: 'home', label: 'Home', path: '/' },
              { id: 'pricing', label: 'Pricing', path: '/pricing' },
              ...(isConnected ? [
                { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
                { id: 'reports', label: 'Reports', path: '/reports' }
              ] : [])
            ].map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-monad-500 focus:ring-offset-2 ${
                  currentPath === item.path
                    ? 'bg-gradient-to-r from-monad-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:text-monad-600 hover:bg-white/50 hover:shadow-md'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
                {currentPath === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-monad-600 to-purple-600 rounded-xl -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Network Status & Wallet Connect */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Network Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-md border border-white/20"
            >
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${networkStatus.isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-sm font-medium text-gray-700">Monad</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <Zap className="w-3 h-3" />
                <span>{networkStatus.tps.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <Activity className="w-3 h-3" />
                <span>{networkStatus.gasPrice} Gwei</span>
              </div>
            </motion.div>

            {/* Wallet Connect */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ReownWalletConnect />
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 rounded-xl bg-white/80 backdrop-blur-sm hover:bg-white shadow-md border border-white/20 transition-all duration-300"
            aria-label="Toggle mobile menu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} className="text-gray-700" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} className="text-gray-700" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/20 bg-white/95 backdrop-blur-xl"
            >
              <nav className="py-6 space-y-3">
                {[
                  { id: 'home', label: 'Home', path: '/' },
                  { id: 'pricing', label: 'Pricing', path: '/pricing' },
                  ...(isConnected ? [
                    { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
                    { id: 'reports', label: 'Reports', path: '/reports' }
                  ] : [])
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`block w-full text-left px-6 py-4 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-monad-500 focus:ring-offset-2 ${
                      currentPath === item.path
                        ? 'bg-gradient-to-r from-monad-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:text-monad-600 hover:bg-white/50 hover:shadow-md'
                    }`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
                
                {/* Mobile Network Status */}
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-md border border-white/20">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${networkStatus.isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                      <span className="text-sm font-medium text-gray-700">Monad Network</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Zap className="w-3 h-3" />
                      <span>{networkStatus.tps.toLocaleString()} TPS</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Wallet Connect */}
                <div className="px-6">
                  <ReownWalletConnect />
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
