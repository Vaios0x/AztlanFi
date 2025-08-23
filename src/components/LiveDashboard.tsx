'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Clock, 
  Globe,
  Activity,
  BarChart3,
  PieChart,
  MapPin,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useEnvioAnalytics } from '@/lib/integrations/envioAnalytics';
import { corridors } from '@/lib/constants/corridors';

export function LiveDashboard() {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [selectedCorridor, setSelectedCorridor] = useState<string>('all');
  
  const { 
    dashboardMetrics, 
    corridorMetrics, 
    recentTransactions,
    corridorFlowData,
    isLoading,
    error 
  } = useEnvioAnalytics(timeRange);
  
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };
  
  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };
  
  const getChangeIcon = (change: number) => {
    return change >= 0 ? ArrowUpRight : ArrowDownRight;
  };
  
  const activeCorridors = corridors.filter(c => c.active);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard en Tiempo Real</h2>
          <p className="text-gray-600">Métricas globales y flujos de pago en vivo</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          {/* Time Range Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['1h', '24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          {/* Corridor Filter */}
          <select
            value={selectedCorridor}
            onChange={(e) => setSelectedCorridor(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los Corredores</option>
            {activeCorridors.map((corridor) => (
              <option key={corridor.id} value={corridor.id}>
                {corridor.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando métricas...</span>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <Activity className="w-5 h-5 text-red-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error al cargar métricas</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Metrics Grid */}
      {dashboardMetrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Total Volume */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Volumen Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(dashboardMetrics.totalVolume)}
                </p>
                <div className="flex items-center mt-2">
                  {(() => {
                    const ChangeIcon = getChangeIcon(dashboardMetrics.volumeChange);
                    return (
                      <>
                        <ChangeIcon className={`w-4 h-4 ${getChangeColor(dashboardMetrics.volumeChange)}`} />
                        <span className={`text-sm font-medium ${getChangeColor(dashboardMetrics.volumeChange)}`}>
                          {Math.abs(dashboardMetrics.volumeChange)}%
                        </span>
                      </>
                    );
                  })()}
                  <span className="text-sm text-gray-500 ml-1">vs período anterior</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          {/* Transaction Count */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transacciones</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(dashboardMetrics.transactionCount)}
                </p>
                <div className="flex items-center mt-2">
                  {(() => {
                    const ChangeIcon = getChangeIcon(dashboardMetrics.transactionChange);
                    return (
                      <>
                        <ChangeIcon className={`w-4 h-4 ${getChangeColor(dashboardMetrics.transactionChange)}`} />
                        <span className={`text-sm font-medium ${getChangeColor(dashboardMetrics.transactionChange)}`}>
                          {Math.abs(dashboardMetrics.transactionChange)}%
                        </span>
                      </>
                    );
                  })()}
                  <span className="text-sm text-gray-500 ml-1">vs período anterior</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          {/* Active Corridors */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Corredores Activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardMetrics.activeCorridors}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {dashboardMetrics.activeCorridors} de {activeCorridors.length} disponibles
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          {/* Average Settlement Time */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tiempo Promedio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardMetrics.avgSettlementTime}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Liquidación promedio
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Corridor Performance */}
      {corridorMetrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Top Corridors */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Corredores Principales
            </h3>
            
            <div className="space-y-4">
              {corridorMetrics.slice(0, 5).map((corridor, index) => (
                <div key={corridor.corridorId} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {corridors.find(c => c.id === corridor.corridorId)?.name || corridor.corridorId}
                      </p>
                      <p className="text-sm text-gray-500">
                        {corridor.transactionCount} transacciones
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(corridor.volume)}
                    </p>
                    <p className="text-sm text-green-600">
                      +{corridor.growthRate}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              Transacciones Recientes
            </h3>
            
            <div className="space-y-3">
              {recentTransactions?.slice(0, 5).map((tx, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(tx.amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {tx.corridor} • {tx.timestamp}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      tx.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : tx.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {tx.status === 'completed' ? 'Completada' : 
                       tx.status === 'pending' ? 'Pendiente' : 'Fallida'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Flow Visualization */}
      {corridorFlowData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
            Flujo de Pagos por Corredor
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {corridorFlowData.map((flow) => {
              const corridor = corridors.find(c => c.id === flow.corridorId);
              const percentage = (flow.volume / dashboardMetrics?.totalVolume || 1) * 100;
              
              return (
                <div key={flow.corridorId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {corridor?.name || flow.corridorId}
                    </span>
                    <span className="text-sm text-gray-500">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatCurrency(flow.volume)}</span>
                    <span>{flow.transactionCount} tx</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
      
      {/* Savings Impact */}
      {dashboardMetrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Impacto en Ahorros
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(dashboardMetrics.totalSavings)}
              </p>
              <p className="text-sm text-gray-600">Ahorro Total</p>
              <p className="text-xs text-gray-500 mt-1">
                vs servicios tradicionales
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {dashboardMetrics.avgSettlementTime}
              </p>
              <p className="text-sm text-gray-600">Tiempo Promedio</p>
              <p className="text-xs text-gray-500 mt-1">
                vs 3-5 días tradicional
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {dashboardMetrics.activeUsers}+
              </p>
              <p className="text-sm text-gray-600">Usuarios Activos</p>
              <p className="text-xs text-gray-500 mt-1">
                en {dashboardMetrics.activeCorridors} países
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
