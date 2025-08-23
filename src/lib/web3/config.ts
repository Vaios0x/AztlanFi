import { createConfig, http } from 'wagmi'
import { monadTestnet } from './chains'
import { injected, metaMask } from 'wagmi/connectors'

export const config = createConfig({
  chains: [monadTestnet],
  connectors: [
    injected(),
    metaMask(),
  ],
  transports: {
    [monadTestnet.id]: http('https://testnet-rpc.monad.xyz'),
  },
})
