'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { ReownWalletConnect } from './web3/ReownWalletConnect'
import { useAccount } from 'wagmi'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentPath, setCurrentPath] = useState('/')
  const { isConnected } = useAccount()

  useEffect(() => {
    setMounted(true)
    setCurrentPath(window.location.pathname)
  }, [])

  const handleNavigation = (section: string) => {
    setIsMenuOpen(false)
    
         if (section === 'home') {
       // If we're on a different page than home, navigate to home
       if (currentPath !== '/') {
         window.location.href = '/'
       } else {
         window.scrollTo({ top: 0, behavior: 'smooth' })
       }
     } else if (section === 'pricing') {
       // Always navigate to the separate pricing page
       if (currentPath !== '/pricing') {
         window.location.href = '/pricing'
       } else {
         // If we're already on pricing, scroll to top
         window.scrollTo({ top: 0, behavior: 'smooth' })
       }
     } else if (section === 'about') {
       // Always navigate to the separate about page
       if (currentPath !== '/about') {
         window.location.href = '/about'
       } else {
         // If we're already on about, scroll to top
         window.scrollTo({ top: 0, behavior: 'smooth' })
       }
     } else if (section === 'dashboard') {
       // Always navigate to the separate dashboard page
       if (currentPath !== '/dashboard') {
         window.location.href = '/dashboard'
       } else {
         // If we're already on dashboard, scroll to top
         window.scrollTo({ top: 0, behavior: 'smooth' })
       }
     } else if (section === 'batch-operations') {
       // Navigate to batch operations
       if (currentPath !== '/batch-operations') {
         window.location.href = '/batch-operations'
       } else {
         window.scrollTo({ top: 0, behavior: 'smooth' })
       }
     } else if (section === 'advanced-queries') {
       // Navigate to advanced queries
       if (currentPath !== '/advanced-queries') {
         window.location.href = '/advanced-queries'
       } else {
         window.scrollTo({ top: 0, behavior: 'smooth' })
       }
     } else if (section === 'reports') {
       // Navigate to reports
       if (currentPath !== '/reports') {
         window.location.href = '/reports'
       } else {
         window.scrollTo({ top: 0, behavior: 'smooth' })
       }
     } else if (section === 'contact') {
       // Always navigate to the separate contact page
       if (currentPath !== '/contact') {
         window.location.href = '/contact'
       } else {
         // If we're already on contact, scroll to top
         window.scrollTo({ top: 0, behavior: 'smooth' })
       }
     }
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-monad-600 to-monad-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AF</span>
              </div>
              <span className="text-xl font-bold text-gray-900">AztlanFi</span>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 cursor-pointer"
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
            <div className="w-8 h-8 bg-gradient-to-br from-monad-600 to-monad-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AF</span>
            </div>
            <span className="text-xl font-bold text-gray-900">AztlanFi</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavigation('home')}
              className="text-gray-600 hover:text-monad-600 transition-colors focus:outline-none focus:ring-2 focus:ring-monad-500 focus:ring-offset-2 rounded px-2 py-1"
              aria-label="Go to home page"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigation('pricing')}
              className="text-gray-600 hover:text-monad-600 transition-colors focus:outline-none focus:ring-2 focus:ring-monad-500 focus:ring-offset-2 rounded px-2 py-1"
              aria-label="Go to pricing section"
            >
              Pricing
            </button>
            {isConnected && (
              <>
                <button 
                  onClick={() => handleNavigation('dashboard')}
                  className="text-gray-600 hover:text-monad-600 transition-colors focus:outline-none focus:ring-2 focus:ring-monad-500 focus:ring-offset-2 rounded px-2 py-1"
                  aria-label="Go to dashboard"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => handleNavigation('batch-operations')}
                  className="text-gray-600 hover:text-monad-600 transition-colors focus:outline-none focus:ring-2 focus:ring-monad-500 focus:ring-offset-2 rounded px-2 py-1"
                  aria-label="Go to batch operations"
                >
                  Batch Operations
                </button>
                <button 
                  onClick={() => handleNavigation('advanced-queries')}
                  className="text-gray-600 hover:text-monad-600 transition-colors focus:outline-none focus:ring-2 focus:ring-monad-500 focus:ring-offset-2 rounded px-2 py-1"
                  aria-label="Go to advanced queries"
                >
                  Advanced Queries
                </button>
                <button 
                  onClick={() => handleNavigation('reports')}
                  className="text-gray-600 hover:text-monad-600 transition-colors focus:outline-none focus:ring-2 focus:ring-monad-500 focus:ring-offset-2 rounded px-2 py-1"
                  aria-label="Go to reports"
                >
                  Reports
                </button>
              </>
            )}
            <button 
              onClick={() => handleNavigation('about')}
              className="text-gray-600 hover:text-monad-600 transition-colors focus:outline-none focus:ring-2 focus:ring-monad-500 focus:ring-offset-2 rounded px-2 py-1"
              aria-label="Go to about page"
            >
              About
            </button>
            <button 
              onClick={() => handleNavigation('contact')}
              className="text-gray-600 hover:text-monad-600 transition-colors focus:outline-none focus:ring-2 focus:ring-monad-500 focus:ring-offset-2 rounded px-2 py-1"
              aria-label="Go to contact page"
            >
              Contact
            </button>
          </nav>

          {/* Wallet Connect */}
          <div className="hidden md:block">
            <ReownWalletConnect />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100"
            >
              <nav className="py-4 space-y-4">
                <button 
                  onClick={() => handleNavigation('home')}
                  className="block w-full text-left text-gray-600 hover:text-monad-600 transition-colors focus:outline-none focus:ring-2 focus:ring-monad-500 focus:ring-offset-2 rounded px-2 py-1"
                  aria-label="Go to home page"
                >
                  Home
                </button>
                <button 
                  onClick={() => handleNavigation('pricing')}
                  className="block w-full text-left text-gray-600 hover:text-monad-600 transition-colors focus:outline-none focus:ring-2 focus:ring-monad-500 focus:ring-offset-2 rounded px-2 py-1"
                  aria-label="Go to pricing section"
                >
                  Pricing
                </button>
                {isConnected && (
                  <>
                    <button 
                      onClick={() => handleNavigation('dashboard')}
                      className="block w-full text-left text-gray-600 hover:text-monad-600 transition-colors focus:outline-none focus:ring-2 focus:ring-monad-500 focus:ring-offset-2 rounded px-2 py-1"
                      aria-label="Go to dashboard"
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => handleNavigation('batch-operations')}
                      className="block w-full text-left text-gray-600 hover:text-monad-600 transition-colors focus:outline-none focus:ring-2 focus:ring-monad-500 focus:ring-offset-2 rounded px-2 py-1"
                      aria-label="Go to batch operations"
                    >
                      Batch Operations
                    </button>
                    <button 
                      onClick={() => handleNavigation('advanced-queries')}
                      className="block w-full text-left text-gray-600 hover:text-monad-600 transition-colors focus:outline-none focus:ring-2 focus:ring-monad-500 focus:ring-offset-2 rounded px-2 py-1"
                      aria-label="Go to advanced queries"
                    >
                      Advanced Queries
                    </button>
                    <button 
                      onClick={() => handleNavigation('reports')}
                      className="block w-full text-left text-gray-600 hover:text-monad-600 transition-colors focus:outline-none focus:ring-2 focus:ring-monad-500 focus:ring-offset-2 rounded px-2 py-1"
                      aria-label="Go to reports"
                    >
                      Reports
                    </button>
                  </>
                )}
                <button 
                  onClick={() => handleNavigation('about')}
                  className="block w-full text-left text-gray-600 hover:text-monad-600 transition-colors focus:outline-none focus:ring-2 focus:ring-monad-500 focus:ring-offset-2 rounded px-2 py-1"
                  aria-label="Go to about page"
                >
                  About
                </button>
                <button 
                  onClick={() => handleNavigation('contact')}
                  className="block w-full text-left text-gray-600 hover:text-monad-600 transition-colors focus:outline-none focus:ring-2 focus:ring-monad-500 focus:ring-offset-2 rounded px-2 py-1"
                  aria-label="Go to contact page"
                >
                  Contact
                </button>
                <div className="pt-4">
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
