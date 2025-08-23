'use client'

import { motion } from 'framer-motion'
import { Shield, Zap, Globe, Clock, Headphones, Award } from 'lucide-react'

export function TrustIndicators() {
  const indicators = [
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Your money is protected by Monad blockchain technology with military-grade encryption.',
      color: 'text-green-400',
      bgColor: 'bg-green-600'
    },
    {
      icon: Zap,
      title: 'Instant Transactions',
      description: 'Send money in just 1 second with Monad\'s high-performance blockchain.',
      color: 'text-monad-400',
      bgColor: 'bg-monad-600'
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Send money to any part of Mexico with our extensive network of pickup locations.',
      color: 'text-blue-400',
      bgColor: 'bg-blue-600'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Send money anytime, anywhere. Our platform never sleeps.',
      color: 'text-purple-400',
      bgColor: 'bg-purple-600'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Get help anytime with our dedicated customer support team.',
      color: 'text-orange-400',
      bgColor: 'bg-orange-600'
    },
    {
      icon: Award,
      title: 'Certified & Licensed',
      description: 'Fully compliant with US and Mexican financial regulations.',
      color: 'text-red-400',
      bgColor: 'bg-red-600'
    }
  ]

  const certifications = [
    'FINRA Registered',
    'OFAC Compliant',
    'AML/KYC Certified',
    'ISO 27001 Security',
    'PCI DSS Level 1',
    'SOC 2 Type II'
  ]

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Trust RemesaFlash?
          </h2>
          <p className="text-lg text-gray-300">
            Built with security, speed, and reliability in mind
          </p>
        </motion.div>

        {/* Trust Indicators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {indicators.map((indicator, index) => (
            <motion.div
              key={indicator.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-800 border border-gray-700 rounded-xl hover:border-gray-600 transition-all duration-300 p-6"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${indicator.bgColor} mb-4`}>
                <indicator.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {indicator.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {indicator.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Certifications & Compliance</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {certifications.map((cert, index) => (
              <span
                key={cert}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300"
              >
                {cert}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
