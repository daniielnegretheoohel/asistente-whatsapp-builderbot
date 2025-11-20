import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import axios from 'axios'
import { chatWithAssistant, verifyOpenAIConfig } from './openai-service.js'

const app = express()
const PORT = process.env.PORT || 3008

// Configuración
const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN
const PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN
const APP_SECRET = process.env.META_APP_SECRET

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// ============================================
// WEBHOOK VERIFICATION (GET)
// ============================================
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode']
    const token = req.query['hub.verify_token']
    const challenge = req.query['hub.challenge']

    console.log('📞 Webhook verification request:')
    console.log(`   Mode: ${mode}`)
    console.log(`   Token recibido: ${token}`)
    console.log(`   Token esperado: ${VERIFY_TOKEN}`)
    console.log(`   Challenge: ${challenge}`)

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('✅ Webhook verificado correctamente')
        res.status(200).send(challenge)
    } else {
        console.error('❌ Verificación fallida')
        res.sendStatus(403)
    }
})

// ============================================
// WEBHOOK MESSAGES (POST)
// ============================================
app.post('/webhook', async (req, res) => {
    const body = req.body

    console.log('📨 Webhook POST recibido')

    // Verificar que sea de una página
    if (body.object === 'page') {
        // Iterar por cada entrada (puede haber múltiples)
        for (const entry of body.entry) {
            // Obtener el evento de mensaje
            const webhookEvent = entry.messaging[0]
            console.log('📬 Evento:', JSON.stringify(webhookEvent, null, 2))

            // Obtener el sender ID
            const senderPsid = webhookEvent.sender.id

            // Verificar si es un mensaje
            if (webhookEvent.message) {
                await handleMessage(senderPsid, webhookEvent.message)
            }
        }

        // Responder rápido a Facebook (200 OK)
        res.status(200).send('EVENT_RECEIVED')
    } else {
        res.sendStatus(404)
    }
})

// ============================================
// MANEJAR MENSAJES
// ============================================
async function handleMessage(senderPsid, receivedMessage) {
    let response

    // Obtener el texto del mensaje
    if (receivedMessage.text) {
        const userMessage = receivedMessage.text
        console.log(`💬 [${senderPsid}]: ${userMessage}`)

        try {
            // Enviar indicador de "escribiendo..."
            await sendTypingIndicator(senderPsid, true)

            // Obtener respuesta de OpenAI
            const aiResponse = await chatWithAssistant(senderPsid, userMessage)

            // Desactivar indicador de "escribiendo..."
            await sendTypingIndicator(senderPsid, false)

            // Preparar respuesta
            response = {
                text: aiResponse
            }

            console.log(`🤖 Respuesta: ${aiResponse}`)

        } catch (error) {
            console.error('❌ Error al procesar con OpenAI:', error.message)
            response = {
                text: 'Lo siento, tuve un problema al procesar tu mensaje. Por favor, intenta de nuevo.'
            }
        }
    } else {
        // Mensaje no soportado (imagen, audio, etc.)
        response = {
            text: 'Recibí tu mensaje, pero solo puedo procesar texto por ahora.'
        }
    }

    // Enviar respuesta
    await callSendAPI(senderPsid, response)
}

// ============================================
// ENVIAR MENSAJE A FACEBOOK
// ============================================
async function callSendAPI(senderPsid, response) {
    const requestBody = {
        recipient: {
            id: senderPsid
        },
        message: response
    }

    try {
        await axios.post(
            `https://graph.facebook.com/v21.0/me/messages`,
            requestBody,
            {
                params: { access_token: PAGE_ACCESS_TOKEN }
            }
        )
        console.log('✅ Mensaje enviado correctamente')
    } catch (error) {
        console.error('❌ Error al enviar mensaje:', error.response?.data || error.message)
    }
}

// ============================================
// ENVIAR INDICADOR DE "ESCRIBIENDO..."
// ============================================
async function sendTypingIndicator(senderPsid, isTyping) {
    const requestBody = {
        recipient: {
            id: senderPsid
        },
        sender_action: isTyping ? 'typing_on' : 'typing_off'
    }

    try {
        await axios.post(
            `https://graph.facebook.com/v21.0/me/messages`,
            requestBody,
            {
                params: { access_token: PAGE_ACCESS_TOKEN }
            }
        )
    } catch (error) {
        console.error('❌ Error al enviar typing indicator:', error.response?.data || error.message)
    }
}

// ============================================
// RUTA DE HEALTH CHECK
// ============================================
app.get('/', (req, res) => {
    res.send('🤖 Bot de Facebook Messenger con OpenAI - Funcionando correctamente')
})

// ============================================
// INICIAR SERVIDOR
// ============================================
const main = async () => {
    console.log('🚀 Iniciando Bot de Facebook Messenger con OpenAI...')
    console.log('')

    // Verificar configuración de OpenAI
    if (!verifyOpenAIConfig()) {
        console.error('')
        console.error('⚠️  Por favor, configura tus credenciales de OpenAI en el archivo .env')
        console.error('📝 Ejemplo:')
        console.error('   OPENAI_API_KEY=sk-...')
        console.error('   ASSISTANT_ID=asst_...')
        console.error('')
        process.exit(1)
    }

    // Verificar configuración de Meta
    if (!VERIFY_TOKEN || !PAGE_ACCESS_TOKEN || !APP_SECRET) {
        console.error('')
        console.error('⚠️  Por favor, configura tus credenciales de Meta en el archivo .env')
        console.error('📝 Ejemplo:')
        console.error('   META_PAGE_ACCESS_TOKEN=EAA...')
        console.error('   META_VERIFY_TOKEN=tu_token_secreto')
        console.error('   META_APP_SECRET=...')
        console.error('')
        process.exit(1)
    }

    console.log('📋 Configuración:')
    console.log(`   🤖 OpenAI Assistant ID: ${process.env.ASSISTANT_ID}`)
    console.log(`   📘 Meta Page ID: ${process.env.META_PAGE_ID || 'No especificado'}`)
    console.log(`   🔐 Meta Verify Token: ${VERIFY_TOKEN}`)
    console.log(`   🌐 Puerto: ${PORT}`)
    console.log('')

    app.listen(PORT, () => {
        console.log('═══════════════════════════════════════════════════════')
        console.log('✅ Bot de Facebook Messenger iniciado correctamente')
        console.log('═══════════════════════════════════════════════════════')
        console.log('')
        console.log(`🌐 Servidor escuchando en puerto ${PORT}`)
        console.log('')
        console.log('⚠️  IMPORTANTE: Configura el webhook en Meta for Developers:')
        console.log(`   URL: ${process.env.PUBLIC_URL || `http://localhost:${PORT}`}/webhook`)
        console.log(`   Verify Token: ${VERIFY_TOKEN}`)
        console.log('   Eventos: messages, messaging_postbacks')
        console.log('')
        console.log('📘 Envía un mensaje a tu página "Plane" en Facebook para probar')
        console.log('')
    })
}

main()
