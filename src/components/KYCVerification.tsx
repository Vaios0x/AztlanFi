'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Upload, 
  Camera, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  FileText,
  Eye,
  EyeOff,
  X,
  ArrowRight,
  Clock,
  Star
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { useComplianceModule } from '@/lib/web3/useContracts'
import toast from 'react-hot-toast'

interface KYCFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  ssn: string
  documentType: 'passport' | 'drivers_license' | 'national_id'
  documentNumber: string
}

interface KYCStatus {
  level: number
  isVerified: boolean
  isPending: boolean
  isRejected: boolean
  rejectionReason?: string
  submittedAt?: Date
  verifiedAt?: Date
}

export function KYCVerification() {
  const { address, isConnected } = useAccount()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSSN, setShowSSN] = useState(false)
  const [formData, setFormData] = useState<KYCFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    ssn: '',
    documentType: 'drivers_license',
    documentNumber: ''
  })

  const [kycStatus, setKycStatus] = useState<KYCStatus>({
    level: 0,
    isVerified: false,
    isPending: false,
    isRejected: false
  })

  const { userData, isLoadingUserData } = useComplianceModule()

  useEffect(() => {
    if (userData) {
      const userDataTyped = userData as any
      const kycLevel = userDataTyped?.kycLevel || 0
      setKycStatus({
        level: kycLevel,
        isVerified: kycLevel >= 1,
        isPending: false,
        isRejected: false
      })
    }
  }, [userData])

  const handleInputChange = (field: keyof KYCFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone)
      case 2:
        return !!(formData.dateOfBirth && formData.address && formData.city && formData.state && formData.zipCode)
      case 3:
        return !!(formData.ssn && formData.documentNumber)
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    } else {
      toast.error('Por favor completa todos los campos requeridos')
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    setIsSubmitting(true)
    try {
      // Simular envío de verificación KYC
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setKycStatus({
        level: 1,
        isVerified: true,
        isPending: false,
        isRejected: false,
        submittedAt: new Date(),
        verifiedAt: new Date()
      })
      
      toast.success('¡Verificación KYC completada exitosamente!')
    } catch (error) {
      toast.error('Error al enviar verificación KYC')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getKYCLevelInfo = (level: number) => {
    switch (level) {
      case 0:
        return {
          title: 'Sin Verificación',
          description: 'Límites básicos aplicados',
          dailyLimit: '$500',
          monthlyLimit: '$2,000',
          features: ['Transferencias básicas', 'Soporte por email']
        }
      case 1:
        return {
          title: 'Verificación Básica',
          description: 'Límites aumentados',
          dailyLimit: '$5,000',
          monthlyLimit: '$25,000',
          features: ['Transferencias prioritarias', 'Soporte 24/7', 'App móvil PWA']
        }
      case 2:
        return {
          title: 'Verificación Avanzada',
          description: 'Límites premium',
          dailyLimit: '$25,000',
          monthlyLimit: '$100,000',
          features: ['Todas las características Pro', 'Comisión 0.3%', 'Sin límites mensuales']
        }
      default:
        return {
          title: 'Verificación Premium',
          description: 'Límites ilimitados',
          dailyLimit: 'Sin límite',
          monthlyLimit: 'Sin límite',
          features: ['Todas las características', 'Comisión 0.1%', 'Soporte VIP']
        }
    }
  }

  const currentLevelInfo = getKYCLevelInfo(kycStatus.level)
  const nextLevelInfo = getKYCLevelInfo(kycStatus.level + 1)

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Conecta tu Wallet
        </h3>
        <p className="text-gray-600">
          Necesitas conectar tu wallet para acceder a la verificación KYC
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-monad-600 to-monad-700 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Verificación KYC
          </h2>
          <p className="text-lg text-gray-600">
            Completa tu verificación para acceder a límites más altos y características premium
          </p>
        </motion.div>
      </div>

      {/* KYC Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-2 gap-6 mb-8"
      >
        {/* Current Level */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Nivel Actual
            </h3>
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < kycStatus.level ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Estado:</span>
              <span className={`font-medium ${
                kycStatus.isVerified ? 'text-green-600' : 'text-orange-600'
              }`}>
                {kycStatus.isVerified ? 'Verificado' : 'Pendiente'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Límite Diario:</span>
              <span className="font-medium">{currentLevelInfo.dailyLimit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Límite Mensual:</span>
              <span className="font-medium">{currentLevelInfo.monthlyLimit}</span>
            </div>
          </div>
        </div>

        {/* Next Level Benefits */}
        {kycStatus.level < 3 && (
          <div className="bg-gradient-to-br from-monad-50 to-blue-50 rounded-xl border border-monad-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Próximo Nivel
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Límite Diario:</span>
                <span className="font-medium text-monad-600">{nextLevelInfo.dailyLimit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Límite Mensual:</span>
                <span className="font-medium text-monad-600">{nextLevelInfo.monthlyLimit}</span>
              </div>
              <div className="pt-2">
                <span className="text-sm text-gray-600">Nuevas características:</span>
                <ul className="mt-1 space-y-1">
                  {nextLevelInfo.features.slice(0, 2).map((feature, index) => (
                    <li key={index} className="text-sm text-monad-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* KYC Form */}
      {!kycStatus.isVerified && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step <= currentStep 
                    ? 'bg-monad-600 border-monad-600 text-white' 
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}>
                  {step < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="font-medium">{step}</span>
                  )}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-monad-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Información Personal
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent"
                        placeholder="Tu apellido"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent"
                        placeholder="tu@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Información de Residencia
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Nacimiento *
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        País
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent"
                      >
                        <option value="US">Estados Unidos</option>
                        <option value="MX">México</option>
                        <option value="CA">Canadá</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección *
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent"
                        placeholder="123 Main St"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent"
                        placeholder="Ciudad"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado *
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent"
                        placeholder="Estado"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código Postal *
                      </label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent"
                        placeholder="12345"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Documentación
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SSN (Últimos 4 dígitos) *
                      </label>
                      <div className="relative">
                        <input
                          type={showSSN ? "text" : "password"}
                          value={formData.ssn}
                          onChange={(e) => handleInputChange('ssn', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent"
                          placeholder="****"
                          maxLength={4}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSSN(!showSSN)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showSSN ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Documento
                      </label>
                      <select
                        value={formData.documentType}
                        onChange={(e) => handleInputChange('documentType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent"
                      >
                        <option value="drivers_license">Licencia de Conducir</option>
                        <option value="passport">Pasaporte</option>
                        <option value="national_id">Identificación Nacional</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Documento *
                      </label>
                      <input
                        type="text"
                        value={formData.documentNumber}
                        onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent"
                        placeholder="Número de documento"
                      />
                    </div>
                  </div>

                  {/* Document Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Subir Documento de Identificación
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Sube una foto clara de tu documento de identificación
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button className="btn-secondary flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        Tomar Foto
                      </button>
                      <button className="btn-secondary flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Seleccionar Archivo
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                className="btn-primary flex items-center gap-2"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Enviar Verificación
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* KYC Verified Status */}
      {kycStatus.isVerified && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6 text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-900 mb-2">
            ¡Verificación Completada!
          </h3>
          <p className="text-green-700 mb-4">
            Tu cuenta ha sido verificada exitosamente. Ahora puedes acceder a límites más altos y características premium.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-green-600 font-medium">Límite Diario:</span>
              <p className="text-green-900 font-semibold">{currentLevelInfo.dailyLimit}</p>
            </div>
            <div>
              <span className="text-green-600 font-medium">Límite Mensual:</span>
              <p className="text-green-900 font-semibold">{currentLevelInfo.monthlyLimit}</p>
            </div>
            <div>
              <span className="text-green-600 font-medium">Comisión:</span>
              <p className="text-green-900 font-semibold">0.3%</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
