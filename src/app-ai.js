import 'dotenv/config'
import { createBot, createProvider, createFlow, addKeyword } from '@builderbot/bot'
import { JsonFileDB as Database } from '@builderbot/database-json'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
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
    console.log('🚀 Iniciando BuilderBot con OpenAI Assistant...')
    console.log('')

    // Verificar configuración antes de iniciar
    if (!verifyOpenAIConfig()) {
        console.error('')
        console.error('⚠️  Por favor, configura tus credenciales en el archivo .env')
        console.error('📝 Ejemplo:')
        console.error('   OPENAI_API_KEY=sk-...')
        console.error('   ASSISTANT_ID=asst_...')
        console.error('')
        process.exit(1)
    }

    console.log('')
    console.log('📋 Configuración:')
    console.log(`   🤖 Assistant ID: ${process.env.ASSISTANT_ID}`)
    console.log(`   🌐 Puerto: ${PORT}`)
    console.log('')

    // Crear flujos
    const adapterFlow = createFlow([aiFlow, adminFlow])

    // Crear provider (WhatsApp con Baileys)
    const adapterProvider = createProvider(Provider)

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
    console.log('📱 Escanea el código QR para vincular WhatsApp')
    console.log('💡 Una vez conectado, envía cualquier mensaje y el asistente responderá')
    console.log('')
    console.log('🔧 Comandos disponibles:')
    console.log('   /stats - Ver estadísticas del bot')
    console.log('')

    // Iniciar servidor HTTP
    httpServer(+PORT)
}

main()
