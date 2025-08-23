'use client'

import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import { SendMoneyForm } from '@/components/forms/SendMoneyForm'
import { ExchangeRateDisplay } from '@/components/ExchangeRateDisplay'
import { RecipientSelector } from '@/components/RecipientSelector'
import { ContractTester } from '@/components/ContractTester'
import { Wallet, AlertCircle } from 'lucide-react'

export default function SendMoney() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-monad-50 to-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 bg-monad-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-8 h-8 text-monad-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to start sending money to Mexico
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                You need to connect your wallet to access this feature
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-monad-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Send Money to Mexico
          </h1>
          <p className="text-lg text-gray-600">
            Fast, secure, and affordable remittances using blockchain technology
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <SendMoneyForm 
                selectedRecipient=""
                setSelectedRecipient={() => {}}
                amount=""
                setAmount={() => {}}
              />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <ExchangeRateDisplay />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <RecipientSelector 
                selectedRecipient=""
                onSelect={() => {}}
              />
            </motion.div>
          </div>
        </div>

        {/* Contract Tester Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <ContractTester />
        </motion.div>
      </div>
    </div>
  )
}
