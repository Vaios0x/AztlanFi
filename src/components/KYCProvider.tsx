'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { KYCModal } from './KYCModal'
import { useRouter } from 'next/navigation'

interface KYCContextType {
  showKYCModal: () => void
  hideKYCModal: () => void
  isKYCModalOpen: boolean
}

const KYCContext = createContext<KYCContextType | undefined>(undefined)

export function KYCProvider({ children }: { children: ReactNode }) {
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false)
  const router = useRouter()

  const showKYCModal = () => {
    setIsKYCModalOpen(true)
  }

  const hideKYCModal = () => {
    setIsKYCModalOpen(false)
  }

  const handleProceed = () => {
    // Para el demo, navegar al dashboard principal
    router.push('/dashboard')
  }

  return (
    <KYCContext.Provider value={{
      showKYCModal,
      hideKYCModal,
      isKYCModalOpen
    }}>
      {children}
      <KYCModal
        isOpen={isKYCModalOpen}
        onClose={hideKYCModal}
        onProceed={handleProceed}
      />
    </KYCContext.Provider>
  )
}

export function useKYCModal() {
  const context = useContext(KYCContext)
  if (context === undefined) {
    throw new Error('useKYCModal must be used within a KYCProvider')
  }
  return context
}
