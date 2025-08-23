'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Calculator, TrendingUp, AlertCircle } from 'lucide-react';
import { PaymentCorridor } from '@/lib/constants/corridors';

interface AmountInputProps {
  amount: string;
  setAmount: (amount: string) => void;
  corridor?: PaymentCorridor;
}

export function AmountInput({ amount, setAmount, corridor }: AmountInputProps) {
  const [exchangeRate, setExchangeRate] = useState<number>(17.85); // MXN/USD default
  const [estimatedFee, setEstimatedFee] = useState<number>(0);
  const [estimatedTotal, setEstimatedTotal] = useState<number>(0);
  const [quickAmounts] = useState([50, 100, 200, 500, 1000, 2000]);
  
  // Calculate estimates when amount or corridor changes
  useEffect(() => {
    const numAmount = parseFloat(amount) || 0;
    const fee = corridor ? (numAmount * corridor.fee) / 100 : (numAmount * 0.5) / 100;
    const total = numAmount + fee;
    
    setEstimatedFee(fee);
    setEstimatedTotal(total);
  }, [amount, corridor]);
  
  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimals
    const regex = /^\d*\.?\d{0,2}$/;
    if (value === '' || regex.test(value)) {
      setAmount(value);
    }
  };
  
  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };
  
  const getDestinationAmount = () => {
    const numAmount = parseFloat(amount) || 0;
    return (numAmount * exchangeRate).toFixed(2);
  };
  
  const getDestinationCurrency = () => {
    if (!corridor) return 'MXN';
    return corridor.toCountry === 'Mexico' ? 'MXN' : 
           corridor.toCountry === 'Brazil' ? 'BRL' :
           corridor.toCountry === 'China' ? 'CNY' :
           corridor.toCountry === 'Japan' ? 'JPY' :
           corridor.toCountry === 'South Korea' ? 'KRW' :
           corridor.toCountry === 'India' ? 'INR' : 'USD';
  };
  
  return (
    <div className="space-y-6">
      {/* Main Amount Input */}
      <div className="relative">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
          Monto a enviar (USD)
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            id="amount"
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0.00"
            className="w-full pl-10 pr-4 py-4 text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            tabIndex={0}
            aria-label="Monto a enviar en dólares estadounidenses"
          />
        </div>
      </div>
      
      {/* Quick Amount Buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Montos rápidos
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {quickAmounts.map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => handleQuickAmount(quickAmount)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                amount === quickAmount.toString()
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
              tabIndex={0}
              aria-label={`Seleccionar monto de $${quickAmount}`}
            >
              ${quickAmount}
            </button>
          ))}
        </div>
      </div>
      
      {/* Exchange Rate and Destination Amount */}
      {amount && parseFloat(amount) > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Tipo de cambio:</span>
            </div>
            <span className="text-sm text-blue-700">
              1 USD = {exchangeRate} {getDestinationCurrency()}
            </span>
          </div>
          
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">Destinatario recibirá:</span>
              <span className="text-lg font-bold text-blue-900">
                {getDestinationAmount()} {getDestinationCurrency()}
              </span>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Fee Breakdown */}
      {amount && parseFloat(amount) > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-50 border border-gray-200 rounded-lg p-4"
        >
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Calculator className="w-4 h-4 mr-2" />
            Desglose de costos
          </h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Monto enviado:</span>
              <span className="font-medium">${parseFloat(amount).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Comisión ({corridor?.fee || 0.5}%):</span>
              <span className="font-medium text-red-600">-${estimatedFee.toFixed(2)}</span>
            </div>
            
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="font-medium text-gray-900">Total a pagar:</span>
                <span className="font-bold text-lg text-gray-900">${estimatedTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Savings Comparison */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Ahorro vs servicios tradicionales:</span>
              <span className="font-medium text-green-600">
                ${((parseFloat(amount) * 0.07) - estimatedFee).toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Validation Messages */}
      {amount && parseFloat(amount) > 0 && (
        <div className="space-y-2">
          {parseFloat(amount) < 10 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
              <div className="text-sm text-yellow-800">
                <strong>Monto mínimo:</strong> $10 USD para transacciones
              </div>
            </motion.div>
          )}
          
          {parseFloat(amount) > 10000 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center p-3 bg-orange-50 border border-orange-200 rounded-lg"
            >
              <AlertCircle className="w-5 h-5 text-orange-600 mr-3" />
              <div className="text-sm text-orange-800">
                <strong>Monto alto:</strong> Para montos superiores a $10,000, contacta soporte
              </div>
            </motion.div>
          )}
          
          {corridor && parseFloat(amount) > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm text-green-800">
                <strong>Liquidación:</strong> {corridor.settlementTime} • 
                <strong> Comisión:</strong> {corridor.fee}%
              </div>
            </motion.div>
          )}
        </div>
      )}
      
      {/* Corridor Info */}
      {corridor && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <span className="text-xl">{corridor.fromFlag}</span>
                <span className="text-gray-400">→</span>
                <span className="text-xl">{corridor.toFlag}</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{corridor.name}</h4>
                <p className="text-sm text-gray-600">
                  Volumen: {corridor.volume} • Tiempo: {corridor.settlementTime}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Comisión</div>
              <div className="text-lg font-bold text-green-600">{corridor.fee}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
