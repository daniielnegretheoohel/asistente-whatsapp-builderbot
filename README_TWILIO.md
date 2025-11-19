# 🤖 Bot de WhatsApp con OpenAI Assistants + Twilio

Chatbot de WhatsApp potenciado por OpenAI Assistants API usando BuilderBot framework y Twilio WhatsApp Business API.

## 🌟 Características

- ✅ Integración completa con **OpenAI Assistants API**
- ✅ Provider **Twilio** (oficial WhatsApp Business API)
- ✅ Memoria conversacional por usuario
- ✅ Manejo automático de hilos (threads)
- ✅ Limpieza automática de sesiones inactivas
- ✅ Listo para producción
- ✅ Funciona en cualquier hosting (Railway, Render, AWS, etc.)

## 📋 Prerrequisitos

- Node.js 18+ instalado
- Cuenta de OpenAI con crédito disponible
- Cuenta de Twilio (gratis para empezar)
- Ngrok para desarrollo local (gratis)

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/daniielnegretheoohel/asistente-whatsapp-builderbot.git
cd asistente-whatsapp-builderbot
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.twilio.example .env
```

Edita `.env` con tus credenciales:

```env
# OpenAI
OPENAI_API_KEY=sk-proj-tu_api_key
ASSISTANT_ID=asst_tu_assistant_id

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_PHONE_NUMBER=whatsapp:+14155238886

# Servidor
PORT=3008
PUBLIC_URL=https://tu-url-publica.com
```

### 4. Configurar OpenAI Assistant

1. Ve a: https://platform.openai.com/assistants
2. Crea un nuevo Assistant
3. Configura:
   - **Nombre**: Tu nombre preferido
   - **Instrucciones**: Define el comportamiento del bot
   - **Modelo**: gpt-4 o gpt-4-turbo
4. Copia el **Assistant ID** y agrégalo al `.env`

### 5. Configurar Twilio Sandbox

Ver la **[GUIA_TWILIO.md](./GUIA_TWILIO.md)** para instrucciones completas.

**Resumen rápido**:

1. Crea cuenta en: https://www.twilio.com/try-twilio
2. Ve a: https://console.twilio.com
3. Copia **Account SID** y **Auth Token**
4. Ve a **Messaging** → **Try WhatsApp** → **Send a WhatsApp message**
5. Únete al Sandbox enviando el mensaje indicado desde tu WhatsApp
6. Copia el número de Sandbox (ejemplo: `whatsapp:+14155238886`)

### 6. Iniciar el bot

```bash
npm run start:twilio
```

### 7. Exponer el servidor con ngrok

En otra terminal:

```bash
ngrok http 3008
```

Copia la URL de ngrok (ejemplo: `https://abc123.ngrok-free.app`) y:

1. Agrégala a tu `.env` como `PUBLIC_URL`
2. Reinicia el bot
3. Configura el webhook en Twilio:
   - URL: `https://abc123.ngrok-free.app/twilio/hook`
   - Método: POST

### 8. ¡Probar!

Envía un mensaje de WhatsApp al número de Twilio Sandbox y el bot responderá usando OpenAI.

## 📁 Estructura del Proyecto

```
asistente_builder/
├── src/
│   ├── app-ai-twilio.js      # Bot principal con Twilio
│   ├── openai-service.js     # Servicio de OpenAI
│   └── app-ai.js             # Bot original con Baileys (deprecado)
├── .env.twilio.example       # Template de variables de entorno
├── Dockerfile.twilio         # Docker para Twilio
├── package.json              # Dependencias
├── GUIA_TWILIO.md           # Guía completa de setup
└── README_TWILIO.md         # Este archivo
```

## 🛠️ Scripts Disponibles

```bash
npm run start:twilio    # Iniciar bot con Twilio
npm run dev:twilio      # Modo desarrollo (con auto-reload)
npm run start:ai        # Iniciar bot con Baileys (deprecado)
```

## 🐳 Docker

### Construir imagen

```bash
docker build -f Dockerfile.twilio -t whatsapp-bot-twilio .
```

### Ejecutar contenedor

```bash
docker run -p 3008:3008 \
  -e OPENAI_API_KEY="sk-proj-..." \
  -e ASSISTANT_ID="asst_..." \
  -e TWILIO_ACCOUNT_SID="AC..." \
  -e TWILIO_AUTH_TOKEN="..." \
  -e TWILIO_PHONE_NUMBER="whatsapp:+14155238886" \
  -e PUBLIC_URL="https://tu-dominio.com" \
  whatsapp-bot-twilio
```

## 🚢 Despliegue en Producción

### Railway

1. Crea cuenta en: https://railway.app
2. Crea nuevo proyecto
3. Conecta tu repositorio de GitHub
4. Agrega variables de entorno en **Variables**:
   ```
   OPENAI_API_KEY
   ASSISTANT_ID
   TWILIO_ACCOUNT_SID
   TWILIO_AUTH_TOKEN
   TWILIO_PHONE_NUMBER
   PORT=3008
   ```
5. Railway genera una URL pública automáticamente
6. Agrega esa URL como `PUBLIC_URL` en las variables
7. Configura el webhook en Twilio con: `https://tu-proyecto.up.railway.app/twilio/hook`

### Render.com

Similar a Railway. Ver [GUIA_TWILIO.md](./GUIA_TWILIO.md) para detalles.

## 💰 Costos

### Desarrollo (Sandbox)
- **Twilio Sandbox**: GRATIS (hasta 5 números)
- **OpenAI**: Según uso (~$0.01-0.03 por conversación)
- **Hosting**: Gratis (Railway/Render free tier)

### Producción
- **Twilio**: $0.005-0.01 por mensaje
- **OpenAI**: Según uso y modelo
- **Hosting**: Gratis o desde $5/mes

**Ejemplo**: 5,000 mensajes/mes = ~$75-145 USD total

## 🔧 Configuración Avanzada

### Personalizar el Assistant

Edita las instrucciones en OpenAI Platform:

```
Eres un asistente virtual para [tu empresa].
Tu objetivo es ayudar a los clientes con [servicios].
Siempre responde de forma amable y profesional.
Si no sabes algo, pide que contacten a soporte.
```

### Comandos personalizados

Edita `src/app-ai-twilio.js`:

```javascript
const customFlow = addKeyword(['/micomando'])
    .addAction(async (ctx, { flowDynamic }) => {
        await flowDynamic([{ body: 'Respuesta personalizada' }])
    })
```

### Limpieza de sesiones

Por defecto, las sesiones se limpian automáticamente después de 1 hora de inactividad. Puedes ajustar esto en `src/openai-service.js`:

```javascript
const CLEANUP_INTERVAL = 60 * 60 * 1000 // 1 hora
const SESSION_TIMEOUT = 60 * 60 * 1000  // 1 hora
```

## 🐛 Solución de Problemas

### Bot no responde

**Checklist**:
- [ ] ¿El bot está corriendo?
- [ ] ¿Ngrok está activo y la URL es correcta?
- [ ] ¿El webhook está configurado en Twilio?
- [ ] ¿La URL del webhook incluye `/twilio/hook`?
- [ ] ¿Tienes crédito en OpenAI?

### Error de autenticación

```bash
# Verifica las credenciales
echo $TWILIO_ACCOUNT_SID
echo $TWILIO_AUTH_TOKEN

# Deben tener valores
```

### Webhook no recibe mensajes

1. Ve a: https://console.twilio.com/us1/monitor/logs/debugger
2. Busca errores recientes
3. Verifica que la URL del webhook sea accesible públicamente

### OpenAI no responde

1. Verifica tu crédito: https://platform.openai.com/usage
2. Verifica que el Assistant ID sea correcto
3. Revisa los logs del servidor

## 📚 Documentación Adicional

- [GUIA_TWILIO.md](./GUIA_TWILIO.md) - Guía completa de configuración de Twilio
- [RESUMEN_FINAL.md](./RESUMEN_FINAL.md) - Resumen del proyecto original
- [BuilderBot Docs](https://builderbot.app)
- [Twilio WhatsApp Docs](https://www.twilio.com/docs/whatsapp)
- [OpenAI Assistants Docs](https://platform.openai.com/docs/assistants)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia ISC.

## 👤 Autor

Daniel Negrete
- GitHub: [@daniielnegretheoohel](https://github.com/daniielnegretheoohel)

## 🙏 Agradecimientos

- [BuilderBot](https://builderbot.app) - Framework de chatbots
- [OpenAI](https://openai.com) - API de Inteligencia Artificial
- [Twilio](https://twilio.com) - WhatsApp Business API

## ⚠️ Nota sobre Baileys

Este proyecto originalmente usaba **Baileys** como provider de WhatsApp, pero debido a problemas actuales con la conexión (Error 405), hemos migrado a **Twilio** que es la solución oficial y estable.

Si quieres probar con Baileys cuando el problema se solucione, usa:
```bash
npm run start:ai  # Versión con Baileys
```

---

**Última actualización**: 2025-11-18
**Versión**: 2.0 (Twilio)
**Estado**: ✅ Producción-ready
