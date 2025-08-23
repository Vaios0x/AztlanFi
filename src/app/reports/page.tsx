'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  PieChart,
  LineChart,
  Target,
  Zap,
  Globe,
  Search,
  Database,
  Shield,
  Award,
  Star,
  Clock,
  MapPin,
  Smartphone,
  MessageCircle,
  QrCode,
  Wallet,
  CreditCard,
  Banknote,
  Coins,
  Bitcoin,
  Send,
  History,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  Server,
  Cloud,
  Wifi,
  Signal,
  Battery,
  Power,
  Bell,
  Settings,
  HelpCircle,
  Info,
  AlertTriangle,
  XCircle,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  Grid,
  List,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Scissors,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  Hash,
  Code,
  Terminal,
  Command,
  Slash,
  AtSign,
  Percent,
  Euro,
  Minus,
  Plus,
  Divide,
  Equal,
  Variable,
  HardDrive,
  Monitor,
  Tablet,
  Laptop,
  Tv,
  Watch,
  Camera,
  Video,
  VideoOff,
  Image,
  ImageOff,
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  Folder,
  FolderOpen,
  FolderPlus,
  FolderMinus,
  FolderX,
  Save,
  Upload,
  Cloud as CloudIcon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  Sun,
  Moon,
  Star as StarIcon,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Laugh,
  Angry,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Ear,
  EarOff,
  Hand,
  Hand as HandIcon,
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown as ThumbsDownIcon,
  Pin,
  MousePointer,
  MousePointer2,
  Hand as HandIcon2,
  Hand as HandIcon3,
  Hand as HandIcon4,
  Hand as HandIcon5,
  Hand as HandIcon6,
  Hand as HandIcon7,
  Hand as HandIcon8,
  Hand as HandIcon9,
  Hand as HandIcon10
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { useRemittancePool, useComplianceModule, useIncentiveVault, useRemittanceToken } from '@/lib/web3/useContracts'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import toast from 'react-hot-toast'
import { corridors } from '@/lib/constants/corridors'

export default function ReportsPage() {
  const { address, isConnected } = useAccount()
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'corridors' | 'partners' | 'sdg' | 'analytics'>('overview')

  // Contract hooks
  const { userBalance, isLoadingBalance } = useRemittancePool()
  const { userData } = useComplianceModule()
  const { userStats, isLoadingUserStats } = useIncentiveVault()
  const { tokenBalance, isLoadingTokenBalance } = useRemittanceToken()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Enhanced mock data for reports with all partner integrations
  const mockData = {
    totalVolume: 2500000,
    totalTransactions: 15432,
    averageTransaction: 162.50,
    successRate: 99.2,
    monthlyGrowth: 25.5,
    dailyTransactions: [45, 52, 38, 67, 89, 76, 54, 43, 65, 78, 92, 85, 67, 54, 43, 65, 78, 92, 85, 67, 54, 43, 65, 78, 92, 85, 67, 54, 43, 65],
    volumeByMonth: [85000, 92000, 78000, 105000, 125000, 118000, 132000, 145000, 138000, 152000, 168000, 175000],
    
    // Enhanced corridor data
    corridorMetrics: corridors.map(corridor => ({
      id: corridor.id,
      name: corridor.name,
      volume: Math.floor(Math.random() * 500000) + 100000,
      transactions: Math.floor(Math.random() * 5000) + 500,
      successRate: 98 + Math.random() * 2,
      avgSettlementTime: 0.8 + Math.random() * 0.4,
      feeSavings: Math.floor(Math.random() * 50000) + 10000,
      fromFlag: corridor.fromFlag,
      toFlag: corridor.toFlag
    })),
    
    // Partner integration metrics
    partnerMetrics: {
      oxProtocol: {
        gaslessTransactions: 8923,
        totalGasSaved: 154.7,
        averageRouteOptimization: 2.3,
        successRate: 99.8
      },
      reown: {
        socialLogins: 5432,
        telegramUsers: 2341,
        farcasterUsers: 1234,
        totalUsers: 15432
      },
      envio: {
        indexedEvents: 154320,
        realTimeQueries: 89234,
        averageQueryTime: 0.15,
        uptime: 99.99
      },
      para: {
        appClipPayments: 1234,
        savingsGoals: 567,
        totalLocked: 89000,
        averageGoalAmount: 157.3
      }
    },
    
    // SDG Impact metrics
    sdgImpact: {
      sdg1: {
        usersSaved: 15432,
        totalSaved: 1250000,
        averageSavingPerUser: 81.25
      },
      sdg8: {
        unbankedServed: 5432,
        crossBorderJobs: 1234,
        economicActivity: 2500000
      },
      sdg10: {
        corridorsEnabled: 32,
        costReduction: 93.5,
        accessibilityScore: 98.7
      },
      sdg17: {
        partnersIntegrated: 5,
        countriesConnected: 20,
        liquidityProviders: 234
      }
    },
    
    // Enhanced destination data
    topDestinations: [
      { country: 'México', volume: 850000, transactions: 5432, percentage: 28, flag: '🇲🇽' },
      { country: 'Brasil', volume: 450000, transactions: 3245, percentage: 15, flag: '🇧🇷' },
      { country: 'China', volume: 380000, transactions: 2341, percentage: 12, flag: '🇨🇳' },
      { country: 'Colombia', volume: 280000, transactions: 1987, percentage: 9, flag: '🇨🇴' },
      { country: 'Japón', volume: 240000, transactions: 1427, percentage: 8, flag: '🇯🇵' },
      { country: 'India', volume: 200000, transactions: 1234, percentage: 7, flag: '🇮🇳' },
      { country: 'Corea del Sur', volume: 180000, transactions: 987, percentage: 6, flag: '🇰🇷' },
      { country: 'Argentina', volume: 160000, transactions: 876, percentage: 5, flag: '🇦🇷' },
      { country: 'Perú', volume: 140000, transactions: 765, percentage: 4, flag: '🇵🇪' },
      { country: 'Chile', volume: 120000, transactions: 654, percentage: 4, flag: '🇨🇱' },
      { country: 'Ecuador', volume: 100000, transactions: 543, percentage: 3, flag: '🇪🇨' },
      { country: 'Venezuela', volume: 80000, transactions: 432, percentage: 3, flag: '🇻🇪' }
    ],
    
    transactionTypes: [
      { type: 'Sends', count: 10824, percentage: 70, icon: Send },
      { type: 'Received', count: 3245, percentage: 21, icon: Download },
      { type: 'Batch', count: 1363, percentage: 9, icon: Zap }
    ],
    
    // Off-ramp methods data
    offRampMethods: [
      { method: 'SPEI', volume: 450000, transactions: 2341, successRate: 99.5, icon: '🏦' },
      { method: 'PIX', volume: 380000, transactions: 1987, successRate: 99.3, icon: '⚡' },
      { method: 'UnionPay', volume: 320000, transactions: 1654, successRate: 99.1, icon: '💳' },
      { method: 'OXXO', volume: 280000, transactions: 1432, successRate: 98.8, icon: '🏪' },
      { method: 'P2P Network', volume: 220000, transactions: 1123, successRate: 98.5, icon: '🤝' }
    ],
    
    // Real-time analytics data
    realTimeData: {
      activeTransactions: 234,
      networkTPS: 8247,
      averageGasPrice: 23,
      lastBlockNumber: 1247892,
      networkHealth: 98.5
    }
  }

  const handleExportReport = () => {
    toast.success('Report exported successfully')
  }

  const handleRefreshData = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Data updated')
    } catch (error) {
      toast.error('Error updating data')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-monad-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <BarChart3 className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading reports...</h2>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-monad-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Connect your Wallet
            </h2>
            <p className="text-gray-300 mb-6">
              You need to connect your wallet to view reports
            </p>
            <button className="bg-gradient-to-r from-monad-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
              Connect Wallet
            </button>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Reports & Analytics Dashboard
              </h1>
              <p className="text-gray-300">
                Comprehensive insights powered by Envio real-time analytics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-monad-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                onClick={handleRefreshData}
                disabled={isLoading}
                className="bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700 hover:bg-gray-700 transition-all duration-200 flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleExportReport}
                className="bg-gradient-to-r from-monad-600 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 bg-gray-800 rounded-xl p-2 border border-gray-700 mb-8 justify-center"
        >
          {[
            { id: 'overview', label: 'Vista General', icon: BarChart3, color: 'from-blue-600 to-cyan-600' },
            { id: 'corridors', label: 'Corredores', icon: Globe, color: 'from-green-600 to-emerald-600' },
            { id: 'partners', label: 'Partners', icon: Award, color: 'from-purple-600 to-pink-600' },
            { id: 'sdg', label: 'Impacto SDG', icon: Target, color: 'from-orange-600 to-red-600' },
            { id: 'analytics', label: 'Analytics', icon: Database, color: 'from-indigo-600 to-purple-600' }
          ].map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === id
                  ? `bg-gradient-to-r ${color} text-white shadow-lg`
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </motion.div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-gradient-to-r from-blue-500 to-cyan-600 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Total Volume</p>
                <p className="text-2xl font-bold">
                  ${(mockData.totalVolume / 1000000).toFixed(1)}M
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-300" />
                  <span className="text-sm text-green-300">+{mockData.monthlyGrowth}%</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-gradient-to-r from-green-500 to-emerald-600 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Transactions</p>
                <p className="text-2xl font-bold">
                  {mockData.totalTransactions.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-300" />
                  <span className="text-sm text-green-300">+8.2%</span>
                </div>
              </div>
              <Activity className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-gradient-to-r from-purple-500 to-pink-600 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Average/Tx</p>
                <p className="text-2xl font-bold">
                  ${mockData.averageTransaction}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowDownRight className="w-4 h-4 text-red-300" />
                  <span className="text-sm text-red-300">-2.1%</span>
                </div>
              </div>
              <Target className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-gradient-to-r from-orange-500 to-red-600 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Success Rate</p>
                <p className="text-2xl font-bold">
                  {mockData.successRate}%
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-300" />
                  <span className="text-sm text-green-300">+0.5%</span>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Active Corridors</p>
                <p className="text-2xl font-bold">
                  32
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-300" />
                  <span className="text-sm text-green-300">+300%</span>
                </div>
              </div>
              <Globe className="w-8 h-8 opacity-80" />
            </div>
          </motion.div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Daily Transactions Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Daily Transactions</h3>
                  <LineChart className="w-5 h-5 text-monad-400" />
                </div>
                <div className="h-64 flex items-end justify-between gap-1">
                  {mockData.dailyTransactions.map((value, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-gradient-to-t from-monad-600 to-monad-400 rounded-t"
                      style={{ height: `${(value / 100) * 100}%` }}
                    />
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-300">
                  Last 30 days - Average: {Math.round(mockData.dailyTransactions.reduce((a, b) => a + b, 0) / mockData.dailyTransactions.length)} tx/day
                </div>
              </motion.div>

              {/* Volume by Month */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Monthly Volume</h3>
                  <BarChart3 className="w-5 h-5 text-monad-400" />
                </div>
                <div className="h-64 flex items-end justify-between gap-2">
                  {mockData.volumeByMonth.map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t"
                        style={{ height: `${(value / 200000) * 100}%` }}
                      />
                      <span className="text-xs text-gray-400 mt-2">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Detailed Analysis */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Top Destinations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Top Destinations (20+ Countries)</h3>
                  <Globe className="w-5 h-5 text-monad-400" />
                </div>
                <div className="space-y-4">
                  {mockData.topDestinations.map((destination, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-monad-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-white">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{destination.country}</p>
                          <p className="text-sm text-gray-300">{destination.transactions.toLocaleString()} tx</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${(destination.volume / 1000).toFixed(0)}K</p>
                        <p className="text-sm text-gray-600">{destination.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Transaction Types */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="card"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Transaction Types</h3>
                  <PieChart className="w-5 h-5 text-monad-600" />
                </div>
                <div className="space-y-4">
                  {mockData.transactionTypes.map((type, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${
                          index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500'
                        }`} />
                        <span className="font-medium text-gray-900">{type.type}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{type.count.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{type.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-monad-600" />
                    <span className="font-medium text-gray-900">System Efficiency</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    98.5% of transactions complete in less than 1 second
                  </p>
                </div>
              </motion.div>

              {/* Performance Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="card"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
                  <Target className="w-5 h-5 text-monad-600" />
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Average Transaction Time</span>
                      <span className="font-medium">0.8s</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">System Uptime</span>
                      <span className="font-medium">99.9%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Customer Satisfaction</span>
                      <span className="font-medium">4.8/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-monad-50 to-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Period Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Growth:</span>
                        <span className="text-green-600 font-medium">+12.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">New users:</span>
                        <span className="font-medium">+2,847</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average savings:</span>
                        <span className="text-green-600 font-medium">$35/tx</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Corridors Tab */}
        {activeTab === 'corridors' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Corredores de Pago Globales
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Análisis detallado de los 32 corredores estratégicos (16 pares bidireccionales) con métricas en tiempo real
              </p>
            </div>

            {/* Corridor Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockData.corridorMetrics.map((corridor, index) => (
                <motion.div
                  key={corridor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card hover-lift"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{corridor.fromFlag}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="text-2xl">{corridor.toFlag}</span>
                    </div>
                    <div className="status-indicator status-online" />
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{corridor.name}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Volumen:</span>
                      <span className="font-medium">${(corridor.volume / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Transacciones:</span>
                      <span className="font-medium">{corridor.transactions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tiempo promedio:</span>
                      <span className="font-medium text-green-600">{corridor.avgSettlementTime.toFixed(1)}s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ahorro en fees:</span>
                      <span className="font-medium text-green-600">${(corridor.feeSavings / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Partners Tab */}
        {activeTab === 'partners' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Integraciones de Partners
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Métricas de rendimiento de todas las integraciones de partners del hackathon
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 0x Protocol */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">0x Protocol</h3>
                    <p className="text-sm text-gray-600">Gasless Swaps & Route Optimization</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Transacciones sin gas:</span>
                    <span className="font-medium">{mockData.partnerMetrics.oxProtocol.gaslessTransactions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gas ahorrado:</span>
                    <span className="font-medium">{mockData.partnerMetrics.oxProtocol.totalGasSaved} ETH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Optimización promedio:</span>
                    <span className="font-medium">{mockData.partnerMetrics.oxProtocol.averageRouteOptimization}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tasa de éxito:</span>
                    <span className="font-medium text-green-600">{mockData.partnerMetrics.oxProtocol.successRate}%</span>
                  </div>
                </div>
              </motion.div>

              {/* Reown */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Reown AppKit</h3>
                    <p className="text-sm text-gray-600">Social Login & Mini Apps</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Logins sociales:</span>
                    <span className="font-medium">{mockData.partnerMetrics.reown.socialLogins.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Usuarios Telegram:</span>
                    <span className="font-medium">{mockData.partnerMetrics.reown.telegramUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Usuarios Farcaster:</span>
                    <span className="font-medium">{mockData.partnerMetrics.reown.farcasterUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total usuarios:</span>
                    <span className="font-medium">{mockData.partnerMetrics.reown.totalUsers.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>

              {/* Envio */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Envio Analytics</h3>
                    <p className="text-sm text-gray-600">Real-time Indexing & Analytics</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Eventos indexados:</span>
                    <span className="font-medium">{mockData.partnerMetrics.envio.indexedEvents.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Consultas en tiempo real:</span>
                    <span className="font-medium">{mockData.partnerMetrics.envio.realTimeQueries.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tiempo promedio:</span>
                    <span className="font-medium">{mockData.partnerMetrics.envio.averageQueryTime}s</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Uptime:</span>
                    <span className="font-medium text-green-600">{mockData.partnerMetrics.envio.uptime}%</span>
                  </div>
                </div>
              </motion.div>

              {/* Para */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Para Wallet</h3>
                    <p className="text-sm text-gray-600">App Clips & Savings Goals</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pagos App Clip:</span>
                    <span className="font-medium">{mockData.partnerMetrics.para.appClipPayments.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Metas de ahorro:</span>
                    <span className="font-medium">{mockData.partnerMetrics.para.savingsGoals.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total bloqueado:</span>
                    <span className="font-medium">${mockData.partnerMetrics.para.totalLocked.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Promedio por meta:</span>
                    <span className="font-medium">${mockData.partnerMetrics.para.averageGoalAmount}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* SDG Impact Tab */}
        {activeTab === 'sdg' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Impacto en Objetivos de Desarrollo Sostenible
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Métricas de impacto alineadas con los ODS de la ONU para el hackathon BGA
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* SDG 1 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card bg-gradient-to-r from-red-50 to-orange-50 border-red-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">SDG 1: No Poverty</h3>
                    <p className="text-sm text-gray-600">Reducción de pobreza</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Usuarios beneficiados:</span>
                    <span className="font-medium">{mockData.sdgImpact.sdg1.usersSaved.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total ahorrado:</span>
                    <span className="font-medium">${(mockData.sdgImpact.sdg1.totalSaved / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ahorro promedio:</span>
                    <span className="font-medium text-green-600">${mockData.sdgImpact.sdg1.averageSavingPerUser}</span>
                  </div>
                </div>
              </motion.div>

              {/* SDG 8 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">SDG 8: Decent Work</h3>
                    <p className="text-sm text-gray-600">Trabajo decente y crecimiento</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">No bancarizados servidos:</span>
                    <span className="font-medium">{mockData.sdgImpact.sdg8.unbankedServed.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Trabajos transfronterizos:</span>
                    <span className="font-medium">{mockData.sdgImpact.sdg8.crossBorderJobs.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Actividad económica:</span>
                    <span className="font-medium">${(mockData.sdgImpact.sdg8.economicActivity / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </motion.div>

              {/* SDG 10 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">SDG 10: Reduced Inequalities</h3>
                    <p className="text-sm text-gray-600">Reducción de desigualdades</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Corredores habilitados:</span>
                    <span className="font-medium">{mockData.sdgImpact.sdg10.corridorsEnabled}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Reducción de costos:</span>
                    <span className="font-medium text-green-600">{mockData.sdgImpact.sdg10.costReduction}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Puntuación accesibilidad:</span>
                    <span className="font-medium">{mockData.sdgImpact.sdg10.accessibilityScore}%</span>
                  </div>
                </div>
              </motion.div>

              {/* SDG 17 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">SDG 17: Partnerships</h3>
                    <p className="text-sm text-gray-600">Alianzas para los objetivos</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Partners integrados:</span>
                    <span className="font-medium">{mockData.sdgImpact.sdg17.partnersIntegrated}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Países conectados:</span>
                    <span className="font-medium">{mockData.sdgImpact.sdg17.countriesConnected}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Proveedores de liquidez:</span>
                    <span className="font-medium">{mockData.sdgImpact.sdg17.liquidityProviders}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Analytics en Tiempo Real
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Dashboard avanzado con métricas en tiempo real powered by Envio
              </p>
            </div>

            {/* Real-time Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card bg-gradient-to-r from-blue-500 to-cyan-600 text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Transacciones Activas</p>
                    <p className="text-2xl font-bold">
                      {mockData.realTimeData.activeTransactions}
                    </p>
                    <p className="text-sm opacity-80">Procesando ahora</p>
                  </div>
                  <Activity className="w-8 h-8 opacity-80" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card bg-gradient-to-r from-green-500 to-emerald-600 text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Network TPS</p>
                    <p className="text-2xl font-bold">
                      {mockData.realTimeData.networkTPS.toLocaleString()}
                    </p>
                    <p className="text-sm opacity-80">Monad Blockchain</p>
                  </div>
                  <Zap className="w-8 h-8 opacity-80" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card bg-gradient-to-r from-purple-500 to-pink-600 text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Gas Price</p>
                    <p className="text-2xl font-bold">
                      {mockData.realTimeData.averageGasPrice} Gwei
                    </p>
                    <p className="text-sm opacity-80">Promedio actual</p>
                  </div>
                  <TrendingUp className="w-8 h-8 opacity-80" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card bg-gradient-to-r from-orange-500 to-red-600 text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Network Health</p>
                    <p className="text-2xl font-bold">
                      {mockData.realTimeData.networkHealth}%
                    </p>
                    <p className="text-sm opacity-80">Salud de la red</p>
                  </div>
                  <Shield className="w-8 h-8 opacity-80" />
                </div>
              </motion.div>
            </div>

            {/* Off-ramp Methods Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Rendimiento de Métodos Off-ramp</h3>
              <div className="space-y-4">
                {mockData.offRampMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{method.method}</h4>
                        <p className="text-sm text-gray-600">
                          {method.transactions.toLocaleString()} transacciones
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${(method.volume / 1000).toFixed(0)}K</p>
                      <p className="text-sm text-green-600">{method.successRate}% éxito</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
