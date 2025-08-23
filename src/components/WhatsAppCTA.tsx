'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Send, Smartphone, Zap, Shield, Clock, X, Copy, Check } from 'lucide-react'

export function WhatsAppCTA() {
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState('')
  const [copied, setCopied] = useState(false)

  const features = [
    {
      icon: Zap,
      title: 'Instant Notifications',
      description: 'Get real-time updates on your transactions'
    },
    {
      icon: Shield,
      title: 'Secure Chat',
      description: 'End-to-end encrypted conversations'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Get help anytime, anywhere'
    }
  ]

  const predefinedMessages = [
    {
      id: 'general',
      title: 'General Inquiry',
              message: 'Hello! I want to learn more about AztlanFi services.'
    },
    {
      id: 'pricing',
      title: 'Pricing Information',
      message: 'Hi! Can you tell me more about your pricing plans and fees?'
    },
    {
      id: 'support',
      title: 'Technical Support',
              message: 'Hello! I need help with my AztlanFi account or transaction.'
    },
    {
      id: 'business',
      title: 'Business Partnership',
              message: 'Hi! I\'m interested in business partnership opportunities with AztlanFi.'
    },
    {
      id: 'custom',
      title: 'Custom Message',
      message: ''
    }
  ]

  const handleWhatsAppClick = () => {
    const phoneNumber = '+14155238886'
    const message = 'Hello! I want to learn more about AztlanFi services.'
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const handleSendMessage = () => {
    if (!selectedMessage) {
      alert('Please select or write a message')
      return
    }

    const phoneNumber = '+14155238886'
    const message = selectedMessage
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
    setShowMessageModal(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const MessageModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-800 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-700"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Send WhatsApp Message</h3>
          <button
            onClick={() => setShowMessageModal(false)}
            className="text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select or write your message:
          </label>
          <select
            value={selectedMessage}
            onChange={(e) => setSelectedMessage(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Choose a message...</option>
            {predefinedMessages.map((msg) => (
              <option key={msg.id} value={msg.message}>
                {msg.title}
              </option>
            ))}
          </select>
          
          {selectedMessage && (
            <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-gray-300">Preview:</p>
                <button
                  onClick={() => copyToClipboard(selectedMessage)}
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <p className="text-white text-sm">{selectedMessage}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowMessageModal(false)}
            className="flex-1 px-4 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!selectedMessage}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            Send via WhatsApp
          </button>
        </div>
      </motion.div>
    </div>
  )

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-6">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Chat with AztlanFi on WhatsApp
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Get instant support, track your transactions, and send money directly through WhatsApp. 
              It's the easiest way to manage your remittances.
            </p>
          </motion.div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-800 border border-gray-700 rounded-xl text-center p-6"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-monad-600 rounded-xl mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <button
              onClick={handleWhatsAppClick}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 hover:shadow-lg transition-all duration-200"
            >
              <MessageCircle size={20} />
              Open WhatsApp
            </button>
            <button 
              onClick={() => setShowMessageModal(true)}
              className="bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 border border-gray-700 hover:bg-gray-700 transition-all duration-200"
            >
              <Send size={20} />
              Send Message
            </button>
          </motion.div>

          {/* WhatsApp Bot Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 md:p-8 text-white overflow-hidden"
          >
            <h3 className="text-2xl font-bold mb-6">
              WhatsApp Bot Commands
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-semibold">/send</p>
                    <p className="text-sm opacity-80">Send money to Mexico</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-semibold">/receive</p>
                    <p className="text-sm opacity-80">Generate QR code for receiving</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-semibold">/balance</p>
                    <p className="text-sm opacity-80">Check your wallet balance</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">4</span>
                  </div>
                  <div>
                    <p className="font-semibold">/history</p>
                    <p className="text-sm opacity-80">View transaction history</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">5</span>
                  </div>
                  <div>
                    <p className="font-semibold">/rates</p>
                    <p className="text-sm opacity-80">Check current exchange rates</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">6</span>
                  </div>
                  <div>
                    <p className="font-semibold">/help</p>
                    <p className="text-sm opacity-80">Get support and instructions</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && <MessageModal />}
    </section>
  )
}
