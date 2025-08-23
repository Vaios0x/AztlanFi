export interface ParaWallet {
  id: string;
  address: string;
  type: 'embedded' | 'external';
  authentication: 'passkey' | 'biometric';
  provider?: string;
  metadata?: any;
}

export interface ParaPayment {
  id: string;
  amount: number;
  currency: string;
  recipient: string;
  type: 'fixed' | 'variable';
  metadata?: any;
  status: 'pending' | 'completed' | 'failed';
  url?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  completed: boolean;
  locked: boolean;
  wallet: ParaWallet;
  recurringDeposits?: RecurringDeposit;
}

export interface RecurringDeposit {
  id: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  nextDeposit: Date;
  active: boolean;
}

export class ParaIntegration {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.PARA_API_KEY || '';
    this.baseUrl = 'https://api.getpara.com/v1';
  }

  // Bounty 1: App Clips for instant payments
  async createAppClipPayment(params: {
    amount: number;
    recipient: string;
    currency?: string;
    metadata?: any;
  }): Promise<{ payment: ParaPayment; qrCode: string; appClipUrl: string }> {
    const payment = await this.createPayment({
      amount: params.amount,
      currency: params.currency || 'USDC',
      recipient: params.recipient,
      type: 'fixed',
      metadata: {
        ...params.metadata,
        appClip: true,
        biometric: true
      }
    });

    // Generate QR code that launches App Clip
    const qrCode = await this.generateQRCode(payment.url || '');
    const appClipUrl = `https://aztlanfi.app.clip/${payment.id}`;

    return { payment, qrCode, appClipUrl };
  }

  // Passkey authentication for instant approval
  async authenticateWithPasskey(params: {
    userId: string;
    userVerification?: 'required' | 'preferred' | 'discouraged';
    authenticatorAttachment?: 'platform' | 'cross-platform';
  }): Promise<{ authenticated: boolean; wallet?: ParaWallet }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/passkey`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: params.userId,
          options: {
            userVerification: params.userVerification || 'required',
            authenticatorAttachment: params.authenticatorAttachment || 'platform'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`);
      }

      const result = await response.json();
      return {
        authenticated: result.authenticated,
        wallet: result.wallet
      };
    } catch (error) {
      console.error('Passkey authentication error:', error);
      return { authenticated: false };
    }
  }

  // Biometric authentication
  async authenticateWithBiometrics(): Promise<boolean> {
    try {
      // Check if biometric authentication is available
      if (!navigator.credentials) {
        throw new Error('Biometric authentication not supported');
      }

      // Request biometric authentication
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          rpId: window.location.hostname,
          userVerification: 'required'
        }
      });

      return credential !== null;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }

  // Bounty 2: Savings Goals with Stablecoins
  async createSavingsGoal(params: {
    name: string;
    targetAmount: number;
    deadline: Date;
    userId: string;
    initialDeposit?: number;
  }): Promise<SavingsGoal> {
    // Create embedded wallet for savings
    const wallet = await this.createWallet({
      userId: params.userId,
      type: 'savings',
      features: ['timelock', 'recurring']
    });

    // Create savings goal
    const response = await fetch(`${this.baseUrl}/savings/goals`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: params.name,
        targetAmount: params.targetAmount,
        deadline: params.deadline.toISOString(),
        walletId: wallet.id,
        initialDeposit: params.initialDeposit || 0,
        lockUntilTarget: true
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create savings goal: ${response.status}`);
    }

    const goal = await response.json();

    // Lock funds in smart contract if initial deposit
    if (params.initialDeposit && params.initialDeposit > 0) {
      await this.lockFundsInContract(goal.id, params.initialDeposit);
    }

    return {
      id: goal.id,
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount || 0,
      deadline: new Date(goal.deadline),
      completed: goal.completed || false,
      locked: goal.locked || true,
      wallet: wallet
    };
  }

  // Recurring deposits
  async setupRecurringDeposit(params: {
    goalId: string;
    amount: number;
    frequency: 'daily' | 'weekly' | 'monthly';
  }): Promise<RecurringDeposit> {
    const response = await fetch(`${this.baseUrl}/savings/recurring`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        goalId: params.goalId,
        amount: params.amount,
        frequency: params.frequency,
        token: 'USDC'
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to setup recurring deposit: ${response.status}`);
    }

    const recurring = await response.json();
    return {
      id: recurring.id,
      amount: recurring.amount,
      frequency: recurring.frequency,
      nextDeposit: new Date(recurring.nextDeposit),
      active: recurring.active
    };
  }

  // Deposit to savings goal
  async depositToGoal(goalId: string, amount: number): Promise<{ success: boolean; newBalance: number }> {
    const response = await fetch(`${this.baseUrl}/savings/goals/${goalId}/deposit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount,
        token: 'USDC'
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to deposit to goal: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: result.success,
      newBalance: result.newBalance
    };
  }

  // Get user's savings goals
  async getSavingsGoals(userId: string): Promise<SavingsGoal[]> {
    const response = await fetch(`${this.baseUrl}/savings/goals?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get savings goals: ${response.status}`);
    }

    const goals = await response.json();
    return goals.map((goal: any) => ({
      id: goal.id,
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: new Date(goal.deadline),
      completed: goal.completed,
      locked: goal.locked,
      wallet: goal.wallet,
      recurringDeposits: goal.recurringDeposits
    }));
  }

  // Withdraw from savings goal
  async withdrawFromGoal(goalId: string, amount: number): Promise<{ success: boolean; newBalance: number }> {
    const response = await fetch(`${this.baseUrl}/savings/goals/${goalId}/withdraw`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to withdraw from goal: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: result.success,
      newBalance: result.newBalance
    };
  }

  // Create Para wallet
  async createWallet(params: {
    userId: string;
    type: 'embedded' | 'external' | 'savings';
    features?: string[];
  }): Promise<ParaWallet> {
    const response = await fetch(`${this.baseUrl}/wallets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: params.type,
        authentication: 'passkey',
        userId: params.userId,
        features: params.features || []
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create wallet: ${response.status}`);
    }

    return response.json();
  }

  // Create payment
  async createPayment(params: {
    amount: number;
    currency: string;
    recipient: string;
    type: 'fixed' | 'variable';
    metadata?: any;
  }): Promise<ParaPayment> {
    const response = await fetch(`${this.baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`Failed to create payment: ${response.status}`);
    }

    return response.json();
  }

  // Generate QR code
  async generateQRCode(data: string): Promise<string> {
    // In a real implementation, you'd use a QR code library
    // For now, return a placeholder
    return `data:image/png;base64,${btoa(data)}`;
  }

  // Lock funds in smart contract
  async lockFundsInContract(goalId: string, amount: number): Promise<{ success: boolean; txHash: string }> {
    // This would interact with the smart contract
    // For now, return a mock response
    return {
      success: true,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`
    };
  }

  // Get payment status
  async getPaymentStatus(paymentId: string): Promise<ParaPayment> {
    const response = await fetch(`${this.baseUrl}/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get payment status: ${response.status}`);
    }

    return response.json();
  }

  // Execute payment (for App Clips)
  async executePayment(paymentId: string): Promise<{ success: boolean; txHash: string }> {
    const response = await fetch(`${this.baseUrl}/payments/${paymentId}/execute`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to execute payment: ${response.status}`);
    }

    return response.json();
  }

  // Get user's wallets
  async getUserWallets(userId: string): Promise<ParaWallet[]> {
    const response = await fetch(`${this.baseUrl}/wallets?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get user wallets: ${response.status}`);
    }

    return response.json();
  }

  // Get wallet balance
  async getWalletBalance(walletId: string): Promise<{ balance: number; currency: string }> {
    const response = await fetch(`${this.baseUrl}/wallets/${walletId}/balance`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get wallet balance: ${response.status}`);
    }

    return response.json();
  }
}

// Hook for React components
export function useParaWallet() {
  const para = new ParaIntegration();

  const createAppClipPayment = async (params: {
    amount: number;
    recipient: string;
    currency?: string;
    metadata?: any;
  }) => {
    return para.createAppClipPayment(params);
  };

  const authenticateWithPasskey = async (params: {
    userId: string;
    userVerification?: 'required' | 'preferred' | 'discouraged';
    authenticatorAttachment?: 'platform' | 'cross-platform';
  }) => {
    return para.authenticateWithPasskey(params);
  };

  const authenticateWithBiometrics = async () => {
    return para.authenticateWithBiometrics();
  };

  const createSavingsGoal = async (params: {
    name: string;
    targetAmount: number;
    deadline: Date;
    userId: string;
    initialDeposit?: number;
  }) => {
    return para.createSavingsGoal(params);
  };

  const setupRecurringDeposit = async (params: {
    goalId: string;
    amount: number;
    frequency: 'daily' | 'weekly' | 'monthly';
  }) => {
    return para.setupRecurringDeposit(params);
  };

  const depositToGoal = async (goalId: string, amount: number) => {
    return para.depositToGoal(goalId, amount);
  };

  const getSavingsGoals = async (userId: string) => {
    return para.getSavingsGoals(userId);
  };

  const withdrawFromGoal = async (goalId: string, amount: number) => {
    return para.withdrawFromGoal(goalId, amount);
  };

  const executePayment = async (paymentId: string) => {
    return para.executePayment(paymentId);
  };

  const getWalletBalance = async (walletId: string) => {
    return para.getWalletBalance(walletId);
  };

  return {
    createAppClipPayment,
    authenticateWithPasskey,
    authenticateWithBiometrics,
    createSavingsGoal,
    setupRecurringDeposit,
    depositToGoal,
    getSavingsGoals,
    withdrawFromGoal,
    executePayment,
    getWalletBalance
  };
}
