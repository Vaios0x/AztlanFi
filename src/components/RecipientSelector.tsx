'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Plus, Search, Star } from 'lucide-react'

interface RecipientSelectorProps {
  selectedRecipient: string
  onSelect: (recipient: string) => void
}

const mockRecipients = [
  {
    id: '1',
    name: 'María González',
    phone: '+52 55 1234 5678',
    isFavorite: true,
    lastTransaction: '2024-01-15',
    totalSent: 2500,
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    phone: '+52 55 9876 5432',
    isFavorite: false,
    lastTransaction: '2024-01-10',
    totalSent: 1800,
  },
  {
    id: '3',
    name: 'Ana Martínez',
    phone: '+52 55 5555 1234',
    isFavorite: true,
    lastTransaction: '2024-01-12',
    totalSent: 3200,
  },
  {
    id: '4',
    name: 'Luis Pérez',
    phone: '+52 55 7777 8888',
    isFavorite: false,
    lastTransaction: '2024-01-08',
    totalSent: 950,
  },
]

export function RecipientSelector({ selectedRecipient, onSelect }: RecipientSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const filteredRecipients = mockRecipients.filter(recipient =>
    recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipient.phone.includes(searchTerm)
  )

  const favorites = filteredRecipients.filter(r => r.isFavorite)
  const others = filteredRecipients.filter(r => !r.isFavorite)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Destinatarios
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 text-monad-600 hover:bg-monad-50 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar destinatario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Add New Recipient Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 p-4 bg-gray-50 rounded-lg"
        >
          <h4 className="font-medium text-gray-900 mb-3">Agregar Nuevo Destinatario</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nombre completo"
              className="input-field"
            />
            <input
              type="tel"
              placeholder="Número de teléfono"
              className="input-field"
            />
            <div className="flex space-x-2">
              <button className="flex-1 btn-primary text-sm py-2">
                Guardar
              </button>
              <button 
                onClick={() => setShowAddForm(false)}
                className="flex-1 btn-secondary text-sm py-2"
              >
                Cancelar
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recipients List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {/* Favorites */}
        {favorites.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-500" />
              Favoritos
            </h4>
            <div className="space-y-2">
              {favorites.map((recipient) => (
                <RecipientCard
                  key={recipient.id}
                  recipient={recipient}
                  isSelected={selectedRecipient === recipient.id}
                  onSelect={() => onSelect(recipient.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Others */}
        {others.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Otros Destinatarios
            </h4>
            <div className="space-y-2">
              {others.map((recipient) => (
                <RecipientCard
                  key={recipient.id}
                  recipient={recipient}
                  isSelected={selectedRecipient === recipient.id}
                  onSelect={() => onSelect(recipient.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredRecipients.length === 0 && (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {searchTerm ? 'No se encontraron destinatarios' : 'No hay destinatarios guardados'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="text-monad-600 hover:text-monad-700 text-sm font-medium mt-2"
              >
                Agregar el primero
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

interface RecipientCardProps {
  recipient: {
    id: string
    name: string
    phone: string
    isFavorite: boolean
    lastTransaction: string
    totalSent: number
  }
  isSelected: boolean
  onSelect: () => void
}

function RecipientCard({ recipient, isSelected, onSelect }: RecipientCardProps) {
  return (
    <motion.button
      onClick={onSelect}
      className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
        isSelected
          ? 'border-monad-600 bg-monad-50'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-monad-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {recipient.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{recipient.name}</div>
            <div className="text-sm text-gray-600">{recipient.phone}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">
            ${recipient.totalSent.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            Enviado
          </div>
        </div>
      </div>
    </motion.button>
  )
}
