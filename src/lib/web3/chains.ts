import { createPublicClient, http } from 'viem'

export const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    public: { http: ['https://testnet-rpc.monad.xyz'] },
    default: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://testnet.monadexplorer.com' },
  },
} as const

export const monadClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
})
