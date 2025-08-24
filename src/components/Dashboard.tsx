'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Activity,
  RefreshCw,
  ExternalLink,
  Zap,
  Users,
  BarChart3,
  Search,
  Globe,
  Award,
  Target,
  Star,
  ArrowRight,
  Plus,
  Minus,
  FileText,
  Download,
  Upload,
  Settings,
  Database,
  Network,
  Cpu,
  Layers,
  MessageCircle,
  Smartphone,
  CreditCard,
  MapPin,
  Calculator,
  PieChart,
  LineChart,
  BarChart,
  Filter,
  SortAsc,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Play,
  Pause,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  Wallet,
  Banknote,
  Coins,
  Bitcoin,
  Send,
  History,
  Calendar,
  Clock as ClockIcon,
  Timer,
  CheckSquare,
  Square,
  Trash2,
  Edit,
  Copy,
  Share,
  Link,
  QrCode,
  Smartphone as Phone,
  Mail,
  User,
  UserCheck,
  UserX,
  Shield as ShieldIcon,
  Lock as LockIcon,
  Key as KeyIcon,
  Database as DatabaseIcon,
  Server,
  Cloud,
  Wifi,
  WifiOff,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Battery,
  BatteryCharging,
  Power,
  PowerOff,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Settings as SettingsIcon,
  HelpCircle,
  Info,
  AlertTriangle,
  XCircle,
  X,
  QrCode as QrCodeIcon,
  Download as DownloadIcon2,
  Upload as UploadIcon2
} from 'lucide-react';
import { useAccount } from 'wagmi';
import { useRemittancePool, useComplianceModule, useIncentiveVault, useRemittanceToken } from '@/lib/web3/useContracts';
import { useAdvancedQueries, useQueryUtils, useDashboardQueries } from '@/lib/web3/advancedQueries';
import { useBatchOperations, useBatchOperationUtils } from '@/lib/web3/batchOperations';
import { BlacklistStatusBanner } from './BlacklistStatusBanner';
import { KYCVerification } from './KYCVerification';
import { ReportsWidget } from './ReportsWidget';
import { PartnerIntegrationsDisplay } from './PartnerIntegrationsDisplay';
import { formatEther } from 'viem';
import { getExplorerUrl } from '@/lib/web3/contracts';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { corridors } from '@/lib/constants/corridors';

export function Dashboard() {
  const { address, isConnected } = useAccount();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showSendMoneyModal, setShowSendMoneyModal] = useState(false);
  const [showReceiveMoneyModal, setShowReceiveMoneyModal] = useState(false);
  const [selectedCorridor, setSelectedCorridor] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'advanced' | 'batch' | 'analytics' | 'savings' | 'whatsapp' | 'partners'>('overview');
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [savingsGoal, setSavingsGoal] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    initialDeposit: ''
  });
  const router = useRouter();

  // States for Advanced Queries
  const [remittanceId, setRemittanceId] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [achievementId, setAchievementId] = useState('');
  const [txId, setTxId] = useState('');
  const [rateIndex, setRateIndex] = useState(0);
  const [rateCount, setRateCount] = useState(5);
  const [maxAge, setMaxAge] = useState(3600);

  // States for Batch Operations
  const [mintBatchData, setMintBatchData] = useState({
    recipients: [''],
    amounts: [''],
    reason: ''
  });
  const [rateBatchData, setRateBatchData] = useState({
    rates: [17.0],
    sources: ['']
  });
  const [csvData, setCsvData] = useState('');

     // Contract hooks
   const { 
     userBalance, 
     isLoadingBalance,
     calculatedFee
  } = useRemittancePool();
  
  const { userData, isLoadingUserData } = useComplianceModule();
  const { userStats, isLoadingUserStats } = useIncentiveVault();
  const { tokenBalance, isLoadingTokenBalance } = useRemittanceToken();

  // Advanced Queries hooks
  const dashboardData = useDashboardQueries();
  const { formatUSD, truncateAddress } = useQueryUtils();

  // Batch Operations hooks
  const { executeMintBatch, executeUpdateRateBatch } = useBatchOperations();
  const { validateMintBatchData, calculateMintBatchTotal } = useBatchOperationUtils();

  useEffect(() => {
    setMounted(true);
    setLastUpdated(new Date());
  }, []);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastUpdated(new Date());
      toast.success('Datos actualizados');
    } catch (error) {
      toast.error('Error al actualizar datos');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateSavingsGoal = async () => {
    if (!savingsGoal.name || !savingsGoal.targetAmount || !savingsGoal.deadline) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }
    
    setIsRefreshing(true);
    try {
      // Simular creación de meta
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('¡Meta de ahorro creada exitosamente!');
      setShowSavingsModal(false);
      resetSavingsGoal();
    } catch (error) {
      toast.error('Error al crear la meta de ahorro');
    } finally {
      setIsRefreshing(false);
    }
  };

  const resetSavingsGoal = () => {
    setSavingsGoal({
      name: '',
      targetAmount: '',
      deadline: '',
      initialDeposit: ''
    });
  };

     const getUserStatus = () => {
     if (!userData) {
      return { kycLevel: 2, isBlacklisted: false, dailyLimit: 25000, monthlyLimit: 100000 };
    }
    
    const userDataTyped = userData as any;
    const kycLevel = userDataTyped?.kycLevel || 0;
    const isBlacklisted = userDataTyped?.isBlacklisted || false;
    
    let dailyLimit = 500;
    let monthlyLimit = 2000;
     
     if (kycLevel >= 1) {
      dailyLimit = userDataTyped?.dailyLimit ? parseFloat(formatEther(userDataTyped.dailyLimit as bigint)) : 5000;
      monthlyLimit = userDataTyped?.monthlyLimit ? parseFloat(formatEther(userDataTyped.monthlyLimit as bigint)) : 25000;
     } else {
      dailyLimit = 25000;
      monthlyLimit = 100000;
    }
    
    return { kycLevel: kycLevel >= 1 ? kycLevel : 2, isBlacklisted, dailyLimit, monthlyLimit };
  };

  const { kycLevel, isBlacklisted, dailyLimit, monthlyLimit } = getUserStatus();

  const handleSendMoney = () => {
    if (!isConnected) {
      toast.error('Por favor conecta tu wallet primero');
      return;
    }
    setShowSendMoneyModal(true);
  };

  const closeSendMoneyModal = () => {
    setShowSendMoneyModal(false);
    setSelectedCorridor('');
    setSelectedDestination('');
    setSendAmount('');
    setDestinationAddress('');
  };

  const handleReceiveMoney = () => {
    if (!isConnected) {
      toast.error('Por favor conecta tu wallet primero');
      return;
    }
    setShowReceiveMoneyModal(true);
  };

  // Available corridors and countries (including reverse addresses)
  const corridors = {
    // Corredores originales
    'usa-mexico': ['🇲🇽 México'],
    'china-mexico': ['🇲🇽 México'],
    'usa-brazil': ['🇧🇷 Brasil'],
    'japan-mexico': ['🇲🇽 México'],
    'korea-latam': ['🇲🇽 México', '🇧🇷 Brasil', '🇨🇴 Colombia', '🇵🇪 Perú', '🇦🇷 Argentina', '🇨🇱 Chile'],
    'india-latam': ['🇲🇽 México', '🇧🇷 Brasil', '🇨🇴 Colombia', '🇵🇪 Perú', '🇦🇷 Argentina', '🇨🇱 Chile', '🇪🇨 Ecuador', '🇧🇴 Bolivia', '🇵🇾 Paraguay', '🇺🇾 Uruguay'],
    
    // Corredores inversos
    'mexico-usa': ['🇺🇸 Estados Unidos'],
    'mexico-china': ['🇨🇳 China'],
    'brazil-usa': ['🇺🇸 Estados Unidos'],
    'mexico-japan': ['🇯🇵 Japón'],
    'latam-korea': ['🇰🇷 Corea del Sur'],
    'latam-india': ['🇮🇳 India'],
    
    // Corredores adicionales de la imagen
    'brazil-mexico': ['🇲🇽 México'],
    'mexico-brazil': ['🇧🇷 Brasil'],
    'europe-latam': ['🇲🇽 México', '🇧🇷 Brasil', '🇨🇴 Colombia', '🇵🇪 Perú', '🇦🇷 Argentina', '🇨🇱 Chile', '🇪🇨 Ecuador', '🇧🇴 Bolivia', '🇵🇾 Paraguay', '🇺🇾 Uruguay'],
    'latam-europe': ['🇪🇺 Europa'],
    
    // Additional corridors between Latin American countries
    'mexico-colombia': ['🇨🇴 Colombia'],
    'colombia-mexico': ['🇲🇽 México'],
    'mexico-peru': ['🇵🇪 Perú'],
    'peru-mexico': ['🇲🇽 México'],
    'mexico-argentina': ['🇦🇷 Argentina'],
    'argentina-mexico': ['🇲🇽 México'],
    'mexico-chile': ['🇨🇱 Chile'],
    'chile-mexico': ['🇲🇽 México'],
    'brazil-colombia': ['🇨🇴 Colombia'],
    'colombia-brazil': ['🇧🇷 Brasil'],
    'brazil-peru': ['🇵🇪 Perú'],
    'peru-brazil': ['🇧🇷 Brasil'],
    'brazil-argentina': ['🇦🇷 Argentina'],
    'argentina-brazil': ['🇧🇷 Brasil'],
    'brazil-chile': ['🇨🇱 Chile'],
    'chile-brazil': ['🇧🇷 Brasil']
  };

  const getAvailableDestinations = () => {
    if (!selectedCorridor) return [];
    return corridors[selectedCorridor as keyof typeof corridors] || [];
  };

  const handleCorridorChange = (corridor: string) => {
    setSelectedCorridor(corridor);
    setSelectedDestination(''); // Reset destination when corridor changes
  };

  const calculateFee = () => {
    const amount = parseFloat(sendAmount) || 0;
    return amount * 0.005; // 0.5% fee
  };

  const calculateTotalToReceive = () => {
    const amount = parseFloat(sendAmount) || 0;
    const fee = calculateFee();
    return amount - fee;
  };

  // Información adicional de corredores
  const corridorInfo = {
    'usa-mexico': { volume: '$2.5B daily', time: '1 second', fee: '0.5%' },
    'mexico-usa': { volume: '$1.8B daily', time: '1 second', fee: '0.5%' },
    'china-mexico': { volume: '$4.5B annually', time: '1 second', fee: '0.5%' },
    'mexico-china': { volume: '$2.1B annually', time: '1 second', fee: '0.5%' },
    'usa-brazil': { volume: '$1.2B annually', time: '1 second', fee: '0.5%' },
    'brazil-usa': { volume: '$800M annually', time: '1 second', fee: '0.5%' },
    'japan-mexico': { volume: '$800M annually', time: '1 second', fee: '0.5%' },
    'mexico-japan': { volume: '$400M annually', time: '1 second', fee: '0.5%' },
    'korea-latam': { volume: '$600M annually', time: '1 second', fee: '0.5%' },
    'latam-korea': { volume: '$300M annually', time: '1 second', fee: '0.5%' },
    'india-latam': { volume: '$400M annually', time: '1 second', fee: '0.5%' },
    'latam-india': { volume: '$200M annually', time: '1 second', fee: '0.5%' },
    'brazil-mexico': { volume: '$10B annually', time: '1 second', fee: '0.5%' },
    'mexico-brazil': { volume: '$8B annually', time: '1 second', fee: '0.5%' },
    'europe-latam': { volume: '$2B annually', time: '1 second', fee: '0.5%' },
    'latam-europe': { volume: '$1.5B annually', time: '1 second', fee: '0.5%' }
  };

  const getCorridorInfo = (corridor: string) => {
    return corridorInfo[corridor as keyof typeof corridorInfo] || { volume: 'N/A', time: '1 second', fee: '0.5%' };
  };

  // Array de corredores para mostrar en Analytics
  const corridorsArray = [
    {
      id: 'usa-mexico',
      name: 'USA → Mexico',
      fromFlag: '🇺🇸',
      toFlag: '🇲🇽',
      volume: '$2.5B daily',
      fee: '0.5',
      settlementTime: '1s'
    },
    {
      id: 'china-mexico',
      name: 'China → Mexico',
      fromFlag: '🇨🇳',
      toFlag: '🇲🇽',
      volume: '$4.5B annually',
      fee: '0.5',
      settlementTime: '1s'
    },
    {
      id: 'brazil-mexico',
      name: 'Brazil → Mexico',
      fromFlag: '🇧🇷',
      toFlag: '🇲🇽',
      volume: '$10B annually',
      fee: '0.5',
      settlementTime: '1s'
    },
    {
      id: 'japan-mexico',
      name: 'Japan → Mexico',
      fromFlag: '🇯🇵',
      toFlag: '🇲🇽',
      volume: '$800M annually',
      fee: '0.5',
      settlementTime: '1s'
    },
    {
      id: 'korea-latam',
      name: 'Korea → LatAm',
      fromFlag: '🇰🇷',
      toFlag: '🌎',
      volume: '$600M annually',
      fee: '0.5',
      settlementTime: '1s'
    },
    {
      id: 'india-latam',
      name: 'India → LatAm',
      fromFlag: '🇮🇳',
      toFlag: '🌎',
      volume: '$400M annually',
      fee: '0.5',
      settlementTime: '1s'
    },
    {
      id: 'europe-latam',
      name: 'Europe → LatAm',
      fromFlag: '🇪🇺',
      toFlag: '🌎',
      volume: '$2B annually',
      fee: '0.5',
      settlementTime: '1s'
    },
    {
      id: 'usa-brazil',
      name: 'USA → Brazil',
      fromFlag: '🇺🇸',
      toFlag: '🇧🇷',
      volume: '$1.2B annually',
      fee: '0.5',
      settlementTime: '1s'
    }
  ];

  const handleAdvancedQueries = () => {
    router.push('/advanced-queries');
  };

  const handleBatchOperations = () => {
    router.push('/batch-operations');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-monad-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Cargando Dashboard...
           </h2>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-monad-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Conecta tu Wallet
          </h2>
          <p className="text-gray-300 mb-6">
            Necesitas conectar tu wallet para ver tu dashboard
          </p>
          <button className="bg-gradient-to-r from-monad-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
            Conectar Wallet
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Blacklist Status Banner */}
        <BlacklistStatusBanner className="mb-6" />
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Dashboard AztlanFi
              </h1>
              <p className="text-xl text-gray-300">
                Your control center for global remittances
              </p>
            </div>
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700 hover:bg-gray-700 transition-all duration-200 flex items-center gap-2"
              aria-label="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Last update: {lastUpdated ? lastUpdated.toLocaleTimeString() : '...'}
          </p>
        </motion.div>

        {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 bg-gray-800 rounded-xl p-2 border border-gray-700 mb-8"
        >
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3, color: 'from-blue-600 to-cyan-600' },
            { id: 'advanced', label: 'Advanced Queries', icon: Search, color: 'from-purple-600 to-pink-600' },
            { id: 'batch', label: 'Batch Operations', icon: Zap, color: 'from-orange-600 to-red-600' },
            { id: 'analytics', label: 'Real-time Analytics', icon: LineChart, color: 'from-green-600 to-emerald-600' },
            { id: 'savings', label: 'Savings Goals', icon: Target, color: 'from-indigo-600 to-purple-600' },
            { id: 'whatsapp', label: 'WhatsApp Bot', icon: MessageCircle, color: 'from-green-500 to-teal-600' },
            { id: 'partners', label: 'Partner Integrations', icon: Network, color: 'from-monad-600 to-purple-600' }
          ].map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === id
                  ? `bg-gradient-to-r ${color} text-white shadow-lg`
                  : 'text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-600'
              }`}
              tabIndex={0}
              aria-label={`Switch to ${label}`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </motion.div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Stats Grid - Simplificado y más accesible */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center hover:border-gray-600 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {isLoadingBalance ? '...' : `$${parseFloat(userBalance || "0").toFixed(2)}`}
                </div>
                <div className="text-sm font-semibold text-gray-300 mb-1">Your Money</div>
<div className="text-xs text-gray-400">Available to send</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center hover:border-gray-600 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {isBlacklisted ? 'Blocked' : 'Verified'}
                </div>
                <div className="text-sm font-semibold text-gray-300 mb-1">Your Account</div>
                <div className="text-xs text-gray-400">Verification status</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center hover:border-gray-600 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {isLoadingTokenBalance ? '...' : parseFloat(tokenBalance || "0").toFixed(0)}
                </div>
                <div className="text-sm font-semibold text-gray-300 mb-1">Points Earned</div>
                <div className="text-xs text-gray-400">For using the service</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center hover:border-gray-600 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {isLoadingUserStats ? '...' : (userStats as any)?.totalTransactions || 0}
                </div>
                <div className="text-sm font-semibold text-gray-300 mb-1">Transactions Made</div>
                <div className="text-xs text-gray-400">Total transactions</div>
              </motion.div>
            </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Limits & Compliance */}
          <div className="lg:col-span-2 space-y-6">
            {/* Limits Section - Simplificado */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">How Much Can You Send?</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">No restrictions</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Per day</span>
                      <span className="font-medium text-white">${dailyLimit.toFixed(0)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (parseFloat(userBalance || "0") / dailyLimit) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Per month</span>
                      <span className="font-medium text-white">${monthlyLimit.toFixed(0)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (parseFloat(userBalance || "0") / monthlyLimit) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                    <h3 className="font-semibold text-white mb-2">Your Account Status</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        {isBlacklisted ? (
                          <AlertCircle className="w-4 h-4 text-red-400" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                        <span className={isBlacklisted ? 'text-red-400' : 'text-green-400'}>
                          {isBlacklisted ? 'Account blocked' : 'Active account'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400">Verification completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tu Plan Actual - Simplificado */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Your Current Plan</h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  kycLevel >= 1 
                    ? 'bg-green-600 text-white' 
                    : 'bg-purple-600 text-white'
                }`}>
                  {kycLevel >= 1 ? 'Professional Plan' : 'Free Plan'}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
                    <div className="text-2xl font-bold text-white mb-1">
                      {kycLevel === 0 ? 'Free' : 'Professional'}
                    </div>
                    <div className="text-sm text-gray-300">Plan type</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
                    <div className="text-2xl font-bold text-white mb-1">
                      {kycLevel === 0 ? '$1,000' : '$10,000'}
                    </div>
                    <div className="text-sm text-gray-300">Por día</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
                    <div className="text-2xl font-bold text-white mb-1">
                      {kycLevel === 0 ? '$5,000' : '$50,000'}
                    </div>
                    <div className="text-sm text-gray-300">Por mes</div>
                  </div>
                </div>
                
                {kycLevel < 1 && (
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-500 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="w-5 h-5 text-white" />
                      <h3 className="font-semibold text-white">Free Plan Active</h3>
                    </div>
                    <p className="text-purple-100 text-sm mb-4">
                      Enjoy basic transfers at no cost. For more features, upgrade to a professional plan.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-purple-200 font-medium">Fee:</span>
                        <p className="text-white font-semibold">0.5%</p>
                      </div>
                      <div>
                        <span className="text-purple-200 font-medium">Support:</span>
                        <p className="text-white font-semibold">WhatsApp</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {kycLevel >= 1 && (
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 border border-green-500 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="w-5 h-5 text-white" />
                      <h3 className="font-semibold text-white">Professional Plan</h3>
                    </div>
                    <p className="text-green-100 text-sm mb-4">
                      Your account is verified. Enjoy higher limits and lower commissions.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-green-200 font-medium">Fee:</span>
                        <p className="text-white font-semibold">0.3%</p>
                      </div>
                      <div>
                        <span className="text-green-200 font-medium">Support:</span>
                        <p className="text-white font-semibold">24/7 Priority</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Tus Últimos Envíos - Simplificado */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Your Recent Transactions</h2>
              <div className="space-y-4">
                                  {[
                    { type: 'Sent to Mexico', amount: '$250', status: 'completed', time: '2 hours ago' },
                    { type: 'Received from USA', amount: '$180', status: 'pending', time: '4 hours ago' },
                    { type: 'Sent to Brazil', amount: '$320', status: 'completed', time: '6 hours ago' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'
                      }`}>
                        {activity.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <Clock className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{activity.type}</p>
                        <p className="text-sm text-gray-300">{activity.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">{activity.amount}</p>
                      <p className={`text-sm ${
                        activity.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {activity.status === 'completed' ? 'Llegó' : 'En camino'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Stats & Quick Actions */}
          <div className="space-y-6">
            {/* Resumen de tu Uso - Simplificado */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Usage Summary</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total sent</span>
                  <span className="font-semibold text-white">
                    {dashboardData.isLoadingTotalVolume ? '...' : `$${dashboardData.totalVolume}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Transactions made</span>
                  <span className="font-semibold text-white">
                    {dashboardData.isLoadingTotalTransactions ? '...' : dashboardData.totalTransactions}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Average fee</span>
                  <span className="font-semibold text-white">
                    {calculatedFee ? `${calculatedFee}%` : '...'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Acciones Principales - Simplificado */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">What do you want to do?</h2>
              <div className="space-y-3">
                <button 
                  onClick={handleSendMoney}
                  className={`w-full bg-gradient-to-r from-monad-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-transform ${
                    !isConnected ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!isConnected}
                  tabIndex={0}
                  aria-label="Send money"
                >
                  <Send className="w-4 h-4" />
                  Send Money
                  <ArrowRight className="w-4 h-4" />
                </button>
                     
                <button 
                  onClick={handleReceiveMoney}
                  className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-transform ${
                    !isConnected ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!isConnected}
                  tabIndex={0}
                  aria-label="Receive money"
                >
                  <QrCodeIcon className="w-4 h-4" />
                  Receive Money
                  <ArrowRight className="w-4 h-4" />
                </button>
                     
                <button 
                  onClick={() => router.push('/pricing')}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl font-semibold border border-gray-600 hover:bg-gray-600 flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                  tabIndex={0}
                  aria-label="View plans and pricing"
                >
                  <DollarSign className="w-4 h-4" />
                  View Plans
                  <ArrowRight className="w-4 h-4" />
                </button>
                     
                <a 
                  href="/contact"
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl font-semibold border border-gray-600 hover:bg-gray-600 flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                  tabIndex={0}
                  aria-label="Contact support"
                >
                  <MessageCircle className="w-4 h-4" />
                  Help
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* Reports Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
            >
              <ReportsWidget />
            </motion.div>

            {/* Service Status - Simplified */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Service Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">AztlanFi</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-medium">Funcionando</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Envíos</span>
                  <span className="text-green-400 font-medium">Disponibles</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Soporte</span>
                  <span className="text-green-400 font-medium">24/7 Activo</span>
                </div>
                <a
                  href="/contact"
                  className="flex items-center justify-center gap-2 text-monad-400 hover:text-monad-300 transition-colors"
                  tabIndex={0}
                  aria-label="Contactar soporte"
                >
                  <MessageCircle className="w-4 h-4" />
                  Necesitas ayuda?
                </a>
              </div>
            </motion.div>
          </div>
        </div>
          </motion.div>
        )}

        {/* Consultas Avanzadas Tab - Simplificado */}
        {activeTab === 'advanced' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Consultas Avanzadas Overview */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Search Information
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Find detailed information about your transfers, transactions and exchange rates
              </p>
            </div>

            {!isConnected && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 mb-6"
              >
                <p className="text-yellow-200 text-center">
                  Connect your wallet to access all features
                </p>
              </motion.div>
            )}

            {/* Data Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Total Sent</h3>
                <p className="text-3xl font-bold text-blue-400">
                  {dashboardData.isLoadingTotalVolume ? '...' : `$${dashboardData.totalVolume}`}
                </p>
              </div>
              
              <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Transactions Made</h3>
                <p className="text-3xl font-bold text-green-400">
                  {dashboardData.isLoadingTotalTransactions ? '...' : dashboardData.totalTransactions}
                </p>
              </div>
              
              <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Available Money</h3>
                <p className="text-3xl font-bold text-purple-400">
                  {dashboardData.isLoadingTotalLiquidity ? '...' : `$${dashboardData.totalLiquidity}`}
                </p>
              </div>
              
              <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Current Rate</h3>
                <p className="text-3xl font-bold text-orange-400">
                  {dashboardData.isLoading ? '...' : `$${dashboardData.currentRate.toFixed(2)}`}
                </p>
              </div>
            </motion.div>

            {/* Search Functions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid md:grid-cols-2 gap-8"
            >
              {/* Search Transfers */}
              <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-white mb-6">Search a Transfer</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Transfer Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your transfer number"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={remittanceId}
                      onChange={(e) => setRemittanceId(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      User Address
                    </label>
                    <input
                      type="text"
                      placeholder="Address to search"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={userAddress}
                      onChange={(e) => setUserAddress(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        if (remittanceId) {
                          toast.success('Searching for transfer...');
                          console.log('Consultando remesa:', remittanceId);
                        }
                      }}
                      className="bg-gradient-to-r from-monad-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!remittanceId}
                    >
                      Search Transfer
                    </button>
                    
                    <button
                      onClick={() => {
                        if (userAddress) {
                          toast.success('Searching for user...');
console.log('Querying user:', userAddress);
                        }
                      }}
                      className="bg-gray-700 text-white border-2 border-gray-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!userAddress}
                    >
                      Search User
                    </button>
                  </div>
                </div>
              </div>

              {/* Search Transactions */}
              <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-white mb-6">Search Transactions</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Transaction Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter transaction number"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={txId}
                      onChange={(e) => setTxId(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Reward ID
                    </label>
                    <input
                      type="text"
                      placeholder="Enter reward ID"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={achievementId}
                      onChange={(e) => setAchievementId(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        if (txId) {
                          toast.success('Searching for transaction...');
                          console.log('Consultando transacción:', txId);
                        }
                      }}
                      className="bg-gradient-to-r from-monad-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!txId}
                    >
                      Search TX
                    </button>
                    
                    <button
                      onClick={() => {
                        if (achievementId) {
                          toast.success('Searching for reward...');
                          console.log('Consultando logro:', achievementId);
                        }
                      }}
                      className="bg-gray-700 text-white border-2 border-gray-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!achievementId}
                    >
                      View Reward
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Rate Queries */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">Query Exchange Rates</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rate Number
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={rateIndex}
                    onChange={(e) => setRateIndex(parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount to Show
                  </label>
                  <input
                    type="number"
                    placeholder="5"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={rateCount}
                    onChange={(e) => setRateCount(parseInt(e.target.value) || 5)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Maximum Time (seconds)
                  </label>
                  <input
                    type="number"
                    placeholder="3600"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={maxAge}
                    onChange={(e) => setMaxAge(parseInt(e.target.value) || 3600)}
                  />
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    toast.success('Searching rate history...');
                    console.log('Consultando historial de tasas, índice:', rateIndex);
                  }}
                  className="bg-gradient-to-r from-monad-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
                >
                  Rate History
                </button>
                
                <button
                  onClick={() => {
                    toast.success('Searching recent rates...');
                    console.log('Consultando tasas recientes, cantidad:', rateCount);
                  }}
                  className="bg-gray-700 text-white border-2 border-gray-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-all"
                >
                  Recent Rates
                </button>
                
                <button
                  onClick={() => {
                    toast.success('Verifying rates...');
                    console.log('Verificando si la tasa está obsoleta, edad máxima:', maxAge);
                  }}
                  className="bg-gray-700 text-white border-2 border-gray-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-all"
                >
                  Verify Rates
                </button>
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">Search Results</h3>
              <div className="bg-gray-700 rounded-lg p-4 min-h-[200px] border border-gray-600">
                <p className="text-gray-300 text-center">
                  Your search results will appear here...
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Batch Operations Tab */}
        {activeTab === 'batch' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Operaciones en Lote Overview */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Multiple Transfers
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Send money to multiple people at once to save time and fees
              </p>
            </div>

            {!isConnected && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 mb-6"
              >
                <p className="text-yellow-200 text-center">
                  Connect your wallet to access all features
                </p>
              </motion.div>
            )}

            {/* Multiple Transfers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">Send to Multiple People</h3>
              
              <div className="space-y-4">
                {/* Recipients and Amounts */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Recipients (one per line)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="maria@email.com&#10;juan@email.com&#10;ana@email.com"
                      value={mintBatchData.recipients.join('\n')}
                      onChange={(e) => setMintBatchData(prev => ({
                        ...prev,
                        recipients: e.target.value.split('\n').filter(line => line.trim())
                      }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amounts (one per line)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="100&#10;200&#10;300"
                      value={mintBatchData.amounts.join('\n')}
                      onChange={(e) => setMintBatchData(prev => ({
                        ...prev,
                        amounts: e.target.value.split('\n').filter(line => line.trim())
                      }))}
                    />
                  </div>
                </div>

                <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">
                      Transfer Reason
                    </label>
                    <input
                      type="text"
                      placeholder="Payroll payment / Bonus / Gift"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={mintBatchData.reason}
                    onChange={(e) => setMintBatchData(prev => ({
                      ...prev,
                      reason: e.target.value
                    }))}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setMintBatchData(prev => ({
                        ...prev,
                        recipients: [...prev.recipients, ''],
                        amounts: [...prev.amounts, '']
                      }));
                      toast.success('Field added');
                    }}
                    className="bg-gray-700 text-white border-2 border-gray-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-all"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Person
                  </button>
                  
                  <button
                    onClick={() => {
                      toast.success('Sending money to multiple people...');
                      console.log('Ejecutando mint batch:', mintBatchData);
                    }}
                    className="bg-gradient-to-r from-monad-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!mintBatchData.recipients[0] || !mintBatchData.amounts[0]}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Send to All
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Actualización de Tasas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">Update Exchange Rates</h3>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Exchange Rates
                    </label>
                    <textarea
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="17.50&#10;17.75&#10;18.00"
                      value={rateBatchData.rates.join('\n')}
                      onChange={(e) => setRateBatchData(prev => ({
                        ...prev,
                        rates: e.target.value.split('\n').filter(line => line.trim()).map(Number)
                      }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Information Sources
                    </label>
                    <textarea
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="Banxico&#10;Banamex&#10;Banorte"
                      value={rateBatchData.sources.join('\n')}
                      onChange={(e) => setRateBatchData(prev => ({
                        ...prev,
                        sources: e.target.value.split('\n').filter(line => line.trim())
                      }))}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setRateBatchData(prev => ({
                        ...prev,
                        rates: [...prev.rates, 17.0],
                        sources: [...prev.sources, '']
                      }));
                      toast.success('Rate field added');
                    }}
                    className="bg-gray-700 text-white border-2 border-gray-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-all"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Rate
                  </button>
                  
                  <button
                    onClick={() => {
                      toast.success('Updating exchange rates...');
                      console.log('Ejecutando update rate batch:', rateBatchData);
                    }}
                    className="bg-gradient-to-r from-monad-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!rateBatchData.rates[0]}
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Update All
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Importar/Exportar Lista */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">Import/Export List</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    List Data
                  </label>
                  <textarea
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={6}
                                          placeholder="recipient,amount,reason&#10;maria@email.com,100,Payment&#10;juan@email.com,200,Bonus"
                    value={csvData}
                    onChange={(e) => setCsvData(e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      toast.success('Importing list...');
                      console.log('Importando CSV:', csvData);
                    }}
                    className="bg-gray-700 text-white border-2 border-gray-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-all"
                  >
                    <DownloadIcon className="w-4 h-4 mr-1" />
                    Import List
                  </button>
                  
                  <button
                    onClick={() => {
                      toast.success('Exporting list...');
                      console.log('Exportando CSV');
                    }}
                    className="bg-gray-700 text-white border-2 border-gray-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-all"
                  >
                    <UploadIcon className="w-4 h-4 mr-1" />
                    Export List
                  </button>
                  
                  <button
                    onClick={() => {
                      toast.success('Processing list...');
                      console.log('Procesando CSV:', csvData);
                    }}
                    className="bg-gradient-to-r from-monad-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!csvData.trim()}
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Process List
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Operations Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">Status of Your Operations</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-900 border border-green-700 rounded-lg p-4">
                  <h4 className="font-semibold text-green-200 mb-2">Multiple Transfers</h4>
                  <p className="text-green-300">Status: Ready</p>
                                      <p className="text-green-300">People: {mintBatchData.recipients.filter(r => r.trim()).length}</p>
                  <p className="text-green-300">Total: ${mintBatchData.amounts.reduce((sum, amount) => sum + (parseFloat(amount) || 0), 0).toFixed(2)}</p>
                </div>
                
                <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-200 mb-2">Rate Update</h4>
                  <p className="text-blue-300">Status: Ready</p>
                                      <p className="text-blue-300">Rates: {rateBatchData.rates.filter(r => r > 0).length}</p>
                                      <p className="text-blue-300">Average: {(rateBatchData.rates.reduce((sum, rate) => sum + rate, 0) / rateBatchData.rates.length).toFixed(2)}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Real-time Analytics Tab - Simplified */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Analytics Overview */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Live Statistics
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                See in real-time how much money is being sent and how our service works
              </p>
            </div>

            {/* Real-time Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Live Transactions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Live Transfers</h3>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Last hour:</span>
                    <span className="font-semibold text-white">1,247 transfers</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Money sent today:</span>
                    <span className="font-semibold text-white">$89,432</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Average time:</span>
                    <span className="font-semibold text-green-400">Less than 1 minute</span>
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="mt-6 h-16 flex items-end justify-between gap-1">
                  {[45, 52, 38, 67, 89, 76, 54, 43, 65, 78, 92, 85].map((value, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-gradient-to-t from-monad-600 to-monad-400 rounded-t"
                      style={{ height: `${(value / 100) * 100}%` }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Service Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Service Status</h3>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">AztlanFi:</span>
                    <span className="font-semibold text-green-400">Working</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Transfers:</span>
                    <span className="font-semibold text-green-400">Available</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Support:</span>
                    <span className="font-semibold text-green-400">24/7 Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Security:</span>
                    <span className="font-semibold text-green-400">Protected</span>
                  </div>
                </div>

                {/* Service Health */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">General status</span>
                    <span className="text-green-400 font-semibold">Excellent</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '98%' }} />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Popular Routes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">Most Popular Routes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {corridorsArray.slice(0, 8).map((corridor, index) => (
                  <div key={corridor.id} className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{corridor.fromFlag}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="text-2xl">{corridor.toFlag}</span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-white mb-1">{corridor.name}</h4>
                    <div className="text-sm text-gray-300 space-y-1">
                      <div className="flex justify-between">
                        <span>Money sent:</span>
                        <span className="font-medium text-white">{corridor.volume}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fee:</span>
                        <span className="font-medium text-green-400">{corridor.fee}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Arrives in:</span>
                        <span className="font-medium text-white">{corridor.settlementTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Global Impact Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 text-white"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  Our Impact
                </h2>
                <p className="text-green-100 text-lg">
                  Helping families connect through money
                </p>
              </div>

              <div className="grid md:grid-cols-5 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">50K+</div>
                  <div className="text-green-100">Families helped</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">$35</div>
                  <div className="text-green-100">Average savings</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">20+</div>
                  <div className="text-green-100">Connected countries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">32</div>
                  <div className="text-green-100">Available routes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <div className="text-green-100">Support available</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Metas de Ahorro Tab - Simplificado */}
        {activeTab === 'savings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Metas de Ahorro Overview */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Save for Your Dreams
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Create savings goals, save money automatically and reach your financial goals
              </p>
            </div>

            {/* Savings Features */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <Target className="w-12 h-12 text-indigo-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  Custom Goals
                </h3>
                <p className="text-gray-300">
                  Define what you want to buy and when, we help you save
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <Lock className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  Safe Money
                </h3>
                <p className="text-gray-300">
                  Your money is saved securely until you reach your goal
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <RefreshCw className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  Automatic Savings
                </h3>
                <p className="text-gray-300">
                  Save money without thinking, automatically every week or month
                </p>
              </motion.div>
            </div>

            {/* Goal Examples */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🏖️ Family Vacation</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Goal:</span>
                    <span className="font-semibold text-white">$2,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Saved:</span>
                    <span className="font-semibold text-green-400">$1,250</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '62.5%' }} />
                  </div>
                  <div className="text-sm text-gray-400">You already have 62% of your goal!</div>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🛡️ Emergency Fund</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Goal:</span>
                    <span className="font-semibold text-white">$5,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Saved:</span>
                    <span className="font-semibold text-green-400">$3,200</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '64%' }} />
                  </div>
                  <div className="text-sm text-gray-400">You already have 64% of your goal!</div>
                </div>
              </div>
            </motion.div>

            {/* Savings Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  Why Save with AztlanFi?
                </h2>
                <p className="text-blue-100 text-lg">
                  We make saving easy and secure
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">0%</div>
                  <div className="text-blue-100">Fee for saving</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">Secure</div>
                  <div className="text-blue-100">Your money is protected</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">Automatic</div>
                  <div className="text-blue-100">Save effortlessly</div>
                </div>
              </div>
            </motion.div>

            {/* Acceso Rápido */}
            <div className="text-center">
              <button
                onClick={() => setShowSavingsModal(true)}
                className="bg-gradient-to-r from-monad-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold text-lg flex items-center justify-center mx-auto hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                tabIndex={0}
                aria-label="Create new savings goal"
              >
                <Target className="w-5 h-5 mr-2" />
                Create My First Goal
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </motion.div>
        )}

        {/* WhatsApp Bot Tab */}
        {activeTab === 'whatsapp' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* WhatsApp Overview */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                WhatsApp Bot
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Send money, check balances and receive instant notifications via WhatsApp
              </p>
            </div>

            {/* WhatsApp Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <MessageCircle className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  Instant Transfers
                </h3>
                <p className="text-gray-300">
                  Send money anywhere in the world with simple commands
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <Bell className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  Real-time Notifications
                </h3>
                <p className="text-gray-300">
                  Receive instant updates on the status of your transactions
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <QrCode className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  QR Codes
                </h3>
                <p className="text-gray-300">
                  Generate QR codes to receive payments quickly and securely
                </p>
              </motion.div>
            </div>

            {/* WhatsApp Commands */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">Available Commands</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
                    <span className="font-mono text-sm bg-gray-600 px-2 py-1 rounded text-white">/send</span>
                    <span className="text-sm text-gray-300">Send money</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
                    <span className="font-mono text-sm bg-gray-600 px-2 py-1 rounded text-white">/balance</span>
                    <span className="text-sm text-gray-300">Check balance</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
                    <span className="font-mono text-sm bg-gray-600 px-2 py-1 rounded text-white">/rates</span>
                    <span className="text-sm text-gray-300">View exchange rates</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
                    <span className="font-mono text-sm bg-gray-600 px-2 py-1 rounded text-white">/history</span>
                    <span className="text-sm text-gray-300">Transaction history</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
                    <span className="font-mono text-sm bg-gray-600 px-2 py-1 rounded text-white">/receive</span>
                    <span className="text-sm text-gray-300">Generate QR to receive</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
                    <span className="font-mono text-sm bg-gray-600 px-2 py-1 rounded text-white">/help</span>
                    <span className="text-sm text-gray-300">Help and support</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* WhatsApp CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-8 text-white text-center"
            >
              <h3 className="text-2xl font-bold mb-4">
                Start using WhatsApp!
              </h3>
              <p className="text-green-100 mb-6">
                Send a message to +1 (555) 123-4567 or scan the QR code
              </p>
              <div className="flex justify-center gap-4">
                <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                  <MessageCircle className="w-5 h-5 inline mr-2" />
                  Open WhatsApp
                </button>
                <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                  <QrCode className="w-5 h-5 inline mr-2" />
                  View QR Code
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Partner Integrations Tab */}
        {activeTab === 'partners' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <PartnerIntegrationsDisplay />
          </motion.div>
        )}

        {/* Send Money Modal */}
        {showSendMoneyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Send Money</h3>
                <button
                  onClick={closeSendMoneyModal}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount to Send (USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="number"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-monad-500 focus:border-transparent"
                      placeholder="500"
                      min="10"
                      max="10000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Remittance Corridor
                  </label>
                  <select 
                    value={selectedCorridor}
                    onChange={(e) => handleCorridorChange(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-monad-500 focus:border-transparent"
                  >
                    <option value="">Select corridor...</option>
                    
                    {/* Main corridors */}
                    <optgroup label="🌍 Main Corridors">
                      <option value="usa-mexico">🇺🇸 → 🇲🇽 USA-Mexico</option>
                      <option value="mexico-usa">🇲🇽 → 🇺🇸 Mexico-USA</option>
                      <option value="china-mexico">🇨🇳 → 🇲🇽 China-Mexico</option>
                      <option value="mexico-china">🇲🇽 → 🇨🇳 Mexico-China</option>
                      <option value="usa-brazil">🇺🇸 → 🇧🇷 USA-Brazil</option>
                      <option value="brazil-usa">🇧🇷 → 🇺🇸 Brazil-USA</option>
                      <option value="japan-mexico">🇯🇵 → 🇲🇽 Japan-Mexico</option>
                      <option value="mexico-japan">🇲🇽 → 🇯🇵 Mexico-Japan</option>
                    </optgroup>
                    
                    {/* Regional corridors */}
                    <optgroup label="🌎 Regional Corridors">
                      <option value="korea-latam">🇰🇷 → 🌎 Korea-LatAm</option>
                      <option value="latam-korea">🌎 → 🇰🇷 LatAm-Korea</option>
                      <option value="india-latam">🇮🇳 → 🌎 India-LatAm</option>
                      <option value="latam-india">🌎 → 🇮🇳 LatAm-India</option>
                      <option value="europe-latam">🇪🇺 → 🌎 Europe-LatAm</option>
                      <option value="latam-europe">🌎 → 🇪🇺 LatAm-Europe</option>
                    </optgroup>
                    
                    {/* Corredores Brasil-Mexico */}
                    <optgroup label="🇧🇷🇲🇽 Brasil-Mexico">
                      <option value="brazil-mexico">🇧🇷 → 🇲🇽 Brazil-Mexico</option>
                      <option value="mexico-brazil">🇲🇽 → 🇧🇷 Mexico-Brazil</option>
                    </optgroup>
                    
                    {/* Corridors between Latin American countries */}
                    <optgroup label="🌎 LatAm Interno">
                      <option value="mexico-colombia">🇲🇽 → 🇨🇴 Mexico-Colombia</option>
                      <option value="colombia-mexico">🇨🇴 → 🇲🇽 Colombia-Mexico</option>
                      <option value="mexico-peru">🇲🇽 → 🇵🇪 Mexico-Peru</option>
                      <option value="peru-mexico">🇵🇪 → 🇲🇽 Peru-Mexico</option>
                      <option value="mexico-argentina">🇲🇽 → 🇦🇷 Mexico-Argentina</option>
                      <option value="argentina-mexico">🇦🇷 → 🇲🇽 Argentina-Mexico</option>
                      <option value="mexico-chile">🇲🇽 → 🇨🇱 Mexico-Chile</option>
                      <option value="chile-mexico">🇨🇱 → 🇲🇽 Chile-Mexico</option>
                      <option value="brazil-colombia">🇧🇷 → 🇨🇴 Brazil-Colombia</option>
                      <option value="colombia-brazil">🇨🇴 → 🇧🇷 Colombia-Brazil</option>
                      <option value="brazil-peru">🇧🇷 → 🇵🇪 Brazil-Peru</option>
                      <option value="peru-brazil">🇵🇪 → 🇧🇷 Peru-Brazil</option>
                      <option value="brazil-argentina">🇧🇷 → 🇦🇷 Brazil-Argentina</option>
                      <option value="argentina-brazil">🇦🇷 → 🇧🇷 Argentina-Brazil</option>
                      <option value="brazil-chile">🇧🇷 → 🇨🇱 Brazil-Chile</option>
                      <option value="chile-brazil">🇨🇱 → 🇧🇷 Chile-Brazil</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Destination Country
                  </label>
                  <select 
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    disabled={!selectedCorridor}
                    className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-monad-500 focus:border-transparent ${
                      !selectedCorridor ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">
                      {selectedCorridor ? 'Select destination country...' : 'First select a corridor'}
                    </option>
                    {getAvailableDestinations().map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Dirección de Destino
                  </label>
                  <input
                    type="text"
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-monad-500 focus:border-transparent"
                    placeholder="Dirección o número de teléfono"
                  />
                </div>

                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  {selectedCorridor && (
                    <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-600">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Volumen del corredor:</span>
                        <span className="text-yellow-400 font-semibold">{getCorridorInfo(selectedCorridor).volume}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Delivery time:</span>
                        <span className="text-blue-400 font-semibold">{getCorridorInfo(selectedCorridor).time}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">AztlanFi Fee:</span>
                    <span className="text-green-400 font-semibold">{getCorridorInfo(selectedCorridor).fee}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Calculated fee:</span>
                    <span className="text-green-400 font-semibold">${calculateFee().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total a recibir:</span>
                    <span className="text-white font-bold">${calculateTotalToReceive().toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={closeSendMoneyModal}
                    className="flex-1 px-4 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    disabled={!selectedCorridor || !selectedDestination || !sendAmount || !destinationAddress}
                    className={`flex-1 px-4 py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
                      selectedCorridor && selectedDestination && sendAmount && destinationAddress
                        ? 'bg-gradient-to-r from-monad-600 to-purple-600 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    Send Money
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Receive Money Modal */}
        {showReceiveMoneyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Receive Money</h3>
                <button
                  onClick={() => setShowReceiveMoneyModal(false)}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                  aria-label="Cerrar modal"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-48 h-48 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <QrCodeIcon className="w-32 h-32 text-gray-800" />
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    Scan this QR code to receive money
                  </p>
                  <button className="text-monad-400 hover:text-monad-300 transition-colors flex items-center justify-center gap-2 mx-auto">
                    <DownloadIcon2 className="w-4 h-4" />
                    Descargar QR
                  </button>
                </div>

                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Tu dirección:</span>
                    <span className="text-white font-mono text-sm">0x1234...5678</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Moneda:</span>
                    <span className="text-green-400 font-semibold">USD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Status:</span>
                    <span className="text-green-400 font-semibold">Listo para recibir</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                    <Copy className="w-4 h-4" />
                    Copiar Dirección
                  </button>
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <Share className="w-4 h-4" />
                    Compartir QR
                  </button>
                </div>

                <button
                  onClick={() => setShowReceiveMoneyModal(false)}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Savings Goal Modal - Simplificado */}
        {showSavingsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-monad-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Crear Mi Meta de Ahorro</h3>
                <p className="text-gray-300 mt-2">¡Vamos a crear tu primera meta!</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    🎯 ¿Qué quieres comprar?
                  </label>
                  <input
                    type="text"
                    value={savingsGoal.name}
                    onChange={(e) => setSavingsGoal({ ...savingsGoal, name: e.target.value })}
                    placeholder="Ej: Un viaje a la playa"
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    💰 ¿Cuánto cuesta? (USD)
                  </label>
                  <input
                    type="number"
                    value={savingsGoal.targetAmount}
                    onChange={(e) => setSavingsGoal({ ...savingsGoal, targetAmount: e.target.value })}
                    placeholder="1000"
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    📅 ¿Para cuándo lo quieres?
                  </label>
                  <input
                    type="date"
                    value={savingsGoal.deadline}
                    onChange={(e) => setSavingsGoal({ ...savingsGoal, deadline: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent bg-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    💸 ¿Quieres empezar con algo ya? (opcional)
                  </label>
                  <input
                    type="number"
                    value={savingsGoal.initialDeposit}
                    onChange={(e) => setSavingsGoal({ ...savingsGoal, initialDeposit: e.target.value })}
                    placeholder="50"
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-monad-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                  />
                </div>

                {/* Beneficios */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-4 text-white">
                  <h4 className="font-semibold mb-2">✨ Beneficios incluidos:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Your money is safe</li>
                    <li>• No fees for saving</li>
                    <li>• You can add money whenever you want</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowSavingsModal(false);
                      resetSavingsGoal();
                    }}
                    className="flex-1 px-4 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateSavingsGoal}
                    disabled={isRefreshing}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-monad-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isRefreshing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creando...
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4" />
                        ¡Crear Mi Meta!
                      </>
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSavingsModal(false);
                  resetSavingsGoal();
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
                aria-label="Cerrar modal"
              >
                <X size={24} />
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
