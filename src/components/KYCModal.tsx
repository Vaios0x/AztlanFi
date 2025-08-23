'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  X, 
  ArrowRight,
  Star,
  Zap,
  Clock,
  Users,
  Smartphone
} from 'lucide-react'

interface KYCModalProps {
  isOpen: boolean
  onClose: () => void
  onProceed: () => void
}

export function KYCModal({ isOpen, onClose, onProceed }: KYCModalProps) {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 300)
  }

  const handleProceed = () => {
    handleClose()
    onProceed()
  }

  const features = [
    {
      icon: Zap,
      title: '0.3% commission',
      description: 'Reduced fees for verified users'
    },
    {
      icon: Clock,
      title: '24/7 priority support',
      description: 'Get help anytime, anywhere'
    },
    {
      icon: Users,
      title: 'Priority transfers',
      description: 'Faster transaction processing'
    },
    {
      icon: Smartphone,
      title: 'Mobile PWA app',
      description: 'Full mobile experience'
    },
    {
      icon: Shield,
      title: 'Delivery time: 1 second',
      description: 'Near-instant transfers'
    },
    {
      icon: Star,
      title: 'Premium benefits',
      description: 'Exclusive features and rewards'
    }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                     <CheckCircle className="w-5 h-5 text-green-600" />
                   </div>
                                 <div>
                   <h2 className="text-xl font-bold text-gray-900">
                     Plan Pro Disponible
                   </h2>
                   <p className="text-sm text-gray-600">
                     Accede a características premium sin verificación KYC
                   </p>
                 </div>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
                             {/* Demo Message */}
               <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
                 <div className="flex items-start gap-3">
                   <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                   <div>
                                           <h3 className="font-semibold text-green-900 mb-1">
                        ¡Plan Pro Demo Activo!
                      </h3>
                      <p className="text-green-800 text-sm">
                        Para este demo del hackathon, el plan Pro está completamente habilitado. Ya tienes acceso a todas las características premium sin verificación KYC.
                      </p>
                   </div>
                 </div>
               </div>

              {/* Current vs Pro Plan */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Current Plan */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    Plan Actual
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Límite Diario:</span>
                      <span className="font-medium">$500</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Límite Mensual:</span>
                      <span className="font-medium">$2,000</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Comisión:</span>
                      <span className="font-medium">0.5%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Soporte:</span>
                      <span className="font-medium">Email</span>
                    </div>
                  </div>
                </div>

                {/* Pro Plan */}
                <div className="border-2 border-monad-200 bg-gradient-to-br from-monad-50 to-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-monad-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-monad-600 rounded-full"></span>
                    Plan Pro
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-monad-700">Límite Diario:</span>
                      <span className="font-medium text-monad-900">$5,000</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-monad-700">Límite Mensual:</span>
                      <span className="font-medium text-monad-900">$25,000</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-monad-700">Comisión:</span>
                      <span className="font-medium text-monad-900">0.3%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-monad-700">Soporte:</span>
                      <span className="font-medium text-monad-900">24/7 Priority</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pro Features */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Características Premium del Plan Pro
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-monad-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-4 h-4 text-monad-600" />
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
              </div>

              {/* Benefits Summary */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Beneficios de la Verificación
                </h3>
                <ul className="space-y-1 text-sm text-green-800">
                  <li>• Acceso a límites de transferencia más altos</li>
                  <li>• Comisiones reducidas (0.3% vs 0.5%)</li>
                  <li>• Soporte prioritario 24/7</li>
                  <li>• Transferencias más rápidas</li>
                  <li>• Acceso a la aplicación móvil PWA</li>
                  <li>• Sin límites mensuales</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
                                              <button
                   onClick={handleProceed}
                   className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                 >
                   Ir al Dashboard
                   <ArrowRight className="w-4 h-4" />
                 </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
