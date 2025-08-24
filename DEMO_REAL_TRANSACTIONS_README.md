# Demo de Transacciones Reales - RemesasFlash

## Descripción

El demo de transacciones reales permite probar el flujo completo de remesas con transacciones reales en Monad testnet. Este demo reemplaza las simulaciones anteriores con operaciones reales en la blockchain.

## Características Principales

### ✅ Transacciones Reales
- **Conexión con contratos reales** en Monad testnet
- **Firma de MetaMask** para cada transacción
- **Operaciones reales** en la blockchain
- **Confirmaciones en tiempo real**

### 🔄 Flujo Completo del Demo

1. **Conectar Contratos**
   - Verifica conexión con todos los contratos desplegados
   - Valida que estés en Monad testnet (Chain ID: 10143)
   - Confirma disponibilidad de contratos

2. **Verificar Compliance**
   - Registra usuario en el módulo de compliance
   - Asigna KYC nivel 1
   - Transacción real en la blockchain

3. **Obtener Tasa de Cambio**
   - Consulta el oracle de tasas de cambio
   - Obtiene tasa actual MXN/USD
   - Operación de solo lectura

4. **Enviar Remesa Real**
   - Crea transacción real de remesa
   - Solicita firma en MetaMask
   - Envía ETH real al destinatario
   - **⚠️ IMPORTANTE: Usa cantidades pequeñas**

5. **Verificar Transacción**
   - Confirma estado en la blockchain
   - Muestra número de bloque y confirmaciones
   - Verifica gas utilizado

6. **Procesar Recompensas**
   - Procesa recompensas por la transacción
   - Actualiza estadísticas del usuario
   - Transacción real en el vault de incentivos

## Configuración Requerida

### 🔗 Red
- **Monad Testnet** (Chain ID: 10143)
- RPC: `https://rpc.testnet.monad.xyz/`
- Explorador: `https://testnet.monadscan.com`

### 💰 Fondos
- **ETH de testnet** en tu wallet
- Cantidad recomendada: 0.01 ETH por transacción
- Puedes obtener ETH de testnet en el faucet oficial

### 🔧 Wallet
- **MetaMask** conectado
- Red configurada correctamente
- Fondos suficientes para gas

## Instrucciones de Uso

### 1. Preparación
```bash
# Asegúrate de estar en la red correcta
Chain ID: 10143
Network Name: Monad Testnet
```

### 2. Configuración del Demo
- **Cantidad**: 0.01 ETH (recomendado)
- **Destinatario**: Tu propia dirección o una de prueba
- **Verificar**: Que tengas fondos suficientes

### 3. Ejecutar Demo
1. Conecta tu wallet
2. Verifica que estés en Monad testnet
3. Configura cantidad y destinatario
4. Haz clic en "Ejecutar Demo"
5. Confirma cada transacción en MetaMask

### 4. Seguimiento
- **Estado en tiempo real** de cada transacción
- **Notificaciones** de confirmación
- **Enlaces al explorador** para verificar
- **Detalles completos** de cada operación

## Componentes del Demo

### 📊 Estado de la Red
- Verificación de conexión
- Estado del wallet
- TPS en tiempo real
- Dirección del usuario

### ⚙️ Configuración
- Cantidad de ETH a enviar
- Dirección del destinatario
- Validación de parámetros

### 🔄 Progreso
- Indicadores visuales de cada paso
- Estados: pendiente, ejecutando, completado, error
- Iconos específicos para cada operación

### 📋 Resultados
- Detalles completos de cada transacción
- Timestamps de ejecución
- Datos de la blockchain
- Enlaces al explorador

## Seguridad y Precauciones

### ⚠️ Avisos Importantes
- **Solo usa cantidades pequeñas** (0.01 ETH máximo)
- **Verifica la red** antes de ejecutar
- **Confirma cada transacción** en MetaMask
- **No uses fondos reales** (solo testnet)

### 🔒 Validaciones
- Verificación de red correcta
- Validación de fondos suficientes
- Comprobación de dirección válida
- Control de errores en cada paso

## Estructura Técnica

### Contratos Utilizados
```typescript
// Contratos principales
RemittancePool: "0x42cCb3EB32ab80433e957260cD7C486ae1BFb9f6"
ComplianceModule: "0x1546F9800d28ddff94438A76C8445381E487E1a8"
IncentiveVault: "0xdFa24C062fb6fFDBF8fe7431aD8EB2014E841ef2"
ExchangeRateOracle: "0x57439Fa61Ac189DD5fBFaA87113A70C70385cF64"
```

### Hooks Principales
```typescript
useRemittancePool()      // Operaciones de remesas
useComplianceModule()    // Gestión de compliance
useIncentiveVault()      // Sistema de recompensas
useExchangeRateOracle()  // Tasas de cambio
```

### Componentes UI
```typescript
TransactionStatus        // Estado de transacciones
DemoTransactionDetails   // Detalles de operaciones
ContractConnection       // Estado de conexión
```

## Solución de Problemas

### ❌ Errores Comunes

**"Wallet no conectado"**
- Conecta MetaMask
- Verifica que esté desbloqueado

**"Debes estar conectado a Monad testnet"**
- Cambia a Monad testnet en MetaMask
- Chain ID: 10143

**"Error al conectar con los contratos"**
- Verifica que los contratos estén desplegados
- Revisa la configuración de red

**"Fondos insuficientes"**
- Obtén ETH de testnet del faucet
- Reduce la cantidad del demo

### 🔧 Debugging
```typescript
// Verificar estado de conexión
console.log('Chain ID:', chainId);
console.log('Is Connected:', isConnected);
console.log('Contract Addresses:', contractAddresses);

// Verificar fondos
console.log('User Balance:', userBalance);
console.log('Demo Amount:', demoAmount);
```

## Mejoras Futuras

### 🚀 Próximas Funcionalidades
- [ ] Verificación real de transacciones
- [ ] Integración con más oracles
- [ ] Soporte para múltiples corredores
- [ ] Dashboard de estadísticas en tiempo real
- [ ] Notificaciones push de confirmaciones

### 📈 Métricas
- [ ] Tiempo promedio de confirmación
- [ ] Tasa de éxito de transacciones
- [ ] Costos de gas por operación
- [ ] Estadísticas de uso del demo

## Contribución

Para contribuir al demo:

1. **Fork** el repositorio
2. **Crea** una rama para tu feature
3. **Implementa** las mejoras
4. **Prueba** en testnet
5. **Envía** un pull request

## Licencia

Este demo es parte del proyecto RemesasFlash y está bajo la misma licencia del proyecto principal.

---

**⚠️ IMPORTANTE**: Este demo ejecuta transacciones reales en testnet. Nunca uses fondos reales y siempre verifica la configuración antes de ejecutar.
