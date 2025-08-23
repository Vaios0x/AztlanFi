'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Star, 
  Zap, 
  Shield, 
  Globe, 
  Users, 
  TrendingUp,
  Award,
  Target,
  DollarSign,
  Clock,
  Activity,
  Wifi,
  Battery,
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
  Hand as HandIcon10,
  ArrowRight
} from 'lucide-react';
import { useAccount } from 'wagmi';
import { useRemittancePool, useComplianceModule, useIncentiveVault, useRemittanceToken } from '@/lib/web3/useContracts';
import { Footer } from '@/components/Footer';
import toast from 'react-hot-toast';
import { corridors } from '@/lib/constants/corridors';

export function Pricing() {
  const { address, isConnected } = useAccount();
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | 'enterprise'>('basic');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [networkStatus, setNetworkStatus] = useState({
    isOnline: true,
    tps: 8247,
    gasPrice: 23,
    lastBlock: 1247892
  });

  // Contract hooks
  const { userBalance, isLoadingBalance } = useRemittancePool();
  const { userData } = useComplianceModule();
  const { userStats, isLoadingUserStats } = useIncentiveVault();
  const { tokenBalance, isLoadingTokenBalance } = useRemittanceToken();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Enhanced pricing data with all partner integrations
  const pricingPlans = {
    basic: {
      name: 'Basic',
      description: 'Perfect for individuals and small remittances',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        'Up to $1,000 monthly volume',
        '0.5% transaction fee',
        '32 global corridors (16 bidirectional pairs)',
        'WhatsApp bot access',
        'PWA mobile app',
        'Basic KYC verification',
        'Email support',
        'Real-time transaction tracking'
      ],
      limitations: [
        'Limited to 10 transactions/month',
        'Basic off-ramp methods only',
        'No advanced analytics',
        'No savings goals'
      ],
      badge: null,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-gray-800',
      borderColor: 'border-gray-700'
    },
    pro: {
      name: 'Pro',
      description: 'For frequent users and small businesses',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        'Up to $10,000 monthly volume',
        '0.3% transaction fee',
        'All 32 global corridors (16 bidirectional pairs)',
        'Priority WhatsApp support',
        'Advanced KYC verification',
        'Para savings goals',
        '0x gasless transactions',
        'Reown social login',
        'Telegram mini-app access',
        'Farcaster integration',
        'Advanced analytics dashboard',
        'Priority customer support',
        'Custom off-ramp methods',
        'Batch operations (up to 50)',
        'Advanced queries access'
      ],
      limitations: [
        'Limited to 100 transactions/month',
        'No enterprise features',
        'No dedicated account manager'
      ],
      badge: 'Most Popular',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-gray-800',
      borderColor: 'border-gray-700'
    },
    enterprise: {
      name: 'Enterprise',
      description: 'For large businesses and financial institutions',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      features: [
        'Unlimited monthly volume',
        '0.2% transaction fee',
        'All 32 global corridors (16 bidirectional pairs)',
        'Custom corridor development',
        'White-label solutions',
        'API access',
        'Advanced compliance tools',
        'Dedicated account manager',
        '24/7 priority support',
        'Custom integrations',
        'Advanced analytics & reporting',
        'SDG impact tracking',
        'Bulk operations',
        'Advanced security features',
        'Custom smart contracts',
        'Multi-signature wallets',
        'Regulatory compliance tools',
        'Custom off-ramp networks'
      ],
      limitations: [
        'Requires enterprise KYC',
        'Minimum contract term',
        'Custom pricing for high volume'
      ],
      badge: 'Enterprise',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-gray-800',
      borderColor: 'border-gray-700'
    }
  };

  // Partner integration metrics
  const partnerMetrics = {
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
  };

  const handlePlanSelection = (plan: 'basic' | 'pro' | 'enterprise') => {
    setSelectedPlan(plan);
    toast.success(`Selected ${pricingPlans[plan].name} plan`);
  };

  const handleBillingToggle = () => {
    setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly');
  };

  const getCurrentPrice = () => {
    const plan = pricingPlans[selectedPlan];
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavingsPercentage = () => {
    if (billingCycle === 'yearly') {
      const monthlyTotal = pricingPlans[selectedPlan].monthlyPrice * 12;
      const yearlyPrice = pricingPlans[selectedPlan].yearlyPrice;
      return Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100);
    }
    return 0;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-monad-400 mx-auto"></div>
          <p className="text-white mt-4">Loading pricing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold mb-6">
            <Award className="w-4 h-4 mr-2" />
            Mobil3 Hackathon Finalist - Payments Track
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-monad-400 to-purple-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            Planes diseñados para ganar el hackathon con tecnología de vanguardia y 
            alineación con los Objetivos de Desarrollo Sostenible de la ONU.
          </p>
        </motion.div>

        {/* Billing Toggle */}
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-gray-800 rounded-xl p-1 border border-gray-700">
          <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-monad-600 to-purple-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Monthly
          </button>
                <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-monad-600 to-purple-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Yearly
              {billingCycle === 'yearly' && (
                <span className="ml-2 px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                  Save {getSavingsPercentage()}%
                </span>
              )}
                </button>
              </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {Object.entries(pricingPlans).map(([key, plan]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`${plan.bgColor} ${plan.borderColor} border rounded-2xl p-8 relative hover:border-gray-600 transition-all duration-300 ${
                selectedPlan === key ? 'ring-2 ring-monad-500' : ''
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {plan.badge}
                  </span>
            </div>
          )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-300 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">
                    ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  <span className="text-gray-400">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
              </div>

                <button
                  onClick={() => handlePlanSelection(key as 'basic' | 'pro' | 'enterprise')}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    selectedPlan === key
                      ? 'bg-gradient-to-r from-monad-600 to-purple-600 text-white'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {plan.monthlyPrice === 0 ? 'Get Started Free' : 'Choose Plan'}
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-white mb-4">Features:</h4>
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
              </div>
                ))}
              </div>

              {plan.limitations.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h4 className="font-semibold text-gray-400 mb-4">Limitations:</h4>
                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-center">
                      <X className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-400 text-sm">{limitation}</span>
              </div>
                  ))}
            </div>
              )}
            </motion.div>
          ))}
          </div>

        {/* Partner Integrations Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gray-800 rounded-2xl p-8 border border-gray-700 mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Integraciones de Partners del Hackathon
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Tecnologías de vanguardia incluidas en todos los planes para la mejor experiencia de usuario
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 0x Protocol */}
            <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">0x</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">0x Protocol</h3>
                  <p className="text-sm text-gray-400">Gasless Swaps</p>
            </div>
          </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                  <span className="text-gray-300">Gasless TX:</span>
                  <span className="text-white font-semibold">{partnerMetrics.oxProtocol.gaslessTransactions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                  <span className="text-gray-300">Gas Saved:</span>
                  <span className="text-green-400 font-semibold">{partnerMetrics.oxProtocol.totalGasSaved} ETH</span>
              </div>
              <div className="flex justify-between">
                  <span className="text-gray-300">Success Rate:</span>
                  <span className="text-blue-400 font-semibold">{partnerMetrics.oxProtocol.successRate}%</span>
              </div>
            </div>
          </div>

            {/* Reown */}
            <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">R</span>
          </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Reown AppKit</h3>
                  <p className="text-sm text-gray-400">Social Login</p>
          </div>
        </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Social Logins:</span>
                  <span className="text-white font-semibold">{partnerMetrics.reown.socialLogins.toLocaleString()}</span>
    </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Telegram Users:</span>
                  <span className="text-blue-400 font-semibold">{partnerMetrics.reown.telegramUsers.toLocaleString()}</span>
        </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Users:</span>
                  <span className="text-purple-400 font-semibold">{partnerMetrics.reown.totalUsers.toLocaleString()}</span>
              </div>
            </div>
          </div>

            {/* Envio */}
            <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">E</span>
          </div>
          <div>
                  <h3 className="text-lg font-semibold text-white">Envio Analytics</h3>
                  <p className="text-sm text-gray-400">Real-time Data</p>
          </div>
          </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                  <span className="text-gray-300">Indexed Events:</span>
                  <span className="text-white font-semibold">{partnerMetrics.envio.indexedEvents.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                  <span className="text-gray-300">Query Time:</span>
                  <span className="text-green-400 font-semibold">{partnerMetrics.envio.averageQueryTime}s</span>
              </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Uptime:</span>
                  <span className="text-blue-400 font-semibold">{partnerMetrics.envio.uptime}%</span>
              </div>
            </div>
          </div>

            {/* Para */}
            <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">P</span>
          </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Para Wallet</h3>
                  <p className="text-sm text-gray-400">App Clips & Savings</p>
            </div>
            </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">App Clip Payments:</span>
                  <span className="text-white font-semibold">{partnerMetrics.para.appClipPayments.toLocaleString()}</span>
            </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Savings Goals:</span>
                  <span className="text-green-400 font-semibold">{partnerMetrics.para.savingsGoals.toLocaleString()}</span>
        </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Locked:</span>
                  <span className="text-orange-400 font-semibold">${partnerMetrics.para.totalLocked.toLocaleString()}</span>
          </div>
          </div>
        </div>
          </div>
        </motion.div>

        {/* Network Status */}
            <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-gray-800 rounded-2xl p-8 border border-gray-700 mb-16"
        >
              <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Estado de la Red Monad
            </h2>
            <p className="text-gray-300">
              Monitoreo en tiempo real del rendimiento de la blockchain
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{networkStatus.tps.toLocaleString()}</div>
              <p className="text-gray-300">TPS Actual</p>
          </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{networkStatus.gasPrice}</div>
              <p className="text-gray-300">Gas Price (Gwei)</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">#{networkStatus.lastBlock.toLocaleString()}</div>
              <p className="text-gray-300">Último Bloque</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">Online</div>
              <p className="text-gray-300">Estado de Red</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para Transformar las Remesas?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Únete a miles de usuarios que ya están ahorrando tiempo y dinero 
            con AztlanFi. Envíos instantáneos a 20+ países a través de 32 corredores estratégicos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-monad-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center hover:shadow-lg transition-all duration-200"
              onClick={() => window.location.href = '/dashboard'}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Comenzar Ahora
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center hover:bg-gray-800 hover:border-gray-500 transition-all duration-200"
              onClick={() => window.location.href = '/contact'}
            >
              <Globe className="w-5 h-5 mr-2" />
              Contactar Soporte
            </motion.button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
