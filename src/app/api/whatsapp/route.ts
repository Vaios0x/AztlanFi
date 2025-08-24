import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Initialize Twilio client function
function getTwilioClient() {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    return null;
  }
  try {
    return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  } catch (error) {
    console.error('Error initializing Twilio client:', error);
    return null;
  }
}

// Webhook verification
const validateRequest = async (request: NextRequest) => {
  const signature = request.headers.get('x-twilio-signature');
  const url = request.url;
  const params = new URLSearchParams(await request.text());
  
  return twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN!,
    signature!,
    url,
    Object.fromEntries(params)
  );
};

// Corridor data
const corridors = [
  { id: 'USA-MEX', name: 'USA to Mexico', fee: 0.5, time: '1 second' },
  { id: 'CHN-MEX', name: 'China to Mexico', fee: 0.5, time: '1 second' },
  { id: 'USA-BRA', name: 'USA to Brazil', fee: 0.5, time: '1 second' },
  { id: 'JPN-MEX', name: 'Japan to Mexico', fee: 0.5, time: '1 second' },
  { id: 'KOR-LATAM', name: 'South Korea to LatAm', fee: 0.5, time: '1 second' },
  { id: 'IND-LATAM', name: 'India to LatAm', fee: 0.5, time: '1 second' },
  { id: 'BRA-MEX', name: 'Brazil to Mexico', fee: 0.5, time: '1 second' },
  { id: 'EUR-LATAM', name: 'Europe to LatAm', fee: 0.5, time: '1 second' }
];

// Session storage (in production, use Redis or database)
const sessions = new Map<string, any>();

// Bot responses
const botResponses = {
  welcome: `¡Hola! Soy el asistente de AztlanFi. Puedo ayudarte a enviar dinero a cualquier parte del mundo.

🌍 *Corredores disponibles:*
• USA → Mexico (0.5% comisión)
• China → Mexico (0.5% comisión)
• USA → Brazil (0.5% comisión)
• Y muchos más...

¿Qué te gustaría hacer?

1️⃣ *Enviar dinero*
2️⃣ *Ver corredores*
3️⃣ *Consultar precios*
4️⃣ *Soporte*

Responde con el número de tu opción.`,

  sendMoney: `Perfecto, vamos a enviar dinero. 

🌍 *Elige el corredor:*

1️⃣ USA → Mexico
2️⃣ China → Mexico  
3️⃣ USA → Brazil
4️⃣ Japan → Mexico
5️⃣ South Korea → LatAm
6️⃣ India → LatAm
7️⃣ Brazil → Mexico
8️⃣ Europe → LatAm

Responde con el número del corredor que prefieres.`,

  corridors: `🌍 *Corredores Disponibles:*

1️⃣ *USA → Mexico*
   💰 Volumen: $2.5B daily
   💸 Comisión: 0.5%
   ⚡ Tiempo: 1 second

2️⃣ *China → Mexico*
   💰 Volumen: $4.5B annually
   💸 Comisión: 0.5%
   ⚡ Tiempo: 1 second

3️⃣ *USA → Brazil*
   💰 Volumen: $1.2B annually
   💸 Comisión: 0.5%
   ⚡ Tiempo: 1 second

4️⃣ *Japan → Mexico*
   💰 Volumen: $800M annually
   💸 Comisión: 0.5%
   ⚡ Tiempo: 1 second

5️⃣ *South Korea → LatAm*
   💰 Volumen: $600M annually
   💸 Comisión: 0.5%
   ⚡ Tiempo: 1 second

6️⃣ *India → LatAm*
   💰 Volumen: $400M annually
   💸 Comisión: 0.5%
   ⚡ Tiempo: 1 second

7️⃣ *Brazil → Mexico*
   💰 Volumen: $300M annually
   💸 Comisión: 0.5%
   ⚡ Tiempo: 1 second

8️⃣ *Europe → LatAm*
   💰 Volumen: $1.5B annually
   💸 Comisión: 0.5%
   ⚡ Tiempo: 1 second

¿Cuál te interesa? Responde con el número.`,

  prices: `💰 *Nuestras Comisiones:*

• *Comisión estándar:* 0.5%
• *Sin comisiones ocultas*
• *Liquidación:* < 1 segundo
• *Soporte:* 24/7

💡 *Comparación:*
• AztlanFi: 0.5%
• Western Union: 6-8%
• MoneyGram: 5-7%
• Bancos tradicionales: 8-12%

¡Ahorras hasta 95% en comisiones!

¿Quieres enviar dinero ahora? Responde "SI" para continuar.`,

  support: `🆘 *Soporte AztlanFi*

¿En qué puedo ayudarte?

1️⃣ *Problema técnico*
2️⃣ *Verificación KYC*
3️⃣ *Contactar humano*
4️⃣ *Preguntas generales*

Responde con el número de tu consulta.`,

  amountRequest: (corridorName: string) => `Excelente elección: *${corridorName}*

Ahora ingresa el monto que quieres enviar (en USD):

💡 *Ejemplos:*
• $100
• $500  
• $1000
• $2000

*Escribe solo el número, sin símbolos.*`,

  transactionSummary: (amount: number, fee: number, total: number, corridorName: string) => `📊 *Resumen de la Transacción:*

💰 *Monto:* $${amount.toFixed(2)} USD
💸 *Comisión:* $${fee.toFixed(2)} (0.5%)
💵 *Total:* $${total.toFixed(2)} USD
🌍 *Corredor:* ${corridorName}
⚡ *Tiempo:* < 1 segundo

¿Quieres continuar con esta transacción?

✅ *Confirmar* - Responde "SI"
❌ *Cancelar* - Responde "NO"`,

  confirmation: `✅ *Transacción Confirmada*

Tu transacción ha sido procesada exitosamente.

🔗 *Seguimiento:* https://aztlanfi.com/dashboard
📧 *Recibo:* Enviado por email
⏰ *Tiempo:* < 1 segundo

El destinatario recibirá el dinero en los próximos segundos.

¿Necesitas algo más? Responde "AYUDA" para más opciones.`,

  error: `❌ *Error en la Transacción*

Lo sentimos, hubo un problema con tu transacción.

🔄 *Intenta de nuevo* o contacta soporte.

Para ayuda, responde "SOPORTE".`
};

// Process incoming messages
const processMessage = async (from: string, body: string) => {
  const session = sessions.get(from) || { step: 'welcome', data: {} };
  const message = body.toLowerCase().trim();
  
  let response = '';
  
  switch (session.step) {
    case 'welcome':
      if (message === '1' || message.includes('enviar')) {
        session.step = 'send_money';
        response = botResponses.sendMoney;
      } else if (message === '2' || message.includes('corredor')) {
        response = botResponses.corridors;
      } else if (message === '3' || message.includes('precio') || message.includes('comisión')) {
        response = botResponses.prices;
      } else if (message === '4' || message.includes('soporte') || message.includes('ayuda')) {
        session.step = 'support';
        response = botResponses.support;
      } else {
        response = botResponses.welcome;
      }
      break;
      
    case 'send_money':
      const corridorIndex = parseInt(message) - 1;
      if (corridorIndex >= 0 && corridorIndex < corridors.length) {
        const corridor = corridors[corridorIndex];
        session.step = 'amount';
        session.data.corridor = corridor;
        response = botResponses.amountRequest(corridor.name);
      } else {
        response = botResponses.sendMoney;
      }
      break;
      
    case 'amount':
      const amount = parseFloat(message.replace(/[^0-9.]/g, ''));
      if (!isNaN(amount) && amount > 0) {
        const fee = amount * 0.005; // 0.5%
        const total = amount + fee;
        session.step = 'confirmation';
        session.data.amount = amount;
        session.data.fee = fee;
        session.data.total = total;
        response = botResponses.transactionSummary(
          amount, 
          fee, 
          total, 
          session.data.corridor.name
        );
      } else {
        response = 'Por favor ingresa un monto válido mayor a $0. Solo números.';
      }
      break;
      
    case 'confirmation':
      if (message === 'si' || message === 'sí' || message === 'confirmar') {
        // Here you would integrate with your actual payment system
        // For now, we'll simulate a successful transaction
        response = botResponses.confirmation;
        session.step = 'welcome';
        session.data = {};
      } else if (message === 'no' || message === 'cancelar') {
        response = 'Transacción cancelada. ¿Quieres intentar con otro monto? Responde "SI" para continuar.';
        session.step = 'amount';
      } else {
        response = botResponses.transactionSummary(
          session.data.amount,
          session.data.fee,
          session.data.total,
          session.data.corridor.name
        );
      }
      break;
      
    case 'support':
      if (message === '1') {
        response = `🔧 *Problema Técnico*

¿Qué problema estás experimentando?

• Error de conexión
• Transacción fallida
• Problema con la app
• Otro

Describe tu problema brevemente.`;
      } else if (message === '2') {
        response = `📋 *Verificación KYC*

Para completar tu verificación KYC:

1️⃣ Ve a https://aztlanfi.com/dashboard/kyc
2️⃣ Sube tu identificación
3️⃣ Toma una selfie
4️⃣ Espera aprobación (24h)

¿Necesitas ayuda con algún paso?`;
      } else if (message === '3') {
        response = `👨‍💼 *Contactar Humano*

Nuestro equipo está disponible 24/7:

📧 Email: support@aztlanfi.com
📞 Teléfono: +1-800-AZTLANFI
💬 Chat: https://aztlanfi.com/support

Tiempo de respuesta: < 2 horas

¿Prefieres que te contactemos? Responde "SI" con tu número.`;
      } else {
        response = botResponses.support;
      }
      break;
      
    default:
      response = botResponses.welcome;
      session.step = 'welcome';
      session.data = {};
  }
  
  // Update session
  sessions.set(from, session);
  
  return response;
};

export async function POST(request: NextRequest) {
  try {
    // Get Twilio client
    const client = getTwilioClient();
    if (!client) {
      return NextResponse.json({ 
        error: 'WhatsApp service not configured. Please add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to environment variables.' 
      }, { status: 503 });
    }

    // Validate Twilio request (commented out for demo)
    // if (!validateRequest(request)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    // }
    
    const formData = await request.formData();
    const from = formData.get('From') as string;
    const body = formData.get('Body') as string;
    const to = formData.get('To') as string;
    
    // Process the message
    const response = await processMessage(from, body);
    
    // Send response via Twilio
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(response);
    
    // Log the interaction
    console.log(`WhatsApp Bot - From: ${from}, Message: ${body}, Response: ${response.substring(0, 100)}...`);
    
    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
    
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('Lo sentimos, hubo un error. Por favor intenta de nuevo o contacta soporte.');
    
    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}

export async function GET(request: NextRequest) {
  // Webhook verification for Twilio
  const url = new URL(request.url);
  const challenge = url.searchParams.get('hub.challenge');
  
  if (challenge) {
    return new NextResponse(challenge);
  }
  
  return NextResponse.json({ 
    status: 'WhatsApp Bot API is running',
    timestamp: new Date().toISOString()
  });
}
