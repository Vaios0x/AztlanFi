'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Loader2,
  ExternalLink,
  Copy
} from 'lucide-react';

interface TransactionStatusProps {
  isVisible: boolean;
  transactionHash?: string;
  status: 'pending' | 'confirmed' | 'failed' | 'idle';
  message: string;
  onClose: () => void;
}

export function TransactionStatus({ 
  isVisible, 
  transactionHash, 
  status, 
  message, 
  onClose 
}: TransactionStatusProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (transactionHash) {
      try {
        await navigator.clipboard.writeText(transactionHash);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />;
      case 'confirmed':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'failed':
        return <AlertTriangle className="w-6 h-6 text-red-400" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'border-blue-500 bg-blue-500/10';
      case 'confirmed':
        return 'border-green-500 bg-green-500/10';
      case 'failed':
        return 'border-red-500 bg-red-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Transacción Pendiente';
      case 'confirmed':
        return 'Transacción Confirmada';
      case 'failed':
        return 'Transacción Fallida';
      default:
        return 'Esperando Transacción';
    }
  };

  const getExplorerUrl = () => {
    if (!transactionHash) return '';
    return `https://testnet.monadscan.com/tx/${transactionHash}`;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className={`fixed bottom-4 right-4 z-50 max-w-md w-full ${getStatusColor()} border rounded-lg p-4 shadow-xl`}
        >
          <div className="flex items-start space-x-3">
            {getStatusIcon()}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">
                  {getStatusText()}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
              
              <p className="text-sm text-gray-300 mb-3">
                {message}
              </p>
              
              {transactionHash && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">Hash:</span>
                    <code className="text-xs text-gray-300 font-mono bg-gray-800 px-2 py-1 rounded">
                      {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="text-gray-400 hover:text-white transition-colors"
                      title="Copiar hash"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {copied && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-green-400"
                    >
                      Hash copiado al portapapeles
                    </motion.div>
                  )}
                  
                  <div className="flex space-x-2">
                    <a
                      href={getExplorerUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Ver en explorador</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {status === 'pending' && (
            <div className="mt-3">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-blue-400 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Confirmando transacción...
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
