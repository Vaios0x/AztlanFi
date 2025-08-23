import { useAccount, useContractWrite, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { parseEther } from 'viem';
import { getContractAddresses } from './contracts';

// ============================================================================
// TIPOS PARA OPERACIONES BATCH
// ============================================================================

export interface BatchMintData {
  recipients: string[];
  amounts: string[];
  reason: string;
}

export interface BatchRateUpdateData {
  rates: number[];
  sources: string[];
}

export interface BatchOperationStatus {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  hash: string | undefined;
}

// ============================================================================
// REMITTANCE TOKEN - BATCH OPERATIONS
// ============================================================================

export function useRemittanceTokenBatchOperations() {
  const { address } = useAccount();
  const chainId = useChainId();
  const contractAddresses = getContractAddresses(chainId || 10143);

  // Mint batch de tokens
  const { 
    data: mintBatchHash, 
    writeContract: mintBatch, 
    isPending: isMintingBatch,
    error: mintBatchError,
    reset: resetMintBatch
  } = useContractWrite();

  // Esperar confirmación de mint batch
  const { 
    isLoading: isConfirmingMintBatch, 
    isSuccess: isMintBatchSuccess, 
    isError: isMintBatchError,
    error: mintBatchConfirmError
  } = useWaitForTransactionReceipt({
    hash: mintBatchHash,
  });

  const executeMintBatch = (batchData: BatchMintData) => {
    if (!mintBatch) return;

    try {
      // Validar datos
      if (batchData.recipients.length !== batchData.amounts.length) {
        throw new Error('El número de destinatarios debe coincidir con el número de cantidades');
      }

      if (batchData.recipients.length === 0) {
        throw new Error('Debe proporcionar al menos un destinatario');
      }

      if (batchData.recipients.length > 100) {
        throw new Error('Máximo 100 destinatarios por operación batch');
      }

      // Validar direcciones
      const validRecipients = batchData.recipients.every(recipient => 
        /^0x[a-fA-F0-9]{40}$/.test(recipient)
      );
      if (!validRecipients) {
        throw new Error('Una o más direcciones de destinatarios no son válidas');
      }

      // Validar cantidades
      const validAmounts = batchData.amounts.every(amount => {
        const num = parseFloat(amount);
        return !isNaN(num) && num > 0;
      });
      if (!validAmounts) {
        throw new Error('Una o más cantidades no son válidas');
      }

      // Convertir cantidades a wei
      const amountsInWei = batchData.amounts.map(amount => parseEther(amount));

      // Ejecutar mint batch
      mintBatch({
        address: contractAddresses.RemittanceToken as `0x${string}`,
        abi: [
          {
            "inputs": [
              { "internalType": "address[]", "name": "_recipients", "type": "address[]" },
              { "internalType": "uint256[]", "name": "_amounts", "type": "uint256[]" },
              { "internalType": "string", "name": "_reason", "type": "string" }
            ],
            "name": "mintBatch",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
        functionName: 'mintBatch',
        args: [
          batchData.recipients as `0x${string}`[],
          amountsInWei,
          batchData.reason
        ],
      });
    } catch (error) {
      console.error('Error ejecutando mint batch:', error);
      throw error;
    }
  };

  return {
    // Función principal
    executeMintBatch,
    
    // Estados
    isMintingBatch,
    isConfirmingMintBatch,
    isMintBatchSuccess,
    isMintBatchError,
    
    // Datos
    mintBatchHash,
    
    // Errores
    mintBatchError,
    mintBatchConfirmError,
    
    // Utilidades
    resetMintBatch,
    
    // Estado combinado
    mintBatchStatus: {
      isPending: isMintingBatch || isConfirmingMintBatch,
      isSuccess: isMintBatchSuccess,
      isError: isMintBatchError,
      error: mintBatchError || mintBatchConfirmError || null,
      hash: mintBatchHash,
    } as BatchOperationStatus,
  };
}

// ============================================================================
// EXCHANGE RATE ORACLE - BATCH OPERATIONS
// ============================================================================

export function useExchangeRateOracleBatchOperations() {
  const { address } = useAccount();
  const chainId = useChainId();
  const contractAddresses = getContractAddresses(chainId || 10143);

  // Update rate batch
  const { 
    data: updateRateBatchHash, 
    writeContract: updateRateBatch, 
    isPending: isUpdatingRateBatch,
    error: updateRateBatchError,
    reset: resetUpdateRateBatch
  } = useContractWrite();

  // Esperar confirmación de update rate batch
  const { 
    isLoading: isConfirmingUpdateRateBatch, 
    isSuccess: isUpdateRateBatchSuccess, 
    isError: isUpdateRateBatchError,
    error: updateRateBatchConfirmError
  } = useWaitForTransactionReceipt({
    hash: updateRateBatchHash,
  });

  const executeUpdateRateBatch = (batchData: BatchRateUpdateData) => {
    if (!updateRateBatch) return;

    try {
      // Validar datos
      if (batchData.rates.length !== batchData.sources.length) {
        throw new Error('El número de tasas debe coincidir con el número de fuentes');
      }

      if (batchData.rates.length === 0) {
        throw new Error('Debe proporcionar al menos una tasa');
      }

      if (batchData.rates.length > 50) {
        throw new Error('Máximo 50 tasas por operación batch');
      }

      // Validar tasas (entre 10.00 y 50.00 MXN/USD)
      const validRates = batchData.rates.every(rate => {
        const num = parseFloat(rate.toString());
        return !isNaN(num) && num >= 10.00 && num <= 50.00;
      });
      if (!validRates) {
        throw new Error('Las tasas deben estar entre 10.00 y 50.00 MXN/USD');
      }

      // Validar fuentes
      const validSources = batchData.sources.every(source => 
        source.length > 0 && source.length <= 50
      );
      if (!validSources) {
        throw new Error('Las fuentes no pueden estar vacías y deben tener máximo 50 caracteres');
      }

      // Convertir tasas a formato del contrato (multiplicar por 100)
      const ratesInContractFormat = batchData.rates.map(rate => 
        BigInt(Math.floor(rate * 100))
      );

      // Ejecutar update rate batch
      updateRateBatch({
        address: contractAddresses.ExchangeRateOracle as `0x${string}`,
        abi: [
          {
            "inputs": [
              { "internalType": "uint256[]", "name": "_rates", "type": "uint256[]" },
              { "internalType": "string[]", "name": "_sources", "type": "string[]" }
            ],
            "name": "updateRateBatch",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
        functionName: 'updateRateBatch',
        args: [ratesInContractFormat, batchData.sources],
      });
    } catch (error) {
      console.error('Error ejecutando update rate batch:', error);
      throw error;
    }
  };

  return {
    // Función principal
    executeUpdateRateBatch,
    
    // Estados
    isUpdatingRateBatch,
    isConfirmingUpdateRateBatch,
    isUpdateRateBatchSuccess,
    isUpdateRateBatchError,
    
    // Datos
    updateRateBatchHash,
    
    // Errores
    updateRateBatchError,
    updateRateBatchConfirmError,
    
    // Utilidades
    resetUpdateRateBatch,
    
    // Estado combinado
    updateRateBatchStatus: {
      isPending: isUpdatingRateBatch || isConfirmingUpdateRateBatch,
      isSuccess: isUpdateRateBatchSuccess,
      isError: isUpdateRateBatchError,
      error: updateRateBatchError || updateRateBatchConfirmError || null,
      hash: updateRateBatchHash,
    } as BatchOperationStatus,
  };
}

// ============================================================================
// HOOK COMPUESTO PARA TODAS LAS OPERACIONES BATCH
// ============================================================================

export function useBatchOperations() {
  const remittanceTokenBatch = useRemittanceTokenBatchOperations();
  const exchangeRateOracleBatch = useExchangeRateOracleBatchOperations();

  return {
    // RemittanceToken batch operations
    ...remittanceTokenBatch,
    
    // ExchangeRateOracle batch operations
    ...exchangeRateOracleBatch,
  };
}

// ============================================================================
// UTILIDADES PARA OPERACIONES BATCH
// ============================================================================

export function useBatchOperationUtils() {
  // Función para validar datos de mint batch
  const validateMintBatchData = (batchData: BatchMintData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validar arrays
    if (!batchData.recipients || batchData.recipients.length === 0) {
      errors.push('Debe proporcionar al menos un destinatario');
    }

    if (!batchData.amounts || batchData.amounts.length === 0) {
      errors.push('Debe proporcionar al menos una cantidad');
    }

    if (batchData.recipients && batchData.amounts && batchData.recipients.length !== batchData.amounts.length) {
      errors.push('El número de destinatarios debe coincidir con el número de cantidades');
    }

    // Validar límites
    if (batchData.recipients && batchData.recipients.length > 100) {
      errors.push('Máximo 100 destinatarios por operación batch');
    }

    // Validar direcciones
    if (batchData.recipients) {
      const invalidAddresses = batchData.recipients.filter(recipient => 
        !/^0x[a-fA-F0-9]{40}$/.test(recipient)
      );
      if (invalidAddresses.length > 0) {
        errors.push(`${invalidAddresses.length} dirección(es) no son válidas`);
      }
    }

    // Validar cantidades
    if (batchData.amounts) {
      const invalidAmounts = batchData.amounts.filter(amount => {
        const num = parseFloat(amount);
        return isNaN(num) || num <= 0;
      });
      if (invalidAmounts.length > 0) {
        errors.push(`${invalidAmounts.length} cantidad(es) no son válidas`);
      }
    }

    // Validar razón
    if (!batchData.reason || batchData.reason.trim().length === 0) {
      errors.push('Debe proporcionar una razón para el mint batch');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Función para validar datos de update rate batch
  const validateUpdateRateBatchData = (batchData: BatchRateUpdateData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validar arrays
    if (!batchData.rates || batchData.rates.length === 0) {
      errors.push('Debe proporcionar al menos una tasa');
    }

    if (!batchData.sources || batchData.sources.length === 0) {
      errors.push('Debe proporcionar al menos una fuente');
    }

    if (batchData.rates && batchData.sources && batchData.rates.length !== batchData.sources.length) {
      errors.push('El número de tasas debe coincidir con el número de fuentes');
    }

    // Validar límites
    if (batchData.rates && batchData.rates.length > 50) {
      errors.push('Máximo 50 tasas por operación batch');
    }

    // Validar tasas
    if (batchData.rates) {
      const invalidRates = batchData.rates.filter(rate => {
        const num = parseFloat(rate.toString());
        return isNaN(num) || num < 10.00 || num > 50.00;
      });
      if (invalidRates.length > 0) {
        errors.push(`${invalidRates.length} tasa(s) fuera del rango válido (10.00-50.00 MXN/USD)`);
      }
    }

    // Validar fuentes
    if (batchData.sources) {
      const invalidSources = batchData.sources.filter(source => 
        !source || source.trim().length === 0 || source.length > 50
      );
      if (invalidSources.length > 0) {
        errors.push(`${invalidSources.length} fuente(s) no son válidas`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Función para formatear datos de mint batch para CSV
  const formatMintBatchForCSV = (batchData: BatchMintData): string => {
    const headers = ['Recipient', 'Amount (USD)', 'Reason'];
    const rows = batchData.recipients.map((recipient, index) => [
      recipient,
      batchData.amounts[index] || '0',
      batchData.reason
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  };

  // Función para formatear datos de update rate batch para CSV
  const formatUpdateRateBatchForCSV = (batchData: BatchRateUpdateData): string => {
    const headers = ['Rate (MXN/USD)', 'Source'];
    const rows = batchData.rates.map((rate, index) => [
      rate.toString(),
      batchData.sources[index] || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  };

  // Función para calcular el total de tokens en un mint batch
  const calculateMintBatchTotal = (batchData: BatchMintData): string => {
    const total = batchData.amounts.reduce((sum, amount) => {
      const num = parseFloat(amount);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
    return total.toFixed(2);
  };

  // Función para calcular estadísticas de tasas en un update rate batch
  const calculateRateBatchStats = (batchData: BatchRateUpdateData): {
    min: number;
    max: number;
    avg: number;
    count: number;
  } => {
    if (!batchData.rates || batchData.rates.length === 0) {
      return { min: 0, max: 0, avg: 0, count: 0 };
    }

    const validRates = batchData.rates.filter(rate => !isNaN(rate));
    if (validRates.length === 0) {
      return { min: 0, max: 0, avg: 0, count: 0 };
    }

    const min = Math.min(...validRates);
    const max = Math.max(...validRates);
    const avg = validRates.reduce((sum, rate) => sum + rate, 0) / validRates.length;

    return {
      min: parseFloat(min.toFixed(2)),
      max: parseFloat(max.toFixed(2)),
      avg: parseFloat(avg.toFixed(2)),
      count: validRates.length
    };
  };

  return {
    validateMintBatchData,
    validateUpdateRateBatchData,
    formatMintBatchForCSV,
    formatUpdateRateBatchForCSV,
    calculateMintBatchTotal,
    calculateRateBatchStats,
  };
}

// ============================================================================
// HOOKS ESPECIALIZADOS PARA UI
// ============================================================================

export function useBatchOperationUI() {
  // Función para obtener el estado visual de una operación batch
  const getBatchOperationStatus = (status: BatchOperationStatus) => {
    if (status.isPending) {
      return {
        text: 'Procesando...',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: '⏳'
      };
    }

    if (status.isSuccess) {
      return {
        text: 'Completado',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: '✅'
      };
    }

    if (status.isError) {
      return {
        text: 'Error',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: '❌'
      };
    }

    return {
      text: 'Pendiente',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      icon: '⏸️'
    };
  };

  // Función para obtener el progreso de una operación batch
  const getBatchOperationProgress = (status: BatchOperationStatus) => {
    if (status.isPending) {
      return 50; // Progreso indeterminado
    }
    if (status.isSuccess) {
      return 100;
    }
    if (status.isError) {
      return 0;
    }
    return 0;
  };

  return {
    getBatchOperationStatus,
    getBatchOperationProgress,
  };
}
