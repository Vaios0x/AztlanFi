'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Plus, Search, Star } from 'lucide-react'
import { useAccount } from 'wagmi'

interface RecipientSelectorProps {
  selectedRecipient: string
  onSelect: (recipient: string) => void
}

interface Recipient {
  id: string
  name: string
  phone: string
  isFavorite: boolean
  lastTransaction: string
  totalSent: number
}

export function RecipientSelector({ selectedRecipient, onSelect }: RecipientSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newRecipient, setNewRecipient] = useState({
    name: '',
    phone: ''
  })
  
  const { address, isConnected } = useAccount()

  // Load user's recipients from local storage or contract
  useEffect(() => {
    if (isConnected && address) {
      // Load recipients from local storage (in a real app, this would come from a contract or database)
      const savedRecipients = localStorage.getItem(`recipients-${address}`)
      if (savedRecipients) {
        setRecipients(JSON.parse(savedRecipients))
      } else {
        // Default empty state - no mock data
        setRecipients([])
      }
      setIsLoading(false)
    }
  }, [isConnected, address])

  const filteredRecipients = recipients.filter(recipient =>
    recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipient.phone.includes(searchTerm)
  )

  const favorites = filteredRecipients.filter(r => r.isFavorite)
  const others = filteredRecipients.filter(r => !r.isFavorite)

  const addRecipient = (newRecipientData: Omit<Recipient, 'id'>) => {
    const recipient: Recipient = {
      ...newRecipientData,
      id: Date.now().toString()
    }
    
    const updatedRecipients = [...recipients, recipient]
    setRecipients(updatedRecipients)
    
    // Save to local storage
    if (address) {
      localStorage.setItem(`recipients-${address}`, JSON.stringify(updatedRecipients))
    }
    
    setShowAddForm(false)
    setNewRecipient({ name: '', phone: '' })
  }

  const toggleFavorite = (recipientId: string) => {
    const updatedRecipients = recipients.map(r => 
      r.id === recipientId ? { ...r, isFavorite: !r.isFavorite } : r
    )
    setRecipients(updatedRecipients)
    
    if (address) {
      localStorage.setItem(`recipients-${address}`, JSON.stringify(updatedRecipients))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newRecipient.name && newRecipient.phone) {
      addRecipient({
        name: newRecipient.name,
        phone: newRecipient.phone,
        isFavorite: false,
        lastTransaction: 'Never',
        totalSent: 0
      })
    }
  }

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            Conecta tu wallet para ver tus destinatarios
          </p>
        </div>
      </motion.div>
    )
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-monad-600 mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">
            Cargando destinatarios...
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Destinatarios</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary-compact flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar destinatarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Add Recipient Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <h4 className="font-medium text-gray-900 mb-3">Agregar Nuevo Destinatario</h4>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Nombre completo"
              value={newRecipient.name}
              onChange={(e) => setNewRecipient(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent"
              required
            />
            <input
              type="tel"
              placeholder="Número de teléfono"
              value={newRecipient.phone}
              onChange={(e) => setNewRecipient(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent"
              required
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="btn-primary-compact"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setNewRecipient({ name: '', phone: '' })
                }}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Recipients List */}
      {recipients.length === 0 ? (
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No tienes destinatarios guardados</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary-compact"
          >
            Agregar tu primer destinatario
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Favorites */}
          {favorites.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-2" />
                Favoritos
              </h4>
              <div className="space-y-2">
                {favorites.map((recipient) => (
                  <motion.div
                    key={recipient.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedRecipient === recipient.id
                        ? 'border-monad-500 bg-monad-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => onSelect(recipient.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-monad-600 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {recipient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{recipient.name}</div>
                          <div className="text-sm text-gray-500">{recipient.phone}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(recipient.id)
                          }}
                          className="text-yellow-500 hover:text-yellow-600"
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Other Recipients */}
          {others.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Otros Destinatarios</h4>
              <div className="space-y-2">
                {others.map((recipient) => (
                  <motion.div
                    key={recipient.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedRecipient === recipient.id
                        ? 'border-monad-500 bg-monad-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => onSelect(recipient.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {recipient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{recipient.name}</div>
                          <div className="text-sm text-gray-500">{recipient.phone}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(recipient.id)
                          }}
                          className="text-gray-400 hover:text-yellow-500"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
