'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { LiveTracker } from '@/components/LiveTracker'
import { Calculator } from '@/components/Calculator'
import { SendMoneyForm } from '@/components/forms/SendMoneyForm'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppCTA } from '@/components/WhatsAppCTA'
import { ScrollToTop } from '@/components/ScrollToTop'
import { ReownHooksDemo } from '@/components/web3/ReownHooksDemo'
import { PricingPlan } from '@/components/PricingPlan'

export default function Home() {
  const router = useRouter()
  const [showCalculator, setShowCalculator] = useState(false)
  const [showSendForm, setShowSendForm] = useState(false)

  // Handle Send Money Now button
  const handleSendMoney = () => {
    toast.success('Redirecting to send money form...')
    setShowSendForm(true)
    // Scroll to send form section
    setTimeout(() => {
      document.getElementById('send-money-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      })
    }, 500)
  }

  // Handle View Calculator button
  const handleViewCalculator = () => {
    toast.success('Opening calculator...')
    setShowCalculator(true)
    // Scroll to calculator section
    setTimeout(() => {
      document.getElementById('calculator-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      })
    }, 500)
  }

  // Handle Quick Action buttons
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'send':
        handleSendMoney()
        break
      case 'receive':
        toast.success('Receive money function coming soon!')
        break
      case 'track':
        toast.success('Redirecting to dashboard...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
        break
      default:
        break
    }
  }

  // Handle feature card clicks
  const handleFeatureClick = (feature: string) => {
    switch (feature) {
      case 'security':
        toast.success('Blockchain security ensures all transactions are transparent and secure!')
        break
      case 'instant':
        toast.success('Transfers complete in seconds using Monad blockchain technology!')
        break
      case 'rates':
        toast.success('Get the best rates with only 0.5% transaction fee!')
        break
      case 'compliance':
        toast.success('Full regulatory compliance with automated KYC verification!')
        break
      case 'transparency':
        toast.success('All transactions are visible on the blockchain for complete transparency!')
        break
      case 'support':
        toast.success('24/7 support available via chat and email!')
        break
      default:
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-monad-50 to-white">
      <Header />
      
      {/* Hero Section with On-Chain Status */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AztlanFi
              <span className="block text-monad-600">Blockchain Powered</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Send money to Mexico instantly, securely and transparently using Monad blockchain technology.
              The best exchange rates and lowest fees in the market.
            </p>
            
            {/* Live Status Indicators */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Monad Network Active</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Current Rate: 17.85 MXN/USD</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">Fee: 0.5%</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleSendMoney}
                className="btn-primary text-lg px-8 py-4 hover:scale-105 transition-transform"
              >
                Send Money Now
              </button>
              <button 
                onClick={handleViewCalculator}
                className="btn-secondary text-lg px-8 py-4 hover:scale-105 transition-transform"
              >
                View Calculator
              </button>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-monad-100/20 to-blue-100/20"></div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to manage your remittances in one place
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Send Money Card */}
            <div className="card-hover group">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-monad-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-monad-200 transition-colors">
                  <svg className="w-8 h-8 text-monad-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Send Money</h3>
                <p className="text-gray-600 mb-4">
                  Send money to Mexico instantly with the best rates
                </p>
                <button 
                  onClick={() => handleQuickAction('send')}
                  className="btn-primary w-full hover:scale-105 transition-transform"
                >
                  Start Sending
                </button>
              </div>
            </div>

            {/* Receive Money Card */}
            <div className="card-hover group">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Receive Money</h3>
                <p className="text-gray-600 mb-4">
                  Receive money safely and quickly from anywhere in the world
                </p>
                <button 
                  onClick={() => handleQuickAction('receive')}
                  className="btn-secondary w-full hover:scale-105 transition-transform"
                >
                  View QR Code
                </button>
              </div>
            </div>

            {/* Track Transactions Card */}
            <div className="card-hover group">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Transactions</h3>
                <p className="text-gray-600 mb-4">
                  Monitor the status of your transactions in real time
                </p>
                <button 
                  onClick={() => handleQuickAction('track')}
                  className="btn-secondary w-full hover:scale-105 transition-transform"
                >
                  View Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Tracker Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LiveTracker />
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator-section" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Calculator />
        </div>
      </section>

      {/* Reown AppKit Demo Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Reown AppKit Integration
            </h2>
            <p className="text-lg text-gray-600">
              Connect your wallet using the most modern Reown AppKit technology
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <ReownHooksDemo />
          </div>
        </div>
      </section>

      {/* Send Money Form Section */}
      <section id="send-money-section" className="py-16 bg-monad-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Send Money Now
            </h2>
            <p className="text-lg text-gray-600">
              Complete the form to send money securely and transparently
            </p>
          </div>
          <SendMoneyForm 
            selectedRecipient=""
            setSelectedRecipient={() => {}}
            amount=""
            setAmount={() => {}}
          />
        </div>
      </section>





      {/* Features Section */}
      <section className="py-16 bg-monad-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-lg text-gray-600">
              Everything that makes AztlanFi the best option for your remittances
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blockchain Security */}
            <div 
              className="card-hover cursor-pointer"
              onClick={() => handleFeatureClick('security')}
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-monad-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-monad-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Blockchain Security</h3>
                <p className="text-gray-600">
                  All transactions are protected by Monad blockchain technology, ensuring total transparency and security.
                </p>
              </div>
            </div>

            {/* Instant Transfers */}
            <div 
              className="card-hover cursor-pointer"
              onClick={() => handleFeatureClick('instant')}
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Transfers</h3>
                <p className="text-gray-600">
                  Send money to Mexico in seconds, not days. Blockchain technology enables near-instant transfers.
                </p>
              </div>
            </div>

            {/* Best Rates */}
            <div 
              className="card-hover cursor-pointer"
              onClick={() => handleFeatureClick('rates')}
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Rates</h3>
                <p className="text-gray-600">
                  Get the best exchange rates in the market with minimal fees. No hidden costs or surprises.
                </p>
              </div>
            </div>

            {/* Compliance */}
            <div 
              className="card-hover cursor-pointer"
              onClick={() => handleFeatureClick('compliance')}
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Full Compliance</h3>
                <p className="text-gray-600">
                  Complete compliance with financial regulations. Automated KYC and real-time monitoring.
                </p>
              </div>
            </div>

            {/* Transparency */}
            <div 
              className="card-hover cursor-pointer"
              onClick={() => handleFeatureClick('transparency')}
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Total Transparency</h3>
                <p className="text-gray-600">
                  All transactions are visible on the blockchain. No secrets, no hidden costs.
                </p>
              </div>
            </div>

            {/* 24/7 Support */}
            <div 
              className="card-hover cursor-pointer"
              onClick={() => handleFeatureClick('support')}
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
                <p className="text-gray-600">
                  Our team is available 24 hours a day to help you with any questions or issues.
                </p>
              </div>
            </div>
          </div>
        </div>
             </section>

       {/* Pricing Section */}
       <section className="py-16 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-gray-900 mb-4">
               Plan Pro - Demo Hackathon
             </h2>
             <p className="text-lg text-gray-600">
               Accede a todas las características premium sin verificación KYC
             </p>
           </div>
           <div className="max-w-md mx-auto">
             <PricingPlan />
           </div>
         </div>
       </section>

       <WhatsAppCTA />
      <Footer />
      <ScrollToTop />
    </div>
  )
}
