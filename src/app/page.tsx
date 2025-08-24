'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Zap, 
  Shield, 
  Smartphone, 
  MessageCircle, 
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  Target,
  Activity,
  Wallet,
  BarChart3,
  Heart,
  Cpu,
  Wifi,
  Battery,
  Signal,
  Send,
  Home,
  Phone,
  CreditCard,
  Banknote,
  Gift,
  Smile,
  MapPin,
  Calculator as CalculatorIcon,
  Play,
  Lock,
  X
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

import { Features } from '@/components/Features';
import { TrustIndicators } from '@/components/TrustIndicators';
import { WhatsAppCTA } from '@/components/WhatsAppCTA';
import { GlobalStats } from '@/components/GlobalStats';
import { useKYC } from '@/hooks/useKYC';
import { corridors } from '@/lib/constants/corridors';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const { isVerified } = useKYC();
  const [stats, setStats] = useState({
    totalVolume: '$2.5M+',
    activeUsers: '15K+',
    countries: '15+',
    avgSettlement: '<1s'
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const activeCorridors = corridors.filter(c => c.active);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Header />
      
      {/* Hero Section - Simplified */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold mb-6">
                <Award className="w-4 h-4 mr-2" />
                🏆 Mobil3 Hackathon Finalist - Payments
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-monad-400 to-purple-400 bg-clip-text text-transparent">
                  AztlanFi
                </span>
                <br />
                <span className="text-3xl md:text-4xl text-gray-300">
                  Send money like a WhatsApp message
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
                Imagine being able to send money to your family in Mexico from the United States 
                as easily as sending a text message. No banks, no waiting, 
                no high fees. Just money that arrives instantly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center hover:shadow-lg transition-all duration-200"
                  onClick={() => window.location.href = '/dashboard'}
                  aria-label="Start sending money now"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Money Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center hover:shadow-lg transition-all duration-200"
                  onClick={() => window.location.href = '/demo'}
                  aria-label="See how it works demonstration"
                >
                  <Play className="w-5 h-5 mr-2" />
                  See How It Works
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-200"
                  onClick={() => window.location.href = '/dashboard'}
                  aria-label="View countries where you can send money"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  View Countries
                </motion.button>
              </div>
            </motion.div>
            
            {/* Stats Grid - Simplified */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16"
            >
              <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700 shadow-sm">
                <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.totalVolume}</div>
                <div className="text-sm text-gray-400">Money Sent</div>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700 shadow-sm">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.activeUsers}</div>
                <div className="text-sm text-gray-400">People Using</div>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700 shadow-sm">
                <Globe className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.countries}</div>
                <div className="text-sm text-gray-400">Connected Countries</div>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700 shadow-sm">
                <Clock className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.avgSettlement}</div>
                <div className="text-sm text-gray-400">Arrival Time</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works - New Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              How Does It Work? Easier Than Using WhatsApp
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Sending money with AztlanFi is as simple as sending a message. 
              We explain it step by step:
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">1. Open the App</h3>
              <p className="text-gray-300">
                Download our app or use it from your browser. 
                No need to go to the bank or fill out complicated forms.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalculatorIcon className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">2. Choose How Much to Send</h3>
              <p className="text-gray-300">
                Enter the amount you want to send. 
                We show you exactly how much your family will receive in Mexican pesos.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">3. Done! Money Received</h3>
              <p className="text-gray-300">
                Your family receives the money instantly in their bank account 
                or can withdraw it in cash at any OXXO or bank.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Advantages vs Traditional Banks */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why is AztlanFi Better Than the Bank?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Compare and see the difference. AztlanFi saves you time, money and headaches.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-sm"
            >
              <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center">
                <Banknote className="w-6 h-6 mr-2" />
                Traditional Banks
              </h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>$25-$50 fees per transfer</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>2-5 business day waits</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>You need to go to the bank in person</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Complicated and long forms</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Limited service hours</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl p-8 border border-green-600 shadow-sm bg-green-900/20"
            >
              <h3 className="text-2xl font-bold text-green-400 mb-6 flex items-center">
                <Zap className="w-6 h-6 mr-2" />
                AztlanFi
              </h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Only $2-$5 fee per transfer</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Money arrives in less than 1 minute</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Everything from your phone, without leaving home</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Simple 3-step process</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>24/7 support via WhatsApp</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* User Stories */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Real Stories from People Like You
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how AztlanFi is helping families stay connected
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-700 rounded-xl p-6 border border-gray-600"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <Smile className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Maria, 45 years old</h4>
                  <p className="text-sm text-gray-400">Worker in California</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "Before I spent $35 on bank fees. Now I only pay $3 and my mom 
                receives the money instantly. It's like magic."
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-700 rounded-xl p-6 border border-gray-600"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Carlos, 28 years old</h4>
                  <p className="text-sm text-gray-400">Student in Texas</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "My sister needed money for rent urgently. In 30 seconds 
                she already had the money in her account. Incredible."
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-700 rounded-xl p-6 border border-gray-600"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Ana, 52 years old</h4>
                  <p className="text-sm text-gray-400">Homemaker in Mexico</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "My son sends me money every month. Before I had to go to the bank 
                and wait in line. Now I just check my phone and it's done."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Available Countries */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Send Money to These Countries
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We connect families in more than 15 countries. We'll add more soon.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {activeCorridors.slice(0, 12).map((corridor, index) => (
              <motion.div
                key={corridor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-gray-800 rounded-xl p-4 text-center border border-gray-700 hover:shadow-md transition-all duration-200"
                tabIndex={0}
                role="button"
                aria-label={`Send money to ${corridor.name}`}
              >
                <div className="text-3xl mb-2">{corridor.fromFlag}</div>
                <div className="text-sm font-medium text-white">{corridor.name}</div>
                <div className="text-xs text-gray-400 mt-1">From {corridor.fee}</div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-monad-400 font-semibold hover:text-monad-300 transition-colors"
              onClick={() => window.location.href = '/dashboard'}
              aria-label="View all available countries"
            >
              View All Countries →
            </motion.button>
          </div>
        </div>
      </section>

      {/* Simplified Security */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Your Money is Safe with Us
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We use the same technology that protects your bank account, but improved
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Identity Verification</h3>
              <p className="text-gray-300">
                We verify your identity once, like at the bank. 
                After that you can send money without problems.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Bank-Level Encryption</h3>
              <p className="text-gray-300">
                Your information is protected with the same technology 
                used by the world's largest banks.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Delivery Guarantee</h3>
              <p className="text-gray-300">
                If for any reason the money doesn't arrive, 
                we'll refund it completely. No questions asked.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Simplified */}
      <section className="py-16 bg-gradient-to-r from-monad-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Send Money Like a Message?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of families who are already saving time and money. 
              The process is easier than using WhatsApp.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-monad-600 px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center hover:shadow-lg transition-all duration-200"
                onClick={() => window.location.href = '/dashboard'}
                aria-label="Start sending money now"
              >
                <Send className="w-5 h-5 mr-2" />
                Start Now
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center hover:bg-white hover:text-monad-600 transition-all duration-200"
                onClick={() => window.location.href = '/contact'}
                aria-label="Contact support via WhatsApp"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat on WhatsApp
              </motion.button>
            </div>
            
            <p className="text-blue-100 mt-6 text-sm">
              📱 No download needed. Works in your browser.
            </p>
          </motion.div>
        </div>
      </section>

      <WhatsAppCTA />
      <Footer />
    </div>
  );
}
