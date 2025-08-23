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

     // Mock data for widget
  const widgetData = {
    totalVolume: 1250000,
    totalTransactions: 15432,
    averageTransaction: 81.25,
    successRate: 98.5,
    monthlyGrowth: 12.5,
    dailyGrowth: 8.2
  }

  const handleViewFullReports = () => {
    toast.success('Redirecting to full reports...')
    setTimeout(() => {
      router.push('/reports')
    }, 1000)
  }

  const handleExportQuickReport = () => {
    toast.success('Quick report exported')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-monad-600 to-purple-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
                     <div>
             <h3 className="text-lg font-semibold text-gray-900">Quick Reports</h3>
             <p className="text-sm text-gray-600">Key system metrics</p>
           </div>
        </div>
        <div className="flex items-center gap-2">
                     <button
             onClick={handleExportQuickReport}
             className="p-2 text-gray-400 hover:text-monad-600 hover:bg-monad-50 rounded-lg transition-colors"
             aria-label="Export quick report"
           >
             <Download className="w-4 h-4" />
           </button>
           <button
             onClick={() => setIsExpanded(!isExpanded)}
             className="p-2 text-gray-400 hover:text-monad-600 hover:bg-monad-50 rounded-lg transition-colors"
             aria-label={isExpanded ? 'Collapse' : 'Expand'}
           >
             <Eye className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-600 font-medium">Total Volume</span>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold text-blue-900">
            ${(widgetData.totalVolume / 1000000).toFixed(1)}M
          </p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-600">+{widgetData.monthlyGrowth}%</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-600 font-medium">Transactions</span>
            <Activity className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-xl font-bold text-green-900">
            {widgetData.totalTransactions.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-600">+{widgetData.dailyGrowth}%</span>
          </div>
        </div>
      </div>

      {/* Métricas secundarias */}
      <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className="text-center p-3 bg-gray-50 rounded-lg">
           <p className="text-sm text-gray-600 mb-1">Average/Tx</p>
           <p className="text-lg font-bold text-gray-900">${widgetData.averageTransaction}</p>
         </div>
         <div className="text-center p-3 bg-gray-50 rounded-lg">
           <p className="text-sm text-gray-600 mb-1">Success Rate</p>
           <p className="text-lg font-bold text-gray-900">{widgetData.successRate}%</p>
         </div>
      </div>

      {/* Contenido expandible */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-100 pt-4"
          >
            <div className="space-y-4">
              {/* Gráfico simple de transacciones diarias */}
                             <div>
                 <h4 className="text-sm font-medium text-gray-900 mb-3">Transactions Last 7 Days</h4>
                <div className="h-20 flex items-end justify-between gap-1">
                  {[45, 52, 38, 67, 89, 76, 54].map((value, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-gradient-to-t from-monad-600 to-monad-400 rounded-t"
                      style={{ height: `${(value / 100) * 100}%` }}
                    />
                  ))}
                </div>
                                 <div className="flex justify-between text-xs text-gray-500 mt-2">
                   <span>Mon</span>
                   <span>Tue</span>
                   <span>Wed</span>
                   <span>Thu</span>
                   <span>Fri</span>
                   <span>Sat</span>
                   <span>Sun</span>
                 </div>
              </div>

              {/* Top 3 destinos */}
                             <div>
                 <h4 className="text-sm font-medium text-gray-900 mb-3">Top Destinations</h4>
                <div className="space-y-2">
                  {[
                    { country: 'México', volume: 450000, percentage: 36 },
                    { country: 'Colombia', volume: 280000, percentage: 22 },
                    { country: 'Perú', volume: 195000, percentage: 16 }
                  ].map((destination, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-monad-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-monad-600">{index + 1}</span>
                        </div>
                        <span className="text-sm text-gray-700">{destination.country}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">${(destination.volume / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-gray-500">{destination.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen de rendimiento */}
                             <div className="bg-gradient-to-r from-monad-50 to-purple-50 p-4 rounded-lg">
                 <h4 className="text-sm font-medium text-gray-900 mb-2">Performance Summary</h4>
                 <div className="space-y-2 text-sm">
                   <div className="flex justify-between">
                     <span className="text-gray-600">Average time:</span>
                     <span className="font-medium text-green-600">0.8s</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-600">Uptime:</span>
                     <span className="font-medium text-green-600">99.9%</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-600">Average savings:</span>
                     <span className="font-medium text-green-600">$35/tx</span>
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
         className="w-full mt-4 btn-primary flex items-center justify-center gap-2"
       >
         <BarChart3 className="w-4 h-4" />
         View Full Reports
       </button>
    </motion.div>
  )
}
