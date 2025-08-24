'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap, Activity, Home, DollarSign, BarChart3, FileText, Target, Download } from 'lucide-react'
import { ReownWalletConnect } from './web3/ReownWalletConnect'
import { MobileWalletConnect } from './web3/MobileWalletConnect'
import { ConnectionStatus } from './web3/ContractConnection'
import { useAccount } from 'wagmi'
import Link from 'next/link'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentPath, setCurrentPath] = useState('/')
  const [networkStatus, setNetworkStatus] = useState({
    isOnline: true,
    tps: 8000,
    gasPrice: 20,
    lastBlock: 1000000
  })
  const [showPWAInstall, setShowPWAInstall] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const { isConnected } = useAccount()

  useEffect(() => {
    setMounted(true)
    setCurrentPath(window.location.pathname)
    
    // PWA Install functionality
    const handleBeforeInstallPrompt = (e: any) => {
      console.log('PWA install prompt detected')
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPWAInstall(true)
    }

    const handleAppInstalled = () => {
      console.log('PWA installed')
      setShowPWAInstall(false)
      setDeferredPrompt(null)
    }

    // Check if PWA is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isInstalled = isStandalone
    console.log('Is standalone mode:', isStandalone)
    console.log('Is installed:', isInstalled)
    
    // Forzar mostrar el botón PWA en desarrollo
    console.log('Development mode: Forcing PWA button to show')
    setShowPWAInstall(true)
    
    // Agregar un indicador visual en la consola
    console.log('🚀 PWA Button should be visible now!')
    console.log('Look for: 🚀 PWA (Dev) button in the header')
    
    // También verificar criterios para producción (pero no bloquear en desarrollo)
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost'
    const hasManifest = document.querySelector('link[rel="manifest"]') !== null
    const hasServiceWorker = 'serviceWorker' in navigator
    
    console.log('PWA Criteria:', { isSecure, hasManifest, hasServiceWorker })
    
    if (!isLocalhost && isSecure && hasManifest && hasServiceWorker && !isInstalled) {
      console.log('Production criteria met: PWA button should show')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    
    // En el futuro, aquí se conectarían a APIs reales de Monad para obtener estadísticas en tiempo real
    // Por ahora, mantenemos valores estáticos
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
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

  const handlePWAInstall = async () => {
    console.log('PWA install button clicked')
    console.log('Deferred prompt available:', !!deferredPrompt)
    
    if (deferredPrompt) {
      try {
        // Use the deferred prompt if available
        console.log('Triggering PWA install prompt...')
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        console.log('PWA install outcome:', outcome)
        
        if (outcome === 'accepted') {
          console.log('PWA installed successfully')
          alert('¡AztlanFi se ha instalado correctamente! Ahora puedes acceder desde tu pantalla de inicio.')
        } else {
          console.log('PWA install was dismissed')
        }
        
        setDeferredPrompt(null)
        setShowPWAInstall(false)
      } catch (error) {
        console.error('Error during PWA installation:', error)
        alert('Error al instalar la PWA. Por favor, intenta manualmente.')
      }
    } else {
      // Fallback: show instructions for manual installation
      console.log('Manual PWA installation instructions')
      const instructions = `
Para instalar AztlanFi como PWA:

📱 Chrome/Edge:
• Haz clic en el ícono de instalación (📱) en la barra de direcciones
• O ve al menú (⋮) → "Instalar aplicación"

📱 Safari (iOS):
• Toca el botón compartir (📤)
• Selecciona "Agregar a pantalla de inicio"

📱 Firefox:
• Ve al menú (☰) → "Instalar aplicación"

📱 Otros navegadores:
• Busca la opción "Instalar aplicación" en el menú
      `
      alert(instructions)
    }
  }

  const navigationItems = [
    { id: 'home', label: 'Home', path: '/', icon: Home },
    { id: 'pricing', label: 'Pricing', path: '/pricing', icon: DollarSign },
    ...(isConnected ? [
      { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
      { id: 'reports', label: 'Reports', path: '/reports', icon: FileText }
    ] : [])
  ]

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <header className="bg-gradient-to-r from-white/95 via-blue-50/95 to-purple-50/95 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-monad-600 via-purple-600 to-monad-700 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-white font-bold text-sm">AF</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-monad-600 to-purple-600 bg-clip-text text-transparent">
                AztlanFi
              </span>
            </div>
            <div className="hidden md:block">
              <div className="w-40 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-gradient-to-r from-white/95 via-blue-50/95 to-purple-50/95 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavigation('home')}
            role="button"
            tabIndex={0}
            aria-label="Go to homepage"
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

          {/* Desktop Navigation & Demo */}
          <div className="hidden md:flex items-center space-x-3">
            <nav className="flex items-center space-x-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`relative px-3 py-2 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-monad-500 focus:ring-offset-2 flex items-center space-x-2 ${
                      currentPath === item.path
                        ? 'bg-gradient-to-r from-monad-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:text-monad-600 hover:bg-white/60 hover:shadow-md'
                    }`}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Go to ${item.label}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {currentPath === item.path && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-monad-600 to-purple-600 rounded-lg -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </nav>

            {/* Demo Button */}
            <Link 
              href="/demo" 
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-300"
              aria-label="View demonstration"
            >
              <Target className="w-4 h-4" />
              <span>Demo</span>
            </Link>

            {/* PWA Install Button */}
            {showPWAInstall && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handlePWAInstall}
                className="flex items-center space-x-1 px-2 py-1.5 rounded-lg text-white text-xs font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all duration-300 border border-orange-400"
                aria-label="Install PWA"
              >
                <Download className="w-3 h-3" />
                <span>🚀 PWA</span>
              </motion.button>
            )}
          </div>

          {/* Network Status & Wallet Connect - Compact Layout */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Compact Network Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-1.5 bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1 shadow-md border border-white/20"
            >
              <div className={`w-1.5 h-1.5 rounded-full ${networkStatus.isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-xs font-medium text-gray-700">Monad</span>
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <Zap className="w-2.5 h-2.5" />
                <span>{Math.round(networkStatus.tps / 1000)}K</span>
              </div>
            </motion.div>

            {/* Compact Contract Connection Status */}
            {isConnected && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1 shadow-md border border-white/20"
              >
                <ConnectionStatus />
              </motion.div>
            )}

            {/* Compact Wallet Connect */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-shrink-0 min-w-0"
            >
              <ReownWalletConnect />
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-white shadow-md border border-white/20 transition-all duration-300"
            aria-label="Open mobile menu"
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
                  <X size={20} className="text-gray-700" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={20} className="text-gray-700" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                onClick={() => setIsMenuOpen(false)}
              />
              
              {/* Menu */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/20 bg-white/95 backdrop-blur-xl max-h-[80vh] overflow-y-auto relative z-50"
            >
              <div className="p-4">
                {/* Mobile Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-monad-600 via-purple-600 to-monad-700 rounded-lg flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs">AF</span>
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-gray-900 via-monad-600 to-purple-600 bg-clip-text text-transparent">
                      AztlanFi
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={16} className="text-gray-600" />
                  </button>
                </div>

                {/* Navigation Items */}
                <nav className="space-y-1 mb-4">
                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => handleNavigation(item.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-monad-500 focus:ring-offset-2 flex items-center space-x-3 ${
                          currentPath === item.path
                            ? 'bg-gradient-to-r from-monad-600 to-purple-600 text-white shadow-lg'
                            : 'text-gray-700 hover:text-monad-600 hover:bg-gray-50'
                        }`}
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.98 }}
                        aria-label={`Go to ${item.label}`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                      </motion.button>
                    )
                  })}
                </nav>

                {/* Action Buttons */}
                <div className="space-y-2 mb-4">
                  <Link 
                    href="/demo"
                    className="w-full text-left px-3 py-2.5 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-3"
                    aria-label="View demonstration"
                  >
                    <Target className="w-4 h-4" />
                    <span className="text-sm">Demo</span>
                  </Link>

                                     {showPWAInstall && (
                     <motion.button
                       onClick={handlePWAInstall}
                       className="w-full text-left px-3 py-2 rounded-lg font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-2 border border-orange-400"
                       aria-label="Install PWA"
                     >
                       <Download className="w-4 h-4" />
                       <span className="text-sm">🚀 PWA</span>
                     </motion.button>
                   )}
                </div>

                {/* Status Section */}
                <div className="space-y-3">
                  {/* Network Status */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${networkStatus.isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-sm font-medium text-gray-700">Monad Network</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-600">
                        <Zap className="w-3 h-3" />
                        <span>{Math.round(networkStatus.tps / 1000)}K TPS</span>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Connect */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <MobileWalletConnect />
                  </div>
                </div>
              </div>
            </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
