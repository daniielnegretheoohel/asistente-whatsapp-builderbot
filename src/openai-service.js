import 'dotenv/config'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

// Almacén de threads por usuario (en memoria)
// Para producción, usar una base de datos
const userThreads = new Map()

/**
 * Interactúa con el OpenAI Assistant
 * @param {string} userId - ID del usuario (número de teléfono)
 * @param {string} userMessage - Mensaje del usuario
 * @returns {Promise<string>} Respuesta del asistente
 */
export const chatWithAssistant = async (userId, userMessage) => {
    try {
        // Obtener o crear thread para este usuario
        let threadId = userThreads.get(userId)

        if (!threadId) {
            const thread = await openai.beta.threads.create()
            threadId = thread.id
            userThreads.set(userId, threadId)
            console.log(`🆕 Nuevo thread creado para usuario ${userId}: ${threadId}`)
        }

        // Agregar mensaje del usuario al thread
        await openai.beta.threads.messages.create(threadId, {
            role: 'user',
            content: userMessage
        })

        console.log(`📝 Mensaje agregado al thread ${threadId}`)

        // Ejecutar el asistente
        const run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: process.env.ASSISTANT_ID
        })

        console.log(`🏃 Run creado: ${run.id} para thread ${threadId}`)

        // Esperar a que el asistente complete la respuesta
        console.log(`🔍 Antes de retrieve - threadId: ${threadId}, run.id: ${run.id}`)
        let runStatus = await openai.beta.threads.runs.retrieve(
            threadId,
            run.id
        )

        console.log(`📊 Estado inicial del run: ${runStatus.status}`)

        // Polling para esperar la respuesta (máximo 30 segundos)
        let attempts = 0
        const maxAttempts = 30

        while (runStatus.status !== 'completed' && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000))
            runStatus = await openai.beta.threads.runs.retrieve(
                threadId,
                run.id
            )
            attempts++

            if (runStatus.status === 'failed') {
                throw new Error('El asistente falló al procesar el mensaje')
            }

            if (runStatus.status === 'cancelled') {
                throw new Error('La ejecución fue cancelada')
            }

            if (runStatus.status === 'expired') {
                throw new Error('La ejecución expiró')
            }
        }

        if (attempts >= maxAttempts) {
            throw new Error('Timeout esperando respuesta del asistente')
        }

        // Obtener la respuesta
        const messages = await openai.beta.threads.messages.list(threadId)
        const lastMessage = messages.data[0]

        if (!lastMessage || !lastMessage.content || !lastMessage.content[0]) {
            throw new Error('No se recibió respuesta del asistente')
        }

        const response = lastMessage.content[0].text.value

        console.log(`✅ Respuesta generada para usuario ${userId}`)

        return response

    } catch (error) {
        console.error(`❌ Error en chatWithAssistant para usuario ${userId}:`, error.message)

        // Eliminar thread corrupto si existe
        if (error.message.includes('falló') || error.message.includes('Timeout')) {
            userThreads.delete(userId)
        }

        throw error
    }
}

/**
 * Verifica que las credenciales de OpenAI estén configuradas
 * @returns {boolean} true si está todo configurado
 */
export const verifyOpenAIConfig = () => {
    if (!process.env.OPENAI_API_KEY) {
        console.error('❌ OPENAI_API_KEY no está configurada en .env')
        return false
    }

    if (!process.env.ASSISTANT_ID) {
        console.error('❌ ASSISTANT_ID no está configurado en .env')
        return false
    }

    console.log('✅ Configuración de OpenAI verificada')
    return true
}

/**
 * Limpia el thread de un usuario (útil para resetear la conversación)
 * @param {string} userId - ID del usuario
 */
export const clearUserThread = (userId) => {
    userThreads.delete(userId)
    console.log(`🗑️ Thread eliminado para usuario ${userId}`)
}

/**
 * Obtiene estadísticas de uso
 * @returns {object} Estadísticas
 */
export const getStats = () => {
    return {
        activeThreads: userThreads.size,
        users: Array.from(userThreads.keys())
    }
}
