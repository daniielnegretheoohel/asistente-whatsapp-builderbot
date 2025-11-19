import 'dotenv/config'
import { createBot, createProvider, createFlow, addKeyword } from '@builderbot/bot'
import { JsonFileDB as Database } from '@builderbot/database-json'
import { TwilioProvider as Provider } from '@builderbot/provider-twilio'
import { chatWithAssistant, verifyOpenAIConfig, getStats } from './openai-service.js'

const PORT = process.env.PORT ?? 3008

// Flow principal: Maneja TODOS los mensajes con IA
const aiFlow = addKeyword([''])
    .addAction(async (ctx, { flowDynamic }) => {
        try {
            const userId = ctx.from
            const userMessage = ctx.body

            console.log(`💬 [${userId}]: ${userMessage}`)

            // Indicador de que está escribiendo (opcional)
            await flowDynamic([{ body: '⏳ Procesando...', delay: 500 }])

            // Obtener respuesta del asistente de OpenAI
            const response = await chatWithAssistant(userId, userMessage)

            // Enviar respuesta al usuario
            await flowDynamic([{ body: response }])

        } catch (error) {
            console.error('❌ Error:', error.message)

            await flowDynamic([
                {
                    body: 'Lo siento, tuve un problema al procesar tu mensaje. Por favor, intenta de nuevo en unos momentos.'
                }
            ])
        }
    })

// Flow de comandos administrativos (opcional)
const adminFlow = addKeyword(['/stats', '/estadisticas'])
    .addAction(async (_, { flowDynamic }) => {
        const stats = getStats()
        await flowDynamic([
            { body: `📊 *Estadísticas del Bot*\n\n` +
                   `👥 Usuarios activos: ${stats.activeThreads}\n` +
                   `💬 Conversaciones en memoria: ${stats.activeThreads}`
            }
        ])
    })

const main = async () => {
    console.log('🚀 Iniciando BuilderBot con OpenAI + Twilio WhatsApp...')
    console.log('')

    // Verificar configuración de OpenAI antes de iniciar
    if (!verifyOpenAIConfig()) {
        console.error('')
        console.error('⚠️  Por favor, configura tus credenciales de OpenAI en el archivo .env')
        console.error('📝 Ejemplo:')
        console.error('   OPENAI_API_KEY=sk-...')
        console.error('   ASSISTANT_ID=asst_...')
        console.error('')
        process.exit(1)
    }

    // Verificar configuración de Twilio
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
        console.error('')
        console.error('⚠️  Por favor, configura tus credenciales de Twilio en el archivo .env')
        console.error('📝 Ejemplo:')
        console.error('   TWILIO_ACCOUNT_SID=AC...')
        console.error('   TWILIO_AUTH_TOKEN=...')
        console.error('   TWILIO_PHONE_NUMBER=whatsapp:+14155238886')
        console.error('')
        process.exit(1)
    }

    console.log('')
    console.log('📋 Configuración:')
    console.log(`   🤖 OpenAI Assistant ID: ${process.env.ASSISTANT_ID}`)
    console.log(`   📞 Twilio Account SID: ${process.env.TWILIO_ACCOUNT_SID}`)
    console.log(`   📱 Número WhatsApp: ${process.env.TWILIO_PHONE_NUMBER}`)
    console.log(`   🌐 Puerto: ${PORT}`)
    console.log('')

    // Crear flujos
    const adapterFlow = createFlow([aiFlow, adminFlow])

    // Crear provider de Twilio para WhatsApp
    const adapterProvider = createProvider(Provider, {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        vendorNumber: process.env.TWILIO_PHONE_NUMBER,
        publicUrl: process.env.PUBLIC_URL || `http://localhost:${PORT}`, // Webhook URL
    })

    console.log('✅ Provider de Twilio configurado')
    console.log('')
    console.log('⚠️  IMPORTANTE: Configura el webhook en Twilio:')
    console.log(`   URL: ${process.env.PUBLIC_URL || `http://localhost:${PORT}`}/twilio/hook`)
    console.log('   Método: POST')
    console.log('')

    // Crear base de datos
    const adapterDB = new Database({ filename: 'db.json' })

    // Crear el bot
    const { httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    console.log('✅ Bot iniciado correctamente')
    console.log('')
    console.log('📱 El bot está listo para recibir mensajes de WhatsApp')
    console.log('💡 Envía un mensaje al número de Twilio para probar')
    console.log('')
    console.log('🔧 Comandos disponibles:')
    console.log('   /stats - Ver estadísticas del bot')
    console.log('')

    // Iniciar servidor HTTP
    httpServer(+PORT)
}

main()
