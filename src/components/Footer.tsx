'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2"
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-monad-600 to-monad-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AF</span>
              </div>
              <span className="text-xl font-bold">AztlanFi</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              The fastest and most secure way to send money from the USA to Mexico using blockchain technology. 
              Save up to 90% on fees compared to traditional remittance services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Send Money</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Receive Money</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Exchange Rates</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Fees & Limits</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Track Transfer</a></li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </motion.div>
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-gray-800 mt-8 pt-8"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="text-monad-400" size={20} />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-gray-300">support@aztlanfi.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="text-monad-400" size={20} />
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-gray-300">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="text-monad-400" size={20} />
              <div>
                <p className="font-semibold">Address</p>
                <p className="text-gray-300">123 Blockchain St, Miami, FL 33101</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-800 mt-8 pt-8 text-center"
        >
          <p className="text-gray-400">
            Made By{' '}
            <a 
              href="https://t.me/Vai0sx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-monad-400 hover:text-monad-300 transition-colors font-semibold"
            >
              @Vaios0x
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
