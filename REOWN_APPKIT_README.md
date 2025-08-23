# Reown AppKit Integration - RemesaFlash

## Descripción

Este proyecto ha sido actualizado para usar **Reown AppKit** en lugar de RainbowKit, proporcionando una experiencia de wallet más moderna y unificada.

## Características Implementadas

### ✅ Configuración Completa
- **Wagmi v2** con Reown AppKit Adapter
- **SSR Support** con cookies para persistencia
- **PWA Compatibility** para aplicaciones móviles
- **Monad Testnet** como red principal

### ✅ Componentes Creados
- `ReownProvider.tsx` - Context provider principal
- `ReownWalletConnect.tsx` - Botón de conexión con web component
- `ReownHooksDemo.tsx` - Demostración de hooks de Wagmi
- `reown-config.ts` - Configuración de AppKit

### ✅ Funcionalidades
- Conexión multi-wallet (WalletConnect, MetaMask, etc.)
- Soporte para Monad Testnet
- Interfaz unificada y moderna
- Integración nativa con Wagmi v2
- Soporte para SSR y PWA

## Configuración

### Variables de Entorno
```bash
NEXT_PUBLIC_REOWN_PROJECT_ID=3c8d240cf81a3a811d283136f4a9b5a6
```

### Dependencias Instaladas
```json
{
  "@reown/appkit": "latest",
  "@reown/appkit-adapter-wagmi": "latest"
}
```

## Uso

### 1. Botón de Conexión
```tsx
import { ReownWalletConnect } from '@/components/web3/ReownWalletConnect'

// En tu componente
<ReownWalletConnect />
```

### 2. Web Component
```tsx
// Usar directamente el web component
<appkit-button className="btn-primary" />
```

### 3. Hooks de Wagmi
```tsx
import { useAccount, useBalance } from 'wagmi'

const { address, isConnected } = useAccount()
const { data: balance } = useBalance({ address })
```

## Estructura de Archivos

```
src/
├── components/
│   ├── ReownProvider.tsx          # Provider principal
│   └── web3/
│       ├── ReownWalletConnect.tsx # Botón de conexión
│       └── ReownHooksDemo.tsx     # Demo de hooks
├── lib/web3/
│   ├── reown-config.ts           # Configuración AppKit
│   ├── chains.ts                 # Configuración de redes
│   └── config.ts                 # Configuración Wagmi (legacy)
└── app/
    └── layout.tsx                # Layout con ReownProvider
```

## Diferencias con RainbowKit

| Característica | RainbowKit | Reown AppKit |
|----------------|------------|--------------|
| **Integración** | Biblioteca separada | Integración nativa con Wagmi |
| **Web Components** | No | Sí (appkit-button) |
| **SSR Support** | Limitado | Completo con cookies |
| **PWA Support** | Básico | Optimizado |
| **Multi-chain** | Complejo | Simplificado |
| **UI/UX** | Personalizable | Moderna y unificada |

## Ventajas de Reown AppKit

1. **Integración Nativa**: Diseñado específicamente para Wagmi v2
2. **Web Components**: Componentes HTML nativos sin dependencias
3. **SSR Completo**: Soporte total para Server-Side Rendering
4. **PWA Optimizado**: Mejor experiencia en aplicaciones móviles
5. **UI Unificada**: Interfaz consistente en todas las wallets
6. **Performance**: Mejor rendimiento y menor bundle size

## Troubleshooting

### Error: "Project ID is not defined"
- Verifica que `NEXT_PUBLIC_REOWN_PROJECT_ID` esté configurado
- Asegúrate de que el archivo `.env.local` existe

### Error: "No connectors available"
- Verifica que el proyecto esté configurado en Reown Dashboard
- Asegúrate de que las redes estén correctamente configuradas

### Problemas de SSR
- Verifica que `next.config.js` tenga la configuración de webpack
- Asegúrate de que `cookieToInitialState` esté siendo usado

## Recursos

- [Documentación Oficial](https://docs.reown.com/appkit/next/core/installation)
- [Reown Dashboard](https://dashboard.reown.com)
- [Wagmi v2 Documentation](https://wagmi.sh)

## Estado del Proyecto

✅ **Completado**: Integración básica de Reown AppKit
✅ **Completado**: Configuración de Monad Testnet
✅ **Completado**: Componentes de UI
✅ **Completado**: Soporte para SSR y PWA
🔄 **En Progreso**: Optimizaciones de performance
📋 **Pendiente**: Tests de integración
