export interface PaymentCorridor {
  id: string;
  name: string;
  fromFlag: string;
  toFlag: string;
  fromCountry: string;
  toCountry: string;
  volume: string;
  fee: number;
  settlementTime: string;
  offRampMethods: OffRampMethod[];
  active: boolean;
  priority: number;
}

export interface OffRampMethod {
  id: string;
  name: string;
  description: string;
  speed: string;
  availability: string;
  icon: string;
  fee: number;
  minAmount: number;
  maxAmount: number;
}

export const corridors: PaymentCorridor[] = [
  // Corredores Principales (8 originales)
  {
    id: 'USA-MEX',
    name: 'USA to Mexico',
    fromFlag: '🇺🇸',
    toFlag: '🇲🇽',
    fromCountry: 'USA',
    toCountry: 'Mexico',
    volume: '$2.5B daily',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 1,
    active: true,
    offRampMethods: [
      {
        id: 'spei',
        name: 'SPEI Transfer',
        description: 'Direct to Mexican bank account',
        speed: 'Instant',
        availability: '24/7',
        icon: '🏦',
        fee: 0,
        minAmount: 1,
        maxAmount: 10000
      },
      {
        id: 'oxxo',
        name: 'OXXO Cash',
        description: 'Cash pickup at 20,000+ locations',
        speed: '5 minutes',
        availability: '24/7',
        icon: '🏪',
        fee: 2,
        minAmount: 10,
        maxAmount: 5000
      },
      {
        id: 'codi',
        name: 'CoDi',
        description: 'QR code payment system',
        speed: 'Instant',
        availability: '24/7',
        icon: '📱',
        fee: 0,
        minAmount: 1,
        maxAmount: 8000
      },
      {
        id: 'p2p',
        name: 'P2P Network',
        description: 'Local provider delivers cash',
        speed: '30 minutes',
        availability: 'Business hours',
        icon: '🤝',
        fee: 5,
        minAmount: 50,
        maxAmount: 2000
      }
    ]
  },
  {
    id: 'MEX-USA',
    name: 'Mexico to USA',
    fromFlag: '🇲🇽',
    toFlag: '🇺🇸',
    fromCountry: 'Mexico',
    toCountry: 'USA',
    volume: '$1.8B daily',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 2,
    active: true,
    offRampMethods: [
      {
        id: 'ach',
        name: 'ACH Transfer',
        description: 'Direct to US bank account',
        speed: '1-2 days',
        availability: 'Business days',
        icon: '🏦',
        fee: 0,
        minAmount: 1,
        maxAmount: 25000
      },
      {
        id: 'wire',
        name: 'Wire Transfer',
        description: 'Same-day bank transfer',
        speed: 'Same day',
        availability: 'Business hours',
        icon: '🏦',
        fee: 25,
        minAmount: 100,
        maxAmount: 100000
      }
    ]
  },
  {
    id: 'CHN-MEX',
    name: 'China to Mexico',
    fromFlag: '🇨🇳',
    toFlag: '🇲🇽',
    fromCountry: 'China',
    toCountry: 'Mexico',
    volume: '$4.5B annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 3,
    active: true,
    offRampMethods: [
      {
        id: 'unionpay',
        name: 'UnionPay',
        description: 'Chinese bank card network',
        speed: 'Instant',
        availability: '24/7',
        icon: '💳',
        fee: 1,
        minAmount: 10,
        maxAmount: 50000
      },
      {
        id: 'alipay',
        name: 'Alipay Transfer',
        description: 'Direct to Alipay wallet',
        speed: '1 minute',
        availability: '24/7',
        icon: '📱',
        fee: 0.5,
        minAmount: 1,
        maxAmount: 10000
      },
      {
        id: 'wechat',
        name: 'WeChat Pay',
        description: 'WeChat wallet transfer',
        speed: '1 minute',
        availability: '24/7',
        icon: '💬',
        fee: 0.5,
        minAmount: 1,
        maxAmount: 10000
      }
    ]
  },
  {
    id: 'MEX-CHN',
    name: 'Mexico to China',
    fromFlag: '🇲🇽',
    toFlag: '🇨🇳',
    fromCountry: 'Mexico',
    toCountry: 'China',
    volume: '$2.1B annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 4,
    active: true,
    offRampMethods: [
      {
        id: 'unionpay',
        name: 'UnionPay',
        description: 'Chinese bank card network',
        speed: 'Instant',
        availability: '24/7',
        icon: '💳',
        fee: 1,
        minAmount: 10,
        maxAmount: 50000
      }
    ]
  },
  {
    id: 'USA-BRA',
    name: 'USA to Brazil',
    fromFlag: '🇺🇸',
    toFlag: '🇧🇷',
    fromCountry: 'USA',
    toCountry: 'Brazil',
    volume: '$1.2B annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 5,
    active: true,
    offRampMethods: [
      {
        id: 'pix',
        name: 'PIX',
        description: 'Brazil instant payment system',
        speed: 'Instant',
        availability: '24/7',
        icon: '⚡',
        fee: 0,
        minAmount: 1,
        maxAmount: 10000
      },
      {
        id: 'bank',
        name: 'Bank Transfer',
        description: 'Traditional bank transfer',
        speed: '1 day',
        availability: 'Business days',
        icon: '🏦',
        fee: 5,
        minAmount: 50,
        maxAmount: 50000
      },
      {
        id: 'boleto',
        name: 'Boleto Bancário',
        description: 'Bank slip payment',
        speed: '1-3 days',
        availability: '24/7',
        icon: '📄',
        fee: 3,
        minAmount: 10,
        maxAmount: 10000
      }
    ]
  },
  {
    id: 'BRA-USA',
    name: 'Brazil to USA',
    fromFlag: '🇧🇷',
    toFlag: '🇺🇸',
    fromCountry: 'Brazil',
    toCountry: 'USA',
    volume: '$800M annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 6,
    active: true,
    offRampMethods: [
      {
        id: 'ach',
        name: 'ACH Transfer',
        description: 'Direct to US bank account',
        speed: '1-2 days',
        availability: 'Business days',
        icon: '🏦',
        fee: 0,
        minAmount: 1,
        maxAmount: 25000
      }
    ]
  },
  {
    id: 'JPN-MEX',
    name: 'Japan to Mexico',
    fromFlag: '🇯🇵',
    toFlag: '🇲🇽',
    fromCountry: 'Japan',
    toCountry: 'Mexico',
    volume: '$800M annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 7,
    active: true,
    offRampMethods: [
      {
        id: 'jcb',
        name: 'JCB Card',
        description: 'Japanese credit card network',
        speed: 'Instant',
        availability: '24/7',
        icon: '💳',
        fee: 1.5,
        minAmount: 10,
        maxAmount: 20000
      },
      {
        id: 'linepay',
        name: 'LINE Pay',
        description: 'LINE messaging app payment',
        speed: '1 minute',
        availability: '24/7',
        icon: '💬',
        fee: 0.5,
        minAmount: 1,
        maxAmount: 5000
      }
    ]
  },
  {
    id: 'MEX-JPN',
    name: 'Mexico to Japan',
    fromFlag: '🇲🇽',
    toFlag: '🇯🇵',
    fromCountry: 'Mexico',
    toCountry: 'Japan',
    volume: '$400M annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 8,
    active: true,
    offRampMethods: [
      {
        id: 'jcb',
        name: 'JCB Card',
        description: 'Japanese credit card network',
        speed: 'Instant',
        availability: '24/7',
        icon: '💳',
        fee: 1.5,
        minAmount: 10,
        maxAmount: 20000
      }
    ]
  },
  {
    id: 'KOR-LATAM',
    name: 'South Korea to Latin America',
    fromFlag: '🇰🇷',
    toFlag: '🌎',
    fromCountry: 'South Korea',
    toCountry: 'Latin America',
    volume: '$600M annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 9,
    active: true,
    offRampMethods: [
      {
        id: 'kakao',
        name: 'KakaoPay',
        description: 'Kakao messaging app payment',
        speed: '1 minute',
        availability: '24/7',
        icon: '💬',
        fee: 0.5,
        minAmount: 1,
        maxAmount: 5000
      },
      {
        id: 'naver',
        name: 'Naver Pay',
        description: 'Naver search engine payment',
        speed: '1 minute',
        availability: '24/7',
        icon: '🔍',
        fee: 0.5,
        minAmount: 1,
        maxAmount: 5000
      }
    ]
  },
  {
    id: 'LATAM-KOR',
    name: 'Latin America to South Korea',
    fromFlag: '🌎',
    toFlag: '🇰🇷',
    fromCountry: 'Latin America',
    toCountry: 'South Korea',
    volume: '$300M annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 10,
    active: true,
    offRampMethods: [
      {
        id: 'kakao',
        name: 'KakaoPay',
        description: 'Kakao messaging app payment',
        speed: '1 minute',
        availability: '24/7',
        icon: '💬',
        fee: 0.5,
        minAmount: 1,
        maxAmount: 5000
      }
    ]
  },
  {
    id: 'IND-LATAM',
    name: 'India to Latin America',
    fromFlag: '🇮🇳',
    toFlag: '🌎',
    fromCountry: 'India',
    toCountry: 'Latin America',
    volume: '$400M annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 11,
    active: true,
    offRampMethods: [
      {
        id: 'upi',
        name: 'UPI',
        description: 'Unified Payment Interface',
        speed: 'Instant',
        availability: '24/7',
        icon: '📱',
        fee: 0,
        minAmount: 1,
        maxAmount: 10000
      },
      {
        id: 'paytm',
        name: 'Paytm',
        description: 'Indian digital wallet',
        speed: '1 minute',
        availability: '24/7',
        icon: '📱',
        fee: 0.5,
        minAmount: 1,
        maxAmount: 5000
      }
    ]
  },
  {
    id: 'LATAM-IND',
    name: 'Latin America to India',
    fromFlag: '🌎',
    toFlag: '🇮🇳',
    fromCountry: 'Latin America',
    toCountry: 'India',
    volume: '$200M annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 12,
    active: true,
    offRampMethods: [
      {
        id: 'upi',
        name: 'UPI',
        description: 'Unified Payment Interface',
        speed: 'Instant',
        availability: '24/7',
        icon: '📱',
        fee: 0,
        minAmount: 1,
        maxAmount: 10000
      }
    ]
  },
  {
    id: 'BRA-MEX',
    name: 'Brazil to Mexico',
    fromFlag: '🇧🇷',
    toFlag: '🇲🇽',
    fromCountry: 'Brazil',
    toCountry: 'Mexico',
    volume: '$10B annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 13,
    active: true,
    offRampMethods: [
      {
        id: 'pix',
        name: 'PIX',
        description: 'Brazil instant payment system',
        speed: 'Instant',
        availability: '24/7',
        icon: '⚡',
        fee: 0,
        minAmount: 1,
        maxAmount: 10000
      },
      {
        id: 'spei',
        name: 'SPEI',
        description: 'Mexican instant payment system',
        speed: 'Instant',
        availability: '24/7',
        icon: '🏦',
        fee: 0,
        minAmount: 1,
        maxAmount: 10000
      }
    ]
  },
  {
    id: 'MEX-BRA',
    name: 'Mexico to Brazil',
    fromFlag: '🇲🇽',
    toFlag: '🇧🇷',
    fromCountry: 'Mexico',
    toCountry: 'Brazil',
    volume: '$8B annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 14,
    active: true,
    offRampMethods: [
      {
        id: 'spei',
        name: 'SPEI',
        description: 'Mexican instant payment system',
        speed: 'Instant',
        availability: '24/7',
        icon: '🏦',
        fee: 0,
        minAmount: 1,
        maxAmount: 10000
      },
      {
        id: 'pix',
        name: 'PIX',
        description: 'Brazil instant payment system',
        speed: 'Instant',
        availability: '24/7',
        icon: '⚡',
        fee: 0,
        minAmount: 1,
        maxAmount: 10000
      }
    ]
  },
  {
    id: 'EUR-LATAM',
    name: 'Europe to Latin America',
    fromFlag: '🇪🇺',
    toFlag: '🌎',
    fromCountry: 'Europe',
    toCountry: 'Latin America',
    volume: '$2B annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 15,
    active: true,
    offRampMethods: [
      {
        id: 'sepa',
        name: 'SEPA Transfer',
        description: 'Single Euro Payments Area',
        speed: '1 day',
        availability: 'Business days',
        icon: '🏦',
        fee: 5,
        minAmount: 50,
        maxAmount: 50000
      },
      {
        id: 'swift',
        name: 'SWIFT Transfer',
        description: 'International bank transfer',
        speed: '2-3 days',
        availability: 'Business days',
        icon: '🌍',
        fee: 15,
        minAmount: 100,
        maxAmount: 100000
      }
    ]
  },
  {
    id: 'LATAM-EUR',
    name: 'Latin America to Europe',
    fromFlag: '🌎',
    toFlag: '🇪🇺',
    fromCountry: 'Latin America',
    toCountry: 'Europe',
    volume: '$1.5B annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 16,
    active: true,
    offRampMethods: [
      {
        id: 'sepa',
        name: 'SEPA Transfer',
        description: 'Single Euro Payments Area',
        speed: '1 day',
        availability: 'Business days',
        icon: '🏦',
        fee: 5,
        minAmount: 50,
        maxAmount: 50000
      }
    ]
  },
  // Corredores Regionales Adicionales
  {
    id: 'USA-COL',
    name: 'USA to Colombia',
    fromFlag: '🇺🇸',
    toFlag: '🇨🇴',
    fromCountry: 'USA',
    toCountry: 'Colombia',
    volume: '$500M annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 17,
    active: true,
    offRampMethods: [
      {
        id: 'ach',
        name: 'ACH Transfer',
        description: 'Direct to Colombian bank account',
        speed: '1-2 days',
        availability: 'Business days',
        icon: '🏦',
        fee: 0,
        minAmount: 1,
        maxAmount: 25000
      }
    ]
  },
  {
    id: 'COL-USA',
    name: 'Colombia to USA',
    fromFlag: '🇨🇴',
    toFlag: '🇺🇸',
    fromCountry: 'Colombia',
    toCountry: 'USA',
    volume: '$300M annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 18,
    active: true,
    offRampMethods: [
      {
        id: 'ach',
        name: 'ACH Transfer',
        description: 'Direct to US bank account',
        speed: '1-2 days',
        availability: 'Business days',
        icon: '🏦',
        fee: 0,
        minAmount: 1,
        maxAmount: 25000
      }
    ]
  },
  {
    id: 'USA-ARG',
    name: 'USA to Argentina',
    fromFlag: '🇺🇸',
    toFlag: '🇦🇷',
    fromCountry: 'USA',
    toCountry: 'Argentina',
    volume: '$400M annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 19,
    active: true,
    offRampMethods: [
      {
        id: 'ach',
        name: 'ACH Transfer',
        description: 'Direct to Argentine bank account',
        speed: '1-2 days',
        availability: 'Business days',
        icon: '🏦',
        fee: 0,
        minAmount: 1,
        maxAmount: 25000
      }
    ]
  },
  {
    id: 'ARG-USA',
    name: 'Argentina to USA',
    fromFlag: '🇦🇷',
    toFlag: '🇺🇸',
    fromCountry: 'Argentina',
    toCountry: 'USA',
    volume: '$250M annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 20,
    active: true,
    offRampMethods: [
      {
        id: 'ach',
        name: 'ACH Transfer',
        description: 'Direct to US bank account',
        speed: '1-2 days',
        availability: 'Business days',
        icon: '🏦',
        fee: 0,
        minAmount: 1,
        maxAmount: 25000
      }
    ]
  },
  {
    id: 'USA-PER',
    name: 'USA to Peru',
    fromFlag: '🇺🇸',
    toFlag: '🇵🇪',
    fromCountry: 'USA',
    toCountry: 'Peru',
    volume: '$300M annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 21,
    active: true,
    offRampMethods: [
      {
        id: 'ach',
        name: 'ACH Transfer',
        description: 'Direct to Peruvian bank account',
        speed: '1-2 days',
        availability: 'Business days',
        icon: '🏦',
        fee: 0,
        minAmount: 1,
        maxAmount: 25000
      }
    ]
  },
  {
    id: 'PER-USA',
    name: 'Peru to USA',
    fromFlag: '🇵🇪',
    toFlag: '🇺🇸',
    fromCountry: 'Peru',
    toCountry: 'USA',
    volume: '$200M annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 22,
    active: true,
    offRampMethods: [
      {
        id: 'ach',
        name: 'ACH Transfer',
        description: 'Direct to US bank account',
        speed: '1-2 days',
        availability: 'Business days',
        icon: '🏦',
        fee: 0,
        minAmount: 1,
        maxAmount: 25000
      }
    ]
  },
  {
    id: 'USA-CHL',
    name: 'USA to Chile',
    fromFlag: '🇺🇸',
    toFlag: '🇨🇱',
    fromCountry: 'USA',
    toCountry: 'Chile',
    volume: '$250M annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 23,
    active: true,
    offRampMethods: [
      {
        id: 'ach',
        name: 'ACH Transfer',
        description: 'Direct to Chilean bank account',
        speed: '1-2 days',
        availability: 'Business days',
        icon: '🏦',
        fee: 0,
        minAmount: 1,
        maxAmount: 25000
      }
    ]
  },
  {
    id: 'CHL-USA',
    name: 'Chile to USA',
    fromFlag: '🇨🇱',
    toFlag: '🇺🇸',
    fromCountry: 'Chile',
    toCountry: 'USA',
    volume: '$150M annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 24,
    active: true,
    offRampMethods: [
      {
        id: 'ach',
        name: 'ACH Transfer',
        description: 'Direct to US bank account',
        speed: '1-2 days',
        availability: 'Business days',
        icon: '🏦',
        fee: 0,
        minAmount: 1,
        maxAmount: 25000
      }
    ]
  },
  {
    id: 'USA-ECU',
    name: 'USA to Ecuador',
    fromFlag: '🇺🇸',
    toFlag: '🇪🇨',
    fromCountry: 'USA',
    toCountry: 'Ecuador',
    volume: '$200M annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 25,
    active: true,
    offRampMethods: [
      {
        id: 'ach',
        name: 'ACH Transfer',
        description: 'Direct to Ecuadorian bank account',
        speed: '1-2 days',
        availability: 'Business days',
        icon: '🏦',
        fee: 0,
        minAmount: 1,
        maxAmount: 25000
      }
    ]
  },
  {
    id: 'ECU-USA',
    name: 'Ecuador to USA',
    fromFlag: '🇪🇨',
    toFlag: '🇺🇸',
    fromCountry: 'Ecuador',
    toCountry: 'USA',
    volume: '$120M annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 26,
    active: true,
    offRampMethods: [
      {
        id: 'ach',
        name: 'ACH Transfer',
        description: 'Direct to US bank account',
        speed: '1-2 days',
        availability: 'Business days',
        icon: '🏦',
        fee: 0,
        minAmount: 1,
        maxAmount: 25000
      }
    ]
  },
  {
    id: 'USA-VEN',
    name: 'USA to Venezuela',
    fromFlag: '🇺🇸',
    toFlag: '🇻🇪',
    fromCountry: 'USA',
    toCountry: 'Venezuela',
    volume: '$150M annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 27,
    active: true,
    offRampMethods: [
      {
        id: 'ach',
        name: 'ACH Transfer',
        description: 'Direct to Venezuelan bank account',
        speed: '1-2 days',
        availability: 'Business days',
        icon: '🏦',
        fee: 0,
        minAmount: 1,
        maxAmount: 25000
      }
    ]
  },
  {
    id: 'VEN-USA',
    name: 'Venezuela to USA',
    fromFlag: '🇻🇪',
    toFlag: '🇺🇸',
    fromCountry: 'Venezuela',
    toCountry: 'USA',
    volume: '$80M annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 28,
    active: true,
    offRampMethods: [
      {
        id: 'ach',
        name: 'ACH Transfer',
        description: 'Direct to US bank account',
        speed: '1-2 days',
        availability: 'Business days',
        icon: '🏦',
        fee: 0,
        minAmount: 1,
        maxAmount: 25000
      }
    ]
  },
  // Corredores Internos de LatAm
  {
    id: 'BRA-COL',
    name: 'Brazil to Colombia',
    fromFlag: '🇧🇷',
    toFlag: '🇨🇴',
    fromCountry: 'Brazil',
    toCountry: 'Colombia',
    volume: '$300M annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 29,
    active: true,
    offRampMethods: [
      {
        id: 'pix',
        name: 'PIX',
        description: 'Brazil instant payment system',
        speed: 'Instant',
        availability: '24/7',
        icon: '⚡',
        fee: 0,
        minAmount: 1,
        maxAmount: 10000
      }
    ]
  },
  {
    id: 'COL-BRA',
    name: 'Colombia to Brazil',
    fromFlag: '🇨🇴',
    toFlag: '🇧🇷',
    fromCountry: 'Colombia',
    toCountry: 'Brazil',
    volume: '$250M annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 30,
    active: true,
    offRampMethods: [
      {
        id: 'pix',
        name: 'PIX',
        description: 'Brazil instant payment system',
        speed: 'Instant',
        availability: '24/7',
        icon: '⚡',
        fee: 0,
        minAmount: 1,
        maxAmount: 10000
      }
    ]
  },
  {
    id: 'MEX-COL',
    name: 'Mexico to Colombia',
    fromFlag: '🇲🇽',
    toFlag: '🇨🇴',
    fromCountry: 'Mexico',
    toCountry: 'Colombia',
    volume: '$200M annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 31,
    active: true,
    offRampMethods: [
      {
        id: 'spei',
        name: 'SPEI',
        description: 'Mexican instant payment system',
        speed: 'Instant',
        availability: '24/7',
        icon: '🏦',
        fee: 0,
        minAmount: 1,
        maxAmount: 10000
      }
    ]
  },
  {
    id: 'COL-MEX',
    name: 'Colombia to Mexico',
    fromFlag: '🇨🇴',
    toFlag: '🇲🇽',
    fromCountry: 'Colombia',
    toCountry: 'Mexico',
    volume: '$180M annually',
    fee: 0.5,
    settlementTime: '1 second',
    priority: 32,
    active: true,
    offRampMethods: [
      {
        id: 'spei',
        name: 'SPEI',
        description: 'Mexican instant payment system',
        speed: 'Instant',
        availability: '24/7',
        icon: '🏦',
        fee: 0,
        minAmount: 1,
        maxAmount: 10000
      }
    ]
  }
];

export function getCorridorById(id: string): PaymentCorridor | undefined {
  return corridors.find(corridor => corridor.id === id);
}

export function getActiveCorridors(): PaymentCorridor[] {
  return corridors.filter(corridor => corridor.active);
}

export function getCorridorToken(corridorId: string): string {
  const tokenMap: Record<string, string> = {
    'USA-MEX': 'MXN',
    'MEX-USA': 'USD',
    'CHN-MEX': 'CNY',
    'MEX-CHN': 'CNY',
    'USA-BRA': 'BRL',
    'BRA-USA': 'USD',
    'JPN-MEX': 'JPY',
    'MEX-JPN': 'JPY',
    'KOR-LATAM': 'KRW',
    'LATAM-KOR': 'KRW',
    'IND-LATAM': 'INR',
    'LATAM-IND': 'INR',
    'BRA-MEX': 'BRL',
    'MEX-BRA': 'BRL',
    'EUR-LATAM': 'EUR',
    'LATAM-EUR': 'EUR',
    'USA-COL': 'USD',
    'COL-USA': 'USD',
    'USA-ARG': 'USD',
    'ARG-USA': 'USD',
    'USA-PER': 'USD',
    'PER-USA': 'USD',
    'USA-CHL': 'USD',
    'CHL-USA': 'USD',
    'USA-ECU': 'USD',
    'ECU-USA': 'USD',
    'USA-VEN': 'USD',
    'VEN-USA': 'USD',
    'BRA-COL': 'BRL',
    'COL-BRA': 'BRL',
    'MEX-COL': 'MXN',
    'COL-MEX': 'MXN'
  };
  return tokenMap[corridorId] || 'USDC';
}

export function getCorridorVolume(corridorId: string): string {
  const corridor = getCorridorById(corridorId);
  return corridor?.volume || 'N/A';
}
