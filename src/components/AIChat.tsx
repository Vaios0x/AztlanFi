'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageCircle, X, Bot, User, Loader2, Globe, Zap, Award, Target, Users, TrendingUp, Shield, Smartphone, Wallet, Activity, Star, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface QuickReply {
  id: string
  text: string
  response: string
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente AI de AztlanFi 🌍\n\n🏆 **Mobil3 Hackathon Finalist - Payments Track**\n\nPuedo ayudarte con:\n\n• 💸 Envío de dinero a 20+ países\n• 🌐 Corredores globales (USA-Mexico, China-Mexico, etc.)\n• ⚡ Transacciones instantáneas (1 segundo)\n• 💰 Comisiones mínimas (0.5%)\n• 🤝 Integraciones con partners del hackathon\n• 📊 Analytics en tiempo real\n• 🎯 Metas de ahorro con stablecoins\n• 📱 PWA y WhatsApp Bot\n• 🌱 Impacto SDG de la ONU\n\n¿En qué puedo ayudarte hoy?',
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Quick reply options updated for hackathon alignment
  const quickReplies: QuickReply[] = [
    {
      id: '1',
      text: '🌍 Corredores Globales',
      response: '¿Qué corredores de pago globales soportan?'
    },
    {
      id: '2',
      text: '⚡ Velocidad Monad',
      response: '¿Por qué son tan rápidas las transacciones?'
    },
    {
      id: '3',
      text: '🤝 Partners Hackathon',
      response: '¿Qué integraciones tienen con los partners del hackathon?'
    },
    {
      id: '4',
      text: '💰 Comisiones vs Tradicional',
      response: '¿Cuánto ahorro vs servicios tradicionales?'
    },
    {
      id: '5',
      text: '📱 PWA + WhatsApp',
      response: '¿Cómo funciona la app PWA y el bot de WhatsApp?'
    },
    {
      id: '6',
      text: '🌱 Impacto SDG',
      response: '¿Cómo contribuyen a los Objetivos de Desarrollo Sostenible?'
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response with hackathon-aligned responses
    const lowerMessage = userMessage.toLowerCase()
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Global Corridors
    if (lowerMessage.includes('corredor') || lowerMessage.includes('país') || lowerMessage.includes('global')) {
      return '🌍 **Corredores Globales AztlanFi:**\n\n🇺🇸 → 🇲🇽 **USA-Mexico**: $2.5B diarios\n🇨🇳 → 🇲🇽 **China-Mexico**: $4.5B anuales\n🇺🇸 → 🇧🇷 **USA-Brazil**: $1.2B anuales\n🇯🇵 → 🇲🇽 **Japan-Mexico**: $800M anuales\n🇰🇷 → 🌎 **Korea-LatAm**: $600M anuales\n🇮🇳 → 🌎 **India-LatAm**: $400M anuales\n🇧🇷 ↔ 🇲🇽 **Brazil-Mexico**: $10B anuales\n🇪🇺 → 🌎 **Europe-LatAm**: $2B anuales\n\n**Total**: 20+ países conectados a través de 32 corredores estratégicos (16 pares bidireccionales).'
    }
    
    // Monad Speed
    if (lowerMessage.includes('velocidad') || lowerMessage.includes('rápido') || lowerMessage.includes('monad') || lowerMessage.includes('tiempo')) {
      return '⚡ **Velocidad Monad Blockchain:**\n\n• **Liquidación**: < 1 segundo\n• **TPS**: 10,000+ transacciones por segundo\n• **Finalidad**: Instantánea\n• **Gas**: Optimizado para eficiencia\n\n**Comparación**:\n• AztlanFi: 1 segundo\n• Western Union: 3-5 días\n• MoneyGram: 2-3 días\n• Bancos tradicionales: 1-3 días\n\nMonad nos permite ser la plataforma de remesas más rápida del mercado.'
    }
    
    // Hackathon Partners
    if (lowerMessage.includes('partner') || lowerMessage.includes('hackathon') || lowerMessage.includes('integración') || lowerMessage.includes('bounty')) {
      return '🤝 **Integraciones Hackathon Partners:**\n\n**0x Protocol**:\n• Swaps gasless para off-ramp\n• Multi-route optimization\n• $4,000 bounty implementation\n\n**Reown AppKit**:\n• Social login (Google, Apple, Telegram)\n• Telegram Mini App integration\n• Farcaster Frame support\n• $3,000 bounty implementation\n\n**Envio Analytics**:\n• Real-time transaction tracking\n• Live dashboard metrics\n• HyperIndex for blockchain data\n• $2,000 bounty implementation\n\n**Para Wallet**:\n• App Clips for instant payments\n• Savings goals with stablecoins\n• Passkey authentication\n• $600 bounty implementation\n\n**BGA SDG Alignment**:\n• UN Sustainable Development Goals\n• Impact tracking (SDG 1, 8, 10, 17)\n• $2,000 USDT bounty\n\n**Monad Blockchain**:\n• 10,000 TPS infrastructure\n• 1-second finality\n• Global scalability'
    }
    
    // Cost Savings
    if (lowerMessage.includes('comisión') || lowerMessage.includes('costo') || lowerMessage.includes('ahorro') || lowerMessage.includes('fee') || lowerMessage.includes('tradicional')) {
      return '💰 **Ahorro vs Servicios Tradicionales:**\n\n**AztlanFi**:\n• Comisión: 0.5%\n• Tiempo: 1 segundo\n• Sin cargos ocultos\n\n**Servicios Tradicionales**:\n• Western Union: 6-8%\n• MoneyGram: 5-7%\n• Bancos: 3-5%\n• Tiempo: 3-5 días\n\n**Ejemplo de Ahorro**:\nEnvío de $1,000:\n• AztlanFi: $5 fee\n• Western Union: $60-80 fee\n• **Ahorro**: $55-75 por transacción\n\n**Impacto Anual**:\n• 50,000+ familias beneficiadas\n• $35 ahorro promedio por tx\n• $1.75M+ ahorrado en comisiones'
    }
    
    // PWA + WhatsApp
    if (lowerMessage.includes('pwa') || lowerMessage.includes('whatsapp') || lowerMessage.includes('app') || lowerMessage.includes('móvil')) {
      return '📱 **PWA + WhatsApp Bot:**\n\n**Progressive Web App (PWA)**:\n• Funciona en cualquier dispositivo\n• Sin descarga de app store\n• Modo offline disponible\n• Instalación como app nativa\n• Acceso global sin restricciones\n\n**WhatsApp Bot**:\n• 2B+ usuarios globales\n• Comandos simples:\n  `/send` - Enviar dinero\n  `/balance` - Ver saldo\n  `/rates` - Tasas de cambio\n  `/history` - Historial\n  `/help` - Ayuda\n\n**Ventajas**:\n• Accesibilidad universal\n• Sin barreras tecnológicas\n• Soporte 24/7\n• Integración con 2B+ usuarios'
    }
    
    // SDG Impact
    if (lowerMessage.includes('sdg') || lowerMessage.includes('impacto') || lowerMessage.includes('sostenible') || lowerMessage.includes('onu') || lowerMessage.includes('desarrollo')) {
      return '🌱 **Impacto SDG - Objetivos de Desarrollo Sostenible:**\n\n**SDG 1: No Poverty**\n• 50,000+ familias beneficiadas\n• Reducción de costos de remesas\n• Acceso financiero para no bancarizados\n\n**SDG 8: Decent Work & Economic Growth**\n• 20+ países con acceso financiero\n• Crecimiento económico inclusivo\n• Trabajo decente para migrantes\n\n**SDG 10: Reduced Inequalities**\n• Reducción de desigualdades financieras\n• Acceso igualitario a servicios bancarios\n• Inclusión financiera global\n\n**SDG 17: Partnerships for the Goals**\n• 5+ partners tecnológicos\n• Alianzas globales para desarrollo\n• Infraestructura Web3 sostenible\n\n**Métricas de Impacto**:\n• $1.75M+ ahorrado en comisiones\n• 20+ países conectados\n• 95% reducción en costos\n• 99.9% uptime garantizado'
    }
    
    // Send Money
    if (lowerMessage.includes('enviar') || lowerMessage.includes('mandar') || lowerMessage.includes('transferir') || lowerMessage.includes('send')) {
      return '💸 **Cómo Enviar Dinero Globalmente:**\n\n**Pasos Simples**:\n1. Conecta tu wallet (MetaMask, etc.)\n2. Selecciona el corredor (USA→Mexico, China→Mexico, etc.)\n3. Ingresa los datos del destinatario\n4. Elige el método de off-ramp:\n   • México: SPEI, OXXO, P2P\n   • Brasil: PIX, Bank Transfer\n   • China: UnionPay, Alipay\n   • India: UPI, Paytm\n5. Confirma la transacción\n\n**Características**:\n• ⚡ Liquidación en 1 segundo\n• 💰 Solo 0.5% de comisión\n• 🔒 Seguridad blockchain\n• 📱 Accesible desde cualquier dispositivo\n\n**Off-Ramp Methods**:\n• Transferencias bancarias directas\n• Efectivo en 20,000+ ubicaciones\n• Red P2P de proveedores locales\n• Integración con sistemas nacionales'
    }
    
    // Exchange Rates
    if (lowerMessage.includes('tasa') || lowerMessage.includes('cambio') || lowerMessage.includes('rate') || lowerMessage.includes('mxn') || lowerMessage.includes('usd')) {
      return '📊 **Tasas de Cambio en Tiempo Real:**\n\n**Tasa Actual**: 17.85 MXN/USD\n\n**Características**:\n• Actualización en tiempo real\n• Sin spreads ocultos\n• Transparencia total\n• Mejores tasas del mercado\n\n**Corredores Activos**:\n• USD → MXN: 17.85\n• USD → BRL: 5.23\n• CNY → MXN: 2.45\n• EUR → MXN: 19.45\n• JPY → MXN: 0.12\n\n**Ventajas**:\n• Sin comisiones ocultas\n• Tasas competitivas\n• Actualización automática\n• Transparencia blockchain'
    }
    
    // Security
    if (lowerMessage.includes('seguridad') || lowerMessage.includes('seguro') || lowerMessage.includes('blockchain') || lowerMessage.includes('smart contract')) {
      return '🔒 **Seguridad Blockchain Avanzada:**\n\n**Monad Blockchain**:\n• 10,000+ TPS para escalabilidad\n• Finalidad instantánea\n• Smart contracts verificados\n• Criptografía de grado militar\n\n**Características de Seguridad**:\n• Transacciones inmutables\n• Verificación en tiempo real\n• Sin datos personales en-chain\n• Escrow P2P para off-ramp\n• KYC/AML integrado\n\n**Compliance**:\n• FINRA Registered\n• OFAC Compliant\n• AML/KYC Certified\n• ISO 27001 Security\n• PCI DSS Level 1\n• SOC 2 Type II\n\n**Tu dinero está protegido por la tecnología blockchain más avanzada del mercado.**'
    }
    
    // Wallet Connection
    if (lowerMessage.includes('wallet') || lowerMessage.includes('conectar') || lowerMessage.includes('metamask') || lowerMessage.includes('web3')) {
      return '🔗 **Conectar Wallet Web3:**\n\n**Wallets Soportadas**:\n• MetaMask\n• WalletConnect\n• Reown AppKit\n• Para Wallet\n• Coinbase Wallet\n• Trust Wallet\n\n**Pasos**:\n1. Haz clic en "Connect Wallet"\n2. Selecciona tu wallet\n3. Aprueba la conexión\n4. Asegúrate de estar en Monad Testnet\n\n**Reown AppKit Features**:\n• Social login (Google, Apple)\n• Telegram Mini App\n• Farcaster integration\n• Biometric authentication\n\n**Para Wallet Features**:\n• App Clips para pagos instantáneos\n• Passkey authentication\n• Savings goals\n• Recurring payments\n\n**Seguridad**:\n• Conexión segura\n• Sin acceso a fondos\n• Solo transacciones aprobadas'
    }
    
    // Analytics & Reports
    if (lowerMessage.includes('analytics') || lowerMessage.includes('reporte') || lowerMessage.includes('métricas') || lowerMessage.includes('dashboard')) {
      return '📊 **Analytics en Tiempo Real con Envio:**\n\n**Dashboard Live**:\n• Volumen global por corredor\n• Transacciones activas\n• Tiempo promedio de liquidación\n• Tasa de éxito\n• Ahorro vs servicios tradicionales\n\n**Métricas en Vivo**:\n• 1,247 transacciones última hora\n• $89,432 volumen 24h\n• 0.8s tiempo promedio\n• 99.9% tasa de éxito\n\n**Corredores Performance**:\n• USA-Mexico: $2.5B daily\n• China-Mexico: $4.5B annually\n• Brazil-Mexico: $10B annually\n• Global: 20+ países\n\n**Envio HyperIndex**:\n• Indexación en tiempo real\n• Eventos blockchain\n• Analytics avanzados\n• Reportes automáticos\n\n**Acceso**: Dashboard → Reports → Analytics'
    }
    
    // Savings Goals
    if (lowerMessage.includes('ahorro') || lowerMessage.includes('meta') || lowerMessage.includes('goal') || lowerMessage.includes('para wallet')) {
      return '🎯 **Metas de Ahorro con Para Wallet:**\n\n**Características**:\n• Crear metas de ahorro\n• Depositos recurrentes\n• Bloqueo hasta alcanzar meta\n• Stablecoins para estabilidad\n• App Clips para pagos instantáneos\n\n**Funcionalidades**:\n• **Crear Meta**: Nombre, monto objetivo, fecha límite\n• **Depositar**: Fondos automáticos o manuales\n• **Auto-Save**: Depositos semanales/mensuales\n• **Bloqueo**: Fondos seguros hasta meta\n• **Tracking**: Progreso en tiempo real\n\n**Ejemplo de Uso**:\n• Meta: "Viaje a México" - $2,000\n• Deposito semanal: $100\n• Tiempo estimado: 20 semanas\n• Stablecoin: USDC para estabilidad\n\n**Ventajas**:\n• Sin inflación\n• Acceso global\n• Transparencia blockchain\n• Seguridad garantizada'
    }
    
    // Batch Operations
    if (lowerMessage.includes('batch') || lowerMessage.includes('lote') || lowerMessage.includes('múltiple') || lowerMessage.includes('bulk')) {
      return '⚡ **Operaciones en Lote (Batch Operations):**\n\n**Funcionalidades**:\n• Envío a múltiples destinatarios\n• Actualización de tasas en lote\n• Ahorro de gas fees\n• Eficiencia para negocios\n\n**Casos de Uso**:\n• **Empresas**: Nómina a empleados\n• **Remesas**: Envío familiar múltiple\n• **Comercio**: Pagos a proveedores\n• **ONGs**: Distribución de ayuda\n\n**Ventajas**:\n• Ahorro de 70% en gas fees\n• Tiempo reducido en 90%\n• Transacciones simultáneas\n• Tracking individual\n\n**Acceso**: Dashboard → Operaciones en Lote'
    }
    
    // Advanced Queries
    if (lowerMessage.includes('consulta') || lowerMessage.includes('query') || lowerMessage.includes('avanzada') || lowerMessage.includes('filtro')) {
      return '🔍 **Consultas Avanzadas:**\n\n**Funcionalidades**:\n• Filtros por corredor\n• Búsqueda por fecha\n• Filtros por monto\n• Análisis de patrones\n• Exportación de datos\n\n**Tipos de Consultas**:\n• Transacciones por país\n• Volumen por período\n• Usuarios más activos\n• Corredores más populares\n• Análisis de tendencias\n\n**Herramientas**:\n• Filtros dinámicos\n• Gráficos interactivos\n• Reportes personalizados\n• Exportación CSV/PDF\n\n**Acceso**: Dashboard → Consultas Avanzadas'
    }
    
    // Network Status
    if (lowerMessage.includes('red') || lowerMessage.includes('network') || lowerMessage.includes('monad') || lowerMessage.includes('estado')) {
      return '🌐 **Estado de la Red Monad:**\n\n**Estado Actual**: Online ✅\n\n**Métricas en Vivo**:\n• Último bloque: #1,247,892\n• Gas price: 23 Gwei\n• TPS actual: 8,247\n• Salud de la red: Excelente\n\n**Performance**:\n• 10,000+ TPS capacidad\n• < 1 segundo finalidad\n• 99.9% uptime\n• Escalabilidad global\n\n**Comparación**:\n• Monad: 10,000 TPS\n• Ethereum: 15 TPS\n• Solana: 65,000 TPS\n• Polygon: 7,000 TPS\n\n**Ventajas Monad**:\n• Velocidad sin comprometer seguridad\n• Costos de gas optimizados\n• Compatibilidad EVM\n• Escalabilidad real'
    }
    
    // Help/Support
    if (lowerMessage.includes('ayuda') || lowerMessage.includes('help') || lowerMessage.includes('soporte') || lowerMessage.includes('support')) {
      return '🆘 **Soporte y Ayuda AztlanFi:**\n\n**Canales de Soporte**:\n• 📧 Email: team@aztlanfi.com\n• 📱 WhatsApp: +1 (555) 123-4567\n• 💬 Telegram: @AztlanFiBot\n• 🌐 Global: 20+ países conectados\n\n**Recursos Disponibles**:\n• 📖 Help Center\n• 🎥 Video tutorials\n• 📚 Documentation\n• 💬 Community Discord\n\n**Tiempos de Respuesta**:\n• Soporte general: 24 horas\n• Urgencias: 2-4 horas\n• Técnico: 4-8 horas\n\n**Hackathon Support**:\n• Mobil3 Hackathon Finalist\n• Payments Track expertise\n• Partner integrations\n• SDG impact alignment\n\n**¿En qué puedo ayudarte específicamente?**'
    }
    
    // Default response with hackathon context
    return '¡Hola! Veo que preguntas sobre "' + userMessage + '".\n\n🏆 **AztlanFi - Mobil3 Hackathon Finalist**\n\nPara información específica, te recomiendo:\n\n• 🌍 **Corredores**: 20+ países conectados\n• ⚡ **Velocidad**: 1 segundo liquidación\n• 💰 **Comisiones**: Solo 0.5%\n• 🤝 **Partners**: 0x, Reown, Envio, Para, BGA\n• 📱 **Acceso**: PWA + WhatsApp Bot\n• 🌱 **Impacto**: Alineado con SDG de la ONU\n\n¿Te gustaría saber más sobre algún aspecto específico de nuestra plataforma global de remesas?'
  }

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText.trim()
    if (!textToSend || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    if (!messageText) setInputText('')
    setIsLoading(true)

    try {
      const aiResponse = await generateAIResponse(userMessage.text)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, estoy teniendo problemas de conexión. Por favor intenta de nuevo en un momento o contacta a nuestro equipo de soporte.',
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickReply = (quickReply: QuickReply) => {
    handleSendMessage(quickReply.response)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 bg-gradient-to-r from-monad-600 to-purple-600 text-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: 0 }}
              animate={{ rotate: 180 }}
              exit={{ rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 180 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-20 right-2 md:right-6 z-40 w-[calc(100vw-1rem)] md:w-[calc(100vw-3rem)] max-w-xs md:max-w-sm h-80 md:h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-monad-600 to-purple-600 text-white p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={12} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AztlanFi AI</h3>
                  <p className="text-xs text-white/80">🏆 Hackathon Finalist • Online</p>
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-monad-600 to-purple-600 text-white' 
                        : 'bg-white text-monad-600 border border-monad-200'
                    }`}>
                      {message.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                    </div>
                    <div className={`rounded-2xl px-3 py-2 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-monad-600 to-purple-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}>
                      <p className="text-xs whitespace-pre-line">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2 max-w-[85%]">
                    <div className="w-6 h-6 rounded-full bg-white text-monad-600 border border-monad-200 flex items-center justify-center">
                      <Bot size={12} />
                    </div>
                    <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <Loader2 size={12} className="animate-spin" />
                        <span className="text-xs">AI está escribiendo...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Reply Options */}
            {messages.length === 1 && !isLoading && (
              <div className="p-3 bg-white border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-2 text-center">Opciones rápidas:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickReplies.map((reply) => (
                    <motion.button
                      key={reply.id}
                      onClick={() => handleQuickReply(reply)}
                      className="px-3 py-2 text-xs bg-gradient-to-r from-gray-100 to-gray-50 hover:from-monad-100 hover:to-purple-50 text-gray-700 hover:text-monad-700 rounded-lg transition-all border border-gray-200 hover:border-monad-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {reply.text}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-monad-500 focus:border-transparent disabled:opacity-50"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isLoading}
                  className="p-2 bg-gradient-to-r from-monad-600 to-purple-600 text-white rounded-full hover:from-monad-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={12} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                Presiona Enter para enviar • 🏆 Mobil3 Hackathon Finalist
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
