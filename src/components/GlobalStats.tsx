'use client';

import { motion } from 'framer-motion';
import { 
  Globe, 
  DollarSign, 
  Users, 
  Zap, 
  TrendingUp, 
  Clock,
  Shield,
  Award
} from 'lucide-react';

interface GlobalStatsProps {
  className?: string;
}

export function GlobalStats({ className = '' }: GlobalStatsProps) {
  const stats = [
    {
      icon: DollarSign,
      value: '$2.5M+',
      label: 'Volumen Total',
      description: 'Procesado en Monad',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-gray-800',
      borderColor: 'border-gray-700',
      textColor: 'text-white',
      labelColor: 'text-gray-300',
      descColor: 'text-gray-400'
    },
    {
      icon: Users,
      value: '15K+',
      label: 'Usuarios Activos',
      description: 'En 20+ países',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-gray-800',
      borderColor: 'border-gray-700',
      textColor: 'text-white',
      labelColor: 'text-gray-300',
      descColor: 'text-gray-400'
    },
    {
      icon: Globe,
      value: '32',
      label: 'Corredores',
      description: '16 pares bidireccionales',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-gray-800',
      borderColor: 'border-gray-700',
      textColor: 'text-white',
      labelColor: 'text-gray-300',
      descColor: 'text-gray-400'
    },
    {
      icon: Clock,
      value: '<1s',
      label: 'Liquidación',
      description: 'Velocidad Monad',
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-gray-800',
      borderColor: 'border-gray-700',
      textColor: 'text-white',
      labelColor: 'text-gray-300',
      descColor: 'text-gray-400'
    },
    {
      icon: TrendingUp,
      value: '95%',
      label: 'Ahorro',
      description: 'vs servicios tradicionales',
      color: 'from-teal-500 to-green-600',
      bgColor: 'bg-gray-800',
      borderColor: 'border-gray-700',
      textColor: 'text-white',
      labelColor: 'text-gray-300',
      descColor: 'text-gray-400'
    },
    {
      icon: Shield,
      value: '99.9%',
      label: 'Uptime',
      description: 'Disponibilidad garantizada',
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-gray-800',
      borderColor: 'border-gray-700',
      textColor: 'text-white',
      labelColor: 'text-gray-300',
      descColor: 'text-gray-400'
    }
  ];

  const achievements = [
    {
      icon: Award,
      title: 'Mobil3 Hackathon Finalist',
      description: 'Payments Track',
      badge: '🏆'
    },
    {
      icon: Zap,
      title: 'Monad Blockchain',
      description: '10,000 TPS',
      badge: '⚡'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: '20+ países, 32 corredores',
      badge: '🌍'
    }
  ];

  return (
    <div className={`space-y-12 ${className}`}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`${stat.bgColor} ${stat.borderColor} border rounded-2xl p-6 text-center hover:border-gray-600 transition-all duration-300 group`}
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className={`text-2xl font-bold ${stat.textColor} mb-1`}>
              {stat.value}
            </div>
            <div className={`text-sm font-semibold ${stat.labelColor} mb-1`}>
              {stat.label}
            </div>
            <div className={`text-xs ${stat.descColor}`}>
              {stat.description}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="bg-gray-800 rounded-2xl p-8 border border-gray-700"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Logros y Reconocimientos
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            AztlanFi está transformando el mercado global de remesas con tecnología de vanguardia
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              className="bg-gray-700 rounded-xl p-6 text-center border border-gray-600 hover:border-gray-500 transition-all duration-300 hover:scale-105"
            >
              <div className="text-4xl mb-4">
                {achievement.badge}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {achievement.title}
              </h3>
              <p className="text-gray-300">
                {achievement.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Real-time Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="grid md:grid-cols-2 gap-8"
      >
        {/* Live Transactions */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Transacciones en Tiempo Real</h3>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Última hora:</span>
              <span className="font-semibold text-white">1,247 tx</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Volumen 24h:</span>
              <span className="font-semibold text-white">$89,432</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Tiempo promedio:</span>
              <span className="font-semibold text-green-400">0.8s</span>
            </div>
          </div>

          {/* Mini Chart */}
          <div className="mt-6 h-16 flex items-end justify-between gap-1">
            {[45, 52, 38, 67, 89, 76, 54, 43, 65, 78, 92, 85].map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-gradient-to-t from-monad-600 to-monad-400 rounded-t"
                style={{ height: `${(value / 100) * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* Network Status */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Estado de la Red</h3>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Monad Network:</span>
              <span className="font-semibold text-green-400">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Último bloque:</span>
              <span className="font-mono text-sm text-white">#1,247,892</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Gas price:</span>
              <span className="font-semibold text-white">23 Gwei</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">TPS actual:</span>
              <span className="font-semibold text-blue-400">8,247</span>
            </div>
          </div>

          {/* Network Health */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Salud de la red</span>
              <span className="text-green-400 font-semibold">Excelente</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '98%' }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Impact Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 text-white"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            Impacto Global
          </h2>
          <p className="text-green-100 text-lg">
            Transformando vidas a través de la inclusión financiera
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">50K+</div>
            <div className="text-green-100">Familias beneficiadas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">$35</div>
            <div className="text-green-100">Ahorro promedio por tx</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">15+</div>
            <div className="text-green-100">Países conectados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">4</div>
            <div className="text-green-100">ODS alineados</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
