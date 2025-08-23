'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  DollarSign, 
  Shield, 
  Smartphone, 
  CreditCard, 
  MapPin,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { OffRampMethod } from '@/lib/constants/corridors';

interface OffRampSelectorProps {
  selectedOffRamp: string;
  onSelectOffRamp: (offRampId: string) => void;
  offRampMethods: OffRampMethod[];
}

export function OffRampSelector({ 
  selectedOffRamp, 
  onSelectOffRamp, 
  offRampMethods 
}: OffRampSelectorProps) {
  const [filter, setFilter] = useState<'all' | 'instant' | 'bank' | 'cash'>('all');
  
  const filteredMethods = offRampMethods.filter(method => {
    if (filter === 'all') return true;
    if (filter === 'instant' && method.speed === 'Instant') return true;
    if (filter === 'bank' && (method.name.includes('Bank') || method.name.includes('SPEI') || method.name.includes('PIX'))) return true;
    if (filter === 'cash' && (method.name.includes('Cash') || method.name.includes('OXXO'))) return true;
    return false;
  });
  
  const getMethodIcon = (method: OffRampMethod) => {
    if (method.name.includes('SPEI') || method.name.includes('Bank')) return CreditCard;
    if (method.name.includes('OXXO') || method.name.includes('Cash')) return MapPin;
    if (method.name.includes('CoDi') || method.name.includes('QR')) return Smartphone;
    if (method.name.includes('P2P')) return Shield;
    if (method.name.includes('PIX')) return Smartphone;
    return DollarSign;
  };
  
  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'Instant': return 'text-green-600';
      case '5 minutes': return 'text-blue-600';
      case '30 minutes': return 'text-orange-600';
      case '1 hour': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };
  
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case '24/7': return 'text-green-600';
      case 'Business hours': return 'text-blue-600';
      case 'Weekdays': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todos los métodos
        </button>
        <button
          onClick={() => setFilter('instant')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'instant' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Clock className="w-4 h-4 inline mr-1" />
          Instantáneos
        </button>
        <button
          onClick={() => setFilter('bank')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'bank' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <CreditCard className="w-4 h-4 inline mr-1" />
          Bancarios
        </button>
        <button
          onClick={() => setFilter('cash')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'cash' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <MapPin className="w-4 h-4 inline mr-1" />
          Efectivo
        </button>
      </div>
      
      {/* Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMethods.map((method, index) => {
          const Icon = getMethodIcon(method);
          const isSelected = selectedOffRamp === method.id;
          
          return (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => onSelectOffRamp(method.id)}
              className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              
              {/* Method Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{method.name}</h3>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
                <span className="text-2xl">{method.icon}</span>
              </div>
              
              {/* Method Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Velocidad:</span>
                  <span className={`font-medium ${getSpeedColor(method.speed)}`}>
                    <Clock className="w-4 h-4 inline mr-1" />
                    {method.speed}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Disponibilidad:</span>
                  <span className={`font-medium ${getAvailabilityColor(method.availability)}`}>
                    {method.availability}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Comisión:</span>
                  <span className={`font-medium ${method.fee === 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {method.fee === 0 ? 'Gratis' : `$${method.fee}`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Límites:</span>
                  <span className="font-medium text-gray-900">
                    ${method.minAmount} - ${method.maxAmount.toLocaleString()}
                  </span>
                </div>
              </div>
              
              {/* Method Features */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-1">
                  {method.speed === 'Instant' && (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      <Clock className="w-3 h-3 mr-1" />
                      Instantáneo
                    </span>
                  )}
                  {method.fee === 0 && (
                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      <DollarSign className="w-3 h-3 mr-1" />
                      Sin comisión
                    </span>
                  )}
                  {method.availability === '24/7' && (
                    <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      <Clock className="w-3 h-3 mr-1" />
                      24/7
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Empty State */}
      {filteredMethods.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Info className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay métodos disponibles
          </h3>
          <p className="text-gray-600">
            Intenta cambiar los filtros para ver más opciones
          </p>
        </motion.div>
      )}
      
      {/* Selection Summary */}
      {selectedOffRamp && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <h4 className="font-medium text-green-800">
                Método seleccionado: {offRampMethods.find(m => m.id === selectedOffRamp)?.name}
              </h4>
              <p className="text-sm text-green-700">
                Velocidad: {offRampMethods.find(m => m.id === selectedOffRamp)?.speed} • 
                Comisión: {offRampMethods.find(m => m.id === selectedOffRamp)?.fee === 0 ? 'Gratis' : `$${offRampMethods.find(m => m.id === selectedOffRamp)?.fee}`}
              </p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Method Comparison */}
      {offRampMethods.length > 1 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Info className="w-4 h-4 mr-2" />
            Comparación de métodos
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">Método</th>
                  <th className="text-center py-2">Velocidad</th>
                  <th className="text-center py-2">Comisión</th>
                  <th className="text-center py-2">Disponibilidad</th>
                </tr>
              </thead>
              <tbody>
                {offRampMethods.map((method) => (
                  <tr key={method.id} className="border-b border-gray-100">
                    <td className="py-2">
                      <div className="flex items-center space-x-2">
                        <span>{method.icon}</span>
                        <span className="font-medium">{method.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-2">
                      <span className={getSpeedColor(method.speed)}>{method.speed}</span>
                    </td>
                    <td className="text-center py-2">
                      <span className={method.fee === 0 ? 'text-green-600' : 'text-red-600'}>
                        {method.fee === 0 ? 'Gratis' : `$${method.fee}`}
                      </span>
                    </td>
                    <td className="text-center py-2">
                      <span className={getAvailabilityColor(method.availability)}>
                        {method.availability}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          Seguridad y Confianza
        </h3>
        <p className="text-sm text-blue-700">
          Todos los métodos de entrega están protegidos por nuestro sistema de escrow P2P. 
          El dinero se libera solo después de confirmar la entrega exitosa.
        </p>
      </div>
    </div>
  );
}
