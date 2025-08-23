'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Star,
  Zap,
  Clock,
  Users,
  Smartphone,
  Shield,
  ArrowRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export function PricingPlan() {
  const router = useRouter()

  const features = [
    {
      icon: Zap,
      title: 'Transfers up to $25,000 USD',
      description: 'Premium transfer limits'
    },
    {
      icon: Clock,
      title: '0.2% commission',
      description: 'Lowest fees for demo users'
    },
    {
      icon: Users,
      title: '24/7 priority support',
      description: 'Get help anytime, anywhere'
    },
    {
      icon: Smartphone,
      title: 'Priority transfers',
      description: 'Faster transaction processing'
    },
    {
      icon: Shield,
      title: 'Mobile PWA app',
      description: 'Full mobile experience'
    },
    {
      icon: Star,
      title: 'Delivery time: 1 second',
      description: 'Near-instant transfers'
    },
    {
      icon: CheckCircle,
      title: 'Premium benefits',
      description: 'Exclusive features and rewards'
    },
    {
      icon: Users,
      title: 'Monthly limit: $100,000',
      description: 'High volume transfers'
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-monad-600 to-purple-600 text-white p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star className="w-5 h-5" />
          <h3 className="text-xl font-bold">Plan Pro</h3>
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold">$12.99</span>
            <span className="text-lg opacity-80">/mes</span>
          </div>
          <div className="text-sm opacity-80 line-through">$19.99 /mes</div>
        </div>
        <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full inline-block">
          Demo Hackathon - Sin KYC
        </div>
      </div>

      {/* Features */}
      <div className="p-6">
        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-3 h-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-xs">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Demo Notice */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-900 text-sm mb-1">
                ¡Plan Pro Demo Activo!
              </h4>
              <p className="text-green-800 text-xs">
                Para este demo del hackathon, el plan Pro está completamente habilitado sin verificación KYC. 
                Haz clic en "Activar Plan Pro" para acceder al dashboard con todas las características premium.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full bg-gradient-to-r from-monad-600 to-purple-600 text-white rounded-lg py-3 px-4 font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          Activar Plan Pro
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
