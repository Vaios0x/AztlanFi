'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { PaymentCorridor } from '@/lib/constants/corridors';

interface CorridorSelectorProps {
  selectedCorridor: PaymentCorridor | null;
  onSelectCorridor: (corridor: PaymentCorridor) => void;
  className?: string;
}

export function CorridorSelector({ 
  selectedCorridor, 
  onSelectCorridor, 
  className = '' 
}: CorridorSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'popular' | 'recent'>('all');

  const filteredCorridors = useMemo(() => {
    let corridors = corridors.filter(corridor => 
      corridor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      corridor.fromCountry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      corridor.toCountry.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (filter) {
      case 'popular':
        corridors = corridors.filter(c => c.priority);
        break;
      case 'recent':
        corridors = corridors.filter(c => c.active);
        break;
      default:
        break;
    }

    return corridors;
  }, [searchTerm, filter]);

  const getCorridorColor = (corridor: PaymentCorridor) => {
    const colors = {
      'USA-Mexico': 'from-blue-500 to-green-500',
      'China-Mexico': 'from-red-500 to-green-500',
      'USA-Brazil': 'from-blue-500 to-yellow-500',
      'Japan-Mexico': 'from-red-500 to-green-500',
      'Korea-LatAm': 'from-blue-500 to-purple-500',
      'India-LatAm': 'from-orange-500 to-purple-500',
      'Brazil-Mexico': 'from-yellow-500 to-green-500',
      'Europe-LatAm': 'from-blue-500 to-green-500'
    };
    return colors[corridor.id as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Selecciona tu Corredor de Pago
        </h2>
        <p className="text-gray-600">
          Conectamos 20+ países a través de 32 corredores estratégicos (16 pares bidireccionales)
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por país o corredor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-monad-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'Todos', icon: Filter },
            { key: 'popular', label: 'Populares', icon: Star },
            { key: 'recent', label: 'Recientes', icon: TrendingUp }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === key
                  ? 'bg-monad-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Corridors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredCorridors.map((corridor, index) => (
            <motion.div
              key={corridor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => onSelectCorridor(corridor)}
              className={`corridor-card cursor-pointer group relative overflow-hidden ${
                selectedCorridor?.id === corridor.id ? 'ring-2 ring-monad-500 scale-105' : ''
              }`}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getCorridorColor(corridor)} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
              
              {/* Popular Badge */}
              {corridor.priority && (
                <div className="absolute top-3 right-3">
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Popular
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="relative z-10">
                {/* Flags and Name */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="corridor-flag">{corridor.fromFlag}</span>
                    <div className="w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400" />
                    <span className="corridor-flag">{corridor.toFlag}</span>
                  </div>
                  {corridor.active && (
                    <div className="status-indicator status-online" />
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-monad-600 transition-colors">
                  {corridor.name}
                </h3>

                {/* Metrics */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>Volumen</span>
                    </div>
                    <span className="font-semibold text-gray-900">{corridor.volume}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>Comisión</span>
                    </div>
                    <span className="font-semibold text-green-600">{corridor.fee}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Tiempo</span>
                    </div>
                    <span className="font-semibold text-gray-900">{corridor.settlementTime}</span>
                  </div>
                </div>

                {/* Off-ramp Methods */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Métodos de entrega:</p>
                  <div className="flex flex-wrap gap-1">
                    {corridor.offRampMethods.slice(0, 3).map((method, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {method.name}
                      </span>
                    ))}
                    {corridor.offRampMethods.length > 3 && (
                      <span className="bg-monad-100 text-monad-700 px-2 py-1 rounded-full text-xs">
                        +{corridor.offRampMethods.length - 3} más
                      </span>
                    )}
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedCorridor?.id === corridor.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 left-3 w-6 h-6 bg-monad-600 rounded-full flex items-center justify-center"
                  >
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </motion.div>
                )}
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-monad-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredCorridors.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron corredores
          </h3>
          <p className="text-gray-600">
            Intenta con otros términos de búsqueda o cambia el filtro
          </p>
        </motion.div>
      )}

      {/* Selected Corridor Summary */}
      {selectedCorridor && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-monad-50 to-purple-50 border border-monad-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-2">
                <span className="corridor-flag">{selectedCorridor.fromFlag}</span>
                <div className="w-6 h-0.5 bg-gradient-to-r from-monad-400 to-purple-400" />
                <span className="corridor-flag">{selectedCorridor.toFlag}</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{selectedCorridor.name}</h4>
                <p className="text-sm text-gray-600">
                  Comisión: {selectedCorridor.fee} • Tiempo: {selectedCorridor.settlementTime}
                </p>
              </div>
            </div>
            <div className="badge-success">
              Seleccionado
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
