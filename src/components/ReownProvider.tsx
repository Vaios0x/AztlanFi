'use client'

import { wagmiAdapter, projectId } from '@/lib/web3/reown-config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { monadTestnet } from '@/lib/web3/chains'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Configurar queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined. Please set NEXT_PUBLIC_REOWN_PROJECT_ID in your .env.local file')
}

// Configurar metadata
const metadata = {
  name: 'AztlanFi',
  description: 'Instant remittance platform Mexico-USA using Monad blockchain',
  url: 'https://aztlanfi.com', // origin debe coincidir con tu dominio
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Crear el modal de AppKit
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [monadTestnet],
  defaultNetwork: monadTestnet,
  metadata: metadata,
  features: {
    analytics: true // Opcional - por defecto usa tu configuración de Cloud
  }
})

function ReownProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ReownProvider
