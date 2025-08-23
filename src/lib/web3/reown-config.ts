import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { monadTestnet } from './chains'

// Project ID de Reown
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '3c8d240cf81a3a811d283136f4a9b5a6'

if (!projectId) {
  throw new Error('Project ID is not defined. Please set NEXT_PUBLIC_REOWN_PROJECT_ID in your .env.local file')
}

export const networks = [monadTestnet]

// Configuración del Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig
