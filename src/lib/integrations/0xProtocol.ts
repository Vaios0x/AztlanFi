import { ethers } from 'ethers';
import { getCorridorToken } from '@/lib/constants/corridors';

export interface SwapQuote {
  sellToken: string;
  buyToken: string;
  sellAmount: string;
  buyAmount: string;
  allowanceTarget: string;
  to: string;
  data: string;
  value: string;
  gas: string;
  gasPrice: string;
  protocolFee: string;
  minimumProtocolFee: string;
  buyTokenAddress: string;
  sellTokenAddress: string;
  sources: any[];
  orders: any[];
  decodedUniqueId: string;
  sellTokenToEthRate: string;
  buyTokenToEthRate: string;
  blockNumber: string;
}

export interface GaslessSwapRequest {
  trade: SwapQuote;
  signature: string;
  chainId: number;
  taker: string;
}

export class ZeroXIntegration {
  private apiKey: string;
  private baseUrl: string;
  private chainId: number;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_0X_API_KEY || '';
    this.baseUrl = 'https://api.0x.org';
    this.chainId = 41454; // Monad testnet
  }

  // Get swap quote with multi-route optimization
  async getSwapQuote(params: {
    sellToken: string;
    buyToken: string;
    sellAmount: string;
    takerAddress: string;
    slippagePercentage?: number;
    intentOnFilling?: boolean;
  }): Promise<SwapQuote> {
    const searchParams = new URLSearchParams({
      ...params,
      slippagePercentage: params.slippagePercentage?.toString() || '0.01',
      skipValidation: 'false',
      intentOnFilling: params.intentOnFilling?.toString() || 'true',
      chainId: this.chainId.toString()
    });

    const response = await fetch(
      `${this.baseUrl}/swap/v1/quote?${searchParams}`,
      {
        headers: { 
          '0x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`0x API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Execute gasless swap
  async executeGaslessSwap(params: GaslessSwapRequest): Promise<any> {
    const response = await fetch(`${this.baseUrl}/gasless/v1/swap`, {
      method: 'POST',
      headers: {
        '0x-api-key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...params,
        chainId: this.chainId
      })
    });

    if (!response.ok) {
      throw new Error(`Gasless swap error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Multi-route optimization for best rates
  async findBestRoute(
    amount: string,
    fromToken: string,
    toToken: string,
    corridors: string[]
  ): Promise<{ bestRoute: SwapQuote; alternatives: SwapQuote[] }> {
    const routes = await Promise.all(
      corridors.map(async (corridor) => {
        try {
          const corridorToken = getCorridorToken(corridor);
          return await this.getSwapQuote({
            sellToken: fromToken,
            buyToken: corridorToken,
            sellAmount: amount,
            takerAddress: '0x0000000000000000000000000000000000000000' // Placeholder
          });
        } catch (error) {
          console.warn(`Failed to get route for corridor ${corridor}:`, error);
          return null;
        }
      })
    );

    const validRoutes = routes.filter(route => route !== null) as SwapQuote[];
    
    if (validRoutes.length === 0) {
      throw new Error('No valid routes found');
    }

    // Find best route by buy amount
    const bestRoute = validRoutes.reduce((best, current) => 
      parseFloat(current.buyAmount) > parseFloat(best.buyAmount) ? current : best
    );

    // Get alternatives (other routes)
    const alternatives = validRoutes.filter(route => route !== bestRoute);

    return { bestRoute, alternatives };
  }

  // Get supported tokens for Monad
  async getSupportedTokens(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/swap/v1/tokens?chainId=${this.chainId}`, {
      headers: { '0x-api-key': this.apiKey }
    });

    if (!response.ok) {
      throw new Error(`Failed to get supported tokens: ${response.status}`);
    }

    const data = await response.json();
    return data.records.map((token: any) => token.address);
  }

  // Get price for token pair
  async getTokenPrice(
    baseToken: string,
    quoteToken: string,
    amount: string
  ): Promise<{ price: string; buyAmount: string }> {
    try {
      const quote = await this.getSwapQuote({
        sellToken: baseToken,
        buyToken: quoteToken,
        sellAmount: amount,
        takerAddress: '0x0000000000000000000000000000000000000000'
      });

      return {
        price: quote.buyAmount,
        buyAmount: quote.buyAmount
      };
    } catch (error) {
      throw new Error(`Failed to get price: ${error}`);
    }
  }

  // Get gasless swap status
  async getGaslessSwapStatus(swapId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/gasless/v1/swap/${swapId}`, {
      headers: { '0x-api-key': this.apiKey }
    });

    if (!response.ok) {
      throw new Error(`Failed to get swap status: ${response.status}`);
    }

    return response.json();
  }

  // Get historical prices
  async getHistoricalPrices(
    baseToken: string,
    quoteToken: string,
    startTime: number,
    endTime: number,
    interval: number
  ): Promise<any[]> {
    const response = await fetch(
      `${this.baseUrl}/price/v1/history?baseToken=${baseToken}&quoteToken=${quoteToken}&startTime=${startTime}&endTime=${endTime}&interval=${interval}&chainId=${this.chainId}`,
      {
        headers: { '0x-api-key': this.apiKey }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get historical prices: ${response.status}`);
    }

    return response.json();
  }

  // Get market makers and liquidity sources
  async getMarketMakers(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/swap/v1/markets?chainId=${this.chainId}`, {
      headers: { '0x-api-key': this.apiKey }
    });

    if (!response.ok) {
      throw new Error(`Failed to get market makers: ${response.status}`);
    }

    return response.json();
  }

  // Validate address for 0x
  validateAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  // Format amount for 0x API
  formatAmount(amount: string, decimals: number = 18): string {
    return ethers.parseUnits(amount, decimals).toString();
  }

  // Parse amount from 0x API response
  parseAmount(amount: string, decimals: number = 18): string {
    return ethers.formatUnits(amount, decimals);
  }

  // Get estimated gas for swap
  async estimateGas(quote: SwapQuote): Promise<string> {
    return quote.gas || '0';
  }

  // Get protocol fee for swap
  async getProtocolFee(quote: SwapQuote): Promise<string> {
    return quote.protocolFee || '0';
  }
}

// Hook for React components
export function use0xProtocol() {
  const zeroX = new ZeroXIntegration();

  const getSwapQuote = async (params: {
    sellToken: string;
    buyToken: string;
    sellAmount: string;
    takerAddress: string;
    slippagePercentage?: number;
  }) => {
    return zeroX.getSwapQuote(params);
  };

  const executeGaslessSwap = async (params: GaslessSwapRequest) => {
    return zeroX.executeGaslessSwap(params);
  };

  const findBestRoute = async (
    amount: string,
    fromToken: string,
    toToken: string,
    corridors: string[]
  ) => {
    return zeroX.findBestRoute(amount, fromToken, toToken, corridors);
  };

  const getTokenPrice = async (
    baseToken: string,
    quoteToken: string,
    amount: string
  ) => {
    return zeroX.getTokenPrice(baseToken, quoteToken, amount);
  };

  return {
    getSwapQuote,
    executeGaslessSwap,
    findBestRoute,
    getTokenPrice,
    validateAddress: zeroX.validateAddress.bind(zeroX),
    formatAmount: zeroX.formatAmount.bind(zeroX),
    parseAmount: zeroX.parseAmount.bind(zeroX)
  };
}
