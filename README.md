# AztlanFi 💸⚡

**Remesas instantáneas México-USA usando blockchain Monad**

AztlanFi es una plataforma revolucionaria de remesas que utiliza la tecnología blockchain de Monad para ofrecer transacciones instantáneas, seguras y económicas entre Estados Unidos y México.

## 🚀 Características Principales

- **⚡ Transacciones en 1 segundo** - Gracias a Monad blockchain
- **💰 Comisión fija del 0.5%** - Sin comisiones ocultas
- **📱 PWA nativa** - Instálala como app en tu móvil
- **🤖 Bot de WhatsApp** - Envía dinero por chat
- **🔒 Seguridad blockchain** - Transacciones inmutables
- **🌍 Cobertura completa** - Todo México desde USA

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Blockchain**: Monad, Wagmi v2, Viem
- **UI/UX**: Framer Motion, Lucide React
- **PWA**: next-pwa
- **Smart Contracts**: Solidity, OpenZeppelin
- **APIs**: Envio.dev, 0x Protocol, ChipiPay

## 📱 PWA Features

- Instalación nativa en móviles
- Funcionamiento offline
- Notificaciones push
- Acceso rápido desde pantalla de inicio
- Experiencia app-like

## 🔗 Integraciones

### Blockchain
- **Monad Testnet**: Red principal para transacciones
- **Wagmi v2**: Hooks para Web3
- **Viem**: Cliente Ethereum

### APIs Externas
- **Envio.dev**: Indexación en tiempo real
- **0x Protocol**: Agregación de liquidez
- **ChipiPay**: Fiat on/off ramps
- **Twilio**: WhatsApp bot

## 🏗️ Arquitectura

```
src/
├── app/                 # Next.js App Router
│   ├── (dashboard)/     # Dashboard pages
│   ├── api/            # API routes
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── forms/          # Form components
│   ├── ui/             # UI components
│   └── web3/           # Web3 components
├── lib/               # Utilities
│   ├── web3/          # Web3 configuration
│   └── integrations/  # External APIs
└── contracts/         # Smart contracts
```

## 🚀 Quick Start

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Wallet (MetaMask, etc.)

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/your-username/aztlanfi.git
cd aztlanfi

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env.local
# Editar .env.local con tus claves

# Ejecutar en desarrollo
npm run dev
```

### Variables de Entorno

```env
# Monad Testnet
NEXT_PUBLIC_MONAD_RPC=https://testnet.monad.xyz/v1/41454
NEXT_PUBLIC_CHAIN_ID=41454
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# APIs
NEXT_PUBLIC_0X_API_KEY=your_0x_api_key
ENVIO_API_KEY=your_envio_key
CHIPIPA_API_KEY=your_chipipa_key

# WhatsApp
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

## 📱 Uso

### Enviar Dinero
1. Conecta tu wallet
2. Selecciona destinatario
3. Ingresa cantidad
4. Confirma transacción
5. ¡Listo en 1 segundo!

### Recibir Dinero
1. Comparte tu QR code
2. Recibe notificación por WhatsApp
3. Retira en OXXO, SPEI, o CoDi

### WhatsApp Bot
- `/enviar` - Enviar dinero
- `/recibir` - Recibir dinero
- `/saldo` - Consultar saldo
- `/ayuda` - Obtener ayuda

## 🔧 Desarrollo

### Scripts Disponibles

```bash
npm run dev          # Desarrollo local
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting
npm run type-check   # Verificación de tipos
```

### Smart Contracts

```bash
# Compilar contratos
npx hardhat compile

# Deploy a Monad testnet
npx hardhat run scripts/deploy.js --network monad-testnet
```

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests de integración
npm run test:integration

# Tests E2E
npm run test:e2e
```

## 📊 Métricas

- **TPS**: 10,000+ transacciones por segundo
- **Finalidad**: 1 segundo
- **Comisión**: 0.5% fija
- **Cobertura**: Todo México
- **Tiempo de envío**: < 1 segundo

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🏆 Hackathon

**Mobil3 Hackathon - Ciudad de México**
- **Fecha**: 20-24 de Agosto, 2025
- **Categoría**: Fintech & Blockchain
- **Premio**: 🥇 Primer Lugar

## 📞 Contacto

- **Email**: equipo@aztlanfi.com
- **WhatsApp**: +1 (555) 123-4567
- **Twitter**: [@AztlanFi](https://twitter.com/AztlanFi)
- **Discord**: [AztlanFi Community](https://discord.gg/aztlanfi)

## 🙏 Agradecimientos

- **Monad Labs** - Por la tecnología blockchain
- **Envio.dev** - Por la indexación en tiempo real
- **0x Protocol** - Por la agregación de liquidez
- **ChipiPay** - Por los fiat on/off ramps
- **Mobil3** - Por organizar el hackathon

---

**⚡ AztlanFi - Revolucionando las remesas con blockchain**
