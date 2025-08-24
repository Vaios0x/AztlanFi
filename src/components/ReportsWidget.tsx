'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'

interface ReportsWidgetProps {
  className?: string
}

export function ReportsWidget({ className = '' }: ReportsWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  // Datos simplificados para el widget
  const widgetData = {
    totalMoney: 1250000,
    totalSends: 15432,
    averageSend: 81.25,
    successRate: 98.5,
    monthlyGrowth: 12.5,
    dailyGrowth: 8.2
  }

  const handleViewFullReports = () => {
    toast.success('Abriendo reportes completos...')
    setTimeout(() => {
      router.push('/reports')
    }, 1000)
  }

  const handleExportQuickReport = () => {
    toast.success('Reporte descargado exitosamente')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-monad-600 to-purple-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Activity Summary</h3>
            <p className="text-sm text-gray-300">How your service usage is going</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportQuickReport}
            className="p-2 text-gray-400 hover:text-monad-400 hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Download report"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-400 hover:text-monad-400 hover:bg-gray-700 rounded-lg transition-colors"
            aria-label={isExpanded ? 'Show less' : 'Show more'}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-900 to-cyan-900 p-4 rounded-lg border border-blue-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-300 font-medium">Money Sent</span>
            <DollarSign className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xl font-bold text-white">
            ${(widgetData.totalMoney / 1000000).toFixed(1)}M
          </p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-300">+{widgetData.monthlyGrowth}% this month</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-900 to-emerald-900 p-4 rounded-lg border border-green-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-300 font-medium">Transactions Made</span>
            <Activity className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-xl font-bold text-white">
            {widgetData.totalSends.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-300">+{widgetData.dailyGrowth}% today</span>
          </div>
        </div>
      </div>

      {/* Métricas secundarias */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-700 rounded-lg border border-gray-600">
          <p className="text-sm text-gray-300 mb-1">Average per Transaction</p>
          <p className="text-lg font-bold text-white">${widgetData.averageSend}</p>
        </div>
        <div className="text-center p-3 bg-gray-700 rounded-lg border border-gray-600">
          <p className="text-sm text-gray-300 mb-1">Successful Transactions</p>
          <p className="text-lg font-bold text-white">{widgetData.successRate}%</p>
        </div>
      </div>

      {/* Contenido expandible */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-600 pt-4"
          >
            <div className="space-y-4">
              {/* Gráfico visual de envíos diarios */}
              <div>
                <h4 className="text-sm font-medium text-white mb-3">Last Week's Transactions</h4>
                <div className="h-24 flex items-end justify-between gap-2 mb-2">
                  {[
                    { day: 'Lun', value: 45, color: 'from-blue-500 to-blue-600' },
                    { day: 'Mar', value: 52, color: 'from-green-500 to-green-600' },
                    { day: 'Mié', value: 38, color: 'from-purple-500 to-purple-600' },
                    { day: 'Jue', value: 67, color: 'from-orange-500 to-orange-600' },
                    { day: 'Vie', value: 89, color: 'from-red-500 to-red-600' },
                    { day: 'Sáb', value: 76, color: 'from-indigo-500 to-indigo-600' },
                    { day: 'Dom', value: 54, color: 'from-pink-500 to-pink-600' }
                  ].map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center group">
                      <div className="relative w-full">
                        <div
                          className={`w-full bg-gradient-to-t ${item.color} rounded-t transition-all duration-500 hover:scale-105`}
                          style={{ height: `${(item.value / 100) * 100}%` }}
                        />
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.value} transactions
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 mt-1">{item.day}</span>
                    </div>
                  ))}
                </div>
                
                {/* Línea de promedio */}
                <div className="relative">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gray-600 opacity-50"></div>
                  <div className="text-xs text-gray-500 text-center mt-1">
                    Average: 60 transactions/day
                  </div>
                </div>
              </div>

              {/* Gráfico de volumen mensual */}
              <div>
                <h4 className="text-sm font-medium text-white mb-3">Monthly Volume</h4>
                <div className="h-24 flex items-end justify-between gap-1 mb-2">
                  {[
                    { month: 'Ene', volume: 85 },
                    { month: 'Feb', volume: 92 },
                    { month: 'Mar', volume: 78 },
                    { month: 'Abr', volume: 105 },
                    { month: 'May', volume: 120 },
                    { month: 'Jun', volume: 95 },
                    { month: 'Jul', volume: 110 },
                    { month: 'Ago', volume: 125 },
                    { month: 'Sep', volume: 115 },
                    { month: 'Oct', volume: 130 },
                    { month: 'Nov', volume: 140 },
                    { month: 'Dic', volume: 150 }
                  ].map((item, index) => {
                    const heightPercentage = (item.volume / 150) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center group">
                        <div className="relative w-full h-full flex items-end">
                          <div
                            className="w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded-t transition-all duration-500 hover:scale-105"
                            style={{ 
                              height: `${Math.max(heightPercentage, 5)}%`,
                              minHeight: '4px'
                            }}
                          />
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            ${item.volume}K
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 mt-1">{item.month}</span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Resumen del volumen */}
                <div className="text-center">
                  <div className="text-xs text-gray-500">
                    Annual total: $1.34M | Average: $112K/month
                  </div>
                </div>
              </div>

              {/* Gráfico de países populares */}
              <div>
                <h4 className="text-sm font-medium text-white mb-3">Países Más Populares</h4>
                <div className="grid grid-cols-2 gap-4">
                  {/* Gráfico circular simple */}
                  <div className="relative w-24 h-24 mx-auto">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#374151"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        strokeDasharray="36, 100"
                        strokeDashoffset="23.04"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2"
                        strokeDasharray="36, 100"
                        strokeDashoffset="36"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="2"
                        strokeDasharray="36, 100"
                        strokeDashoffset="42.48"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-semibold text-white">Total</span>
                    </div>
                  </div>
                  
                  {/* Lista de países */}
                  <div className="space-y-2">
                    {[
                      { country: 'México', volume: 450000, percentage: 36, color: '#3B82F6' },
                      { country: 'Colombia', volume: 280000, percentage: 22, color: '#10B981' },
                      { country: 'Perú', volume: 195000, percentage: 16, color: '#F59E0B' }
                    ].map((destination, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: destination.color }}
                          />
                          <span className="text-sm text-gray-300">{destination.country}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">${(destination.volume / 1000).toFixed(0)}K</p>
                          <p className="text-xs text-gray-400">{destination.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Resumen de rendimiento */}
              <div className="bg-gradient-to-r from-monad-900 to-purple-900 p-4 rounded-lg border border-monad-700">
                <h4 className="text-sm font-medium text-white mb-2">How's the Service Going?</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Tiempo promedio:</span>
                    <span className="font-medium text-green-400">Menos de 1 minuto</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Servicio disponible:</span>
                    <span className="font-medium text-green-400">99.9% del tiempo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Ahorro promedio:</span>
                    <span className="font-medium text-green-400">$35 por envío</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón para ver reportes completos */}
      <button
        onClick={handleViewFullReports}
        className="w-full mt-4 bg-gradient-to-r from-monad-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
      >
        <BarChart3 className="w-4 h-4" />
        Ver Reportes Completos
      </button>
    </motion.div>
  )
}
