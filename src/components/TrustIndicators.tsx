'use client'

import { motion } from 'framer-motion'
import { Shield, Zap, Globe, Clock, Headphones, Award } from 'lucide-react'

export function TrustIndicators() {
  const indicators = [
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Your money is protected by Monad blockchain technology with military-grade encryption.',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Zap,
      title: 'Instant Transactions',
      description: 'Send money in just 1 second with Monad\'s high-performance blockchain.',
      color: 'text-monad-600',
      bgColor: 'bg-monad-100'
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Send money to any part of Mexico with our extensive network of pickup locations.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Send money anytime, anywhere. Our platform never sleeps.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Get help anytime with our dedicated customer support team.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: Award,
      title: 'Certified & Licensed',
      description: 'Fully compliant with US and Mexican financial regulations.',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Trust RemesaFlash?
          </h2>
          <p className="text-lg text-gray-600">
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
              className="card hover:shadow-xl transition-shadow duration-300 p-6"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${indicator.bgColor} mb-4`}>
                <indicator.icon className={`w-6 h-6 ${indicator.color}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {indicator.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {indicator.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-monad-600 to-monad-700 rounded-2xl p-6 md:p-8 text-white overflow-hidden"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">
              Certifications & Compliance
            </h3>
            <p className="text-lg opacity-90">
              We meet the highest standards in financial security and compliance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm"
              >
                <p className="font-semibold text-sm md:text-base">{cert}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
