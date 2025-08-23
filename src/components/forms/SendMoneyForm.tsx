'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DollarSign, Phone, User, ArrowRight, AlertCircle, ExternalLink, Shield, Clock, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRemittancePool, useComplianceModule, useAddressValidation } from '@/lib/web3/useContracts'
import { useAccount } from 'wagmi'
import { getExplorerUrl } from '@/lib/web3/contracts'
import { parseEther, formatEther } from 'viem'
import { keccak256, toUtf8Bytes } from 'ethers'

const sendMoneySchema = z.object({
  recipientName: z.string().min(2, 'Name must have at least 2 characters'),
  phoneNumber: z.string().regex(/^\+52\d{10}$/, 'Invalid phone number'),
  amount: z.number().min(1, 'Minimum amount is $1').max(10000, 'Maximum amount is $10,000'),
  message: z.string().optional(),
})

type SendMoneyFormData = z.infer<typeof sendMoneySchema>

interface SendMoneyFormProps {
  selectedRecipient: string
  setSelectedRecipient: (recipient: string) => void
  amount: string
  setAmount: (amount: string) => void
}

export function SendMoneyForm({ 
  selectedRecipient, 
  setSelectedRecipient, 
  amount, 
  setAmount 
}: SendMoneyFormProps) {
  const { address, isConnected } = useAccount()
  const { 
    createRemittance, 
    isCreatingRemittance, 
    isConfirmingCreate,
    isConfirmedCreate,
    userBalance,
    isLoadingBalance,
    calculatedFee,
    exchangeRate
  } = useRemittancePool()
  const { userData, isLoadingUserData } = useComplianceModule()
  const { validateAddress } = useAddressValidation()
  
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [transactionStatus, setTransactionStatus] = useState<'pending' | 'confirmed' | 'failed' | null>(null)
  const [mounted, setMounted] = useState(false)
  const [complianceCheck, setComplianceCheck] = useState<{
    isCompliant: boolean
    message: string
    kycLevel: number
    dailyLimit: string
    dailyUsed: string
    monthlyLimit: string
    monthlyUsed: string
  } | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<SendMoneyFormData>({
    resolver: zodResolver(sendMoneySchema),
  })

  const watchedAmount = watch('amount', 0)
  const fee = watchedAmount * 0.005 // 0.5% fee
  const totalAmount = watchedAmount + fee
  const mxnAmount = watchedAmount * (exchangeRate || 17) // Real exchange rate from contract

  // Evitar errores de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  // Validar compliance en tiempo real
  useEffect(() => {
    if (address && userData && watchedAmount > 0) {
      // Type-safe access to userData
      const userDataTyped = userData as any
      const kycLevel = userDataTyped?.kycLevel || 0
      const dailyLimit = userDataTyped?.dailyLimit ? formatEther(userDataTyped.dailyLimit as bigint) : "0"
      const dailyUsed = userDataTyped?.dailyUsed ? formatEther(userDataTyped.dailyUsed as bigint) : "0"
      const monthlyLimit = userDataTyped?.monthlyLimit ? formatEther(userDataTyped.monthlyLimit as bigint) : "0"
      const monthlyUsed = userDataTyped?.monthlyUsed ? formatEther(userDataTyped.monthlyUsed as bigint) : "0"
      
      const dailyRemaining = parseFloat(dailyLimit) - parseFloat(dailyUsed)
      const monthlyRemaining = parseFloat(monthlyLimit) - parseFloat(monthlyUsed)
      
      let isCompliant = true
      let message = "Transaction allowed"
      
      if (userDataTyped?.isBlacklisted) {
        isCompliant = false
        message = "User blacklisted"
      } else if (watchedAmount > dailyRemaining) {
        isCompliant = false
        message = `Exceeds daily limit. Remaining: $${dailyRemaining.toFixed(2)}`
      } else if (watchedAmount > monthlyRemaining) {
        isCompliant = false
        message = `Exceeds monthly limit. Remaining: $${monthlyRemaining.toFixed(2)}`
      } else if (kycLevel === 0 && watchedAmount > 500) {
        isCompliant = false
        message = "KYC required for amounts over $500"
      }
      
      setComplianceCheck({
        isCompliant,
        message,
        kycLevel,
        dailyLimit,
        dailyUsed,
        monthlyLimit,
        monthlyUsed
      })
    }
  }, [address, userData, watchedAmount])

  // Actualizar status de transacción
  useEffect(() => {
    if (isCreatingRemittance) {
      setTransactionStatus('pending')
    }
  }, [isCreatingRemittance])

  useEffect(() => {
    if (isConfirmedCreate) {
      setTransactionStatus('confirmed')
      toast.success('Remittance sent successfully!')
    }
  }, [isConfirmedCreate])

  // Manejo de errores de transacción
  useEffect(() => {
    if (isCreatingRemittance && !isConfirmingCreate) {
      setTransactionStatus('failed')
      toast.error('Error creating remittance')
    }
  }, [isCreatingRemittance, isConfirmingCreate])

  const onSubmit = async (data: SendMoneyFormData) => {
    if (!isConnected) {
      toast.error('You must connect your wallet first')
      return
    }

    if (!address) {
      toast.error('Could not get your wallet address')
      return
    }

    if (!complianceCheck?.isCompliant) {
      toast.error(`Compliance error: ${complianceCheck?.message}`)
      return
    }

    if (!validateAddress(selectedRecipient)) {
      toast.error('Invalid recipient address')
      return
    }

    if (selectedRecipient.toLowerCase() === address.toLowerCase()) {
      toast.error('You cannot send money to your own address')
      return
    }

    const userBalanceNum = parseFloat(userBalance || "0")
    if (totalAmount > userBalanceNum) {
      toast.error(`Insufficient balance. Available: $${userBalanceNum.toFixed(2)}`)
      return
    }

    setIsLoading(true)
    
    try {
      // Generate phone hash for compliance
      const phoneHash = keccak256(toUtf8Bytes(data.phoneNumber + Date.now().toString()))
      
      // Crear remesa usando el contrato
      createRemittance(selectedRecipient, totalAmount.toString(), phoneHash)
      
      toast.success('Transaction sent to blockchain!')
      reset()
      setShowPreview(false)
    } catch (error) {
      console.error('Error sending remittance:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      toast.error(`Error sending money: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = () => {
    switch (transactionStatus) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusMessage = () => {
    switch (transactionStatus) {
      case 'pending':
        return 'Transaction in progress...'
      case 'confirmed':
        return 'Transaction confirmed!'
      case 'failed':
        return 'Transaction failed'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Compliance Status */}
      {complianceCheck && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`card ${complianceCheck.isCompliant ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
        >
          <div className="flex items-start space-x-3">
            <Shield className={`w-6 h-6 ${complianceCheck.isCompliant ? 'text-green-600' : 'text-red-600'} flex-shrink-0 mt-0.5`} />
            <div className="flex-1">
              <h3 className={`font-semibold mb-1 ${complianceCheck.isCompliant ? 'text-green-900' : 'text-red-900'}`}>
                Compliance Verification
              </h3>
              <p className={`text-sm ${complianceCheck.isCompliant ? 'text-green-700' : 'text-red-700'} mb-2`}>
                {complianceCheck.message}
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-medium">KYC Level:</span> {complianceCheck.kycLevel}
                </div>
                <div>
                  <span className="font-medium">Daily Limit:</span> ${parseFloat(complianceCheck.dailyLimit).toFixed(2)}
                </div>
                <div>
                  <span className="font-medium">Used Today:</span> ${parseFloat(complianceCheck.dailyUsed).toFixed(2)}
                </div>
                <div>
                  <span className="font-medium">Monthly Limit:</span> ${parseFloat(complianceCheck.monthlyLimit).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Transfer Details
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Recipient Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                {...register('recipientName')}
                type="text"
                className="input-field pl-10"
                placeholder="Full name"
                aria-label="Recipient name"
              />
            </div>
            {errors.recipientName && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.recipientName.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                {...register('phoneNumber')}
                type="tel"
                className="input-field pl-10"
                placeholder="+52 55 1234 5678"
                aria-label="Phone number"
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                {...register('amount', { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="input-field pl-10"
                placeholder="0.00"
                min="1"
                max="10000"
                aria-label="Amount in USD"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              {...register('message')}
              rows={3}
              className="input-field resize-none"
              placeholder="Message for recipient..."
              aria-label="Optional message"
            />
          </div>

          {/* Fee Breakdown */}
          {watchedAmount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-gray-50 rounded-xl p-4"
            >
              <h3 className="font-semibold text-gray-900 mb-3">Fee Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Amount to send:</span>
                  <span>${watchedAmount.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span>Commission (0.5%):</span>
                  <span>${fee.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span>Total to pay:</span>
                  <span className="font-semibold">${totalAmount.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Will receive in Mexico:</span>
                  <span>${mxnAmount.toFixed(2)} MXN</span>
                </div>
                {userBalance && (
                  <div className="flex justify-between text-gray-600">
                    <span>Available balance:</span>
                    <span>${parseFloat(userBalance).toFixed(2)} USD</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              isLoading || 
              isCreatingRemittance || 
              watchedAmount <= 0 || 
              !isConnected || 
              !complianceCheck?.isCompliant ||
              isLoadingUserData
            }
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Send remittance"
          >
            {!mounted ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Loading...
              </div>
            ) : isLoading || isCreatingRemittance ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isCreatingRemittance ? 'Sending to blockchain...' : 'Processing...'}
              </div>
            ) : !isConnected ? (
              <>
                Connect Wallet First
                <AlertCircle className="ml-2 w-5 h-5" />
              </>
            ) : isLoadingUserData ? (
              <>
                Verifying Compliance...
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
              </>
            ) : (
              <>
                Send Remittance
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Transaction Status */}
      {(isCreatingRemittance || transactionHash || transactionStatus) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`card ${
            transactionStatus === 'confirmed' ? 'bg-green-50 border-green-200' :
            transactionStatus === 'failed' ? 'bg-red-50 border-red-200' :
            'bg-blue-50 border-blue-200'
          }`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getStatusIcon()}
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold mb-1 ${
                transactionStatus === 'confirmed' ? 'text-green-900' :
                transactionStatus === 'failed' ? 'text-red-900' :
                'text-blue-900'
              }`}>
                {getStatusMessage()}
              </h3>
              <p className={`text-sm mb-3 ${
                transactionStatus === 'confirmed' ? 'text-green-700' :
                transactionStatus === 'failed' ? 'text-red-700' :
                'text-blue-700'
              }`}>
                Your remittance is being processed on the Monad blockchain.
              </p>
              {transactionHash && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">Hash:</span>
                  <a
                    href={`${getExplorerUrl(10143)}/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center"
                    aria-label="View transaction in explorer"
                  >
                    {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card bg-blue-50 border-blue-200"
      >
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">
              Secure Transaction
            </h3>
            <p className="text-sm text-blue-700">
              Your money is protected by blockchain technology. The transaction will complete in less than 1 second.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
