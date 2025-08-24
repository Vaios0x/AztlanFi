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
  ExternalLink,
  Send,
  Phone,
  Calculator,
  Gift,
  Banknote,
  CreditCard,
  Wifi,
  MessageCircle
} from 'lucide-react'

export function Features() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)

  const features = [
    {
      id: 'speed',
      icon: Zap,
      title: "Faster Than a Message",
      description: "Your money arrives in less than 1 minute, like sending a WhatsApp",
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      details: {
        title: "Instant Speed",
        description: "Imagine your money traveling at the speed of light. That's what AztlanFi does.",
        benefits: [
          "Money arrives in less than 1 minute",
          "No more waiting days",
          "Immediate confirmation",
          "Like sending a text message"
        ],
        technical: "We use advanced technology that processes your transfer instantly, without waiting or delays.",
        link: "/demo"
      }
    },
    {
      id: 'fees',
      icon: DollarSign,
      title: "Minimal Fees",
      description: "Only $2-$5 per transfer vs $25-$50 from the bank. You save up to 90%",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      details: {
        title: "Save Real Money",
        description: "Low fees mean more money for your family.",
        benefits: [
          "Only $2-$5 per transfer",
          "No hidden charges",
          "Transparent pricing",
          "Save up to $45 per transfer"
        ],
        technical: "We eliminate expensive intermediaries and pass the savings directly to you.",
        link: "/pricing"
      }
    },
    {
      id: 'security',
      icon: Shield,
      title: "Safe as a Bank",
      description: "The same protection as your bank account, but improved",
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      details: {
        title: "Bank-Level Security",
        description: "Your money is protected with the best security technology.",
        benefits: [
          "Identity verification",
          "Bank-level encryption",
          "Fraud protection",
          "Refund guarantee"
        ],
        technical: "We use the same technology that protects the world's largest banks.",
        link: "/security"
      }
    },
    {
      id: 'mobile',
      icon: Smartphone,
      title: "Easy-to-Use App",
      description: "Works on your phone like WhatsApp. No need to download anything",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      details: {
        title: "Intuitive Web App",
        description: "Designed so anyone can use it easily.",
        benefits: [
          "Works on any phone",
          "No need to download anything",
          "Simple and clear interface",
          "Like using WhatsApp"
        ],
        technical: "Our web app works on any device with internet.",
        link: "/dashboard"
      }
    },
    {
      id: 'global',
      icon: Globe,
      title: "Send to Many Countries",
      description: "Mexico, Guatemala, El Salvador and more. We'll add more countries soon",
      color: "from-teal-500 to-cyan-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      details: {
        title: "Global Coverage",
        description: "We connect families in different countries around the world.",
        benefits: [
          "15+ countries available",
          "More countries coming soon",
          "Fair exchange rates",
          "Local payment methods"
        ],
        technical: "We work with banks and local services in each country to ensure delivery.",
        link: "/coverage"
      }
    },
    {
      id: 'support',
      icon: MessageCircle,
      title: "24/7 Support via WhatsApp",
      description: "We help you when you need it, in Spanish and via WhatsApp",
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      details: {
        title: "Personalized Support",
        description: "We're here to help you when you need it.",
        benefits: [
          "24/7 attention",
          "Via WhatsApp",
          "In Spanish",
          "Response in minutes"
        ],
        technical: "Our team is available all day to resolve your questions.",
        link: "https://wa.me/+14155238886"
      }
    }
  ]

  const benefits = [
    {
      icon: CheckCircle,
      title: "No Hidden Limits",
      description: "We tell you exactly how much you'll pay"
    },
    {
      icon: Award,
      title: "Better Exchange Rate",
      description: "Fair and updated rates"
    },
    {
      icon: Heart,
      title: "We Help Families",
      description: "We reduce costs for migrant families"
    },
    {
      icon: TrendingUp,
      title: "Always Improving",
      description: "We add new countries and features"
    }
  ]

  const FeatureModal = ({ feature, onClose }: { feature: any, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center`}>
              <feature.icon className="text-white" size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{feature.details.title}</h3>
              <p className="text-gray-600">{feature.details.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close window"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">What Does This Mean?</h4>
            <ul className="space-y-2">
              {feature.details.benefits.map((benefit: string, index: number) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">In Simple Terms</h4>
            <p className="text-gray-700 leading-relaxed">{feature.details.technical}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <a
              href={feature.details.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
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
    <section id="features" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose AztlanFi?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We explain in simple terms why we're the best option 
            for sending money to your family
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
              className="group p-8 rounded-2xl border-2 bg-gray-800 border-gray-700 hover:border-gray-600 hover:shadow-xl transition-all duration-300 cursor-pointer"
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
              
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-monad-400 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
              
              <div className="mt-6 flex items-center text-monad-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 ml-2" />
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
              What Else Do We Offer?
            </h3>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Additional features that make AztlanFi your best option
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
            <div className="text-4xl font-bold text-monad-400">1 minute</div>
            <div className="text-gray-400">Arrival time</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-4xl font-bold text-monad-400">90%</div>
            <div className="text-gray-400">Less in fees</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-4xl font-bold text-monad-400">15+</div>
            <div className="text-gray-400">Available countries</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-4xl font-bold text-monad-400">24/7</div>
            <div className="text-gray-400">Support available</div>
          </div>
        </motion.div>
      </div>

      {/* Feature Modal */}
      {selectedFeature && (
        <FeatureModal 
          feature={features.find(f => f.id === selectedFeature)!}
          onClose={() => setSelectedFeature(null)}
        />
      )}
    </section>
  )
}
