'use client'

import { Pricing } from '@/components/Pricing'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      


      <main className="pt-8">
        <Pricing />
      </main>
      
      <Footer />
    </div>
  )
}
