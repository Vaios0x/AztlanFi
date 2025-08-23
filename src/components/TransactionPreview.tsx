'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Clock, 
  DollarSign, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Copy,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { PaymentCorridor, OffRampMethod } from '@/lib/constants/corridors';

interface Recipient {
  name: string;
  phone: string;
  email: string;
  address: string;
  bankAccount: string;
}

interface TransactionPreviewProps {
  corridor?: PaymentCorridor;
  amount: string;
  recipient: Recipient;
  offRamp?: OffRampMethod;
  onConfirm: () => void;
  isProcessing: boolean;
  transactionHash?: string;
}

export function TransactionPreview({
  corridor,
  amount,
  recipient,
  offRamp,
  onConfirm,
  isProcessing,
  transactionHash
}: TransactionPreviewProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [copiedField, setCopiedField] = useState<string>('');
  
  const numAmount = parseFloat(amount) || 0;
  const fee = corridor ? (numAmount * corridor.fee) / 100 : (numAmount * 0.5) / 100;
  const total = numAmount + fee;
  const destinationAmount = numAmount * 17.85; // Mock exchange rate
  
  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  const getTransactionStatus = () => {
    if (transactionHash) return 'completed';
    if (isProcessing) return 'processing';
    return 'pending';
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'processing': return 'text-blue-600';
      case 'pending': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'processing': return Loader2;
      case 'pending': return Clock;
      default: return Clock;
    }
  };
  
  const status = getTransactionStatus();
  const StatusIcon = getStatusIcon(status);
  
  return (
    <div className="space-y-6">
      {/* Transaction Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Resumen de la Transacción</h3>
          <div className={`flex items-center space-x-2 ${getStatusColor(status)}`}>
            <StatusIcon className={`w-5 h-5 ${status === 'processing' ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">
              {status === 'completed' && 'Completada'}
              {status === 'processing' && 'Procesando...'}
              {status === 'pending' && 'Pendiente de confirmación'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Corredor:</span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{corridor?.fromFlag}</span>
                <span className="text-gray-400">→</span>
                <span className="text-2xl">{corridor?.toFlag}</span>
                <span className="font-medium">{corridor?.name}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Monto enviado:</span>
              <span className="font-bold text-lg">${numAmount.toFixed(2)} USD</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Comisión:</span>
              <span className="text-red-600">-${fee.toFixed(2)}</span>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="font-medium text-gray-900">Total a pagar:</span>
              <span className="font-bold text-xl text-gray-900">${total.toFixed(2)} USD</span>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Destinatario recibirá:</span>
              <span className="font-bold text-lg text-green-600">
                {destinationAmount.toFixed(2)} MXN
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Método de entrega:</span>
              <span className="font-medium">{offRamp?.name}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tiempo estimado:</span>
              <span className="font-medium">{offRamp?.speed}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Disponibilidad:</span>
              <span className="font-medium">{offRamp?.availability}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recipient Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
          Información del Destinatario
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Nombre:</span>
              <span className="font-medium">{recipient.name}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Teléfono:</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{recipient.phone}</span>
                <button
                  onClick={() => copyToClipboard(recipient.phone, 'phone')}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  aria-label="Copiar número de teléfono"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {recipient.email && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{recipient.email}</span>
                  <button
                    onClick={() => copyToClipboard(recipient.email, 'email')}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    aria-label="Copiar email"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            {recipient.address && (
              <div className="flex items-start justify-between">
                <span className="text-gray-600">Dirección:</span>
                <div className="flex items-start space-x-2">
                  <span className="font-medium text-right max-w-xs">{recipient.address}</span>
                  <button
                    onClick={() => copyToClipboard(recipient.address, 'address')}
                    className="text-blue-600 hover:text-blue-800 transition-colors mt-1"
                    aria-label="Copiar dirección"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            
            {recipient.bankAccount && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cuenta bancaria:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{recipient.bankAccount}</span>
                  <button
                    onClick={() => copyToClipboard(recipient.bankAccount, 'bank')}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    aria-label="Copiar número de cuenta"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Copy Success Messages */}
        {copiedField && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-2 bg-green-100 text-green-800 text-sm rounded-lg text-center"
          >
            ¡{copiedField === 'phone' ? 'Número de teléfono' : 
               copiedField === 'email' ? 'Email' : 
               copiedField === 'address' ? 'Dirección' : 
               'Número de cuenta'} copiado al portapapeles!
          </motion.div>
        )}
      </div>
      
      {/* Transaction Details */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="text-lg font-semibold text-gray-900">Detalles de la Transacción</h3>
          <motion.div
            animate={{ rotate: showDetails ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </button>
        
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de Corredor:</span>
                  <span className="font-mono">{corridor?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Volumen del Corredor:</span>
                  <span>{corridor?.volume}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tiempo de Liquidación:</span>
                  <span>{corridor?.settlementTime}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Método ID:</span>
                  <span className="font-mono">{offRamp?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Límite Mínimo:</span>
                  <span>${offRamp?.minAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Límite Máximo:</span>
                  <span>${offRamp?.maxAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {transactionHash && (
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Hash de Transacción:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">{transactionHash.slice(0, 10)}...</span>
                    <button
                      onClick={() => copyToClipboard(transactionHash, 'hash')}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      aria-label="Copiar hash de transacción"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <a
                      href={`https://explorer.monad.xyz/tx/${transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      aria-label="Ver transacción en el explorador"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
      
      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-800 mb-1">
              Transacción Segura
            </h3>
            <p className="text-sm text-blue-700">
              Esta transacción está protegida por nuestro sistema de escrow P2P y la blockchain de Monad. 
              El dinero se libera automáticamente una vez confirmada la entrega exitosa.
            </p>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      {!transactionHash && (
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Procesando Transacción...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Confirmar y Enviar
              </>
            )}
          </button>
          
          <button
            onClick={() => window.history.back()}
            disabled={isProcessing}
            className="px-6 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancelar
          </button>
        </div>
      )}
      
      {/* Success Message */}
      {transactionHash && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            ¡Transacción Completada!
          </h3>
          <p className="text-green-700 mb-4">
            Tu dinero ha sido enviado exitosamente. El destinatario recibirá la notificación en breve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Ver en Dashboard
            </button>
            <button
              onClick={() => window.location.href = '/dashboard/send'}
              className="border border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors"
            >
              Enviar Otro
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
