const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Permitir que Flask consulte el QR

// Inicializar el cliente de WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox']
    }
});

let isReady = false;
let currentQR = null;
let isAuthenticated = false;

// Evento: Generar QR
client.on('qr', async (qr) => {
    console.log('🔄 Nuevo QR generado (listo para verse en la web)');
    try {
        currentQR = await qrcode.toDataURL(qr);
    } catch (err) {
        console.error("Error generando imagen QR:", err);
    }
});

// Evento: Autenticado
client.on('authenticated', () => {
    console.log('✅ WhatsApp Autenticado correctamente!');
    isAuthenticated = true;
    currentQR = null; // Borrar QR
});

// Evento: Listo
client.on('ready', () => {
    console.log('✅ Cliente de WhatsApp está LISTO para enviar mensajes!');
    isReady = true;
});

// Lista de administradores autorizados para crear órdenes vía WhatsApp
// El formato debe terminar en @c.us. Ejemplo para 3133288298 -> '573133288298@c.us'
const AUTHORIZED_NUMBERS = [
    '573133288298@c.us'
];

// Evento: Mensaje entrante
client.on('message', async msg => {
    // Ignorar mensajes de grupos, estados o del propio bot
    if (msg.isStatus || msg.author || msg.fromMe) return;
    
    // Si el mensaje viene de un administrador autorizado
    if (AUTHORIZED_NUMBERS.includes(msg.from)) {
        console.log(`\n👑 [ORDEN VIP RECIBIDA] de ${msg.from}: ${msg.body}`);
        await msg.reply("🤖 Recibido. Despertando a la IA para crear tu orden en Skydropx...");
        
        try {
            // Mandamos el texto al backend interno de Flask
            const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
            
            const response = await fetch("http://127.0.0.1:5000/api/internal/whatsapp_order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ texto: msg.body })
            });
            
            const result = await response.json();
            
            if (result.success) {
                await msg.reply(result.message);
            } else {
                await msg.reply("❌ Error creando la orden: " + result.error);
            }
        } catch (error) {
            console.error(error);
            await msg.reply("❌ Ocurrió un error conectando con el servidor local Flask.");
        }
    } else {
        // Si el cliente responde, simplemente lo ignoramos (no se envía aviso)
        console.log(`📩 Mensaje ignorado de cliente normal (${msg.from}): ${msg.body}`);
    }
});

// Endpoint para que la web pregunte por el QR
app.get('/api/get_qr', (req, res) => {
    res.json({
        ready: isReady,
        authenticated: isAuthenticated,
        qr_image: currentQR
    });
});

// Evento: Error
client.on('auth_failure', msg => {
    console.error('❌ Error de autenticación:', msg);
});

// Iniciar WhatsApp
client.initialize();

// Crear un servidor Express local en el puerto 5001 para recibir peticiones de Flask
app.post('/api/send_message', async (req, res) => {
    if (!isReady) {
        return res.status(503).json({ error: "WhatsApp aún no está listo. Escanea el QR." });
    }

    const { number, message } = req.body;

    if (!number || !message) {
        return res.status(400).json({ error: "Faltan datos: number y message" });
    }

    // Formatear el número (eliminar el +, espacios, y agregar @c.us al final)
    // Ejemplo de número entrante: +573000000000 -> 573000000000@c.us
    const formattedNumber = number.replace(/\D/g, '') + "@c.us";

    try {
        await client.sendMessage(formattedNumber, message);
        console.log(`💬 Mensaje enviado a ${number}: ${message}`);
        res.json({ success: true, status: "Mensaje enviado" });
    } catch (error) {
        console.error("❌ Error enviando mensaje:", error);
        res.status(500).json({ success: false, error: error.toString() });
    }
});

app.listen(5001, () => {
    console.log('🚀 API Local de WhatsApp escuchando en http://127.0.0.1:5001');
});
