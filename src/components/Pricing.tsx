'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Star, 
  Zap, 
  Shield, 
  Globe, 
  Users, 
  TrendingUp,
  Award,
  Target,
  DollarSign,
  Clock,
  Activity,
  Smartphone,
  MessageCircle,
  CreditCard,
  Banknote,
  Send,
  X,
  ArrowRight,
  Heart,
  Gift,
  Calculator as CalculatorIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

export function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | 'enterprise'>('basic');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Simplified pricing plans
  const pricingPlans = {
    basic: {
      name: 'Basic',
      description: 'Perfect for occasional money sending',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        'Up to $1,000 per month',
        'Only 0.5% commission',
        'Send to 15+ countries',
        'Easy-to-use web app',
        'WhatsApp support',
        'Identity verification',
        'Real-time tracking',
        'Money arrives in 1 minute'
      ],
      limitations: [
        'Maximum 10 sends per month',
        'Only basic payment methods',
        'No advanced reports',
        'No savings goals'
      ],
      badge: null,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-gray-800',
      borderColor: 'border-gray-700'
    },
    pro: {
      name: 'Professional',
      description: 'For people who send money frequently',
      monthlyPrice: 19,
      yearlyPrice: 190,
      features: [
        'Up to $10,000 per month',
        'Reduced 0.3% commission',
        'All countries available',
        'Priority WhatsApp support',
        'Automatic savings goals',
        'Detailed reports',
        'Multiple payment methods',
        'Gas-free sends',
        'Full mobile app access',
        'Instant notifications',
        'Complete history',
        '24/7 Spanish support'
      ],
      limitations: [
        'Maximum 100 sends per month',
        'No business features',
        'No dedicated account manager'
      ],
      badge: 'Most Popular',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-gray-800',
      borderColor: 'border-gray-700'
    },
    enterprise: {
      name: 'Enterprise',
      description: 'For businesses and high-volume sending',
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        'Unlimited volume',
        'Minimum 0.2% commission',
        'All countries and methods',
        'Custom API',
        'Dedicated account manager',
        '24/7 priority support',
        'Business reports',
        'System integration',
        'Compliance tools',
        'Multi-signature wallets',
        'Advanced analytics',
        'Social impact tracking',
        'Batch operations',
        'Advanced security',
        'Custom contracts'
      ],
      limitations: [
        'Requires business verification',
        'Minimum 1-year contract',
        'Special pricing for high volume'
      ],
      badge: 'Enterprise',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-gray-800',
      borderColor: 'border-gray-700'
    }
  };

  const handlePlanSelection = (plan: 'basic' | 'pro' | 'enterprise') => {
    setSelectedPlan(plan);
    toast.success(`${pricingPlans[plan].name} plan selected`);
  };

  const handleBillingToggle = () => {
    setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly');
  };

  const getSavingsPercentage = () => {
    if (billingCycle === 'yearly') {
      const monthlyTotal = pricingPlans[selectedPlan].monthlyPrice * 12;
      const yearlyPrice = pricingPlans[selectedPlan].yearlyPrice;
      return Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100);
    }
    return 0;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-monad-400 mx-auto"></div>
          <p className="text-white mt-4">Loading prices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold mb-6">
            <Award className="w-4 h-4 mr-2" />
            🏆 Mobil3 Hackathon Finalist - Payments
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-monad-400 to-purple-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            Simple and transparent plans to send money to your family. 
            No surprises, no hidden charges.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-gray-800 rounded-xl p-1 border border-gray-700">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-monad-600 to-purple-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-monad-600 to-purple-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Yearly
              {billingCycle === 'yearly' && (
                <span className="ml-2 px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                  Save {getSavingsPercentage()}%
                </span>
              )}
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {Object.entries(pricingPlans).map(([key, plan]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`${plan.bgColor} ${plan.borderColor} border rounded-2xl p-8 relative hover:border-gray-600 transition-all duration-300 ${
                selectedPlan === key ? 'ring-2 ring-monad-500' : ''
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-300 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">
                    ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  <span className="text-gray-400">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>

                <button
                  onClick={() => handlePlanSelection(key as 'basic' | 'pro' | 'enterprise')}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    selectedPlan === key
                      ? 'bg-gradient-to-r from-monad-600 to-purple-600 text-white'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {plan.monthlyPrice === 0 ? 'Start Free' : 'Choose Plan'}
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-white mb-4">Includes:</h4>
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.limitations.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h4 className="font-semibold text-gray-400 mb-4">Limitations:</h4>
                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-center">
                      <X className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-400 text-sm">{limitation}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Competitor Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gray-800 rounded-2xl p-8 border border-gray-700 mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why is AztlanFi Cheaper?
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Compare our fees with traditional services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Western Union */}
            <div className="bg-red-900/20 rounded-xl p-6 border border-red-600">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                  <Banknote className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-400">Western Union</h3>
                  <p className="text-sm text-red-300">Traditional service</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Fee:</span>
                  <span className="text-red-400 font-semibold">8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Time:</span>
                  <span className="text-red-400 font-semibold">2-5 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Minimum:</span>
                  <span className="text-red-400 font-semibold">$15</span>
                </div>
              </div>
            </div>

            {/* MoneyGram */}
            <div className="bg-orange-900/20 rounded-xl p-6 border border-orange-600">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mr-4">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-orange-400">MoneyGram</h3>
                  <p className="text-sm text-orange-300">Traditional service</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Fee:</span>
                  <span className="text-orange-400 font-semibold">7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Time:</span>
                  <span className="text-orange-400 font-semibold">1-3 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Minimum:</span>
                  <span className="text-orange-400 font-semibold">$12</span>
                </div>
              </div>
            </div>

            {/* AztlanFi */}
            <div className="bg-green-900/20 rounded-xl p-6 border border-green-600">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-400">AztlanFi</h3>
                  <p className="text-sm text-green-300">Modern service</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Fee:</span>
                  <span className="text-green-400 font-semibold">0.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Time:</span>
                  <span className="text-green-400 font-semibold">1 minute</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Minimum:</span>
                  <span className="text-green-400 font-semibold">$2</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-gray-800 rounded-2xl p-8 border border-gray-700 mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Benefits Included in All Plans
            </h2>
            <p className="text-gray-300">
              Modern technologies for the best user experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Mobile App</h3>
              <p className="text-gray-300 text-sm">Works on any phone without downloading</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">WhatsApp</h3>
              <p className="text-gray-300 text-sm">Direct support via WhatsApp 24/7</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Security</h3>
              <p className="text-gray-300 text-sm">Bank-level protection for your money</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Global</h3>
              <p className="text-gray-300 text-sm">Send to 15+ countries from anywhere</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Save Money?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of families who are already saving up to 90% on fees. 
            Instant sends to 15+ countries.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-monad-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center hover:shadow-lg transition-all duration-200"
              onClick={() => window.location.href = '/dashboard'}
            >
              <Send className="w-5 h-5 mr-2" />
              Start Now
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center hover:bg-gray-800 hover:border-gray-500 transition-all duration-200"
              onClick={() => window.location.href = '/contact'}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat on WhatsApp
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
