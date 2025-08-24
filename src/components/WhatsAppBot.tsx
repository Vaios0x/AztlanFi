'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Globe, 
  DollarSign, 
  Clock,
  CheckCircle,
  AlertCircle,
  Bot,
  User,
  Loader2
} from 'lucide-react';
import { corridors } from '@/lib/constants/corridors';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'quick_reply' | 'corridor_selection' | 'amount_input' | 'confirmation';
  data?: any;
}

interface QuickReply {
  id: string;
  text: string;
  action: string;
}

export function WhatsAppBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<'welcome' | 'corridor' | 'amount' | 'recipient' | 'confirmation'>('welcome');
  const [selectedCorridor, setSelectedCorridor] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState({
    name: '',
    phone: '',
    country: ''
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      // Add welcome message when chat opens
      if (messages.length === 0) {
        addBotMessage('¡Hola! Soy el asistente de AztlanFi. Puedo ayudarte a enviar dinero a cualquier parte del mundo. ¿Qué te gustaría hacer?', 'text');
        addQuickReplies([
          { id: '1', text: 'Enviar Dinero', action: 'send_money' },
          { id: '2', text: 'Ver Corredores', action: 'view_corridors' },
          { id: '3', text: 'Consultar Precios', action: 'check_prices' },
          { id: '4', text: 'Soporte', action: 'support' }
        ]);
      }
    }
  }, [isOpen]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const addBotMessage = (text: string, type: Message['type'] = 'text', data?: any) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date(),
      type,
      data
    };
    setMessages(prev => [...prev, message]);
  };
  
  const addUserMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, message]);
  };
  
  const addQuickReplies = (replies: QuickReply[]) => {
    addBotMessage('', 'quick_reply', { replies });
  };
  
  const simulateTyping = async (callback: () => void) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    setIsTyping(false);
    callback();
  };
  
  const handleQuickReply = async (action: string) => {
    switch (action) {
      case 'send_money':
        addBotMessage('Perfecto, vamos a enviar dinero. Primero, elige el corredor de pago:', 'text');
        showCorridorSelection();
        break;
        
      case 'view_corridors':
        addBotMessage('Aquí tienes todos nuestros corredores disponibles:', 'text');
        showCorridorsList();
        break;
        
      case 'check_prices':
        addBotMessage('Nuestras comisiones son las más bajas del mercado:', 'text');
        addBotMessage('• Comisión estándar: 0.5%\n• Sin comisiones ocultas\n• Liquidación en menos de 1 segundo\n• Soporte 24/7', 'text');
        break;
        
      case 'support':
        addBotMessage('¿En qué puedo ayudarte?', 'text');
        addQuickReplies([
          { id: '1', text: 'Problema Técnico', action: 'tech_support' },
          { id: '2', text: 'Verificación KYC', action: 'kyc_support' },
          { id: '3', text: 'Contactar Humano', action: 'human_support' }
        ]);
        break;
        
      default:
        addBotMessage('No entiendo esa opción. ¿Puedes intentar de nuevo?', 'text');
    }
  };
  
  const showCorridorSelection = () => {
    const activeCorridors = corridors.filter(c => c.active).slice(0, 6);
    const replies = activeCorridors.map((corridor, index) => ({
      id: (index + 1).toString(),
      text: `${corridor.fromFlag}→${corridor.toFlag} ${corridor.name}`,
      action: `select_corridor_${corridor.id}`
    }));
    
    addQuickReplies(replies);
    setCurrentStep('corridor');
  };
  
  const showCorridorsList = () => {
    const activeCorridors = corridors.filter(c => c.active);
    let message = '🌍 **Corredores Disponibles:**\n\n';
    
    activeCorridors.forEach((corridor, index) => {
      message += `${index + 1}. ${corridor.fromFlag}→${corridor.toFlag} ${corridor.name}\n`;
      message += `   💰 Volumen: ${corridor.volume}\n`;
      message += `   💸 Comisión: ${corridor.fee}%\n`;
      message += `   ⚡ Tiempo: ${corridor.settlementTime}\n\n`;
    });
    
    addBotMessage(message, 'text');
  };
  
  const handleCorridorSelection = async (corridorId: string) => {
    const corridor = corridors.find(c => c.id === corridorId);
    if (!corridor) return;
    
    setSelectedCorridor(corridorId);
    
    addBotMessage(`Excelente elección: ${corridor.name}`, 'text');
    addBotMessage(`Ahora ingresa el monto que quieres enviar (en USD):`, 'text');
    addBotMessage('💡 **Ejemplos:**\n• $100\n• $500\n• $1000', 'text');
    
    setCurrentStep('amount');
  };
  
  const handleAmountInput = async (amount: string) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      addBotMessage('Por favor ingresa un monto válido mayor a $0', 'text');
      return;
    }
    
    setAmount(amount);
    const corridor = corridors.find(c => c.id === selectedCorridor);
    const fee = corridor ? (numAmount * corridor.fee) / 100 : (numAmount * 0.5) / 100;
    const total = numAmount + fee;
    
    addBotMessage(`📊 **Resumen de la Transacción:**`, 'text');
    addBotMessage(`💰 Monto: $${numAmount.toFixed(2)} USD\n💸 Comisión: $${fee.toFixed(2)} (${corridor?.fee || 0.5}%)\n💵 Total: $${total.toFixed(2)} USD`, 'text');
    addBotMessage(`¿Quieres continuar con esta transacción?`, 'text');
    addQuickReplies([
      { id: '1', text: '✅ Confirmar', action: 'confirm_transaction' },
      { id: '2', text: '❌ Cancelar', action: 'cancel_transaction' }
    ]);
    
    setCurrentStep('confirmation');
  };
  
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const text = inputText.trim();
    addUserMessage(text);
    setInputText('');
    
    // Handle different conversation flows
    if (currentStep === 'amount') {
      await handleAmountInput(text);
    } else if (text.toLowerCase().includes('enviar') || text.toLowerCase().includes('send')) {
      await handleQuickReply('send_money');
    } else if (text.toLowerCase().includes('corredor') || text.toLowerCase().includes('corridor')) {
      await handleQuickReply('view_corridors');
    } else if (text.toLowerCase().includes('precio') || text.toLowerCase().includes('comisión')) {
      await handleQuickReply('check_prices');
    } else if (text.toLowerCase().includes('ayuda') || text.toLowerCase().includes('soporte')) {
      await handleQuickReply('support');
    } else {
      addBotMessage('No entiendo tu mensaje. ¿Puedes ser más específico?', 'text');
      addQuickReplies([
        { id: '1', text: 'Enviar Dinero', action: 'send_money' },
        { id: '2', text: 'Ver Corredores', action: 'view_corridors' },
        { id: '3', text: 'Ayuda', action: 'support' }
      ]);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <>
      {/* WhatsApp Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Abrir chat de WhatsApp"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>
      
      {/* Chat Window */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-40"
        >
          {/* Header */}
          <div className="bg-green-500 text-white p-4 rounded-t-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">AztlanFi Bot</h3>
                <p className="text-sm text-green-100">Asistente de pagos</p>
              </div>
              <div className="ml-auto flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                <span className="text-xs">En línea</span>
              </div>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {message.type === 'text' && (
                      <div className="whitespace-pre-line">{message.text}</div>
                    )}
                    
                    {message.type === 'quick_reply' && message.data?.replies && (
                      <div className="space-y-2">
                        {message.data.replies.map((reply: QuickReply) => (
                          <button
                            key={reply.id}
                            onClick={() => handleQuickReply(reply.action)}
                            className="block w-full text-left p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                          >
                            {reply.text}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={`text-xs text-gray-500 mt-1 ${
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center order-1 mr-2">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center order-1 ml-2">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </motion.div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-2">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mt-2 text-xs text-gray-500 text-center">
              💡 Tip: Puedes decir "enviar dinero" para comenzar
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

// Missing X icon component
const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
