'use client'

import { motion } from 'framer-motion'
import { XCircle, AlertTriangle, CheckCircle, Shield } from 'lucide-react'
import { useAccount } from 'wagmi'
import { useComplianceModule } from '@/lib/web3/useContracts'

interface BlacklistStatusBannerProps {
  className?: string
}

export function BlacklistStatusBanner({ className = '' }: BlacklistStatusBannerProps) {
  const { address, isConnected } = useAccount()
  const { userData, isLoadingUserData } = useComplianceModule()

  if (!isConnected || isLoadingUserData) {
    return null
  }

  const userDataTyped = userData as any
  const isBlacklisted = userDataTyped?.isBlacklisted || false
  const kycLevel = userDataTyped?.kycLevel || 0

  if (!isBlacklisted) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 rounded-lg shadow-lg ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <XCircle className="w-6 h-6 animate-pulse" />
          <div>
                         <h3 className="font-semibold text-lg">
               Account Blocked
             </h3>
             <p className="text-red-100 text-sm">
               Your account has been suspended by the compliance team
             </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
                     <span className="text-sm font-medium">
             KYC Level: {kycLevel}
           </span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-red-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
                         <div className="flex items-center gap-2">
               <AlertTriangle className="w-4 h-4" />
               <span className="text-sm">Limited access</span>
             </div>
             <div className="flex items-center gap-2">
               <XCircle className="w-4 h-4" />
               <span className="text-sm">Transactions blocked</span>
             </div>
          </div>
                     <button className="bg-white text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
             Request Review
           </button>
        </div>
      </div>
    </motion.div>
  )
}
