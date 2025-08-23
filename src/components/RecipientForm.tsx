'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { PaymentCorridor } from '@/lib/constants/corridors';

interface Recipient {
  name: string;
  phone: string;
  email: string;
  address: string;
  bankAccount: string;
}

interface RecipientFormProps {
  recipient: Recipient;
  setRecipient: (recipient: Recipient) => void;
  corridor?: PaymentCorridor;
}

export function RecipientForm({ recipient, setRecipient, corridor }: RecipientFormProps) {
  const [errors, setErrors] = useState<Partial<Recipient>>({});
  const [isValidating, setIsValidating] = useState(false);
  
  const handleInputChange = (field: keyof Recipient, value: string) => {
    setRecipient({ ...recipient, [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };
  
  const validateField = (field: keyof Recipient, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'El nombre es requerido';
        if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
        break;
      case 'phone':
        if (!value.trim()) return 'El teléfono es requerido';
        if (!/^\+?[\d\s\-\(\)]{10,}$/.test(value)) return 'Ingresa un número de teléfono válido';
        break;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Ingresa un email válido';
        }
        break;
      case 'bankAccount':
        if (value && !/^[\d\s\-]{10,}$/.test(value)) {
          return 'Ingresa un número de cuenta válido';
        }
        break;
    }
    return undefined;
  };
  
  const handleBlur = (field: keyof Recipient) => {
    const error = validateField(field, recipient[field]);
    setErrors({ ...errors, [field]: error });
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Recipient> = {};
    let isValid = true;
    
    Object.keys(recipient).forEach((field) => {
      const error = validateField(field as keyof Recipient, recipient[field as keyof Recipient]);
      if (error) {
        newErrors[field as keyof Recipient] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };
  
  const getRequiredFields = () => {
    if (!corridor) return ['name', 'phone'];
    
    // Different corridors may require different fields
    switch (corridor.id) {
      case 'USA-MEX':
      case 'CHN-MEX':
      case 'JPN-MEX':
        return ['name', 'phone', 'address'];
      case 'USA-BRA':
      case 'BRA-MEX':
        return ['name', 'phone', 'bankAccount'];
      default:
        return ['name', 'phone'];
    }
  };
  
  const isFieldRequired = (field: keyof Recipient): boolean => {
    return getRequiredFields().includes(field);
  };
  
  const getFieldLabel = (field: keyof Recipient): string => {
    switch (field) {
      case 'name': return 'Nombre completo';
      case 'phone': return 'Número de teléfono';
      case 'email': return 'Correo electrónico (opcional)';
      case 'address': return 'Dirección completa';
      case 'bankAccount': return 'Número de cuenta bancaria';
      default: return field;
    }
  };
  
  const getFieldPlaceholder = (field: keyof Recipient): string => {
    switch (field) {
      case 'name': return 'Juan Pérez García';
      case 'phone': return '+52 55 1234 5678';
      case 'email': return 'juan.perez@email.com';
      case 'address': return 'Calle Principal 123, Col. Centro, CDMX';
      case 'bankAccount': return '0123 4567 8901 2345';
      default: return '';
    }
  };
  
  const getFieldIcon = (field: keyof Recipient) => {
    switch (field) {
      case 'name': return User;
      case 'phone': return Phone;
      case 'email': return Mail;
      case 'address': return MapPin;
      case 'bankAccount': return CreditCard;
      default: return User;
    }
  };
  
  const renderField = (field: keyof Recipient) => {
    const Icon = getFieldIcon(field);
    const isRequired = isFieldRequired(field);
    const hasError = errors[field];
    const value = recipient[field];
    
    return (
      <div key={field} className="space-y-2">
        <label htmlFor={field} className="block text-sm font-medium text-gray-700">
          {getFieldLabel(field)}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="relative">
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            id={field}
            type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            onBlur={() => handleBlur(field)}
            placeholder={getFieldPlaceholder(field)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              hasError 
                ? 'border-red-300 bg-red-50' 
                : value 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-300'
            }`}
            tabIndex={0}
            aria-label={getFieldLabel(field)}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={hasError ? `${field}-error` : undefined}
          />
          
          {/* Status Icon */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {hasError ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : value ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : null}
          </div>
        </div>
        
        {/* Error Message */}
        {hasError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            id={`${field}-error`}
            className="text-sm text-red-600 flex items-center"
          >
            <AlertCircle className="w-4 h-4 mr-1" />
            {hasError}
          </motion.p>
        )}
        
        {/* Help Text */}
        {field === 'phone' && (
          <p className="text-xs text-gray-500">
            Incluye código de país (ej: +52 para México, +55 para Brasil)
          </p>
        )}
        
        {field === 'bankAccount' && corridor && (
          <p className="text-xs text-gray-500">
            {corridor.toCountry === 'Brazil' 
              ? 'Ingresa el número PIX o cuenta bancaria brasileña'
              : 'Ingresa el número de cuenta bancaria del destinatario'
            }
          </p>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(['name', 'phone', 'email', 'address', 'bankAccount'] as const).map(renderField)}
      </div>
      
      {/* Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Por favor corrige los siguientes errores:
              </h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Success Summary */}
      {Object.keys(errors).length === 0 && 
       getRequiredFields().every(field => recipient[field as keyof Recipient]) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-green-800">
                Información del destinatario completa
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Todos los campos requeridos han sido completados correctamente
              </p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Corridor-specific Instructions */}
      {corridor && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Instrucciones para {corridor.name}
          </h3>
          <div className="text-sm text-blue-700 space-y-1">
            {corridor.id === 'USA-MEX' && (
              <>
                <p>• El destinatario recibirá el dinero en pesos mexicanos</p>
                <p>• Puede recoger en efectivo en OXXO o recibir en cuenta bancaria</p>
                <p>• Tiempo de entrega: {corridor.settlementTime}</p>
              </>
            )}
            {corridor.id === 'CHN-MEX' && (
              <>
                <p>• Transferencia directa a cuenta bancaria mexicana</p>
                <p>• Requiere información bancaria completa</p>
                <p>• Tiempo de entrega: {corridor.settlementTime}</p>
              </>
            )}
            {corridor.id === 'USA-BRA' && (
              <>
                <p>• Transferencia PIX instantánea en Brasil</p>
                <p>• Requiere número de teléfono o CPF del destinatario</p>
                <p>• Tiempo de entrega: {corridor.settlementTime}</p>
              </>
            )}
            {corridor.id === 'BRA-MEX' && (
              <>
                <p>• Transferencia entre cuentas bancarias</p>
                <p>• Requiere información bancaria completa</p>
                <p>• Tiempo de entrega: {corridor.settlementTime}</p>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Privacy Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-800 mb-2">
          Privacidad y Seguridad
        </h3>
        <p className="text-sm text-gray-600">
          La información del destinatario se utiliza únicamente para procesar la transferencia. 
          No compartimos esta información con terceros y está protegida por encriptación de nivel bancario.
        </p>
      </div>
    </div>
  );
}
