import { HyperIndex, HyperSync } from '@envio/hyperindex';

export interface TransactionEvent {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: string;
  corridor: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
  fee: string;
  offRampMethod: string;
}

export interface CorridorMetrics {
  corridor: string;
  totalVolume: number;
  transactionCount: number;
  averageFee: number;
  averageTime: number;
  successRate: number;
  volume24h: number;
  volumeChange: number;
}

export interface GlobalMetrics {
  totalVolume: number;
  totalTransactions: number;
  activeCorridors: number;
  avgSettlement: number;
  totalSaved: number;
  volume24h: number;
  volumeChange: number;
  corridorFlow: any[];
  recentTransactions: TransactionEvent[];
}

export class EnvioAnalytics {
  private indexer: HyperIndex;
  private apiKey: string;
  
  constructor() {
    this.apiKey = process.env.ENVIO_API_KEY || '';
    this.indexer = new HyperIndex({
      endpoint: 'https://indexer.envio.dev',
      apiKey: this.apiKey,
      network: 'monad-testnet',
      contracts: [
        {
          address: process.env.NEXT_PUBLIC_REMITTANCE_CONTRACT || '',
          abi: this.getRemittanceABI(),
          startBlock: 0
        },
        {
          address: process.env.NEXT_PUBLIC_ESCROW_CONTRACT || '',
          abi: this.getEscrowABI(),
          startBlock: 0
        }
      ]
    });
  }

  // Subscribe to real-time transaction events
  async subscribeToTransactions(callback: (event: TransactionEvent) => void) {
    return this.indexer.subscribe({
      events: [
        'RemittanceInitiated',
        'RemittanceCompleted',
        'LiquidityAdded',
        'FeeCollected',
        'CorridorActivated',
        'EscrowCreated',
        'EscrowReleased'
      ],
      callback: (event: any) => {
        const transactionEvent = this.parseTransactionEvent(event);
        callback(transactionEvent);
      }
    });
  }

  // Get corridor-specific metrics
  async getCorridorMetrics(corridor: string, timeframe: string = '24h'): Promise<CorridorMetrics> {
    const query = `
      query CorridorMetrics($corridor: String!, $timeframe: String!) {
        remittances(
          where: { corridor: $corridor, timestamp_gte: $timeframe }
        ) {
          totalVolume
          transactionCount
          averageFee
          averageTime
          successRate
          volume24h
          volumeChange
        }
      }
    `;

    const variables = { 
      corridor, 
      timeframe: this.getTimeframeTimestamp(timeframe) 
    };

    const result = await this.indexer.query({ query, variables });
    
    return {
      corridor,
      totalVolume: result.data?.remittances?.totalVolume || 0,
      transactionCount: result.data?.remittances?.transactionCount || 0,
      averageFee: result.data?.remittances?.averageFee || 0,
      averageTime: result.data?.remittances?.averageTime || 0,
      successRate: result.data?.remittances?.successRate || 0,
      volume24h: result.data?.remittances?.volume24h || 0,
      volumeChange: result.data?.remittances?.volumeChange || 0
    };
  }

  // Get global dashboard metrics
  async getDashboardMetrics(): Promise<GlobalMetrics> {
    const [volume, transactions, corridors, providers, recentTx] = await Promise.all([
      this.getTotalVolume24h(),
      this.getTransactionCount24h(),
      this.getActiveCorridors(),
      this.getLiquidityProviders(),
      this.getRecentTransactions()
    ]);

    const corridorFlow = await this.getCorridorFlowData();
    const totalSaved = await this.calculateTotalSavings();

    return {
      totalVolume: volume,
      totalTransactions: transactions,
      activeCorridors: corridors.length,
      avgSettlement: 1, // 1 second on Monad
      totalSaved,
      volume24h: volume,
      volumeChange: await this.getVolumeChange(),
      corridorFlow,
      recentTransactions: recentTx
    };
  }

  // Get total volume in last 24 hours
  async getTotalVolume24h(): Promise<number> {
    const query = `
      query TotalVolume24h {
        remittances(
          where: { timestamp_gte: "${this.getTimeframeTimestamp('24h')}" }
        ) {
          totalVolume
        }
      }
    `;

    const result = await this.indexer.query({ query });
    return result.data?.remittances?.totalVolume || 0;
  }

  // Get transaction count in last 24 hours
  async getTransactionCount24h(): Promise<number> {
    const query = `
      query TransactionCount24h {
        remittances(
          where: { timestamp_gte: "${this.getTimeframeTimestamp('24h')}" }
        ) {
          count
        }
      }
    `;

    const result = await this.indexer.query({ query });
    return result.data?.remittances?.count || 0;
  }

  // Get active corridors
  async getActiveCorridors(): Promise<string[]> {
    const query = `
      query ActiveCorridors {
        remittances(
          where: { timestamp_gte: "${this.getTimeframeTimestamp('7d')}" }
        ) {
          corridor
        }
      }
    `;

    const result = await this.indexer.query({ query });
    const corridors = result.data?.remittances?.map((tx: any) => tx.corridor) || [];
    return [...new Set(corridors)]; // Remove duplicates
  }

  // Get liquidity providers
  async getLiquidityProviders(): Promise<any[]> {
    const query = `
      query LiquidityProviders {
        liquidityProviders {
          address
          totalAmount
          totalRewards
          lastUpdate
        }
      }
    `;

    const result = await this.indexer.query({ query });
    return result.data?.liquidityProviders || [];
  }

  // Get recent transactions
  async getRecentTransactions(limit: number = 10): Promise<TransactionEvent[]> {
    const query = `
      query RecentTransactions($limit: Int!) {
        remittances(
          orderBy: timestamp
          orderDirection: desc
          first: $limit
        ) {
          id
          hash
          from
          to
          amount
          corridor
          timestamp
          status
          fee
          offRampMethod
        }
      }
    `;

    const result = await this.indexer.query({ query, variables: { limit } });
    return result.data?.remittances?.map((tx: any) => this.parseTransactionEvent(tx)) || [];
  }

  // Get corridor flow data for heat map
  async getCorridorFlowData(): Promise<any[]> {
    const query = `
      query CorridorFlow {
        remittances(
          where: { timestamp_gte: "${this.getTimeframeTimestamp('24h')}" }
        ) {
          corridor
          amount
          timestamp
        }
      }
    `;

    const result = await this.indexer.query({ query });
    const transactions = result.data?.remittances || [];

    // Group by corridor and calculate flow
    const flowMap = new Map();
    transactions.forEach((tx: any) => {
      if (!flowMap.has(tx.corridor)) {
        flowMap.set(tx.corridor, { volume: 0, count: 0 });
      }
      const corridor = flowMap.get(tx.corridor);
      corridor.volume += parseFloat(tx.amount);
      corridor.count += 1;
    });

    return Array.from(flowMap.entries()).map(([corridor, data]) => ({
      corridor,
      volume: data.volume,
      count: data.count
    }));
  }

  // Calculate total savings vs traditional remittances
  async calculateTotalSavings(): Promise<number> {
    const query = `
      query TotalFees {
        remittances {
          amount
          fee
        }
      }
    `;

    const result = await this.indexer.query({ query });
    const transactions = result.data?.remittances || [];

    let totalSavings = 0;
    transactions.forEach((tx: any) => {
      const amount = parseFloat(tx.amount);
      const aztlanfiFee = parseFloat(tx.fee);
      const traditionalFee = amount * 0.07; // 7% traditional fee
      const savings = traditionalFee - aztlanfiFee;
      totalSavings += savings;
    });

    return totalSavings;
  }

  // Get volume change percentage
  async getVolumeChange(): Promise<number> {
    const [current24h, previous24h] = await Promise.all([
      this.getTotalVolume24h(),
      this.getTotalVolume48h()
    ]);

    if (previous24h === 0) return 0;
    return ((current24h - previous24h) / previous24h) * 100;
  }

  // Get total volume in last 48 hours
  async getTotalVolume48h(): Promise<number> {
    const query = `
      query TotalVolume48h {
        remittances(
          where: { timestamp_gte: "${this.getTimeframeTimestamp('48h')}" }
        ) {
          totalVolume
        }
      }
    `;

    const result = await this.indexer.query({ query });
    return result.data?.remittances?.totalVolume || 0;
  }

  // Get user-specific metrics
  async getUserMetrics(userAddress: string): Promise<any> {
    const query = `
      query UserMetrics($userAddress: String!) {
        remittances(
          where: { from: $userAddress }
        ) {
          totalVolume
          transactionCount
          averageAmount
          lastTransaction
        }
      }
    `;

    const result = await this.indexer.query({ 
      query, 
      variables: { userAddress } 
    });

    return result.data?.remittances || {};
  }

  // Get fee comparison data
  async getFeeComparison(): Promise<any[]> {
    const query = `
      query FeeComparison {
        remittances(
          where: { timestamp_gte: "${this.getTimeframeTimestamp('30d')}" }
        ) {
          corridor
          amount
          fee
        }
      }
    `;

    const result = await this.indexer.query({ query });
    const transactions = result.data?.remittances || [];

    // Calculate average fees by corridor
    const feeMap = new Map();
    transactions.forEach((tx: any) => {
      if (!feeMap.has(tx.corridor)) {
        feeMap.set(tx.corridor, { totalFee: 0, count: 0, totalAmount: 0 });
      }
      const corridor = feeMap.get(tx.corridor);
      corridor.totalFee += parseFloat(tx.fee);
      corridor.totalAmount += parseFloat(tx.amount);
      corridor.count += 1;
    });

    return Array.from(feeMap.entries()).map(([corridor, data]) => ({
      corridor,
      aztlanfi: (data.totalFee / data.totalAmount) * 100,
      traditional: 7, // 7% traditional fee
      savings: 7 - ((data.totalFee / data.totalAmount) * 100)
    }));
  }

  // Parse transaction event from Envio
  private parseTransactionEvent(event: any): TransactionEvent {
    return {
      id: event.id || event.transactionHash,
      hash: event.transactionHash,
      from: event.from || event.sender,
      to: event.to || event.receiver,
      amount: event.amount,
      corridor: event.corridor || 'USA-MEX',
      timestamp: event.timestamp || Date.now(),
      status: event.status || 'completed',
      fee: event.fee || '0',
      offRampMethod: event.offRampMethod || 'direct'
    };
  }

  // Get timeframe timestamp
  private getTimeframeTimestamp(timeframe: string): string {
    const now = Date.now();
    const ms = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '48h': 48 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    return (now - (ms[timeframe as keyof typeof ms] || ms['24h'])).toString();
  }

  // Get Remittance contract ABI
  private getRemittanceABI(): any[] {
    return [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "id",
            "type": "bytes32"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "phoneHash",
            "type": "string"
          }
        ],
        "name": "RemittanceCreated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "id",
            "type": "bytes32"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "receiver",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "RemittanceCompleted",
        "type": "event"
      }
    ];
  }

  // Get Escrow contract ABI
  private getEscrowABI(): any[] {
    return [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "escrowId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "EscrowCreated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "escrowId",
            "type": "uint256"
          }
        ],
        "name": "EscrowReleased",
        "type": "event"
      }
    ];
  }
}

// Hook for React components
export function useEnvioAnalytics() {
  const analytics = new EnvioAnalytics();

  const subscribeToTransactions = (callback: (event: TransactionEvent) => void) => {
    return analytics.subscribeToTransactions(callback);
  };

  const getCorridorMetrics = (corridor: string, timeframe?: string) => {
    return analytics.getCorridorMetrics(corridor, timeframe);
  };

  const getDashboardMetrics = () => {
    return analytics.getDashboardMetrics();
  };

  const getRecentTransactions = (limit?: number) => {
    return analytics.getRecentTransactions(limit);
  };

  const getUserMetrics = (userAddress: string) => {
    return analytics.getUserMetrics(userAddress);
  };

  const getFeeComparison = () => {
    return analytics.getFeeComparison();
  };

  return {
    subscribeToTransactions,
    getCorridorMetrics,
    getDashboardMetrics,
    getRecentTransactions,
    getUserMetrics,
    getFeeComparison
  };
}
