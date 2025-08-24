# 🎯 Demo Flow Guide - Mobil3 Hackathon Finals

## 📋 Demo Flow (30 segundos total)

### 🎬 **Estructura del Demo**
1. **WhatsApp Bot** (5s) - Envío USA→Mexico
2. **PWA Demo** (10s) - China→Mexico business payment  
3. **Envio Dashboard** (5s) - Métricas en tiempo real
4. **Para Savings** (5s) - Metas de ahorro
5. **App Clip QR** (5s) - Pago instantáneo

---

## 1️⃣ **WhatsApp Bot Demo (5 segundos)**

### 🎯 **Objetivo**: Mostrar envío USA→Mexico vía WhatsApp

### 📱 **Setup Previo**:
```bash
# Configurar Twilio WhatsApp
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+14155238886
```

### 🎬 **Demo Script**:
```
"Envío USA→Mexico vía WhatsApp:
1. Abrir WhatsApp en el teléfono
2. Enviar: 'Hola AztlanFi'
3. Bot responde: '¡Hola! Envía dinero a México'
4. Enviar: 'Enviar $100 a Mexico'
5. Bot confirma: 'Enviando $100 a México - 0.5% fee'
6. ✅ Transacción completada en 1 segundo"
```

### 🔧 **Implementación**:
- Usar el endpoint: `src/app/api/whatsapp/route.ts`
- Integrar con `AztlanFiCore.sol` para procesar remesas
- Mostrar confirmación en tiempo real

---

## 2️⃣ **PWA Demo (10 segundos)**

### 🎯 **Objetivo**: Business payment China→Mexico

### 💻 **Setup**:
```bash
# Iniciar PWA
npm run dev
# Abrir: http://localhost:3000
```

### 🎬 **Demo Script**:
```
"Business Payment China→Mexico:
1. Abrir PWA en navegador móvil
2. Seleccionar: 'China → Mexico'
3. Ingresar: $5,000 (business payment)
4. Seleccionar: 'UnionPay' como método
5. Confirmar transacción
6. ✅ Liquidación en 1 segundo
7. Mostrar confirmación en blockchain"
```

### 🔧 **Implementación**:
- Usar `src/components/Dashboard.tsx` - modal "Enviar Dinero"
- Integrar con `0xProtocol.ts` para gasless transactions
- Mostrar transacción en `LiveDashboard.tsx`

---

## 3️⃣ **Envio Dashboard (5 segundos)**

### 🎯 **Objetivo**: Métricas en tiempo real

### 📊 **Setup**:
```bash
# Configurar Envio Analytics
NEXT_PUBLIC_ENVIO_API_KEY=your_key
```

### 🎬 **Demo Script**:
```
"Dashboard en Tiempo Real:
1. Abrir: /reports
2. Mostrar: 32 corredores activos
3. Métricas: $2.5M+ volumen procesado
4. Gráficos: Flujos de pago en tiempo real
5. ✅ Transparencia total en blockchain"
```

### 🔧 **Implementación**:
- Usar `src/app/reports/page.tsx`
- Integrar con `src/lib/integrations/envioAnalytics.ts`
- Mostrar datos reales de `PartnerIntegrations.sol`

---

## 4️⃣ **Para Savings (5 segundos)**

### 🎯 **Objetivo**: Metas de ahorro con stablecoins

### 🎯 **Setup**:
```bash
# Configurar Para Wallet
NEXT_PUBLIC_PARA_API_KEY=your_key
```

### 🎬 **Demo Script**:
```
"Metas de Ahorro:
1. Abrir: /dashboard
2. Seleccionar: 'Savings Goals'
3. Crear meta: 'Vacaciones México - $2,000'
4. Configurar: Depósito automático $200/mes
5. ✅ Meta creada con stablecoins"
```

### 🔧 **Implementación**:
- Usar `src/components/SavingsGoals.tsx`
- Integrar con `contracts/SavingsGoals.sol`
- Conectar con Para Wallet SDK

---

## 5️⃣ **App Clip QR (5 segundos)**

### 🎯 **Objetivo**: Pago instantáneo con QR

### 📱 **Setup**:
```bash
# Generar QR codes dinámicos
# Integrar con Para Wallet App Clips
```

### 🎬 **Demo Script**:
```
"App Clip QR - Pago Instantáneo:
1. Mostrar QR code en pantalla
2. Escanear con iPhone (App Clip)
3. Autenticación biométrica
4. Confirmar pago: $50 USDC
5. ✅ Pago instantáneo completado"
```

### 🔧 **Implementación**:
- Usar `src/components/WhatsAppBot.tsx` para generar QR
- Integrar con Para Wallet App Clips
- Mostrar confirmación en tiempo real

---

## 🎬 **Script Completo del Presentador**

### 🎤 **30-Second Elevator Pitch**:
```
"AztlanFi transforma el mercado de remesas de $750B anuales 
habilitando transferencias instantáneas con 0.5% de comisión 
entre LatAm, Asia y USA. Construido en Monad con 10,000 TPS, 
entregamos pagos en 1 segundo a través de WhatsApp, PWA y App Clips. 
No solo resolvemos remesas USA-México; construimos la infraestructura 
de pagos para el sur global."
```

### 🎯 **Demo Flow Script**:
```
"Ahora les muestro el demo completo:

1. WhatsApp Bot (5s): Envío USA→Mexico vía WhatsApp
2. PWA Demo (10s): Business payment China→Mexico  
3. Envio Dashboard (5s): Métricas en tiempo real
4. Para Savings (5s): Metas de ahorro con stablecoins
5. App Clip QR (5s): Pago instantáneo con QR

Cada demo muestra una integración diferente con nuestros partners 
del hackathon: 0x Protocol, Reown AppKit, Envio Analytics, y Para Wallet."
```

---

## 🛠️ **Setup Técnico Completo**

### 📋 **Checklist Pre-Demo**:
- [ ] **WhatsApp Bot**: Configurar Twilio y probar endpoint
- [ ] **PWA**: Verificar que funcione en móvil
- [ ] **Envio Dashboard**: Conectar con analytics reales
- [ ] **Para Savings**: Configurar wallet integration
- [ ] **App Clip QR**: Generar QR codes de prueba
- [ ] **Contratos**: Verificar que estén en Monad Testnet
- [ ] **Internet**: Conexión estable para demo en vivo

### 🔧 **Comandos de Preparación**:
```bash
# 1. Verificar contratos desplegados
npx hardhat run verify-deployment.js --network monad-testnet

# 2. Iniciar PWA
npm run dev

# 3. Probar WhatsApp Bot
curl -X POST http://localhost:3000/api/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"message": "Hola AztlanFi"}'

# 4. Verificar analytics
curl https://api.envio.com/analytics/aztlanfi

# 5. Probar Para Wallet
# Abrir en móvil: https://para.com/demo
```

### 📱 **Dispositivos Necesarios**:
- **Laptop**: Para mostrar PWA y dashboard
- **iPhone**: Para App Clip QR demo
- **WhatsApp**: Para bot demo
- **Proyector**: Para presentación

---

## 🎯 **Puntos Clave del Demo**

### 💡 **Highlights a Enfatizar**:
1. **Velocidad**: 1 segundo vs 3-5 días tradicional
2. **Costo**: 0.5% vs 6-8% comisiones tradicionales
3. **Accesibilidad**: WhatsApp, PWA, App Clips
4. **Transparencia**: Blockchain en tiempo real
5. **Global**: 32 corredores, 20+ países

### 🏆 **Competitive Advantages**:
- **Multi-corridor**: No solo USA→Mexico
- **Mobile-first**: PWA + App Clips
- **Partner integrations**: Hackathon bounties
- **Real-time**: Analytics en vivo
- **Gasless**: UX perfecto

### 🎬 **Timing Perfecto**:
- **5s cada demo**: Mantener ritmo
- **Transiciones rápidas**: Sin pausas
- **Backup ready**: Plan B para cada demo
- **Q&A preparado**: Respuestas rápidas

---

## 🚀 **Post-Demo Actions**

### 📊 **Métricas a Mostrar**:
- Volumen procesado en tiempo real
- Usuarios activos
- Corredores activos
- Tiempo promedio de liquidación
- Comisiones ahorradas

### 🤝 **Next Steps**:
- Demo en vivo con jurado
- Q&A session
- Technical deep dive
- Partnership discussions

---

**¡Listo para ganar el Mobil3 Hackathon! 🏆**
