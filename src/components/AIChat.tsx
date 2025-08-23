'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageCircle, X, Bot, User, Loader2 } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface QuickReply {
  id: string
  text: string
  response: string
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AztlanFi AI assistant. I can help you with:\n\n• Sending money to Mexico\n• Exchange rates and fees\n• Transaction tracking\n• Account setup\n• General questions\n\nHow can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Quick reply options
  const quickReplies: QuickReply[] = [
    {
      id: '1',
      text: '💰 Send Money',
      response: 'How do I send money to Mexico?'
    },
    {
      id: '2',
      text: '📊 Exchange Rate',
      response: 'What is the current exchange rate?'
    },
    {
      id: '3',
      text: '💳 Connect Wallet',
      response: 'How do I connect my wallet?'
    },
    {
      id: '4',
      text: '📈 Track Transaction',
      response: 'How can I track my transaction?'
    },
    {
      id: '5',
      text: '🔒 KYC Verification',
      response: 'Tell me about KYC verification'
    },
    {
      id: '6',
      text: '📋 Fees & Limits',
      response: 'What are the fees and limits?'
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response with predefined responses based on keywords
    const lowerMessage = userMessage.toLowerCase()
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    if (lowerMessage.includes('send') || lowerMessage.includes('money') || lowerMessage.includes('transfer')) {
      return 'To send money to Mexico:\n\n1. Connect your wallet\n2. Click "Send Money Now" on the homepage\n3. Enter the recipient\'s details\n4. Choose the amount\n5. Confirm the transaction\n\nOur fees are only 0.5% and transfers are instant!'
    }
    
    if (lowerMessage.includes('rate') || lowerMessage.includes('exchange') || lowerMessage.includes('mxn')) {
      return 'Current exchange rate: 17.85 MXN/USD\n\nOur rates are updated in real-time and are among the best in the market. We use Monad blockchain technology to ensure transparent and competitive rates.'
    }
    
    if (lowerMessage.includes('fee') || lowerMessage.includes('cost') || lowerMessage.includes('charge')) {
      return 'Our fees are:\n\n• Transaction fee: 0.5%\n• No hidden charges\n• No monthly fees\n• No setup fees\n\nThis is up to 90% cheaper than traditional remittance services!'
    }
    
    if (lowerMessage.includes('track') || lowerMessage.includes('status') || lowerMessage.includes('where')) {
      return 'To track your transaction:\n\n1. Go to the Dashboard\n2. Find your transaction in the history\n3. Click on it to see real-time status\n\nAll transactions are recorded on the Monad blockchain for complete transparency.'
    }
    
    if (lowerMessage.includes('wallet') || lowerMessage.includes('connect') || lowerMessage.includes('metamask')) {
      return 'To connect your wallet:\n\n1. Click the "Connect Wallet" button in the top right\n2. Choose your wallet (MetaMask, WalletConnect, etc.)\n3. Approve the connection\n4. Make sure you\'re on Monad Testnet\n\nWe support all major Web3 wallets!'
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return 'I\'m here to help! You can:\n\n• Ask me about sending money\n• Get information about rates and fees\n• Learn how to track transactions\n• Get help with wallet connection\n\nFor urgent support, contact us at support@aztlanfi.com'
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'Hello! Welcome to AztlanFi! I\'m here to help you with all your remittance needs. What would you like to know about sending money to Mexico?'
    }
    
    if (lowerMessage.includes('kyc') || lowerMessage.includes('verification') || lowerMessage.includes('identity')) {
      return 'KYC (Know Your Customer) verification:\n\n• Required for Pro plan access\n• Simple 3-step process\n• Secure and confidential\n• Usually completed in minutes\n\nVisit the Dashboard to start your verification process.'
    }
    
    if (lowerMessage.includes('batch') || lowerMessage.includes('bulk') || lowerMessage.includes('multiple')) {
      return 'Batch Operations:\n\n• Send money to multiple recipients at once\n• Update exchange rates in bulk\n• Save time and gas fees\n• Available in the Batch Operations section\n\nPerfect for businesses and frequent users!'
    }
    
    if (lowerMessage.includes('report') || lowerMessage.includes('analytics') || lowerMessage.includes('statistics')) {
      return 'Reports & Analytics:\n\n• View transaction history\n• Track spending patterns\n• Export data for accounting\n• Real-time performance metrics\n\nAccess detailed reports in the Reports section.'
    }
    
    if (lowerMessage.includes('security') || lowerMessage.includes('safe') || lowerMessage.includes('secure')) {
      return 'Security Features:\n\n• Monad blockchain technology\n• Smart contract security\n• Real-time transaction verification\n• No personal data stored on-chain\n• Industry-leading encryption\n\nYour money and data are completely secure with us.'
    }
    
    if (lowerMessage.includes('time') || lowerMessage.includes('how long') || lowerMessage.includes('duration')) {
      return 'Transaction Times:\n\n• Money transfers: Instant (1-2 seconds)\n• Wallet connection: 30 seconds\n• KYC verification: 2-5 minutes\n• Support response: Within 24 hours\n\nWe\'re the fastest remittance service available!'
    }
    
    if (lowerMessage.includes('limit') || lowerMessage.includes('maximum') || lowerMessage.includes('amount')) {
      return 'Transaction Limits:\n\n• Basic plan: $1,000/day, $5,000/month\n• Pro plan: $10,000/day, $50,000/month\n• No minimum amount\n• Higher limits available for verified users\n\nContact support for custom limits.'
    }
    
    // Default response
    return 'I understand you\'re asking about "' + userMessage + '". For the most accurate and up-to-date information about AztlanFi services, I recommend:\n\n• Checking our current rates on the homepage\n• Visiting the Dashboard for your account details\n• Contacting our support team for specific questions\n\nIs there anything specific about sending money to Mexico that I can help you with?'
  }

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText.trim()
    if (!textToSend || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    if (!messageText) setInputText('')
    setIsLoading(true)

    try {
      const aiResponse = await generateAIResponse(userMessage.text)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment or contact our support team.',
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickReply = (quickReply: QuickReply) => {
    handleSendMessage(quickReply.response)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 bg-gradient-to-r from-monad-600 to-monad-700 text-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: 0 }}
              animate={{ rotate: 180 }}
              exit={{ rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 180 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-20 right-2 md:right-6 z-40 w-[calc(100vw-1rem)] md:w-[calc(100vw-3rem)] max-w-xs md:max-w-sm h-80 md:h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-monad-600 to-monad-700 text-white p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={12} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AztlanFi AI</h3>
                  <p className="text-xs text-white/80">Online • Ready to help</p>
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' 
                        ? 'bg-monad-600 text-white' 
                        : 'bg-white text-monad-600 border border-monad-200'
                    }`}>
                      {message.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                    </div>
                    <div className={`rounded-2xl px-3 py-2 ${
                      message.sender === 'user'
                        ? 'bg-monad-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}>
                      <p className="text-xs whitespace-pre-line">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2 max-w-[85%]">
                    <div className="w-6 h-6 rounded-full bg-white text-monad-600 border border-monad-200 flex items-center justify-center">
                      <Bot size={12} />
                    </div>
                    <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <Loader2 size={12} className="animate-spin" />
                        <span className="text-xs">AI is typing...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Reply Options */}
            {messages.length === 1 && !isLoading && (
              <div className="p-3 bg-white border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-2 text-center">Quick options:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickReplies.map((reply) => (
                    <motion.button
                      key={reply.id}
                      onClick={() => handleQuickReply(reply)}
                      className="px-3 py-2 text-xs bg-gray-100 hover:bg-monad-100 text-gray-700 hover:text-monad-700 rounded-lg transition-colors border border-gray-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {reply.text}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-monad-500 focus:border-transparent disabled:opacity-50"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isLoading}
                  className="p-2 bg-monad-600 text-white rounded-full hover:bg-monad-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={12} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                Press Enter to send • AI responses are for demonstration
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
