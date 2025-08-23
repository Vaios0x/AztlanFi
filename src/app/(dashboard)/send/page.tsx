'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Globe, 
  DollarSign, 
  Clock, 
  Shield, 
  CheckCircle,
  ArrowLeft,
  AlertCircle,
  Info
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CorridorSelector } from '@/components/CorridorSelector';
import { AmountInput } from '@/components/AmountInput';
import { RecipientForm } from '@/components/RecipientForm';
import { OffRampSelector } from '@/components/OffRampSelector';
import { TransactionPreview } from '@/components/TransactionPreview';
import { useKYC } from '@/hooks/useKYC';
import { corridors } from '@/lib/constants/corridors';
import { use0xProtocol } from '@/lib/integrations/0xProtocol';
import { useParaWallet } from '@/lib/integrations/paraIntegration';

export default function SendMoneyPage() {
  const [step, setStep] = useState(1);
  const [selectedCorridor, setSelectedCorridor] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    bankAccount: ''
  });
  const [selectedOffRamp, setSelectedOffRamp] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>('');
  
  const { isVerified } = useKYC();
  const { getSwapQuote, executeGaslessSwap } = use0xProtocol();
  const { createAppClipPayment } = useParaWallet();
  
  const currentCorridor = corridors.find(c => c.id === selectedCorridor);
  const currentOffRamp = currentCorridor?.offRampMethods.find(m => m.id === selectedOffRamp);
  
  const totalSteps = 4;
  
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSendMoney = async () => {
    if (!isVerified) {
      alert('Por favor completa la verificación KYC primero');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Get swap quote from 0x Protocol
      const quote = await getSwapQuote({
        sellToken: 'USDC',
        buyToken: currentCorridor?.toCountry === 'Mexico' ? 'MXN' : 'USD',
        sellAmount: parseFloat(amount),
        takerAddress: '0x...', // User wallet address
        skipValidation: false,
        intentOnFilling: true
      });
      
      // Execute gasless swap
      const swapResult = await executeGaslessSwap({
        trade: quote,
        signature: '0x...', // User signature
        userAddress: '0x...' // User address
      });
      
      // Create App Clip payment if using Para
      if (selectedOffRamp === 'app-clip') {
        await createAppClipPayment({
          amount: parseFloat(amount),
          recipient: recipient.name,
          token: 'USDC',
          qrCodeData: `aztlanfi://payment/${Date.now()}`
        });
      }
      
      setTransactionHash(swapResult.txHash);
      setStep(5); // Success step
      
    } catch (error) {
      console.error('Error sending money:', error);
      alert('Error al enviar dinero. Por favor intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedCorridor !== '';
      case 2:
        return amount !== '' && parseFloat(amount) > 0;
      case 3:
        return recipient.name !== '' && recipient.phone !== '';
      case 4:
        return selectedOffRamp !== '';
      default:
        return false;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </button>
            <div className="text-sm text-gray-600">
              Paso {step} de {totalSteps}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        
        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <Globe className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Selecciona el Corredor
                </h1>
                <p className="text-gray-600">
                  Elige el corredor de pago que mejor se adapte a tus necesidades
                </p>
              </div>
              
              <CorridorSelector
                selectedCorridor={selectedCorridor}
                onSelectCorridor={setSelectedCorridor}
                corridors={corridors.filter(c => c.active)}
              />
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <DollarSign className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Ingresa el Monto
                </h1>
                <p className="text-gray-600">
                  Especifica cuánto dinero quieres enviar
                </p>
              </div>
              
              <AmountInput
                amount={amount}
                setAmount={setAmount}
                corridor={currentCorridor}
              />
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <CheckCircle className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Información del Destinatario
                </h1>
                <p className="text-gray-600">
                  Proporciona los datos de quien recibirá el dinero
                </p>
              </div>
              
              <RecipientForm
                recipient={recipient}
                setRecipient={setRecipient}
                corridor={currentCorridor}
              />
            </motion.div>
          )}
          
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <Shield className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Método de Entrega
                </h1>
                <p className="text-gray-600">
                  Elige cómo quieres que se entregue el dinero
                </p>
              </div>
              
              <OffRampSelector
                selectedOffRamp={selectedOffRamp}
                onSelectOffRamp={setSelectedOffRamp}
                offRampMethods={currentCorridor?.offRampMethods || []}
              />
            </motion.div>
          )}
          
          {step === 5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <Send className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Confirmar Transacción
                </h1>
                <p className="text-gray-600">
                  Revisa los detalles antes de enviar
                </p>
              </div>
              
              <TransactionPreview
                corridor={currentCorridor}
                amount={amount}
                recipient={recipient}
                offRamp={currentOffRamp}
                onConfirm={handleSendMoney}
                isProcessing={isProcessing}
                transactionHash={transactionHash}
              />
            </motion.div>
          )}
          
          {/* Navigation Buttons */}
          {step < 5 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
              >
                {step === totalSteps ? 'Enviar Dinero' : 'Siguiente'}
                {step === totalSteps && <Send className="w-4 h-4 ml-2" />}
              </button>
            </div>
          )}
        </div>
        
        {/* KYC Warning */}
        {!isVerified && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4"
          >
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Verificación KYC Requerida
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Para enviar dinero, necesitas completar la verificación KYC. 
                  Esto es requerido por regulaciones financieras.
                </p>
                <button
                  onClick={() => window.location.href = '/dashboard/kyc'}
                  className="mt-2 text-sm text-yellow-800 underline hover:text-yellow-900"
                >
                  Completar Verificación →
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <Clock className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Liquidación Rápida</h3>
            <p className="text-sm text-gray-600">
              Transacciones completadas en menos de 1 segundo usando Monad
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <DollarSign className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Comisiones Bajas</h3>
            <p className="text-sm text-gray-600">
              Solo 0.5% de comisión vs 6-8% de servicios tradicionales
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <Shield className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Seguridad Blockchain</h3>
            <p className="text-sm text-gray-600">
              Todas las transacciones son transparentes y seguras en la blockchain
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
