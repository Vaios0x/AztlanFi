'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, 
  Shield, 
  Globe, 
  Clock, 
  DollarSign, 
  Smartphone, 
  Users, 
  Lock,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Heart,
  X,
  ExternalLink
} from 'lucide-react'

export function Features() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)

  const features = [
    {
      id: 'speed',
      icon: Zap,
      title: "Ultra Fast Speed",
      description: "Instant transfers with 1-second finality thanks to Monad blockchain technology",
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      details: {
        title: "Ultra Fast Speed - Powered by Monad",
        description: "Experience lightning-fast remittances with 1-second finality, powered by Monad's revolutionary parallel execution engine.",
        benefits: [
          "10,000+ transactions per second",
          "1-second finality guarantee",
          "Parallel transaction processing",
          "Real-time settlement confirmation"
        ],
        technical: "Monad's parallel execution engine processes multiple transactions simultaneously, eliminating the bottlenecks of traditional sequential blockchain processing.",
        link: "https://monad.xyz"
      }
    },
    {
      id: 'fees',
      icon: DollarSign,
      title: "Minimal Fees",
      description: "Only 0.5% commission vs 7-8% from traditional services. Save up to 95% on fees",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      details: {
        title: "Minimal Fees - Maximum Savings",
        description: "Save up to 95% compared to traditional remittance services with our transparent, low-fee structure.",
        benefits: [
          "Only 0.5% commission",
          "No hidden charges",
          "Transparent pricing",
          "Volume discounts available"
        ],
        technical: "Our smart contract-based system eliminates intermediaries, reducing operational costs and passing savings directly to users.",
        link: "https://aztlanfi.com/pricing"
      }
    },
    {
      id: 'security',
      icon: Shield,
      title: "Blockchain Security",
      description: "Immutable and transparent transactions with advanced cryptographic verification",
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      details: {
        title: "Blockchain Security - Military Grade",
        description: "Your funds are protected by the most advanced cryptographic security measures available.",
        benefits: [
          "Immutable transaction records",
          "Advanced cryptographic verification",
          "Multi-signature wallet support",
          "Real-time fraud detection"
        ],
        technical: "All transactions are cryptographically signed and verified on the blockchain, ensuring complete transparency and security.",
        link: "https://aztlanfi.com/security"
      }
    },
    {
      id: 'mobile',
      icon: Smartphone,
      title: "Mobile PWA App",
      description: "Progressive web application that works offline and installs as a native app",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      details: {
        title: "Mobile PWA App - Native Experience",
        description: "Access AztlanFi anywhere with our progressive web app that works like a native mobile application.",
        benefits: [
          "Works offline",
          "Install as native app",
          "Push notifications",
          "Biometric authentication"
        ],
        technical: "Built with modern PWA standards, the app provides a seamless mobile experience with offline capabilities and native app features.",
        link: "https://app.aztlanfi.com"
      }
    },
    {
      id: 'global',
      icon: Globe,
      title: "Global Coverage",
      description: "Send to Mexico from anywhere in the world with multi-currency support",
      color: "from-teal-500 to-cyan-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      details: {
        title: "Global Coverage - Worldwide Access",
        description: "Send money to Mexico from anywhere in the world with our global network and multi-currency support.",
        benefits: [
          "Worldwide coverage",
          "Multi-currency support",
          "Real-time exchange rates",
          "Local payment methods"
        ],
        technical: "Our global network connects with local payment systems and banking infrastructure to ensure reliable delivery worldwide.",
        link: "https://aztlanfi.com/coverage"
      }
    },
    {
      id: 'support',
      icon: Users,
      title: "24/7 Support",
      description: "Customer service in English with live chat and integrated WhatsApp",
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      details: {
        title: "24/7 Support - Always Here for You",
        description: "Get help anytime, anywhere with our comprehensive customer support system available 24/7.",
        benefits: [
          "24/7 live chat",
          "WhatsApp integration",
          "English and Spanish support",
          "Average response time < 2 minutes"
        ],
        technical: "Our AI-powered support system combined with human experts ensures you get the help you need instantly.",
        link: "https://wa.me/+14155238886"
      }
    }
  ]

  const benefits = [
    {
      icon: CheckCircle,
      title: "No Hidden Limits",
      description: "Transparent pricing with no surprise charges"
    },
    {
      icon: Award,
      title: "Best Exchange Rate",
      description: "Real-time updated market rates"
    },
    {
      icon: Heart,
      title: "Social Impact",
      description: "We reduce costs for migrant families"
    },
    {
      icon: TrendingUp,
      title: "Constant Growth",
      description: "Platform that continuously improves"
    }
  ]

  const FeatureModal = ({ feature }: { feature: any }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center`}>
              <feature.icon className="text-white" size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{feature.details.title}</h3>
              <p className="text-gray-600">{feature.details.description}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedFeature(null)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits</h4>
            <ul className="space-y-2">
              {feature.details.benefits.map((benefit: string, index: number) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Technical Details</h4>
            <p className="text-gray-600 leading-relaxed">{feature.details.technical}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setSelectedFeature(null)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <a
              href={feature.details.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-monad-600 to-purple-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Learn More
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Main Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover why AztlanFi is the most advanced, fastest and most economical 
            remittance platform on the market
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group p-8 rounded-2xl border-2 ${feature.bgColor} ${feature.borderColor} hover:shadow-xl transition-all duration-300 cursor-pointer`}
              tabIndex={0}
              role="button"
              aria-label={`Feature: ${feature.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setSelectedFeature(feature.id)
                }
              }}
              onClick={() => setSelectedFeature(feature.id)}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="text-white" size={28} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-monad-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
              
              <div className="mt-6 flex items-center text-monad-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Learn more</span>
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-monad-600 to-purple-700 rounded-3xl p-12 text-white"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Why choose AztlanFi?
            </h3>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              More than a remittance platform, we are your financial partner for the future
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
                tabIndex={0}
                role="button"
                aria-label={`Benefit: ${benefit.title}`}
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors duration-300">
                  <benefit.icon className="text-white" size={28} />
                </div>
                
                <h4 className="text-lg font-bold mb-2 group-hover:text-yellow-200 transition-colors">
                  {benefit.title}
                </h4>
                
                <p className="text-sm opacity-90 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 grid md:grid-cols-4 gap-8 text-center"
        >
          <div className="space-y-2">
            <div className="text-4xl font-bold text-monad-600">10,000+</div>
            <div className="text-gray-600">Transactions per second</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-4xl font-bold text-monad-600">95%</div>
            <div className="text-gray-600">Less in fees</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-4xl font-bold text-monad-600">1s</div>
            <div className="text-gray-600">Finality time</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-4xl font-bold text-monad-600">24/7</div>
            <div className="text-gray-600">Support available</div>
          </div>
        </motion.div>
      </div>

      {/* Feature Modal */}
      {selectedFeature && (
        <FeatureModal feature={features.find(f => f.id === selectedFeature)} />
      )}
    </section>
  )
}
