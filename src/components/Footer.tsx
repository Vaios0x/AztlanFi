'use client'

import { motion } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageCircle,
  ArrowRight,
  ExternalLink,
  Heart
} from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-r from-white/95 via-blue-50/95 to-purple-50/95 backdrop-blur-xl border-t border-white/20 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Logo and Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-monad-600 via-purple-600 to-monad-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">AF</span>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-monad-600 to-purple-600 bg-clip-text text-transparent">
              AztlanFi
            </span>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We make sending money easier, faster and cheaper for everyone.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-6 mb-8"
        >
          <a href="/about" className="text-gray-600 hover:text-monad-600 transition-colors flex items-center">
            <ArrowRight className="w-3 h-3 mr-2" />
            About Us
          </a>
          <a href="/pricing" className="text-gray-600 hover:text-monad-600 transition-colors flex items-center">
            <ArrowRight className="w-3 h-3 mr-2" />
            Pricing
          </a>
          <a href="/dashboard" className="text-gray-600 hover:text-monad-600 transition-colors flex items-center">
            <ArrowRight className="w-3 h-3 mr-2" />
            Dashboard
          </a>
          <a href="/contact" className="text-gray-600 hover:text-monad-600 transition-colors flex items-center">
            <ArrowRight className="w-3 h-3 mr-2" />
            Contact
          </a>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <div className="flex items-center justify-center space-x-3">
            <Mail className="text-monad-600" size={20} />
            <div className="text-center">
              <p className="font-semibold text-gray-900">Email</p>
              <p className="text-gray-600">hola@aztlanfi.com</p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <MessageCircle className="text-monad-600" size={20} />
            <div className="text-center">
              <p className="font-semibold text-gray-900">WhatsApp</p>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <MapPin className="text-monad-600" size={20} />
            <div className="text-center">
              <p className="font-semibold text-gray-900">Global</p>
              <p className="text-gray-600">20+ countries connected</p>
            </div>
          </div>
        </motion.div>

        {/* Separator Line */}
        <div className="border-t border-gray-200 mb-6"></div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-gray-500 mb-2">
            © {currentYear} AztlanFi. Made with <Heart className="inline w-4 h-4 text-red-500" /> for the{' '}
            <a 
              href="https://mobil3.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-monad-600 hover:text-monad-700 transition-colors font-semibold"
            >
              Mobil3 Hackathon
            </a>
          </p>
          <p className="text-gray-500 text-sm">
            Created by{' '}
            <a 
              href="https://t.me/Vai0sx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-monad-600 hover:text-monad-700 transition-colors font-semibold flex items-center justify-center"
            >
              @Vaios0x
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
