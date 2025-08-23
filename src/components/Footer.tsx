'use client'

import { motion } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Globe,
  Zap,
  Shield,
  Award,
  Target,
  Users,
  TrendingUp,
  MessageCircle,
  Smartphone,
  Wallet,
  Activity,
  Star,
  CheckCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* Hackathon Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold mb-4">
            <Award className="w-4 h-4 mr-2" />
            Mobil3 Hackathon Finalist - Payments Track
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Transformando el Mercado de Remesas de $750B
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Construido en Monad para velocidad y escalabilidad global. 
            Conectamos 20+ países a través de 32 corredores estratégicos (16 pares bidireccionales).
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 mb-12">
          
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-monad-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">AF</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">AztlanFi</span>
                <div className="text-sm text-gray-500">Global Payment Bridge</div>
              </div>
            </div>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              El primer puente de pagos global construido específicamente para el sur global. 
              Liquidación en menos de 1 segundo con comisiones de solo 0.5%.
            </p>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="text-2xl font-bold text-monad-600">$2.5M+</div>
                <div className="text-sm text-gray-500">Volumen Procesado</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="text-2xl font-bold text-green-600">15K+</div>
                <div className="text-sm text-gray-500">Usuarios Activos</div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-monad-600 hover:text-white transition-colors border border-gray-200 shadow-sm">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-monad-600 hover:text-white transition-colors border border-gray-200 shadow-sm">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-monad-600 hover:text-white transition-colors border border-gray-200 shadow-sm">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-monad-600 hover:text-white transition-colors border border-gray-200 shadow-sm">
                <MessageCircle size={18} />
              </a>
            </div>
          </motion.div>

          {/* Global Corridors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
              <Globe className="w-5 h-5 mr-2 text-monad-600" />
              Corredores Globales
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <span className="text-gray-600">🇺🇸 → 🇲🇽 USA-Mexico</span>
                <span className="text-sm text-green-600">$2.5B daily</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-600">🇨🇳 → 🇲🇽 China-Mexico</span>
                <span className="text-sm text-green-600">$4.5B annually</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-600">🇺🇸 → 🇧🇷 USA-Brazil</span>
                <span className="text-sm text-green-600">$1.2B annually</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-600">🇯🇵 → 🇲🇽 Japan-Mexico</span>
                <span className="text-sm text-green-600">$800M annually</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-600">🇰🇷 → 🌎 Korea-LatAm</span>
                <span className="text-sm text-green-600">$600M annually</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-600">🇮🇳 → 🌎 India-LatAm</span>
                <span className="text-sm text-green-600">$400M annually</span>
              </li>
            </ul>
          </motion.div>

          {/* Partner Integrations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
              <Zap className="w-5 h-5 mr-2 text-monad-600" />
              Partner Integrations
            </h3>
            <ul className="space-y-3">
              <li className="text-gray-600">0x Protocol</li>
              <li className="text-gray-600">Reown AppKit</li>
              <li className="text-gray-600">Envio Analytics</li>
              <li className="text-gray-600">Para Wallet</li>
              <li className="text-gray-600">BGA SDG Alignment</li>
              <li className="flex items-center justify-between">
                <span className="text-gray-600">Monad Blockchain</span>
                <span className="text-sm text-yellow-600">10,000 TPS</span>
              </li>
            </ul>
          </motion.div>

          {/* Support & Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
              <Shield className="w-5 h-5 mr-2 text-monad-600" />
              Support & Links
            </h3>
            <ul className="space-y-3">
              <li><a href="/about" className="text-gray-600 hover:text-monad-600 transition-colors flex items-center">
                <ArrowRight className="w-3 h-3 mr-2" />
                About
              </a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-monad-600 transition-colors flex items-center">
                <ArrowRight className="w-3 h-3 mr-2" />
                Contact
              </a></li>
              <li><a href="/dashboard" className="text-gray-600 hover:text-monad-600 transition-colors flex items-center">
                <ArrowRight className="w-3 h-3 mr-2" />
                Dashboard
              </a></li>
              <li><a href="/reports" className="text-gray-600 hover:text-monad-600 transition-colors flex items-center">
                <ArrowRight className="w-3 h-3 mr-2" />
                Reports
              </a></li>
              <li><a href="/pricing" className="text-gray-600 hover:text-monad-600 transition-colors flex items-center">
                <ArrowRight className="w-3 h-3 mr-2" />
                Pricing
              </a></li>
              <li><a href="#" className="text-gray-600 hover:text-monad-600 transition-colors flex items-center">
                <ArrowRight className="w-3 h-3 mr-2" />
                Help Center
              </a></li>
            </ul>
          </motion.div>
        </div>



        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="border-t border-gray-200 pt-8"
        >
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="text-monad-600" size={20} />
              <div>
                <p className="font-semibold text-gray-900">Email</p>
                <p className="text-gray-600">team@aztlanfi.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="text-monad-600" size={20} />
              <div>
                <p className="font-semibold text-gray-900">WhatsApp</p>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Smartphone className="text-monad-600" size={20} />
              <div>
                <p className="font-semibold text-gray-900">Telegram</p>
                <p className="text-gray-600">@AztlanFiBot</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="text-monad-600" size={20} />
              <div>
                <p className="font-semibold text-gray-900">Global</p>
                <p className="text-gray-600">20+ países conectados</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="border-t border-gray-200 mt-8 pt-8 text-center"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">
              © {currentYear} AztlanFi. Built for{' '}
              <a 
                href="https://mobil3.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-monad-600 hover:text-monad-700 transition-colors font-semibold"
              >
                Mobil3 Hackathon
              </a>
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-gray-500">Made with ❤️ by</span>
              <a 
                href="https://t.me/Vai0sx" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-monad-600 hover:text-monad-700 transition-colors font-semibold flex items-center"
              >
                @Vaios0x
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
