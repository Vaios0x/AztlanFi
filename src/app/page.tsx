'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Zap, 
  Shield, 
  Smartphone, 
  MessageCircle, 
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  Target,
  Activity,
  Wallet,
  BarChart3,
  Heart,
  Cpu,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Calculator } from '@/components/Calculator';
import { Features } from '@/components/Features';
import { TrustIndicators } from '@/components/TrustIndicators';
import { WhatsAppCTA } from '@/components/WhatsAppCTA';
import { GlobalStats } from '@/components/GlobalStats';
import { useKYC } from '@/hooks/useKYC';
import { corridors } from '@/lib/constants/corridors';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const { isVerified } = useKYC();
  const [stats, setStats] = useState({
    totalVolume: '$2.5M+',
    activeUsers: '15K+',
    countries: '15+',
    avgSettlement: '<1s'
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const activeCorridors = corridors.filter(c => c.active);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold mb-6">
                <Award className="w-4 h-4 mr-2" />
                Mobil3 Hackathon Finalist - Payments Track
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-monad-400 to-purple-400 bg-clip-text text-transparent">
                  AztlanFi
                </span>
                <br />
                <span className="text-4xl md:text-5xl text-gray-300">
                  Global Payment Bridge
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
                Transformando el mercado de remesas de $750B anuales con pagos instantáneos 
                entre LatAm, Asia y USA. Construido en Monad para velocidad y escalabilidad global.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-monad-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center hover:shadow-lg transition-all duration-200"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Enviar Dinero Ahora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center hover:bg-gray-800 hover:border-gray-500 transition-all duration-200"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  <Globe className="w-5 h-5 mr-2" />
                  Ver Corredores
                </motion.button>
              </div>
            </motion.div>
            
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16"
            >
              <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
                <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.totalVolume}</div>
                <div className="text-sm text-gray-400">Volumen Total</div>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.activeUsers}</div>
                <div className="text-sm text-gray-400">Usuarios Activos</div>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
                <Globe className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.countries}</div>
                <div className="text-sm text-gray-400">Países</div>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
                <Clock className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.avgSettlement}</div>
                <div className="text-sm text-gray-400">Tiempo Promedio</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Logros y Reconocimientos
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              AztlanFi está transformando el mercado global de remesas con tecnología de vanguardia
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-700 rounded-xl p-6 text-center border border-gray-600"
            >
              <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <div className="text-2xl font-bold text-white mb-2">🏆</div>
              <h3 className="text-lg font-semibold text-white mb-2">Mobil3 Hackathon</h3>
              <p className="text-sm text-gray-300">Finalist Payments Track</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-700 rounded-xl p-6 text-center border border-gray-600"
            >
              <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <div className="text-2xl font-bold text-white mb-2">⚡</div>
              <h3 className="text-lg font-semibold text-white mb-2">Monad Blockchain</h3>
              <p className="text-sm text-gray-300">10,000 TPS</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-700 rounded-xl p-6 text-center border border-gray-600"
            >
              <Globe className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <div className="text-2xl font-bold text-white mb-2">🌍</div>
              <h3 className="text-lg font-semibold text-white mb-2">Global Reach</h3>
                              <p className="text-sm text-gray-300">20+ países</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gray-700 rounded-xl p-6 text-center border border-gray-600"
            >
              <Activity className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <div className="text-2xl font-bold text-white mb-2">📊</div>
              <h3 className="text-lg font-semibold text-white mb-2">Real-time Analytics</h3>
              <p className="text-sm text-gray-300">Envio Integration</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Real-time Transactions Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Transacciones en Tiempo Real
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Monitoreo global de todas las transacciones AztlanFi
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Última hora</h3>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold text-green-400">1,247</div>
              <p className="text-sm text-gray-400">transacciones</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Volumen 24h</h3>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold text-blue-400">$89,432</div>
              <p className="text-sm text-gray-400">procesado</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Tiempo promedio</h3>
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold text-purple-400">0.8s</div>
              <p className="text-sm text-gray-400">liquidación</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Estado de la Red</h3>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold text-green-400">Online</div>
              <p className="text-sm text-gray-400">Monad Network</p>
            </motion.div>
          </div>
          
          {/* Network Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">#1,247,892</div>
                <p className="text-sm text-gray-400">Último bloque</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">23 Gwei</div>
                <p className="text-sm text-gray-400">Gas price</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">8,247</div>
                <p className="text-sm text-gray-400">TPS actual</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900 text-green-300">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Salud de la red: Excelente
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Global Impact Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Impacto Global
            </h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Transformando vidas a través de la inclusión financiera
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <p className="text-green-100">Familias beneficiadas</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl mb-4">💰</div>
              <div className="text-3xl font-bold text-white mb-2">$35</div>
              <p className="text-green-100">Ahorro promedio por tx</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl mb-4">🌍</div>
              <div className="text-3xl font-bold text-white mb-2">15+</div>
              <p className="text-green-100">Países conectados</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl mb-4">🎯</div>
              <div className="text-3xl font-bold text-white mb-2">4</div>
              <p className="text-green-100">ODS alineados</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Corridors Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Corredores de Pago Globales
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Conectamos 20+ países a través de 32 corredores estratégicos (16 pares bidireccionales), 
              desde remesas tradicionales hasta pagos comerciales B2B.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeCorridors.slice(0, 8).map((corridor, index) => (
              <motion.div
                key={corridor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{corridor.fromFlag}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="text-2xl">{corridor.toFlag}</span>
                  </div>
                  {corridor.priority && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </span>
                  )}
                </div>
                
                <h3 className="font-semibold text-white mb-2">
                  {corridor.name}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Volumen:</span>
                    <span className="font-medium text-green-400">{corridor.volume}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Comisión:</span>
                    <span className="font-medium text-green-400">{corridor.fee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tiempo:</span>
                    <span className="font-medium">{corridor.settlementTime}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-monad-400 font-semibold hover:text-monad-300 transition-colors"
              onClick={() => window.location.href = '/dashboard'}
            >
              Ver Todos los Corredores →
            </motion.button>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              ¿Por qué AztlanFi?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Construido para ganar el hackathon con tecnología de vanguardia 
              y alineación con los Objetivos de Desarrollo Sostenible de la ONU.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
            >
              <Zap className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">
                Velocidad Monad
              </h3>
              <p className="text-gray-300">
                10,000 TPS para liquidación en menos de 1 segundo. 
                La velocidad más rápida del mercado de remesas.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
            >
              <DollarSign className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">
                Comisiones Mínimas
              </h3>
              <p className="text-gray-300">
                Solo 0.5% vs 6-8% tradicional. Ahorro promedio de $50 
                por transacción de $1,000.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
            >
              <Smartphone className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">
                PWA + WhatsApp
              </h3>
              <p className="text-gray-300">
                Acceso desde cualquier dispositivo sin app store. 
                Bot de WhatsApp para 2B+ usuarios globales.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
            >
              <Shield className="w-12 h-12 text-orange-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">
                Seguridad Avanzada
              </h3>
              <p className="text-gray-300">
                KYC/AML integrado, escrow P2P, y cumplimiento 
                regulatorio automático.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
            >
              <BarChart3 className="w-12 h-12 text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">
                Análisis en Tiempo Real
              </h3>
              <p className="text-gray-300">
                Dashboard con Envio para monitoreo global, 
                métricas de corredores y flujos de pago.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
            >
              <Target className="w-12 h-12 text-teal-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">
                ODS Alineados
              </h3>
              <p className="text-gray-300">
                Impacto medible en SDG 1, 8, 10, 17. 
                Reducción de pobreza e inclusión financiera.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partner Integrations Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Integraciones de Partners del Hackathon
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Tecnologías de vanguardia para la mejor experiencia de usuario
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-700 rounded-xl p-6 border border-gray-600"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">0x</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">0x Protocol</h3>
                  <p className="text-sm text-gray-400">Gasless Swaps</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Swaps sin gas para off-ramp instantáneo. Multi-route optimization para las mejores tasas.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-700 rounded-xl p-6 border border-gray-600"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Reown AppKit</h3>
                  <p className="text-sm text-gray-400">Social Login</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Login social con Google, Apple, Telegram. Mini Apps y Farcaster integration.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-700 rounded-xl p-6 border border-gray-600"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Envio Analytics</h3>
                  <p className="text-sm text-gray-400">Real-time Data</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Analytics en tiempo real con HyperIndex. Monitoreo global de transacciones.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gray-700 rounded-xl p-6 border border-gray-600"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Para Wallet</h3>
                  <p className="text-sm text-gray-400">App Clips & Savings</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                App Clips para pagos instantáneos. Metas de ahorro con stablecoins.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gray-700 rounded-xl p-6 border border-gray-600"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">BGA SDG</h3>
                  <p className="text-sm text-gray-400">Impact Alignment</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Alineación con Objetivos de Desarrollo Sostenible de la ONU. Impacto medible.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-gray-700 rounded-xl p-6 border border-gray-600"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Monad</h3>
                  <p className="text-sm text-gray-400">10,000 TPS</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Blockchain de alta velocidad. 1 segundo finalidad. Escalabilidad global.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <Calculator />

      {/* Features Section */}
      <Features />

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-monad-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              ¿Listo para Transformar las Remesas?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Únete a miles de usuarios que ya están ahorrando tiempo y dinero 
              con AztlanFi. Envíos instantáneos a 20+ países.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-monad-600 px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center hover:shadow-lg transition-all duration-200"
                onClick={() => window.location.href = '/dashboard'}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Comenzar Ahora
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center hover:bg-white hover:text-monad-600 transition-all duration-200"
                onClick={() => window.location.href = '/contact'}
              >
                <Globe className="w-5 h-5 mr-2" />
                Contactar Soporte
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <WhatsAppCTA />
      <Footer />
    </div>
  );
}
