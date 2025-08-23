# Funciones de Consulta Avanzadas - RemesasFlash

## Resumen

Se han implementado completamente todas las funciones de consulta avanzadas solicitadas para el sistema de remesas blockchain. Estas funciones permiten consultar datos específicos de los contratos inteligentes de manera eficiente y segura.

## Funciones Implementadas

### 🔄 RemittancePool

#### `getRemittance(bytes32 _id)`
- **Descripción**: Obtiene los detalles completos de una remesa específica
- **Parámetros**: `_id` - ID único de la remesa (hash)
- **Retorna**: Estructura `Remittance` con todos los datos
- **Hook**: `useGetRemittance(remittanceId)`

#### `totalVolume()`
- **Descripción**: Obtiene el volumen total de todas las remesas procesadas
- **Retorna**: `uint256` - Volumen total en wei
- **Hook**: `totalVolume` (dato directo)

#### `totalTransactions()`
- **Descripción**: Obtiene el número total de transacciones realizadas
- **Retorna**: `uint256` - Número total de transacciones
- **Hook**: `totalTransactions` (dato directo)

### 🛡️ ComplianceModule

#### `isBlacklisted(address _user)`
- **Descripción**: Verifica si un usuario está en la lista negra
- **Parámetros**: `_user` - Dirección del usuario a verificar
- **Retorna**: `bool` - True si está en blacklist
- **Hook**: `useIsBlacklisted(userAddress)`

#### `getTransaction(bytes32 _txId)`
- **Descripción**: Obtiene los detalles de una transacción específica
- **Parámetros**: `_txId` - ID único de la transacción
- **Retorna**: Estructura `Transaction` con todos los datos
- **Hook**: `useGetTransaction(txId)`

### 🎁 IncentiveVault

#### `getUserAchievement(address _user, string _achievementId)`
- **Descripción**: Obtiene un logro específico de un usuario
- **Parámetros**: 
  - `_user` - Dirección del usuario
  - `_achievementId` - ID del logro (ej: "first_transaction")
- **Retorna**: Estructura `Achievement` con detalles del logro
- **Hook**: `useGetUserAchievement(userAddress, achievementId)`

#### `getPendingRewards(address _user)`
- **Descripción**: Obtiene las recompensas pendientes de un usuario
- **Parámetros**: `_user` - Dirección del usuario
- **Retorna**: `uint256` - Cantidad de recompensas pendientes
- **Hook**: `useGetPendingRewards(userAddress)`

#### `claimAchievement(string _achievementId)`
- **Descripción**: Reclama un logro específico (función de escritura)
- **Parámetros**: `_achievementId` - ID del logro a reclamar
- **Hook**: Disponible en `useIncentiveVault()`

### 📊 ExchangeRateOracle

#### `getRateHistory(uint256 _index)`
- **Descripción**: Obtiene un registro específico del historial de tasas
- **Parámetros**: `_index` - Índice del registro en el historial
- **Retorna**: Estructura `RateData` con detalles de la tasa
- **Hook**: `useGetRateHistory(index)`

#### `getRecentRates(uint256 _count)`
- **Descripción**: Obtiene las tasas más recientes
- **Parámetros**: `_count` - Número de tasas a obtener (1-100)
- **Retorna**: Array de `RateData[]` con las tasas recientes
- **Hook**: `useGetRecentRates(count)`

#### `isRateStale(uint256 _maxAge)`
- **Descripción**: Verifica si la tasa actual está obsoleta
- **Parámetros**: `_maxAge` - Edad máxima en segundos
- **Retorna**: `bool` - True si la tasa está obsoleta
- **Hook**: `useIsRateStale(maxAge)`

#### `getRateAge()`
- **Descripción**: Obtiene la edad de la tasa actual
- **Retorna**: `uint256` - Edad en segundos
- **Hook**: `rateAge` (dato directo)

## Hooks Principales

### `useAdvancedQueries()`
Hook principal que combina todas las funciones de consulta avanzadas:

```typescript
const {
  useGetRemittance,
  totalVolume,
  totalTransactions,
  useIsBlacklisted,
  useGetTransaction,
  useGetUserAchievement,
  useGetPendingRewards,
  useGetRateHistory,
  useGetRecentRates,
  useIsRateStale,
  rateAge,
  isRateStale1Hour,
  isRateStale24Hours,
} = useAdvancedQueries();
```

### `useDashboardQueries()`
Hook especializado para datos del dashboard:

```typescript
const {
  totalVolume,
  totalTransactions,
  totalLiquidity,
  currentRate,
  userStats,
  pendingRewards,
  isLoading,
} = useDashboardQueries();
```

### `useQueryUtils()`
Utilidades para formateo y validación:

```typescript
const {
  formatTimestamp,
  formatExchangeRate,
  formatUSD,
  formatMXN,
  isValidAddress,
  isValidHash,
  truncateAddress,
  getRemittanceStatus,
  getKYCLevel,
} = useQueryUtils();
```

## Hooks Especializados

### `useRemittancePoolQueries()`
Consultas específicas del RemittancePool:

```typescript
const {
  useGetRemittance,
  totalVolume,
  totalTransactions,
  isLoadingTotalVolume,
  isLoadingTotalTransactions,
} = useRemittancePoolQueries();
```

### `useComplianceModuleQueries()`
Consultas específicas del ComplianceModule:

```typescript
const {
  useIsBlacklisted,
  useGetTransaction,
  isCurrentUserBlacklisted,
  isLoadingCurrentUserBlacklist,
} = useComplianceModuleQueries();
```

### `useIncentiveVaultQueries()`
Consultas específicas del IncentiveVault:

```typescript
const {
  useGetUserAchievement,
  useGetPendingRewards,
  useGetCurrentUserAchievement,
  currentUserPendingRewards,
  isLoadingCurrentUserPendingRewards,
} = useIncentiveVaultQueries();
```

### `useExchangeRateOracleQueries()`
Consultas específicas del ExchangeRateOracle:

```typescript
const {
  useGetRateHistory,
  useGetRecentRates,
  useIsRateStale,
  rateAge,
  isRateStale1Hour,
  isRateStale24Hours,
  isLoadingRateAge,
  isLoadingRateStale1Hour,
  isLoadingRateStale24Hours,
} = useExchangeRateOracleQueries();
```

## Tipos de Datos

### `Remittance`
```typescript
interface Remittance {
  sender: string;
  receiver: string;
  amount: bigint;
  fee: bigint;
  timestamp: bigint;
  completed: boolean;
  phoneHash: string;
  id: string;
}
```

### `Transaction`
```typescript
interface Transaction {
  sender: string;
  receiver: string;
  amount: bigint;
  timestamp: bigint;
  isSuspicious: boolean;
  reason: string;
}
```

### `Achievement`
```typescript
interface Achievement {
  name: string;
  description: string;
  requirement: bigint;
  isNFT: boolean;
  metadataURI: string;
  isClaimed: boolean;
}
```

### `RateData`
```typescript
interface RateData {
  rate: bigint;
  timestamp: bigint;
  source: string;
  isValid: boolean;
}
```

## Ejemplo de Uso

```typescript
import { useAdvancedQueries, useQueryUtils } from '@/lib/web3/advancedQueries';

function MyComponent() {
  const { useGetRemittance, totalVolume } = useAdvancedQueries();
  const { formatUSD, truncateAddress } = useQueryUtils();
  
  const [remittanceId, setRemittanceId] = useState('');
  const { data: remittance, isLoading } = useGetRemittance(remittanceId);
  
  return (
    <div>
      <h2>Volumen Total: ${totalVolume}</h2>
      
      <input 
        value={remittanceId}
        onChange={(e) => setRemittanceId(e.target.value)}
        placeholder="ID de remesa"
      />
      
      {remittance && (
        <div>
          <p>Remitente: {truncateAddress(remittance.sender)}</p>
          <p>Monto: {formatUSD(remittance.amount)}</p>
          <p>Estado: {remittance.completed ? 'Completada' : 'Pendiente'}</p>
        </div>
      )}
    </div>
  );
}
```

## Características de Seguridad

- ✅ Validación de direcciones Ethereum
- ✅ Validación de hashes de transacciones
- ✅ Manejo de errores robusto
- ✅ Estados de carga para mejor UX
- ✅ Formateo seguro de datos
- ✅ Accesibilidad completa (ARIA labels, tabIndex)

## Características de Accesibilidad

- ✅ Navegación con teclado (tabIndex)
- ✅ Etiquetas ARIA descriptivas
- ✅ Estados de carga claros
- ✅ Retroalimentación visual para errores
- ✅ Contraste de colores adecuado
- ✅ Textos descriptivos para screen readers

## Archivos Creados/Modificados

1. **`src/lib/web3/advancedQueries.ts`** - Nuevo archivo con todos los hooks
2. **`src/components/AdvancedQueriesDemo.tsx`** - Componente de demostración
3. **`src/app/advanced-queries/page.tsx`** - Página de demostración
4. **`src/lib/web3/useContracts.ts`** - Actualizado con re-exports

## URL de Demostración

Accede a la demostración completa en: `/advanced-queries`

## Estado de Implementación

✅ **COMPLETADO** - Todas las funciones solicitadas han sido implementadas:

- ✅ `getRemittance(bytes32 _id)`
- ✅ `totalVolume()`
- ✅ `totalTransactions()`
- ✅ `isBlacklisted(address _user)`
- ✅ `getTransaction(bytes32 _txId)`
- ✅ `getUserAchievement(address _user, string _achievementId)`
- ✅ `getPendingRewards(address _user)`
- ✅ `claimAchievement(string _achievementId)`
- ✅ `getRateHistory(uint256 _index)`
- ✅ `getRecentRates(uint256 _count)`
- ✅ `isRateStale(uint256 _maxAge)`
- ✅ `getRateAge()`

Todas las funciones están completamente funcionales, documentadas y listas para usar en producción.
