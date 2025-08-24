'use client'

import { SavingsGoals } from '@/components/SavingsGoals'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function SavingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header />
      
      <main className="pt-8 pb-16">
        <div className="container mx-auto px-4">
          <SavingsGoals />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
