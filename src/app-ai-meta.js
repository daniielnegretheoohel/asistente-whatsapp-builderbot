import 'dotenv/config'
import { createBot, createProvider, createFlow, addKeyword } from '@builderbot/bot'
import { JsonFileDB as Database } from '@builderbot/database-json'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import { chatWithAssistant, verifyOpenAIConfig, getStats } from './openai-service.js'

const PORT = process.env.PORT ?? 3008

// Flow principal: Maneja TODOS los mensajes con IA
const aiFlow = addKeyword([''])
    .addAction(async (ctx, { flowDynamic }) => {
        try {
            const userId = ctx.from
            const userMessage = ctx.body

            console.log(`💬 [Facebook - ${userId}]: ${userMessage}`)

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
    console.log('🚀 Iniciando BuilderBot con OpenAI + Facebook Messenger...')
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

    // Verificar configuración de Meta (Facebook)
    if (!process.env.META_PAGE_ACCESS_TOKEN || !process.env.META_VERIFY_TOKEN || !process.env.META_APP_SECRET) {
        console.error('')
        console.error('⚠️  Por favor, configura tus credenciales de Meta en el archivo .env')
        console.error('📝 Ejemplo:')
        console.error('   META_PAGE_ACCESS_TOKEN=EAA...')
        console.error('   META_VERIFY_TOKEN=tu_token_secreto')
        console.error('   META_APP_SECRET=...')
        console.error('')
        process.exit(1)
    }

    console.log('')
    console.log('📋 Configuración:')
    console.log(`   🤖 OpenAI Assistant ID: ${process.env.ASSISTANT_ID}`)
    console.log(`   📘 Meta Page ID: ${process.env.META_PAGE_ID || 'No especificado'}`)
    console.log(`   🔐 Meta Verify Token: ${process.env.META_VERIFY_TOKEN}`)
    console.log(`   🌐 Puerto: ${PORT}`)
    console.log('')

    // Crear flujos
    const adapterFlow = createFlow([aiFlow, adminFlow])

    // Crear provider de Meta para Facebook Messenger
    const adapterProvider = createProvider(Provider, {
        jwtToken: process.env.META_PAGE_ACCESS_TOKEN,
        numberId: process.env.META_PAGE_ID,
        verifyToken: process.env.META_VERIFY_TOKEN,
        version: 'v21.0',
    })

    console.log('✅ Provider de Meta (Facebook) configurado')
    console.log('')
    console.log('⚠️  IMPORTANTE: Configura el webhook en Meta for Developers:')
    console.log(`   URL: ${process.env.PUBLIC_URL || `http://localhost:${PORT}`}/webhook`)
    console.log('   Método: POST')
    console.log(`   Verify Token: ${process.env.META_VERIFY_TOKEN}`)
    console.log('')

    // Crear base de datos
    const adapterDB = new Database({ filename: 'db-meta.json' })

    // Crear el bot
    const { httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    console.log('✅ Bot iniciado correctamente')
    console.log('')
    console.log('📘 El bot está listo para recibir mensajes de Facebook Messenger')
    console.log('💡 Envía un mensaje a tu página de Facebook para probar')
    console.log('')
    console.log('🔧 Comandos disponibles:')
    console.log('   /stats - Ver estadísticas del bot')
    console.log('')

    // Iniciar servidor HTTP
    httpServer(+PORT)
}

main()
