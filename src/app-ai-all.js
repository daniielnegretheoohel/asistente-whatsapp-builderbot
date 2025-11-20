import 'dotenv/config'
import { createBot, createProvider, createFlow, addKeyword } from '@builderbot/bot'
import { JsonFileDB as Database } from '@builderbot/database-json'
import { TwilioProvider } from '@builderbot/provider-twilio'
import { MetaProvider } from '@builderbot/provider-meta'
import { chatWithAssistant, verifyOpenAIConfig, getStats } from './openai-service.js'

const PORT = process.env.PORT ?? 3008

// Flow principal: Maneja TODOS los mensajes con IA
const aiFlow = addKeyword([''])
    .addAction(async (ctx, { flowDynamic }) => {
        try {
            const userId = ctx.from
            const userMessage = ctx.body
            const platform = ctx.provider || 'desconocido'

            console.log(`💬 [${platform} - ${userId}]: ${userMessage}`)

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
    console.log('🚀 Iniciando BuilderBot MULTI-CANAL: WhatsApp + Facebook Messenger...')
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

    console.log('')
    console.log('📋 Configuración Global:')
    console.log(`   🤖 OpenAI Assistant ID: ${process.env.ASSISTANT_ID}`)
    console.log(`   🌐 Puerto: ${PORT}`)
    console.log('')

    // Crear flujos (compartidos entre ambos providers)
    const adapterFlow = createFlow([aiFlow, adminFlow])

    // Crear base de datos compartida
    const adapterDB = new Database({ filename: 'db-multicanal.json' })

    // ==============================
    // PROVIDER 1: WHATSAPP (Twilio)
    // ==============================
    let twilioProvider = null
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
        console.log('📱 Configurando WhatsApp (Twilio)...')
        console.log(`   📞 Account SID: ${process.env.TWILIO_ACCOUNT_SID}`)
        console.log(`   📱 Número: ${process.env.TWILIO_PHONE_NUMBER}`)

        twilioProvider = createProvider(TwilioProvider, {
            accountSid: process.env.TWILIO_ACCOUNT_SID,
            authToken: process.env.TWILIO_AUTH_TOKEN,
            vendorNumber: process.env.TWILIO_PHONE_NUMBER,
            publicUrl: process.env.PUBLIC_URL || `http://localhost:${PORT}`,
        })

        console.log('   ✅ WhatsApp configurado')
        console.log(`   🔗 Webhook: ${process.env.PUBLIC_URL || `http://localhost:${PORT}`}/webhook`)
        console.log('')
    } else {
        console.log('⚠️  WhatsApp (Twilio) NO configurado - faltan credenciales')
        console.log('')
    }

    // ===================================
    // PROVIDER 2: FACEBOOK (Meta)
    // ===================================
    let metaProvider = null
    if (process.env.META_PAGE_ACCESS_TOKEN && process.env.META_VERIFY_TOKEN) {
        console.log('📘 Configurando Facebook Messenger (Meta)...')
        console.log(`   📘 Page ID: ${process.env.META_PAGE_ID || 'No especificado'}`)
        console.log(`   🔐 Verify Token: ${process.env.META_VERIFY_TOKEN}`)

        metaProvider = createProvider(MetaProvider, {
            jwtToken: process.env.META_PAGE_ACCESS_TOKEN,
            numberId: process.env.META_PAGE_ID,
            verifyToken: process.env.META_VERIFY_TOKEN,
            version: 'v21.0',
        })

        console.log('   ✅ Facebook Messenger configurado')
        console.log(`   🔗 Webhook: ${process.env.PUBLIC_URL || `http://localhost:${PORT}`}/webhook`)
        console.log('')
    } else {
        console.log('⚠️  Facebook (Meta) NO configurado - faltan credenciales')
        console.log('')
    }

    // Verificar que al menos un provider esté configurado
    if (!twilioProvider && !metaProvider) {
        console.error('')
        console.error('❌ ERROR: No hay ningún provider configurado')
        console.error('   Debes configurar al menos WhatsApp (Twilio) O Facebook (Meta)')
        console.error('')
        process.exit(1)
    }

    // ====================================
    // CREAR BOT CON PROVIDERS ACTIVOS
    // ====================================
    // BuilderBot permite múltiples providers, usamos el primero disponible
    const activeProvider = twilioProvider || metaProvider

    const { httpServer } = await createBot({
        flow: adapterFlow,
        provider: activeProvider,
        database: adapterDB,
    })

    console.log('═══════════════════════════════════════════════════════')
    console.log('✅ Bot MULTI-CANAL iniciado correctamente')
    console.log('═══════════════════════════════════════════════════════')
    console.log('')

    if (twilioProvider) {
        console.log('📱 WhatsApp (Twilio): ACTIVO')
        console.log('   💡 Envía un mensaje a tu número de Twilio para probar')
    }

    if (metaProvider) {
        console.log('📘 Facebook Messenger (Meta): ACTIVO')
        console.log('   💡 Envía un mensaje a tu página de Facebook para probar')
    }

    console.log('')
    console.log('🔧 Comandos disponibles:')
    console.log('   /stats - Ver estadísticas del bot')
    console.log('')
    console.log('⚠️  IMPORTANTE: Ambos providers usan el mismo webhook:')
    console.log(`   ${process.env.PUBLIC_URL || `http://localhost:${PORT}`}/webhook`)
    console.log('')

    // Iniciar servidor HTTP
    httpServer(+PORT)
}

main()
