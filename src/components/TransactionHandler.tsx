'use client';

import { useState, useCallback, useRef } from 'react';
import { Activity, CheckCircle, AlertTriangle } from 'lucide-react';

interface TransactionHandlerProps {
  onTransactionStart: () => Promise<void>;
  onTransactionSuccess: (hash: string) => void;
  onTransactionError: (error: string) => void;
  isConnected: boolean;
  chainId: number;
  children: React.ReactNode;
}

export function TransactionHandler({
  onTransactionStart,
  onTransactionSuccess,
  onTransactionError,
  isConnected,
  chainId,
  children
}: TransactionHandlerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleTransaction = useCallback(async () => {
    if (isProcessing) return;

    // Validaciones
    if (!isConnected) {
      onTransactionError('Conecta tu wallet primero');
      return;
    }

    if (chainId !== 10143) {
      onTransactionError('Debes estar conectado a Monad testnet (Chain ID: 10143)');
      return;
    }

    setIsProcessing(true);
    setStatus('pending');
    setMessage('Iniciando transacción...');

    // Crear abort controller para cancelar si es necesario
    abortControllerRef.current = new AbortController();

    try {
      await onTransactionStart();
      setStatus('success');
      setMessage('Transacción completada exitosamente');
      
      // Limpiar estado después de 3 segundos
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);

    } catch (error: any) {
      console.error('Error en transacción:', error);
      setStatus('error');
      setMessage(error.message || 'Error desconocido');
      onTransactionError(error.message || 'Error desconocido');
      
      // Limpiar estado después de 5 segundos
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
    }
  }, [isProcessing, isConnected, chainId, onTransactionStart, onTransactionSuccess, onTransactionError]);

  const cancelTransaction = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsProcessing(false);
      setStatus('idle');
      setMessage('');
    }
  }, []);

  return (
    <div>
      {children}
      
      {/* Status Indicator */}
      {status !== 'idle' && (
        <div className="fixed top-4 right-4 z-50 bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg">
          <div className="flex items-center space-x-3">
            {status === 'pending' && (
              <>
                <Activity className="w-5 h-5 animate-spin text-blue-400" />
                <div>
                  <p className="text-sm text-white font-medium">Procesando...</p>
                  <p className="text-xs text-gray-400">{message}</p>
                </div>
                <button
                  onClick={cancelTransaction}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Cancelar
                </button>
              </>
            )}
            
            {status === 'success' && (
              <>
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm text-white font-medium">¡Éxito!</p>
                  <p className="text-xs text-gray-400">{message}</p>
                </div>
              </>
            )}
            
            {status === 'error' && (
              <>
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-sm text-white font-medium">Error</p>
                  <p className="text-xs text-gray-400">{message}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
