'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Plus, 
  Edit,
  Trash2,
  Lock,
  Unlock,
  Clock,
  CheckCircle,
  AlertCircle,
  PiggyBank,
  Repeat
} from 'lucide-react';
import { useParaWallet } from '@/lib/integrations/paraIntegration';

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  isLocked: boolean;
  recurringDeposit?: {
    amount: number;
    frequency: 'daily' | 'weekly' | 'monthly';
    nextDeposit: Date;
  };
  createdAt: Date;
  progress: number;
}

export function SavingsGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    createSavingsGoal, 
    depositToGoal, 
    getSavingsGoals, 
    setupRecurringDeposit,
    withdrawFromGoal 
  } = useParaWallet();
  
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    initialDeposit: '',
    isLocked: false,
    recurringDeposit: {
      enabled: false,
      amount: '',
      frequency: 'weekly' as const
    }
  });
  
  const [depositAmount, setDepositAmount] = useState('');
  
  useEffect(() => {
    loadGoals();
  }, []);
  
  const loadGoals = async () => {
    setIsLoading(true);
    try {
      const userGoals = await getSavingsGoals();
      setGoals(userGoals);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateGoal = async () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
    
    setIsLoading(true);
    try {
      const goal = await createSavingsGoal({
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.targetAmount),
        deadline: new Date(newGoal.deadline),
        initialDeposit: parseFloat(newGoal.initialDeposit) || 0,
        isLocked: newGoal.isLocked
      });
      
      if (newGoal.recurringDeposit.enabled && newGoal.recurringDeposit.amount) {
        await setupRecurringDeposit({
          goalId: goal.id,
          amount: parseFloat(newGoal.recurringDeposit.amount),
          frequency: newGoal.recurringDeposit.frequency
        });
      }
      
      setGoals([...goals, goal]);
      setShowCreateModal(false);
      resetNewGoal();
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('Error al crear la meta de ahorro');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeposit = async () => {
    if (!selectedGoal || !depositAmount) return;
    
    setIsLoading(true);
    try {
      await depositToGoal({
        goalId: selectedGoal.id,
        amount: parseFloat(depositAmount)
      });
      
      // Update local state
      const updatedGoals = goals.map(goal => 
        goal.id === selectedGoal.id 
          ? { ...goal, currentAmount: goal.currentAmount + parseFloat(depositAmount) }
          : goal
      );
      setGoals(updatedGoals);
      
      setShowDepositModal(false);
      setDepositAmount('');
      setSelectedGoal(null);
    } catch (error) {
      console.error('Error depositing:', error);
      alert('Error al realizar el depósito');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleWithdraw = async (goal: SavingsGoal) => {
    if (goal.isLocked) {
      alert('Esta meta está bloqueada hasta alcanzar el objetivo');
      return;
    }
    
    const amount = prompt('Ingresa el monto a retirar:');
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsLoading(true);
    try {
      await withdrawFromGoal({
        goalId: goal.id,
        amount: parseFloat(amount)
      });
      
      // Update local state
      const updatedGoals = goals.map(g => 
        g.id === goal.id 
          ? { ...g, currentAmount: Math.max(0, g.currentAmount - parseFloat(amount)) }
          : g
      );
      setGoals(updatedGoals);
    } catch (error) {
      console.error('Error withdrawing:', error);
      alert('Error al realizar el retiro');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetNewGoal = () => {
    setNewGoal({
      name: '',
      targetAmount: '',
      deadline: '',
      initialDeposit: '',
      isLocked: false,
      recurringDeposit: {
        enabled: false,
        amount: '',
        frequency: 'weekly'
      }
    });
  };
  
  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'text-green-600';
    if (progress >= 75) return 'text-blue-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getDaysRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Metas de Ahorro</h2>
          <p className="text-gray-600">Ahorra de forma inteligente con Para Wallet</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-200 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Meta
        </button>
      </div>
      
      {/* Overall Progress */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Progreso General</h3>
          <PiggyBank className="w-6 h-6 text-blue-600" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalSaved)}
            </p>
            <p className="text-sm text-gray-600">Total Ahorrado</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalTarget)}
            </p>
            <p className="text-sm text-gray-600">Meta Total</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {overallProgress.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Progreso</p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(overallProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Goals Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando metas...</span>
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tienes metas de ahorro
          </h3>
          <p className="text-gray-600 mb-6">
            Crea tu primera meta para comenzar a ahorrar de forma inteligente
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Crear Primera Meta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            >
              {/* Goal Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                  <div className="flex items-center space-x-2">
                    {goal.isLocked ? (
                      <Lock className="w-4 h-4 text-red-500" />
                    ) : (
                      <Unlock className="w-4 h-4 text-green-500" />
                    )}
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          setSelectedGoal(goal);
                          setShowDepositModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        aria-label="Depositar"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleWithdraw(goal)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        aria-label="Retirar"
                      >
                        <TrendingUp className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progreso</span>
                    <span className={`font-medium ${getProgressColor(goal.progress)}`}>
                      {goal.progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        goal.progress >= 100 
                          ? 'bg-green-500' 
                          : goal.progress >= 75 
                          ? 'bg-blue-500' 
                          : goal.progress >= 50 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(goal.progress, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Goal Details */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Ahorrado</p>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(goal.currentAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Meta</p>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{getDaysRemaining(goal.deadline)} días</span>
                  </div>
                  {goal.progress >= 100 && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span>¡Completada!</span>
                    </div>
                  )}
                </div>
                
                {/* Recurring Deposit */}
                {goal.recurringDeposit && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-blue-700">
                        <Repeat className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">
                          Depósito automático
                        </span>
                      </div>
                      <span className="text-sm text-blue-600">
                        {formatCurrency(goal.recurringDeposit.amount)}/{goal.recurringDeposit.frequency}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Create Goal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nueva Meta de Ahorro</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la meta
                </label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder="Ej: Vacaciones en Europa"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta de ahorro (USD)
                </label>
                <input
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  placeholder="5000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha límite
                </label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Depósito inicial (opcional)
                </label>
                <input
                  type="number"
                  value={newGoal.initialDeposit}
                  onChange={(e) => setNewGoal({ ...newGoal, initialDeposit: e.target.value })}
                  placeholder="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isLocked"
                  checked={newGoal.isLocked}
                  onChange={(e) => setNewGoal({ ...newGoal, isLocked: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isLocked" className="ml-2 text-sm text-gray-700">
                  Bloquear hasta alcanzar la meta
                </label>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="recurringDeposit"
                    checked={newGoal.recurringDeposit.enabled}
                    onChange={(e) => setNewGoal({
                      ...newGoal,
                      recurringDeposit: { ...newGoal.recurringDeposit, enabled: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="recurringDeposit" className="ml-2 text-sm font-medium text-gray-700">
                    Depósito automático
                  </label>
                </div>
                
                {newGoal.recurringDeposit.enabled && (
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={newGoal.recurringDeposit.amount}
                      onChange={(e) => setNewGoal({
                        ...newGoal,
                        recurringDeposit: { ...newGoal.recurringDeposit, amount: e.target.value }
                      })}
                      placeholder="Monto"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                      value={newGoal.recurringDeposit.frequency}
                      onChange={(e) => setNewGoal({
                        ...newGoal,
                        recurringDeposit: { ...newGoal.recurringDeposit, frequency: e.target.value as any }
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="daily">Diario</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensual</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetNewGoal();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateGoal}
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Creando...' : 'Crear Meta'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Deposit Modal */}
      {showDepositModal && selectedGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Depositar a "{selectedGoal.name}"
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto a depositar (USD)
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">
                  <p>Progreso actual: {selectedGoal.progress.toFixed(1)}%</p>
                  <p>Ahorrado: {formatCurrency(selectedGoal.currentAmount)}</p>
                  <p>Meta: {formatCurrency(selectedGoal.targetAmount)}</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowDepositModal(false);
                  setDepositAmount('');
                  setSelectedGoal(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeposit}
                disabled={isLoading || !depositAmount}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Depositando...' : 'Depositar'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
