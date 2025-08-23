import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useComplianceModule } from '@/lib/web3/useContracts'

export function useKYC() {
  const { address, isConnected } = useAccount()
  const { userData, isLoadingUserData } = useComplianceModule()
  const [kycLevel, setKycLevel] = useState(0)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    if (userData) {
      const userDataTyped = userData as any
      const level = userDataTyped?.kycLevel || 0
      // Para el demo del hackathon, simular nivel Pro (2) si no está verificado
      const demoLevel = level >= 1 ? level : 2
      setKycLevel(demoLevel)
      setIsVerified(demoLevel >= 1)
    } else {
      // Si no hay datos del usuario, simular nivel Pro para el demo
      setKycLevel(2)
      setIsVerified(true)
    }
  }, [userData])

  const requiresKYC = () => {
    // Para el demo del hackathon, no se requiere KYC
    return false
  }

  const getKYCStatus = () => {
    if (!isConnected) return 'disconnected'
    if (isLoadingUserData) return 'loading'
    if (isVerified) return 'verified'
    return 'unverified'
  }

  const getLimits = () => {
    switch (kycLevel) {
      case 0:
        return {
          daily: 500,
          monthly: 2000,
          commission: 0.5
        }
      case 1:
        return {
          daily: 5000,
          monthly: 25000,
          commission: 0.3
        }
      case 2:
        return {
          daily: 25000,
          monthly: 100000,
          commission: 0.2
        }
      default:
        return {
          daily: 50000,
          monthly: 500000,
          commission: 0.1
        }
    }
  }

  const getFeatures = () => {
    switch (kycLevel) {
      case 0:
        return {
          title: 'Plan Básico',
          features: ['Transferencias básicas', 'Soporte por email'],
          color: 'gray'
        }
      case 1:
        return {
          title: 'Plan Verificado',
          features: ['Transferencias prioritarias', 'Soporte 24/7', 'App móvil PWA'],
          color: 'blue'
        }
      case 2:
        return {
          title: 'Plan Premium',
          features: ['Todas las características Pro', 'Comisión 0.2%', 'Sin límites mensuales'],
          color: 'purple'
        }
      default:
        return {
          title: 'Plan VIP',
          features: ['Todas las características', 'Comisión 0.1%', 'Soporte VIP'],
          color: 'gold'
        }
    }
  }

  return {
    kycLevel,
    isVerified,
    requiresKYC,
    getKYCStatus,
    getLimits,
    getFeatures,
    isLoading: isLoadingUserData
  }
}
