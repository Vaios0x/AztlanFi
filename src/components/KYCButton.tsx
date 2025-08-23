'use client'

import { ReactNode } from 'react'
import { useKYC } from '@/hooks/useKYC'
import { useKYCModal } from './KYCProvider'

interface KYCButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  requireKYC?: boolean
}

export function KYCButton({ 
  children, 
  className = '', 
  onClick, 
  requireKYC = true 
}: KYCButtonProps) {
  const { requiresKYC } = useKYC()
  const { showKYCModal } = useKYCModal()

  const handleClick = () => {
    if (requireKYC && requiresKYC()) {
      showKYCModal()
    } else if (onClick) {
      onClick()
    }
  }

  return (
    <button
      className={className}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}
