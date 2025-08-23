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
  const [activeTab, setActiveTab] = useState<'overview' | 'advanced' | 'batch' | 'analytics' | 'savings' | 'whatsapp'>('overview');
  const router = useRouter();

  // Estados para Advanced Queries
  const [remittanceId, setRemittanceId] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [achievementId, setAchievementId] = useState('');
  const [txId, setTxId] = useState('');
  const [rateIndex, setRateIndex] = useState(0);
  const [rateCount, setRateCount] = useState(5);
  const [maxAge, setMaxAge] = useState(3600);

  // Estados para Batch Operations
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

  // Corredores y países disponibles (incluyendo direcciones inversas)
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
    
    // Corredores adicionales entre países latinoamericanos
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
                Tu centro de control para remesas globales
              </p>
            </div>
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-700 hover:bg-gray-700 transition-all duration-200 flex items-center gap-2"
              aria-label="Actualizar datos"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Última actualización: {lastUpdated ? lastUpdated.toLocaleTimeString() : '...'}
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
            { id: 'overview', label: 'Vista General', icon: BarChart3, color: 'from-blue-600 to-cyan-600' },
            { id: 'advanced', label: 'Consultas Avanzadas', icon: Search, color: 'from-purple-600 to-pink-600' },
            { id: 'batch', label: 'Operaciones en Lote', icon: Zap, color: 'from-orange-600 to-red-600' },
            { id: 'analytics', label: 'Analytics en Tiempo Real', icon: LineChart, color: 'from-green-600 to-emerald-600' },
            { id: 'savings', label: 'Metas de Ahorro', icon: Target, color: 'from-indigo-600 to-purple-600' },
            { id: 'whatsapp', label: 'WhatsApp Bot', icon: MessageCircle, color: 'from-green-500 to-teal-600' }
          ].map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === id
                  ? `bg-gradient-to-r ${color} text-white shadow-lg`
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
              tabIndex={0}
              aria-label={`Cambiar a ${label}`}
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
            {/* Stats Grid - Mejorado con diseño del home page */}
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
                <div className="text-sm font-semibold text-gray-300 mb-1">Saldo Disponible</div>
                <div className="text-xs text-gray-400">En USDC</div>
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
                  {isBlacklisted ? 'Bloqueado' : `Nivel ${kycLevel}`}
            </div>
                <div className="text-sm font-semibold text-gray-300 mb-1">Estado KYC</div>
                <div className="text-xs text-gray-400">Verificación</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center hover:border-gray-600 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {isLoadingTokenBalance ? '...' : parseFloat(tokenBalance || "0").toFixed(0)}
              </div>
                <div className="text-sm font-semibold text-gray-300 mb-1">Tokens RF</div>
                <div className="text-xs text-gray-400">Recompensas</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center hover:border-gray-600 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {isLoadingUserStats ? '...' : (userStats as any)?.totalTransactions || 0}
              </div>
                <div className="text-sm font-semibold text-gray-300 mb-1">Transacciones</div>
                <div className="text-xs text-gray-400">Total</div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Limits & Compliance */}
          <div className="lg:col-span-2 space-y-6">
            {/* Limits Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Límites de Transacción</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">Activo</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-300">Límite Diario</span>
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
                          <span className="text-gray-300">Límite Mensual</span>
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
                        <h3 className="font-semibold text-white mb-2">Estado de Cumplimiento</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        {isBlacklisted ? (
                              <AlertCircle className="w-4 h-4 text-red-400" />
                        ) : (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                            <span className={isBlacklisted ? 'text-red-400' : 'text-green-400'}>
                              {isBlacklisted ? 'Cuenta bloqueada' : 'Cuenta verificada'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-400">KYC Nivel {kycLevel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* KYC Status */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
              className="card"
            >
                             <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Estado KYC</h2>
                                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    kycLevel >= 1 
                        ? 'bg-green-600 text-white' 
                        : 'bg-purple-600 text-white'
                  }`}>
                      {kycLevel >= 1 ? 'Verificado' : 'Demo Plan Pro'}
                  </div>
               </div>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
                        <div className="text-2xl font-bold text-white mb-1">
                          {kycLevel === 0 ? 'Demo Plan Pro' : kycLevel === 1 ? 'Verificado' : 'Premium'}
                       </div>
                        <div className="text-sm text-gray-300">Nivel Actual</div>
                     </div>
                      <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
                        <div className="text-2xl font-bold text-white mb-1">
                         {kycLevel === 0 ? '$25,000' : kycLevel === 1 ? '$5,000' : '$25,000'}
                       </div>
                        <div className="text-sm text-gray-300">Límite Diario</div>
                     </div>
                      <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
                        <div className="text-2xl font-bold text-white mb-1">
                         {kycLevel === 0 ? '$100,000' : kycLevel === 1 ? '$25,000' : '$100,000'}
                       </div>
                        <div className="text-sm text-gray-300">Límite Mensual</div>
                     </div>
                </div>
                    
                                                    {kycLevel < 1 && (
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-500 rounded-lg p-4">
                       <div className="flex items-center gap-3 mb-3">
                          <CheckCircle className="w-5 h-5 text-white" />
                          <h3 className="font-semibold text-white">Demo Plan Pro Activo</h3>
                       </div>
                        <p className="text-purple-100 text-sm mb-4">
                          Para este demo del hackathon, el plan Pro está completamente habilitado. Disfruta todos los límites y características premium sin verificación KYC.
                       </p>
                       <div className="grid grid-cols-2 gap-4 text-sm">
                         <div>
                            <span className="text-purple-200 font-medium">Comisión:</span>
                            <p className="text-white font-semibold">0.2%</p>
                         </div>
                         <div>
                            <span className="text-purple-200 font-medium">Soporte:</span>
                            <p className="text-white font-semibold">24/7 Prioritario</p>
                         </div>
                       </div>
                     </div>
                   )}
                    
                                 {kycLevel >= 1 && (
                      <div className="bg-gradient-to-r from-green-600 to-emerald-600 border border-green-500 rounded-lg p-4">
                     <div className="flex items-center gap-3 mb-3">
                          <CheckCircle className="w-5 h-5 text-white" />
                          <h3 className="font-semibold text-white">Verificación Completada</h3>
                     </div>
                        <p className="text-green-100 text-sm mb-4">
                          Tu cuenta está verificada. Disfruta límites aumentados y características premium.
                     </p>
                     <div className="grid grid-cols-2 gap-4 text-sm">
                       <div>
                            <span className="text-green-200 font-medium">Comisión:</span>
                            <p className="text-white font-semibold">0.3%</p>
                       </div>
                       <div>
                            <span className="text-green-200 font-medium">Soporte:</span>
                            <p className="text-white font-semibold">24/7 Prioritario</p>
                       </div>
                     </div>
                   </div>
                 )}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
              className="card"
            >
                  <h2 className="text-xl font-bold text-white mb-6">Actividad Reciente</h2>
              <div className="space-y-4">
                                 {[
                      { type: 'Envío', amount: '$250', status: 'completed', time: '2 horas atrás' },
                      { type: 'Recepción', amount: '$180', status: 'pending', time: '4 horas atrás' },
                      { type: 'Envío', amount: '$320', status: 'completed', time: '6 horas atrás' },
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
                            {activity.status === 'completed' ? 'Completado' : 'Pendiente'}
                       </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Stats & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
              className="card"
            >
                                     <h2 className="text-xl font-bold text-white mb-6">Estadísticas Rápidas</h2>
              <div className="space-y-4">
                                                   <div className="flex items-center justify-between">
                       <span className="text-gray-300">Volumen Total</span>
                       <span className="font-semibold text-white">
                         {dashboardData.isLoadingTotalVolume ? '...' : `$${dashboardData.totalVolume}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                       <span className="text-gray-300">Transacciones Totales</span>
                       <span className="font-semibold text-white">
                         {dashboardData.isLoadingTotalTransactions ? '...' : dashboardData.totalTransactions}
                    </span>
                  </div>
                                 <div className="flex items-center justify-between">
                       <span className="text-gray-300">Comisión Promedio</span>
                       <span className="font-semibold text-white">
                     {calculatedFee ? `${calculatedFee}%` : '...'}
                   </span>
                 </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 }}
              className="card"
            >
                                     <h2 className="text-xl font-bold text-white mb-6">Acciones Rápidas</h2>
              <div className="space-y-3">
                <button 
                  onClick={handleSendMoney}
                       className={`w-full bg-gradient-to-r from-monad-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-transform ${
                    !isConnected ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!isConnected}
                       tabIndex={0}
                       aria-label="Enviar dinero"
                >
                  <DollarSign className="w-4 h-4" />
                       Enviar Dinero
                       <ArrowRight className="w-4 h-4" />
                </button>
                     
                <button 
                  onClick={handleReceiveMoney}
                       className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-transform ${
                    !isConnected ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!isConnected}
                       tabIndex={0}
                       aria-label="Recibir dinero"
                     >
                       <QrCodeIcon className="w-4 h-4" />
                       Recibir Dinero
                       <ArrowRight className="w-4 h-4" />
                </button>
                     
                     <button 
                       onClick={handleAdvancedQueries}
                       className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl font-semibold border border-gray-600 hover:bg-gray-600 flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                       tabIndex={0}
                       aria-label="Consultas avanzadas"
                >
                  <Search className="w-4 h-4" />
                       Consultas Avanzadas
                       <ArrowRight className="w-4 h-4" />
                     </button>
                     
                <button 
                       onClick={handleBatchOperations}
                       className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl font-semibold border border-gray-600 hover:bg-gray-600 flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                       tabIndex={0}
                       aria-label="Operaciones en lote"
                     >
                       <Zap className="w-4 h-4" />
                       Operaciones en Lote
                       <ArrowRight className="w-4 h-4" />
                </button>
                     
                     <a 
                       href="/reports"
                       className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl font-semibold border border-gray-600 hover:bg-gray-600 flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                       tabIndex={0}
                       aria-label="Ver reportes"
                >
                  <BarChart3 className="w-4 h-4" />
                       Ver Reportes
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

            {/* Network Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 }}
              className="card"
            >
                                     <h2 className="text-xl font-bold text-white mb-6">Estado de la Red</h2>
              <div className="space-y-4">
                                 <div className="flex items-center justify-between">
                       <span className="text-gray-300">Red Monad</span>
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                         <span className="text-green-400 font-medium">En Línea</span>
                   </div>
                 </div>
                 <div className="flex items-center justify-between">
                       <span className="text-gray-300">Último Bloque</span>
                       <span className="font-mono text-sm text-white">
                     {Math.floor(Math.random() * 1000000) + 1000000}
                   </span>
                 </div>
                <div className="flex items-center justify-between">
                       <span className="text-gray-300">Precio del Gas</span>
                       <span className="font-mono text-sm text-white">
                    {Math.floor(Math.random() * 50) + 10} Gwei
                  </span>
                </div>
                                 <a
                   href={`${getExplorerUrl(10143)}/address/${address}`}
                   target="_blank"
                   rel="noopener noreferrer"
                       className="flex items-center justify-center gap-2 text-monad-400 hover:text-monad-300 transition-colors"
                       tabIndex={0}
                       aria-label="Ver en explorador"
                 >
                   <ExternalLink className="w-4 h-4" />
                       Ver en Explorador
                 </a>
              </div>
            </motion.div>
          </div>
        </div>
          </motion.div>
        )}

        {/* Advanced Queries Tab */}
        {activeTab === 'advanced' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Advanced Queries Overview */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Consultas Avanzadas
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Accede a datos detallados del blockchain, consultas en tiempo real y análisis avanzados de transacciones
              </p>
      </div>

            {!isConnected && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
              >
                <p className="text-yellow-800 text-center">
                  Conecta tu wallet para acceder a todas las funciones
                </p>
              </motion.div>
            )}

            {/* Dashboard Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Volumen Total</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {dashboardData.isLoadingTotalVolume ? '...' : `$${dashboardData.totalVolume}`}
                </p>
    </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Transacciones</h3>
                <p className="text-3xl font-bold text-green-600">
                  {dashboardData.isLoadingTotalTransactions ? '...' : dashboardData.totalTransactions}
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Liquidez Total</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {dashboardData.isLoadingTotalLiquidity ? '...' : `$${dashboardData.totalLiquidity}`}
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tasa USD/MXN</h3>
                <p className="text-3xl font-bold text-orange-600">
                  {dashboardData.isLoading ? '...' : `$${dashboardData.currentRate.toFixed(2)}`}
                </p>
              </div>
            </motion.div>

            {/* Query Functions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid md:grid-cols-2 gap-8"
            >
              {/* Remittance Queries */}
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Consultas de Remesas</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID de Remesa
                    </label>
                    <input
                      type="text"
                      placeholder="Ingresa el ID de remesa"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={remittanceId}
                      onChange={(e) => setRemittanceId(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección de Usuario
                    </label>
                    <input
                      type="text"
                      placeholder="0x..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={userAddress}
                      onChange={(e) => setUserAddress(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        if (remittanceId) {
                          // Ejecutar consulta de remesa
                          console.log('Consultando remesa:', remittanceId);
                        }
                      }}
                      className="btn-primary text-sm"
                      disabled={!remittanceId}
                    >
                      Consultar Remesa
                    </button>
                    
                    <button
                      onClick={() => {
                        if (userAddress) {
                          // Ejecutar consulta de usuario
                          console.log('Consultando usuario:', userAddress);
                        }
                      }}
                      className="btn-secondary text-sm"
                      disabled={!userAddress}
                    >
                      Verificar Usuario
                    </button>
                  </div>
                </div>
              </div>

              {/* Transaction Queries */}
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Consultas de Transacciones</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hash de Transacción
                    </label>
                    <input
                      type="text"
                      placeholder="0x..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={txId}
                      onChange={(e) => setTxId(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID de Logro
                    </label>
                    <input
                      type="text"
                      placeholder="Ingresa el ID de logro"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={achievementId}
                      onChange={(e) => setAchievementId(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        if (txId) {
                          // Ejecutar consulta de transacción
                          console.log('Consultando transacción:', txId);
                        }
                      }}
                      className="btn-primary text-sm"
                      disabled={!txId}
                    >
                      Consultar TX
                    </button>
                    
                    <button
                      onClick={() => {
                        if (achievementId) {
                          // Ejecutar consulta de logro
                          console.log('Consultando logro:', achievementId);
                        }
                      }}
                      className="btn-secondary text-sm"
                      disabled={!achievementId}
                    >
                      Ver Logro
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
              className="card"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Consultas de Tasas de Cambio</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Índice de Tasa
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={rateIndex}
                    onChange={(e) => setRateIndex(parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad de Tasas
                  </label>
                  <input
                    type="number"
                    placeholder="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={rateCount}
                    onChange={(e) => setRateCount(parseInt(e.target.value) || 5)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Edad Máxima (segundos)
                  </label>
                  <input
                    type="number"
                    placeholder="3600"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={maxAge}
                    onChange={(e) => setMaxAge(parseInt(e.target.value) || 3600)}
                  />
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    // Consultar historial de tasas
                    console.log('Consultando historial de tasas, índice:', rateIndex);
                  }}
                  className="btn-primary text-sm"
                >
                  Historial de Tasas
                </button>
                
                <button
                  onClick={() => {
                    // Consultar tasas recientes
                    console.log('Consultando tasas recientes, cantidad:', rateCount);
                  }}
                  className="btn-secondary text-sm"
                >
                  Tasas Recientes
                </button>
                
                <button
                  onClick={() => {
                    // Verificar si la tasa está obsoleta
                    console.log('Verificando si la tasa está obsoleta, edad máxima:', maxAge);
                  }}
                  className="btn-accent text-sm"
                >
                  Verificar Obsolescencia
                </button>
              </div>
            </motion.div>

            {/* Results Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Resultados de Consultas</h3>
              <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
                <p className="text-gray-600 text-center">
                  Los resultados de las consultas aparecerán aquí...
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
            {/* Batch Operations Overview */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Operaciones en Lote
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Ejecuta múltiples operaciones simultáneamente para optimizar costos de gas y mejorar la eficiencia
              </p>
            </div>

            {!isConnected && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
              >
                <p className="text-yellow-800 text-center">
                  Conecta tu wallet para acceder a todas las funciones
                </p>
              </motion.div>
            )}

            {/* Batch Mint Operations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Operaciones de Mint en Lote</h3>
              
              <div className="space-y-4">
                {/* Recipients and Amounts */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destinatarios (uno por línea)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="0x1234...&#10;0x5678...&#10;0x9abc..."
                      value={mintBatchData.recipients.join('\n')}
                      onChange={(e) => setMintBatchData(prev => ({
                        ...prev,
                        recipients: e.target.value.split('\n').filter(line => line.trim())
                      }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Montos (uno por línea)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Razón del Mint
                  </label>
                  <input
                    type="text"
                    placeholder="Recompensa por actividad"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      // Agregar nuevo destinatario
                      setMintBatchData(prev => ({
                        ...prev,
                        recipients: [...prev.recipients, ''],
                        amounts: [...prev.amounts, '']
                      }));
                    }}
                    className="btn-secondary text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar Destinatario
                  </button>
                  
                  <button
                    onClick={() => {
                      // Ejecutar mint batch
                      console.log('Ejecutando mint batch:', mintBatchData);
                    }}
                    className="btn-primary text-sm"
                    disabled={!mintBatchData.recipients[0] || !mintBatchData.amounts[0]}
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Ejecutar Mint Batch
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Batch Rate Updates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Actualización de Tasas en Lote</h3>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tasas de Cambio
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fuentes de Datos
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      // Agregar nueva tasa
                      setRateBatchData(prev => ({
                        ...prev,
                        rates: [...prev.rates, 17.0],
                        sources: [...prev.sources, '']
                      }));
                    }}
                    className="btn-secondary text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar Tasa
                  </button>
                  
                  <button
                    onClick={() => {
                      // Ejecutar update rate batch
                      console.log('Ejecutando update rate batch:', rateBatchData);
                    }}
                    className="btn-primary text-sm"
                    disabled={!rateBatchData.rates[0]}
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Actualizar Tasas
                  </button>
                </div>
              </div>
            </motion.div>

            {/* CSV Import/Export */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Importación/Exportación CSV</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Datos CSV
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={6}
                    placeholder="recipient,amount,reason&#10;0x1234...,100,Recompensa&#10;0x5678...,200,Bonificación"
                    value={csvData}
                    onChange={(e) => setCsvData(e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      // Importar CSV
                      console.log('Importando CSV:', csvData);
                    }}
                    className="btn-secondary text-sm"
                  >
                    <DownloadIcon className="w-4 h-4 mr-1" />
                    Importar CSV
                  </button>
                  
                  <button
                    onClick={() => {
                      // Exportar CSV
                      console.log('Exportando CSV');
                    }}
                    className="btn-secondary text-sm"
                  >
                    <UploadIcon className="w-4 h-4 mr-1" />
                    Exportar CSV
                  </button>
                  
                  <button
                    onClick={() => {
                      // Procesar CSV
                      console.log('Procesando CSV:', csvData);
                    }}
                    className="btn-primary text-sm"
                    disabled={!csvData.trim()}
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Procesar CSV
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Batch Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Estado de Operaciones</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Mint Batch</h4>
                  <p className="text-green-700">Estado: Pendiente</p>
                  <p className="text-green-700">Destinatarios: {mintBatchData.recipients.filter(r => r.trim()).length}</p>
                  <p className="text-green-700">Total: ${mintBatchData.amounts.reduce((sum, amount) => sum + (parseFloat(amount) || 0), 0).toFixed(2)}</p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Rate Update Batch</h4>
                  <p className="text-blue-700">Estado: Pendiente</p>
                  <p className="text-blue-700">Tasas: {rateBatchData.rates.filter(r => r > 0).length}</p>
                  <p className="text-blue-700">Promedio: {(rateBatchData.rates.reduce((sum, rate) => sum + rate, 0) / rateBatchData.rates.length).toFixed(2)}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Analytics en Tiempo Real Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Analytics Overview */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Analytics en Tiempo Real
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Monitorea el flujo global de pagos, métricas de 32 corredores y análisis detallado con Envio
              </p>
            </div>

            {/* Real-time Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Live Transactions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card-gradient"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Transacciones en Tiempo Real</h3>
                  <div className="status-indicator status-online" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Última hora:</span>
                    <span className="font-semibold text-gray-900">1,247 tx</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Volumen 24h:</span>
                    <span className="font-semibold text-gray-900">$89,432</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tiempo promedio:</span>
                    <span className="font-semibold text-green-600">0.8s</span>
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

              {/* Network Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card-gradient"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Estado de la Red</h3>
                  <div className="status-indicator status-online" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monad Network:</span>
                    <span className="font-semibold text-green-600">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Último bloque:</span>
                    <span className="font-mono text-sm">#1,247,892</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Gas price:</span>
                    <span className="font-semibold text-gray-900">23 Gwei</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">TPS actual:</span>
                    <span className="font-semibold text-blue-600">8,247</span>
                  </div>
                </div>

                {/* Network Health */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Salud de la red</span>
                    <span className="text-green-600 font-semibold">Excelente</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '98%' }} />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Corridor Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Análisis por Corredor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {corridorsArray.map((corridor, index) => (
                  <div key={corridor.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{corridor.fromFlag}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="text-2xl">{corridor.toFlag}</span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{corridor.name}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Volumen:</span>
                        <span className="font-medium">{corridor.volume}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Comisión:</span>
                        <span className="font-medium text-green-600">{corridor.fee}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tiempo:</span>
                        <span className="font-medium">{corridor.settlementTime}</span>
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
                  Impacto Global
                </h2>
                <p className="text-green-100 text-lg">
                  Transformando vidas a través de la inclusión financiera
                </p>
              </div>

              <div className="grid md:grid-cols-5 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">50K+</div>
                  <div className="text-green-100">Familias beneficiadas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">$35</div>
                  <div className="text-green-100">Ahorro promedio por tx</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">20+</div>
                  <div className="text-green-100">Países conectados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">32</div>
                  <div className="text-green-100">Corredores activos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">4</div>
                  <div className="text-green-100">ODS alineados</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Savings Goals Tab */}
        {activeTab === 'savings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Savings Overview */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Metas de Ahorro
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Crea metas financieras, bloquea fondos y automatiza tus ahorros con stablecoins
              </p>
            </div>

            {/* Savings Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card hover-lift"
              >
                <Target className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Metas Personalizadas
                </h3>
                <p className="text-gray-600">
                  Define objetivos financieros específicos con fechas límite y montos objetivo
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card hover-lift"
              >
                <Lock className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Bloqueo Inteligente
                </h3>
                <p className="text-gray-600">
                  Bloquea fondos hasta alcanzar tu meta o la fecha límite
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card hover-lift"
              >
                <RefreshCw className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Ahorro Automático
                </h3>
                <p className="text-gray-600">
                  Configura depósitos recurrentes semanales, quincenales o mensuales
                </p>
              </motion.div>
            </div>

            {/* Sample Savings Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Meta: Vacaciones</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Objetivo:</span>
                    <span className="font-semibold">$2,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ahorrado:</span>
                    <span className="font-semibold text-green-600">$1,250</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '62.5%' }} />
                  </div>
                  <div className="text-sm text-gray-500">62.5% completado</div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Meta: Emergencias</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Objetivo:</span>
                    <span className="font-semibold">$5,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ahorrado:</span>
                    <span className="font-semibold text-green-600">$3,200</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '64%' }} />
                  </div>
                  <div className="text-sm text-gray-500">64% completado</div>
                </div>
              </div>
            </motion.div>

            {/* Quick Access */}
            <div className="text-center">
              <button
                onClick={() => router.push('/savings')}
                className="btn-primary text-lg flex items-center justify-center mx-auto"
                tabIndex={0}
                aria-label="Crear nueva meta de ahorro"
              >
                <Target className="w-5 h-5 mr-2" />
                Crear Nueva Meta
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                WhatsApp Bot
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Envía dinero, consulta saldos y recibe notificaciones instantáneas a través de WhatsApp
              </p>
            </div>

            {/* WhatsApp Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card hover-lift"
              >
                <MessageCircle className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Envíos Instantáneos
                </h3>
                <p className="text-gray-600">
                  Envía dinero a cualquier parte del mundo con comandos simples
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card hover-lift"
              >
                <Bell className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Notificaciones en Tiempo Real
                </h3>
                <p className="text-gray-600">
                  Recibe actualizaciones instantáneas sobre el estado de tus transacciones
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card hover-lift"
              >
                <QrCode className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Códigos QR
                </h3>
                <p className="text-gray-600">
                  Genera códigos QR para recibir pagos de forma rápida y segura
                </p>
              </motion.div>
            </div>

            {/* WhatsApp Commands */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Comandos Disponibles</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">/send</span>
                    <span className="text-sm text-gray-600">Enviar dinero</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">/balance</span>
                    <span className="text-sm text-gray-600">Consultar saldo</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">/rates</span>
                    <span className="text-sm text-gray-600">Ver tasas de cambio</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">/history</span>
                    <span className="text-sm text-gray-600">Historial de transacciones</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">/receive</span>
                    <span className="text-sm text-gray-600">Generar QR para recibir</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">/help</span>
                    <span className="text-sm text-gray-600">Ayuda y soporte</span>
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
                ¡Comienza a usar WhatsApp!
              </h3>
              <p className="text-green-100 mb-6">
                Envía un mensaje a +1 (555) 123-4567 o escanea el código QR
              </p>
              <div className="flex justify-center gap-4">
                <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                  <MessageCircle className="w-5 h-5 inline mr-2" />
                  Abrir WhatsApp
                </button>
                <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                  <QrCode className="w-5 h-5 inline mr-2" />
                  Ver QR Code
                </button>
              </div>
            </motion.div>
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
                <h3 className="text-2xl font-bold text-white">Enviar Dinero</h3>
                <button
                  onClick={closeSendMoneyModal}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                  aria-label="Cerrar modal"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cantidad a Enviar (USD)
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
                    Corredor de Remesas
                  </label>
                  <select 
                    value={selectedCorridor}
                    onChange={(e) => handleCorridorChange(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-monad-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar corredor...</option>
                    
                    {/* Corredores principales */}
                    <optgroup label="🌍 Corredores Principales">
                      <option value="usa-mexico">🇺🇸 → 🇲🇽 USA-Mexico</option>
                      <option value="mexico-usa">🇲🇽 → 🇺🇸 Mexico-USA</option>
                      <option value="china-mexico">🇨🇳 → 🇲🇽 China-Mexico</option>
                      <option value="mexico-china">🇲🇽 → 🇨🇳 Mexico-China</option>
                      <option value="usa-brazil">🇺🇸 → 🇧🇷 USA-Brazil</option>
                      <option value="brazil-usa">🇧🇷 → 🇺🇸 Brazil-USA</option>
                      <option value="japan-mexico">🇯🇵 → 🇲🇽 Japan-Mexico</option>
                      <option value="mexico-japan">🇲🇽 → 🇯🇵 Mexico-Japan</option>
                    </optgroup>
                    
                    {/* Corredores regionales */}
                    <optgroup label="🌎 Corredores Regionales">
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
                    
                    {/* Corredores entre países latinoamericanos */}
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
                    País de Destino
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
                      {selectedCorridor ? 'Seleccionar país de destino...' : 'Primero selecciona un corredor'}
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
                        <span className="text-gray-300">Tiempo de entrega:</span>
                        <span className="text-blue-400 font-semibold">{getCorridorInfo(selectedCorridor).time}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Comisión AztlanFi:</span>
                    <span className="text-green-400 font-semibold">{getCorridorInfo(selectedCorridor).fee}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Comisión calculada:</span>
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
                    Enviar Dinero
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
                <h3 className="text-2xl font-bold text-white">Recibir Dinero</h3>
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
                    Escanea este código QR para recibir dinero
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
                    <span className="text-gray-300">Estado:</span>
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
      </div>
    </div>
  );
}
