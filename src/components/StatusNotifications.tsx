'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X, 
  TrendingUp,
  Shield,
  Star,
  DollarSign,
  Activity,
  Bell,
  BellOff
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { useRemittancePool, useComplianceModule, useIncentiveVault, useRemittanceToken } from '@/lib/web3/useContracts'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  title: string
  message: string
  icon: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  timestamp: Date
}

export function StatusNotifications() {
  const { address, isConnected } = useAccount()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [mounted, setMounted] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true)

  // Hooks para obtener datos on-chain
  const { 
    userBalance, 
    calculatedRewards,
    isLoadingBalance,
    isLoadingRewards 
  } = useRemittancePool()
  
  const { 
    userData, 
    isLoadingUserData 
  } = useComplianceModule()
  
  const { 
    userStats, 
    userRewards,
    isLoadingUserStats,
    isLoadingUserRewards
  } = useIncentiveVault()
  
  const { 
    tokenBalance,
    isLoadingTokenBalance
  } = useRemittanceToken()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isConnected || !mounted || !isNotificationsEnabled) return

    const newNotifications: Notification[] = []

    // Verificar KYC status
    if (!isLoadingUserData && userData && typeof userData === 'object' && 'kycLevel' in userData) {
      const kycLevel = (userData as any).kycLevel || 0
      if (kycLevel === 0) {
        newNotifications.push({
          id: 'kyc-unverified',
          type: 'warning',
          title: 'KYC Required',
          message: 'Complete your KYC verification to unlock higher transfer limits',
          icon: <Shield className="w-5 h-5" />,
          action: {
            label: 'Verify Now',
            onClick: () => window.location.href = '/admin'
          },
          timestamp: new Date()
        })
      } else if (kycLevel === 1) {
        newNotifications.push({
          id: 'kyc-basic',
          type: 'info',
          title: 'KYC Basic',
          message: 'Upgrade to Verified KYC for higher limits and better rates',
          icon: <Shield className="w-5 h-5" />,
          action: {
            label: 'Upgrade',
            onClick: () => window.location.href = '/admin'
          },
          timestamp: new Date()
        })
      }
    }

    // Verificar recompensas disponibles
    if (!isLoadingRewards && calculatedRewards && parseFloat(calculatedRewards) > 0) {
      newNotifications.push({
        id: 'rewards-available',
        type: 'success',
        title: 'Rewards Available',
        message: `You have ${calculatedRewards} MON rewards ready to claim`,
        icon: <Star className="w-5 h-5" />,
        action: {
          label: 'Claim Now',
          onClick: () => window.location.href = '/admin'
        },
        timestamp: new Date()
      })
    }

    // Verificar balance bajo
    if (!isLoadingBalance && userBalance && parseFloat(userBalance) < 0.1) {
      newNotifications.push({
        id: 'low-balance',
        type: 'warning',
        title: 'Low Balance',
        message: 'Your wallet balance is low. Consider adding funds for transactions',
        icon: <DollarSign className="w-5 h-5" />,
        action: {
          label: 'Add Funds',
          onClick: () => window.location.href = '/dashboard'
        },
        timestamp: new Date()
      })
    }

    // Verificar tokens RFLASH
    if (!isLoadingTokenBalance && tokenBalance && parseFloat(tokenBalance) > 0) {
      newNotifications.push({
        id: 'rflash-tokens',
        type: 'info',
        title: 'RFLASH Tokens',
        message: `You have ${tokenBalance} RFLASH tokens from rewards`,
        icon: <Activity className="w-5 h-5" />,
        action: {
          label: 'View Details',
          onClick: () => window.location.href = '/admin'
        },
        timestamp: new Date()
      })
    }

    setNotifications(newNotifications)
  }, [
    isConnected, 
    mounted, 
    isNotificationsEnabled,
    userData, 
    isLoadingUserData, 
    calculatedRewards, 
    isLoadingRewards, 
    userBalance, 
    isLoadingBalance,
    tokenBalance,
    isLoadingTokenBalance
  ])

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const toggleNotifications = () => {
    setIsNotificationsEnabled(!isNotificationsEnabled)
    if (isNotificationsEnabled) {
      setNotifications([])
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  if (!isConnected) {
    return null
  }

  const unreadCount = notifications.length

  return (
    <div className="fixed top-20 right-4 z-50">
      {/* Bell Icon */}
      <div className="relative">
        <button
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
            isNotificationsEnabled 
              ? 'bg-white hover:bg-gray-50 border border-gray-200' 
              : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
          }`}
          aria-label="Toggle notifications"
        >
          {isNotificationsEnabled ? (
            <Bell className={`w-6 h-6 ${unreadCount > 0 ? 'text-monad-600' : 'text-gray-600'}`} />
          ) : (
            <BellOff className="w-6 h-6 text-gray-500" />
          )}
          
          {/* Notification Badge */}
          {isNotificationsEnabled && unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
        </button>

        {/* Toggle Notifications Button */}
        <button
          onClick={toggleNotifications}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          {isNotificationsEnabled ? 'Disable' : 'Enable'}
        </button>
      </div>

      {/* Notifications Panel */}
      <AnimatePresence>
        {isNotificationsOpen && isNotificationsEnabled && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="mt-4 bg-white rounded-lg shadow-xl border border-gray-200 w-80 max-h-96 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                <span className="text-xs text-gray-500">{unreadCount} new</span>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 ${getIconColor(notification.type)}`}>
                          {notification.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className="text-sm font-medium text-gray-900 mb-1">
                              {notification.title}
                            </h4>
                            <button
                              onClick={() => removeNotification(notification.id)}
                              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors ml-2"
                              aria-label="Close notification"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            {notification.action && (
                              <button
                                onClick={notification.action.onClick}
                                className="text-xs font-medium text-monad-600 hover:text-monad-700 underline"
                              >
                                {notification.action.label}
                              </button>
                            )}
                            <span className="text-xs text-gray-400">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function getIconColor(type: string) {
  switch (type) {
    case 'success':
      return 'text-green-600'
    case 'warning':
      return 'text-yellow-600'
    case 'error':
      return 'text-red-600'
    default:
      return 'text-blue-600'
  }
}
