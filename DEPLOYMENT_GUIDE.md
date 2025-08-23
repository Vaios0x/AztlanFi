# 🚀 Guía de Despliegue - AztlanFi Smart Contracts

## 📋 Resumen

Esta guía te ayudará a desplegar todos los smart contracts de AztlanFi en la red Monad testnet con la configuración correcta para el hackathon Mobil3.

## 🔑 Configuración de Wallet

- **Wallet Address**: 
- **Private Key**: 
- **Network**: Monad Testnet (Chain ID: 10143)
- **RPC URL**: https://testnet-rpc.monad.xyz
- **Explorer**: https://testnet.monadexplorer.com

## 📦 Contratos a Desplegar

### Contratos Principales
1. **AztlanFiCore** - Contrato principal con 32 corredores
2. **PartnerIntegrations** - Integración con partners del hackathon
3. **RemittancePool** - Pool de liquidez para remesas
4. **ComplianceModule** - Módulo de cumplimiento y KYC
5. **IncentiveVault** - Sistema de recompensas e incentivos
6. **RemittanceToken** - Token nativo de la plataforma
7. **ExchangeRateOracle** - Oracle para tasas de cambio

### Características Implementadas
- ✅ **32 Corredores Estratégicos** (16 pares bidireccionales)
- ✅ **Integración 0x Protocol** (transacciones gasless)
- ✅ **Integración Reown AppKit** (social logins)
- ✅ **Integración Envio Analytics** (analytics en tiempo real)
- ✅ **Integración Para Wallet** (savings goals)
- ✅ **Sistema de Roles** (Admin, Compliance, Liquidity Provider)
- ✅ **Eventos de Analytics** para tracking
- ✅ **Configuración Automática** de referencias entre contratos

## 🚀 Pasos de Despliegue

### 1. Preparación

```bash
# Verificar que tienes Node.js y npm instalados
node --version
npm --version

# Instalar dependencias
npm install

# Verificar configuración de Hardhat
npx hardhat compile
```

### 2. Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Monad Testnet RPC
MONAD_RPC_URL=https://testnet-rpc.monad.xyz

# Wallet Private Key (ya configurado en el script)
PRIVATE_KEY=2003f926c578fea4a77ffdd98a288a3297ee12b8893505562422dd258e4a5765

# API Keys para partners (opcional)
NEXT_PUBLIC_0X_API_KEY=your_0x_api_key
```

### 3. Verificar Balance

```bash
# Verificar balance de la wallet
npx hardhat run check-monad-balance.js --network monad-testnet
```

### 4. Desplegar Contratos

```bash
# Desplegar todos los contratos
npx hardhat run deploy-monad-final.js --network monad-testnet
```

### 5. Verificar Despliegue

```bash
# Verificar que todos los contratos se desplegaron correctamente
npx hardhat run verify-deployment.js --network monad-testnet
```

### 6. Actualizar Frontend

```bash
# Actualizar automáticamente las direcciones en el frontend
node update-contract-addresses.js
```

## 📊 Verificación de Despliegue

El script de verificación comprobará:

### ✅ Roles y Permisos
- Default Admin Role
- Compliance Officer Role
- Liquidity Provider Role
- Partner Role
- Analytics Role

### ✅ Inicialización de Corredores
- 32 corredores activos
- Límites diarios y mensuales configurados
- Pares bidireccionales funcionando

### ✅ Estadísticas de Partners
- 0x Protocol: transacciones gasless, gas ahorrado
- Reown: social logins, usuarios totales
- Envio: eventos indexados, uptime
- Para: savings goals, total locked

### ✅ Referencias entre Contratos
- ComplianceModule → RemittancePool
- IncentiveVault → RemittancePool
- RemittancePool → ComplianceModule
- RemittanceToken → IncentiveVault (minter)

## 🔗 MonadScan Explorer

Después del despliegue, podrás verificar los contratos en:
- **Monad Explorer Testnet**: https://testnet.monadexplorer.com

## 📁 Archivos Generados

- `deployment-info-monad-final.json` - Información completa del despliegue
- `src/lib/web3/contracts.ts` - Direcciones actualizadas para el frontend

## 🧪 Testing

### Test de Funcionalidad Básica

```bash
# Ejecutar tests
npx hardhat test

# Test específico de corredores
npx hardhat test test/corridors.test.js

# Test de integración de partners
npx hardhat test test/partners.test.js
```

### Test de Integración

```bash
# Test de envío de remesa con partners
npx hardhat run test-integration.js --network monad-testnet
```

## 🔧 Configuración Post-Despliegue

### 1. Configurar Límites de Corredores

```javascript
// Ejemplo: Configurar límites para USA-MEX
await aztlanFiCore.setCorridorLimits(
  "USA-MEX",
  ethers.parseEther("1000000"), // 1M USD daily limit
  ethers.parseEther("5000000")  // 5M USD monthly limit
);
```

### 2. Configurar Fees

```javascript
// Ejemplo: Configurar fee para un corredor
await aztlanFiCore.setCorridorFee("USA-MEX", 30); // 0.3%
```

### 3. Agregar Liquidez

```javascript
// Ejemplo: Agregar liquidez a un corredor
await aztlanFiCore.addLiquidity("USA-MEX", ethers.parseEther("100000"));
```

## 🚨 Troubleshooting

### Error: "Insufficient funds"
```bash
# Verificar balance
npx hardhat run check-monad-balance.js --network monad-testnet

# Si es necesario, solicitar tokens de test
# Visitar: https://faucet.testnet.monad.xyz
```

### Error: "Contract deployment failed"
```bash
# Verificar configuración de red
npx hardhat run test-monad-connection.js --network monad-testnet

# Verificar gas limit
# El script ya incluye gas limit optimizado para Monad
```

### Error: "Role not found"
```bash
# Verificar roles después del despliegue
npx hardhat run verify-deployment.js --network monad-testnet

# Si es necesario, configurar roles manualmente
```

## 📞 Soporte

Si encuentras problemas durante el despliegue:

1. **Verificar logs** del script de despliegue
2. **Ejecutar verificación** con `verify-deployment.js`
3. **Revisar configuración** de red y wallet
4. **Contactar soporte** del hackathon

## 🎯 Próximos Pasos

Después del despliegue exitoso:

1. ✅ **Verificar contratos** en MonadScan
2. ✅ **Actualizar frontend** con nuevas direcciones
3. ✅ **Testear funcionalidades** principales
4. ✅ **Configurar analytics** y monitoring
5. ✅ **Preparar demo** para el hackathon

---

**¡Listo para ganar el hackathon Mobil3! 🏆**
