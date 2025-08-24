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
              { id: 'overview', label: 'Overview', icon: BarChart3, color: 'from-blue-600 to-cyan-600' },
              { id: 'corridors', label: 'Corridors', icon: Globe, color: 'from-green-600 to-emerald-600' },
              { id: 'partners', label: 'Partners', icon: Award, color: 'from-purple-600 to-pink-600' },
              { id: 'sdg', label: 'SDG Impact', icon: Target, color: 'from-orange-600 to-red-600' },
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
                                        <p className="font-semibold text-white">${(destination.volume / 1000).toFixed(0)}K</p>
                <p className="text-sm text-gray-400">{destination.percentage}%</p>
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
                  <h3 className="text-lg font-semibold text-white">Transaction Types</h3>
                  <PieChart className="w-5 h-5 text-monad-600" />
                </div>
                <div className="space-y-4">
                  {mockData.transactionTypes.map((type, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${
                          index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500'
                        }`} />
                        <span className="font-medium text-white">{type.type}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">{type.count.toLocaleString()}</p>
                        <p className="text-sm text-gray-400">{type.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-monad-400" />
                    <span className="font-medium text-white">System Efficiency</span>
                  </div>
                  <p className="text-sm text-gray-300">
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
                  <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
                  <Target className="w-5 h-5 text-monad-600" />
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Average Transaction Time</span>
                      <span className="font-medium text-white">0.8s</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">System Uptime</span>
                      <span className="font-medium text-white">99.9%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Customer Satisfaction</span>
                      <span className="font-medium text-white">4.8/5</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-monad-900 to-purple-900 p-4 rounded-lg border border-monad-700">
                    <h4 className="font-semibold text-white mb-2">Period Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Growth:</span>
                        <span className="text-green-400 font-medium">+12.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">New users:</span>
                        <span className="font-medium text-white">+2,847</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Average savings:</span>
                        <span className="text-green-400 font-medium">$35/tx</span>
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
              <h2 className="text-3xl font-bold text-white mb-4">
                Money Transfer Routes
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                See how the money you send to different countries flows. Here you can see how much money moves and how fast it arrives.
              </p>
            </div>

            {/* General Summary */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                General Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">32</div>
                  <div className="text-sm text-gray-400">Active routes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">20</div>
                  <div className="text-sm text-gray-400">Connected countries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">98.5%</div>
                  <div className="text-sm text-gray-400">Successful transfers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">0.8s</div>
                  <div className="text-sm text-gray-400">Average time</div>
                </div>
              </div>
            </div>

            {/* Transfer Routes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockData.corridorMetrics.map((corridor, index) => (
                <motion.div
                  key={corridor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{corridor.fromFlag}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="text-2xl">{corridor.toFlag}</span>
                    </div>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  </div>
                  
                  <h3 className="font-semibold text-white mb-4">{corridor.name}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">💰 Money sent:</span>
                      <span className="font-medium text-white">${(corridor.volume / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">📤 Transfers made:</span>
                      <span className="font-medium text-white">{corridor.transactions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">⚡ Speed:</span>
                      <span className="font-medium text-green-400">Less than 1 minute</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">💸 Money saved:</span>
                      <span className="font-medium text-green-400">${(corridor.feeSavings / 1000).toFixed(0)}K</span>
                    </div>
                  </div>

                  {/* Success progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Successful transfers</span>
                      <span>{corridor.successRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${corridor.successRate}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Information */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                What does this mean?
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
                <div>
                  <h4 className="font-medium text-white mb-2">📊 Money sent</h4>
                  <p>This is the total amount of money that has been sent through this route in the last month.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">📤 Transfers made</h4>
                  <p>The total number of times money has been sent through this route.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">⚡ Speed</h4>
                  <p>How long it takes for the money to arrive from when you send it until it reaches its destination.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">💸 Money saved</h4>
                  <p>How much money our users have saved compared to other services.</p>
                </div>
              </div>
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
              <h2 className="text-3xl font-bold text-white mb-4">
                Our Technology Partners
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We work with the best companies to make your experience easier and faster
              </p>
            </div>

            {/* Partners Summary */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                Collaboration Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">4</div>
                  <div className="text-sm text-gray-400">Partner companies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">15K+</div>
                  <div className="text-sm text-gray-400">Connected users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">$89K</div>
                  <div className="text-sm text-gray-400">Money saved</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 0x Protocol */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">0x Protocol</h3>
                    <p className="text-sm text-gray-300">Makes transfers cheaper and faster</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">⚡ Fee-free transfers:</span>
                    <span className="font-medium text-white">{mockData.partnerMetrics.oxProtocol.gaslessTransactions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">💰 Money saved:</span>
                    <span className="font-medium text-white">${(mockData.partnerMetrics.oxProtocol.totalGasSaved * 2000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">🎯 Route improvements:</span>
                    <span className="font-medium text-white">{mockData.partnerMetrics.oxProtocol.averageRouteOptimization}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">✅ Successful transfers:</span>
                    <span className="font-medium text-green-400">{mockData.partnerMetrics.oxProtocol.successRate}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Overall performance</span>
                    <span>{mockData.partnerMetrics.oxProtocol.successRate}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${mockData.partnerMetrics.oxProtocol.successRate}%` }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Reown */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Reown AppKit</h3>
                    <p className="text-sm text-gray-300">Lets you easily sign in with social networks</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">🔐 Social logins:</span>
                    <span className="font-medium text-white">{mockData.partnerMetrics.reown.socialLogins.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">📱 Telegram users:</span>
                    <span className="font-medium text-white">{mockData.partnerMetrics.reown.telegramUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">🌐 Farcaster users:</span>
                    <span className="font-medium text-white">{mockData.partnerMetrics.reown.farcasterUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">👥 Total users:</span>
                    <span className="font-medium text-white">{mockData.partnerMetrics.reown.totalUsers.toLocaleString()}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Active users</span>
                    <span>{Math.round((mockData.partnerMetrics.reown.totalUsers / 20000) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(mockData.partnerMetrics.reown.totalUsers / 20000) * 100}%` }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Envio */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Envio Analytics</h3>
                    <p className="text-sm text-gray-300">Processes all information in real time</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">📊 Data processed:</span>
                    <span className="font-medium text-white">{mockData.partnerMetrics.envio.indexedEvents.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">🔍 Live searches:</span>
                    <span className="font-medium text-white">{mockData.partnerMetrics.envio.realTimeQueries.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">⚡ Speed:</span>
                    <span className="font-medium text-white">Less than 1 second</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">🟢 Uptime:</span>
                    <span className="font-medium text-green-400">{mockData.partnerMetrics.envio.uptime}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Service availability</span>
                    <span>{mockData.partnerMetrics.envio.uptime}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${mockData.partnerMetrics.envio.uptime}%` }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Para */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Para Wallet</h3>
                    <p className="text-sm text-gray-300">Helps you save and pay from your phone</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">📱 Mobile payments:</span>
                    <span className="font-medium text-white">{mockData.partnerMetrics.para.appClipPayments.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">🎯 Savings goals:</span>
                    <span className="font-medium text-white">{mockData.partnerMetrics.para.savingsGoals.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">💰 Money saved:</span>
                    <span className="font-medium text-white">${mockData.partnerMetrics.para.totalLocked.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">📈 Average per goal:</span>
                    <span className="font-medium text-white">${mockData.partnerMetrics.para.averageGoalAmount}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Completed goals</span>
                    <span>{Math.round((mockData.partnerMetrics.para.savingsGoals / 1000) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(mockData.partnerMetrics.para.savingsGoals / 1000) * 100}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                Why do we work with these companies?
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
                <div>
                  <h4 className="font-medium text-white mb-2">🤝 Collaboration</h4>
                  <p>Each company helps us do something specific better: faster, cheaper, or easier to use.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">💡 Innovation</h4>
                  <p>We use the best available technologies to give you the best possible experience.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">🛡️ Security</h4>
                  <p>All these companies are leaders in their fields and maintain high security standards.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">📈 Growth</h4>
                  <p>Together we can serve more people and make sending money more accessible for everyone.</p>
                </div>
              </div>
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
              <h2 className="text-3xl font-bold text-white mb-4">
                Our Impact on the World
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                See how we help make the world a better place. We work with UN goals to help people.
              </p>
            </div>

            {/* Impact Summary */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Summary of Our Impact
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">15K+</div>
                  <div className="text-sm text-gray-400">People helped</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">$1.25M</div>
                  <div className="text-sm text-gray-400">Money saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">20</div>
                  <div className="text-sm text-gray-400">Connected countries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">93%</div>
                  <div className="text-sm text-gray-400">Lower costs</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Meta 1: Sin Pobreza */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Goal 1: No Poverty</h3>
                    <p className="text-sm text-gray-300">We help people save money</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">👥 People who saved:</span>
                    <span className="font-medium text-white">{mockData.sdgImpact.sdg1.usersSaved.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">💰 Total saved:</span>
                    <span className="font-medium text-white">${(mockData.sdgImpact.sdg1.totalSaved / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">💸 Savings per person:</span>
                    <span className="font-medium text-green-400">${mockData.sdgImpact.sdg1.averageSavingPerUser}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Goal achieved</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-orange-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: '75%' }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Meta 8: Trabajo Decente */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Goal 8: Decent Work</h3>
                    <p className="text-sm text-gray-300">We help unbanked people</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">🏦 Unbanked helped:</span>
                    <span className="font-medium text-white">{mockData.sdgImpact.sdg8.unbankedServed.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">💼 Jobs created:</span>
                    <span className="font-medium text-white">{mockData.sdgImpact.sdg8.crossBorderJobs.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">📈 Economic activity:</span>
                    <span className="font-medium text-white">${(mockData.sdgImpact.sdg8.economicActivity / 1000000).toFixed(1)}M</span>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Meta alcanzada</span>
                    <span>68%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: '68%' }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Meta 10: Menos Desigualdad */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Goal 10: Reduced Inequalities</h3>
                    <p className="text-sm text-gray-300">We make sending money easier</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">🌍 Available routes:</span>
                    <span className="font-medium text-white">{mockData.sdgImpact.sdg10.corridorsEnabled}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">💸 Lower costs:</span>
                    <span className="font-medium text-green-400">{mockData.sdgImpact.sdg10.costReduction}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">✅ Easy to use:</span>
                    <span className="font-medium text-white">{mockData.sdgImpact.sdg10.accessibilityScore}%</span>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Meta alcanzada</span>
                    <span>92%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: '92%' }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Meta 17: Alianzas */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Goal 17: Partnerships</h3>
                    <p className="text-sm text-gray-300">We work with the best companies</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">🤝 Partner companies:</span>
                    <span className="font-medium text-white">{mockData.sdgImpact.sdg17.partnersIntegrated}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">🌍 Connected countries:</span>
                    <span className="font-medium text-white">{mockData.sdgImpact.sdg17.countriesConnected}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">💳 Payment providers:</span>
                    <span className="font-medium text-white">{mockData.sdgImpact.sdg17.liquidityProviders}</span>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Meta alcanzada</span>
                    <span>85%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: '85%' }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                What are these goals?
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
                <div>
                  <h4 className="font-medium text-white mb-2">🎯 UN Goals</h4>
                  <p>These are 17 objectives that the UN created to make the world a better place. We work on 4 of them.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">💡 Our Commitment</h4>
                  <p>We want to make sending money easier, cheaper, and more accessible for all people in the world.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">📊 We Measure Our Impact</h4>
                  <p>We keep track of how many people we help and how much money they save using our service.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">🌱 Sustainable Growth</h4>
                  <p>We work so that our business helps people and the planet at the same time.</p>
                </div>
              </div>
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
              <h2 className="text-3xl font-bold text-white mb-4">
                Live Statistics
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                See what's happening right now in our service. Here you can see in real time how everything is going.
              </p>
            </div>

            {/* Current Status Summary */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                Current Service Status
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">🟢</div>
                  <div className="text-sm text-gray-400">All systems working</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">⚡</div>
                  <div className="text-sm text-gray-400">Very fast</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">🛡️</div>
                  <div className="text-sm text-gray-400">Secure</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">📱</div>
                  <div className="text-sm text-gray-400">Available 24/7</div>
                </div>
              </div>
            </div>

            {/* Real-time Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">📤 Transfers in Progress</p>
                    <p className="text-2xl font-bold text-white">
                      {mockData.realTimeData.activeTransactions}
                    </p>
                    <p className="text-sm text-green-400">Arriving now</p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">⚡ System Speed</p>
                    <p className="text-2xl font-bold text-white">
                      {Math.round(mockData.realTimeData.networkTPS / 1000)}K
                    </p>
                    <p className="text-sm text-green-400">Operations per second</p>
                  </div>
                  <Zap className="w-8 h-8 text-green-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">💰 Current Costs</p>
                    <p className="text-2xl font-bold text-white">
                      ${mockData.realTimeData.averageGasPrice}
                    </p>
                    <p className="text-sm text-green-400">Very low</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-purple-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">🛡️ Service Status</p>
                    <p className="text-2xl font-bold text-white">
                      {mockData.realTimeData.networkHealth}%
                    </p>
                    <p className="text-sm text-green-400">Excellent</p>
                  </div>
                  <Shield className="w-8 h-8 text-orange-400" />
                </div>
              </motion.div>
            </div>

            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                How Do They Receive the Money?
              </h3>
              <div className="space-y-4">
                {mockData.offRampMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <h4 className="font-medium text-white">{method.method}</h4>
                        <p className="text-sm text-gray-300">
                          {method.transactions.toLocaleString()} people used this
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">${(method.volume / 1000).toFixed(0)}K</p>
                      <p className="text-sm text-green-400">{method.successRate}% worked well</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Additional Information */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                What does this mean?
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
                <div>
                  <h4 className="font-medium text-white mb-2">📤 Transfers in Progress</h4>
                  <p>These are the money transfers that are arriving at their destination right now.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">⚡ System Speed</h4>
                  <p>How many operations our system can process each second. The higher, the faster.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">💰 Current Costs</h4>
                  <p>How much it costs to process each transfer. The lower, the better for you.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">🛡️ Service Status</h4>
                  <p>How well everything is working. 100% means everything is perfect.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
