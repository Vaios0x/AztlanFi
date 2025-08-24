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
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';

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
  const { address } = useAccount();
  
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
      // Cargar metas desde localStorage (en producción vendría del contrato)
      const savedGoals = localStorage.getItem(`savings-goals-${address}`);
      if (savedGoals) {
        const parsedGoals = JSON.parse(savedGoals).map((goal: any) => ({
          ...goal,
          deadline: new Date(goal.deadline),
          createdAt: new Date(goal.createdAt),
          nextDeposit: goal.nextDeposit ? new Date(goal.nextDeposit) : undefined
        }));
        setGoals(parsedGoals);
      } else {
        // Estado inicial vacío - no mock data
        setGoals([]);
      }
      toast.success('Metas cargadas exitosamente');
    } catch (error) {
      console.error('Error loading goals:', error);
      toast.error('Error al cargar metas');
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveGoals = (updatedGoals: SavingsGoal[]) => {
    if (address) {
      localStorage.setItem(`savings-goals-${address}`, JSON.stringify(updatedGoals));
    }
  };
  
  const handleCreateGoal = async () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline) {
      toast.error('Please complete all required fields');
      return;
    }
    
    setIsLoading(true);
    try {
      const newGoalData: SavingsGoal = {
        id: Date.now().toString(),
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: parseFloat(newGoal.initialDeposit) || 0,
        deadline: new Date(newGoal.deadline),
        isLocked: newGoal.isLocked,
        createdAt: new Date(),
        progress: 0
      };
      
      if (newGoal.recurringDeposit.enabled && newGoal.recurringDeposit.amount) {
        newGoalData.recurringDeposit = {
          amount: parseFloat(newGoal.recurringDeposit.amount),
          frequency: newGoal.recurringDeposit.frequency,
          nextDeposit: new Date()
        };
      }
      
      const updatedGoals = [...goals, newGoalData];
      setGoals(updatedGoals);
      saveGoals(updatedGoals);
      setShowCreateModal(false);
      resetNewGoal();
      toast.success('Goal created successfully!');
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Error creating savings goal');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeposit = async () => {
    if (!selectedGoal || !depositAmount) return;
    
    setIsLoading(true);
    try {
      // Update goal with deposit
      const updatedGoals = goals.map(goal => {
        if (goal.id === selectedGoal.id) {
          const newAmount = goal.currentAmount + parseFloat(depositAmount);
          return {
            ...goal,
            currentAmount: newAmount,
            progress: Math.min((newAmount / goal.targetAmount) * 100, 100)
          };
        }
        return goal;
      });
      
      setGoals(updatedGoals);
      saveGoals(updatedGoals);
      setSelectedGoal(null);
      setDepositAmount('');
      toast.success('Deposit successful!');
    } catch (error) {
      console.error('Error making deposit:', error);
      toast.error('Error making deposit');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleWithdraw = async (goal: SavingsGoal) => {
    if (goal.isLocked) {
      toast.error('This goal is locked until the target is reached');
      return;
    }
    
    const amount = prompt('Enter the amount to withdraw:');
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsLoading(true);
    try {
      // Simular retiro
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedGoals = goals.map(g => 
        g.id === goal.id 
          ? { 
              ...g, 
              currentAmount: Math.max(0, g.currentAmount - parseFloat(amount)),
              progress: (Math.max(0, g.currentAmount - parseFloat(amount)) / g.targetAmount) * 100
            }
          : g
      );
      setGoals(updatedGoals);
      saveGoals(updatedGoals);
      toast.success('Withdrawal made successfully!');
    } catch (error) {
      console.error('Error withdrawing:', error);
      toast.error('Error making withdrawal');
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
    if (progress >= 100) return 'text-green-400';
    if (progress >= 75) return 'text-blue-400';
    if (progress >= 50) return 'text-yellow-400';
    return 'text-red-400';
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
          <h2 className="text-2xl font-bold text-white">Save for Your Dreams</h2>
          <p className="text-gray-300">Create savings goals and reach your financial objectives</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-monad-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center transform hover:scale-105"
          tabIndex={0}
          aria-label="Create new savings goal"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create My First Goal
        </button>
      </div>
      
      {/* Overall Progress */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Your Overall Progress</h3>
          <PiggyBank className="w-6 h-6 text-indigo-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(totalSaved)}
            </p>
            <p className="text-sm text-gray-300">Total Saved</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">
              {formatCurrency(totalTarget)}
            </p>
            <p className="text-sm text-gray-300">Total Goal</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">
              {overallProgress.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-300">Progress</p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="w-full bg-gray-600 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(overallProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Goals Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-monad-400"></div>
          <span className="ml-3 text-gray-300">Loading your goals...</span>
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            Start Saving!
          </h3>
          <p className="text-gray-300 mb-6">
            Create your first goal to start saving easily and safely
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-monad-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            tabIndex={0}
            aria-label="Create first savings goal"
          >
            Create My First Goal
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
              className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Goal Header */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">{goal.name}</h3>
                  <div className="flex items-center space-x-2">
                    {goal.isLocked ? (
                      <Lock className="w-4 h-4 text-red-400" />
                    ) : (
                      <Unlock className="w-4 h-4 text-green-400" />
                    )}
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          setSelectedGoal(goal);
                          setShowDepositModal(true);
                        }}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        aria-label="Add money to this goal"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleWithdraw(goal)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        aria-label="Withdraw money from this goal"
                      >
                        <TrendingUp className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Progress</span>
                    <span className={`font-medium ${getProgressColor(goal.progress)}`}>
                      {goal.progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
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
                    <p className="text-gray-400">Saved</p>
                    <p className="font-semibold text-green-400">
                      {formatCurrency(goal.currentAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Goal</p>
                    <p className="font-semibold text-white">
                      {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{getDaysRemaining(goal.deadline)} days remaining</span>
                  </div>
                  {goal.progress >= 100 && (
                    <div className="flex items-center text-green-400">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span>Goal reached!</span>
                    </div>
                  )}
                </div>
                
                {/* Recurring Deposit */}
                {goal.recurringDeposit && (
                  <div className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-blue-300">
                        <Repeat className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">
                          Automatic savings
                        </span>
                      </div>
                      <span className="text-sm text-blue-400">
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
            className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Create New Savings Goal</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  What do you want to save for?
                </label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder="Ex: Europe vacation"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  How much do you want to save? (USD)
                </label>
                <input
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  placeholder="5000"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  When do you need it by?
                </label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent bg-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Initial deposit (optional)
                </label>
                <input
                  type="number"
                  value={newGoal.initialDeposit}
                  onChange={(e) => setNewGoal({ ...newGoal, initialDeposit: e.target.value })}
                  placeholder="100"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isLocked"
                  checked={newGoal.isLocked}
                  onChange={(e) => setNewGoal({ ...newGoal, isLocked: e.target.checked })}
                  className="rounded border-gray-600 text-monad-600 focus:ring-monad-500 bg-gray-700"
                />
                <label htmlFor="isLocked" className="ml-2 text-sm text-gray-300">
                  Lock until goal is reached
                </label>
              </div>
              
              <div className="border-t border-gray-600 pt-4">
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="recurringDeposit"
                    checked={newGoal.recurringDeposit.enabled}
                    onChange={(e) => setNewGoal({
                      ...newGoal,
                      recurringDeposit: { ...newGoal.recurringDeposit, enabled: e.target.checked }
                    })}
                    className="rounded border-gray-600 text-monad-600 focus:ring-monad-500 bg-gray-700"
                  />
                  <label htmlFor="recurringDeposit" className="ml-2 text-sm font-medium text-gray-300">
                    Automatic savings
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
                      placeholder="Amount"
                      className="px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                    />
                    <select
                      value={newGoal.recurringDeposit.frequency}
                      onChange={(e) => setNewGoal({
                        ...newGoal,
                        recurringDeposit: { ...newGoal.recurringDeposit, frequency: e.target.value as any }
                      })}
                      className="px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent bg-gray-700 text-white"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
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
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGoal}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-monad-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 transition-all duration-200"
              >
                {isLoading ? 'Creating...' : 'Create My Goal'}
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
            className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Add money to "{selectedGoal.name}"
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  How much do you want to add? (USD)
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="100"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-sm text-gray-300">
                  <p>Current progress: {selectedGoal.progress.toFixed(1)}%</p>
                  <p>Saved: {formatCurrency(selectedGoal.currentAmount)}</p>
                  <p>Goal: {formatCurrency(selectedGoal.targetAmount)}</p>
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
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeposit}
                disabled={isLoading || !depositAmount}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 transition-all duration-200"
              >
                {isLoading ? 'Adding...' : 'Add Money'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
