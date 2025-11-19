# 🤖 Bot de WhatsApp con OpenAI + Twilio

Chatbot inteligente de WhatsApp potenciado por OpenAI GPT-4o mini y Twilio WhatsApp Business API.

## 🌟 Características

- ✅ Inteligencia Artificial (GPT-4o mini)
- ✅ WhatsApp Business API oficial (Twilio)
- ✅ Memoria conversacional por usuario
- ✅ Disponibilidad 24/7
- ✅ Hosting en Railway (gratis)
- ✅ Escalable y production-ready

## 🚀 Estado del Proyecto

**Versión**: 2.0 (Twilio)
**Estado**: ✅ En producción
**URL**: https://asistente-whatsapp-builderbot-production-387d.up.railway.app

## 📋 Prerrequisitos

- Node.js 18+
- Cuenta de OpenAI
- Cuenta de Twilio
- Cuenta de Railway (para hosting)

## ⚡ Inicio Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env`:

```bash
# OpenAI
OPENAI_API_KEY=tu_api_key
ASSISTANT_ID=tu_assistant_id

# Twilio
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_PHONE_NUMBER=whatsapp:+14155238886

# Servidor
PORT=3008
PUBLIC_URL=tu_url_publica
```

### 3. Iniciar el bot

```bash
npm run start:twilio
```

## 📚 Documentación Completa

Para documentación detallada, ver **[INTEGRACION.md](./INTEGRACION.md)**

Este documento incluye:
- Proceso completo de implementación
- Configuración paso a paso de todos los servicios
- Costos detallados por escenarios
- Troubleshooting
- Roadmap de próximos pasos

También está disponible **[README_TWILIO.md](./README_TWILIO.md)** con documentación técnica adicional.

## 💰 Costos Estimados

| Conversaciones/mes | Costo Total |
|--------------------|-------------|
| 100 | $2-3 USD/mes |
| 500 | $10-12 USD/mes |
| 1,000 | $21-23 USD/mes |
| 5,000 | $105-115 USD/mes |

## 🏗️ Arquitectura

```
WhatsApp Usuario → Twilio API → Railway (Bot) → OpenAI GPT-4o mini → Respuesta
```

## 📁 Estructura del Proyecto

```
asistente_builder/
├── src/
│   ├── app-ai-twilio.js      # Bot principal ⭐
│   └── openai-service.js      # Servicio de OpenAI
├── legacy_baileys/            # Archivos obsoletos (Baileys)
├── .env                       # Variables de entorno
├── package.json               # Dependencias
├── railway.json               # Config de Railway
├── Dockerfile.twilio          # Docker
├── INTEGRACION.md            # Documentación completa ⭐
└── README.md                  # Este archivo
```

## 🛠️ Scripts Disponibles

```bash
npm run start:twilio    # Iniciar bot con Twilio
npm run dev:twilio      # Modo desarrollo
```

## 🔧 Configuración de Servicios

### OpenAI
1. Crear Assistant en: https://platform.openai.com/assistants
2. Configurar modelo: **gpt-4o-mini**
3. Copiar Assistant ID

### Twilio
1. Crear cuenta: https://www.twilio.com/try-twilio
2. Activar WhatsApp Sandbox
3. Configurar webhook: `https://tu-url/webhook` (método POST)

### Railway
1. Conectar repositorio de GitHub
2. Configurar variables de entorno
3. Deploy automático

## 📊 Monitoreo

- **Railway Logs**: https://railway.app/dashboard
- **Twilio Debugger**: https://console.twilio.com/us1/monitor/logs/debugger
- **OpenAI Usage**: https://platform.openai.com/usage

## 🐛 Troubleshooting

Ver sección de Troubleshooting en **[INTEGRACION.md](./INTEGRACION.md#troubleshooting)**

## 🔄 Migración a Producción

Para migrar del Sandbox a un número real de WhatsApp Business:

1. Solicitar número en Twilio Console
2. Actualizar `TWILIO_PHONE_NUMBER` en Railway
3. Configurar webhook del número real
4. ¡Listo!

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/mejora`)
3. Commit tus cambios (`git commit -m 'Agregar mejora'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

## 📄 Licencia

ISC

## 👤 Autor

Daniel Negrete
- GitHub: [@daniielnegretheoohel](https://github.com/daniielnegretheoohel)

## 🙏 Créditos

- [BuilderBot](https://builderbot.app) - Framework de chatbots
- [OpenAI](https://openai.com) - API de IA
- [Twilio](https://twilio.com) - WhatsApp Business API

---

**Última actualización**: 19 de Noviembre, 2025
