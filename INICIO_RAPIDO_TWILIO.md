# ⚡ Inicio Rápido - Bot WhatsApp con Twilio

## 🎯 En 10 minutos tendrás tu bot funcionando

---

## 📋 Checklist Pre-vuelo

Antes de empezar, asegúrate de tener:

- [ ] Node.js instalado (`node --version`)
- [ ] Cuenta de Twilio (crear en: https://www.twilio.com/try-twilio)
- [ ] Cuenta de OpenAI con crédito (https://platform.openai.com)
- [ ] WhatsApp en tu teléfono

---

## 🚀 Paso 1: Instalar dependencias (1 min)

```bash
cd asistente_builder
npm install
```

---

## 🔑 Paso 2: Obtener credenciales de Twilio (3 min)

### 2.1 Crear cuenta Twilio
1. Ve a: https://www.twilio.com/try-twilio
2. Regístrate (gratis, incluye $15 USD)
3. Verifica tu email y teléfono

### 2.2 Obtener Account SID y Auth Token
1. Ve al Dashboard: https://console.twilio.com
2. Copia:
   - **Account SID** (empieza con `AC...`)
   - **Auth Token** (haz clic en "Show")

### 2.3 Activar Sandbox de WhatsApp
1. Ve a: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. Verás un código y un número de WhatsApp
3. Desde tu WhatsApp, envía el código al número mostrado
4. Recibirás: "You are all set!"
5. Copia el número (ejemplo: `whatsapp:+14155238886`)

---

## ⚙️ Paso 3: Configurar variables (2 min)

Crea un archivo `.env` en la raíz del proyecto:

```bash
# OpenAI (reemplaza con tus valores reales)
OPENAI_API_KEY=sk-proj-TU_API_KEY_AQUI
ASSISTANT_ID=asst_TU_ASSISTANT_ID_AQUI

# Twilio (nuevas - reemplaza con tus valores)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=tu_auth_token_aqui
TWILIO_PHONE_NUMBER=whatsapp:+14155238886

# Servidor
PORT=3008
PUBLIC_URL=http://localhost:3008
```

---

## 🏃 Paso 4: Iniciar el bot (30 seg)

```bash
npm run start:twilio
```

Deberías ver:

```
🚀 Iniciando BuilderBot con OpenAI + Twilio WhatsApp...
✅ Provider de Twilio configurado
✅ Bot iniciado correctamente
📱 El bot está listo para recibir mensajes de WhatsApp
```

---

## 🌐 Paso 5: Exponer con ngrok (1 min)

**Opción A: Instalar ngrok** (si no lo tienes)

```bash
# Linux
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok

# O descarga desde: https://ngrok.com/download
```

**Configurar authtoken** (gratis en https://dashboard.ngrok.com/signup):

```bash
ngrok config add-authtoken TU_AUTHTOKEN_DE_NGROK
```

**Iniciar ngrok** (en otra terminal):

```bash
ngrok http 3008
```

Copia la URL HTTPS que aparece (ejemplo: `https://abc123.ngrok-free.app`)

**Actualizar .env**:

```bash
PUBLIC_URL=https://abc123.ngrok-free.app
```

**Reiniciar el bot** (Ctrl+C y luego):

```bash
npm run start:twilio
```

---

## 🔗 Paso 6: Configurar webhook en Twilio (1 min)

1. Ve a: https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox
2. En **"When a message comes in"**:
   - URL: `https://abc123.ngrok-free.app/twilio/hook`
   - Método: **POST**
3. Haz clic en **Save**

---

## 🎉 Paso 7: ¡PROBAR! (30 seg)

1. Abre WhatsApp en tu teléfono
2. Ve a la conversación con el número de Twilio
3. Envía: `Hola`
4. El bot responderá usando OpenAI ✨

---

## 📊 Resumen de Comandos

```bash
# Terminal 1: Bot
cd asistente_builder
npm run start:twilio

# Terminal 2: ngrok
ngrok http 3008
```

---

## 🐛 ¿Problemas?

### Bot no responde

**Checklist rápido**:
```bash
# 1. ¿Bot corriendo?
# Deberías ver: "Bot iniciado correctamente"

# 2. ¿Ngrok activo?
# Deberías ver: "Forwarding https://..."

# 3. ¿Webhook configurado?
# Verifica en: https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox
# URL debe ser: https://tu-ngrok.ngrok-free.app/twilio/hook

# 4. ¿Número unido al Sandbox?
# Envía de nuevo el código "join ..." al número de Twilio
```

### Ver logs de Twilio

https://console.twilio.com/us1/monitor/logs/debugger

---

## 📁 Archivos Importantes

```
asistente_builder/
├── .env                      ← Configurar aquí
├── src/app-ai-twilio.js     ← Bot principal
├── GUIA_TWILIO.md           ← Guía completa (si necesitas más detalles)
└── INICIO_RAPIDO_TWILIO.md  ← Este archivo
```

---

## 🚢 Próximos Pasos

Una vez que funcione localmente:

1. **Desplegar en Railway** (gratis):
   - Ver: `GUIA_TWILIO.md` → Sección "Despliegue en Producción"

2. **Migrar a número real de WhatsApp Business**:
   - Ver: `GUIA_TWILIO.md` → Sección "Migrar del Sandbox a Producción"

---

## 💰 Costos

### Desarrollo (Sandbox)
- Twilio: **GRATIS** (hasta 5 números)
- OpenAI: Según uso (~$1-5 para pruebas)
- ngrok: **GRATIS**
- **Total**: ~$1-5 para empezar

### Producción (número real)
- Twilio: ~$25-45/mes (5,000 mensajes)
- OpenAI: ~$50-100/mes (según uso)
- Hosting: **GRATIS** (Railway/Render)
- **Total**: ~$75-145/mes

---

## 📞 Ayuda

- **Documentación completa**: `GUIA_TWILIO.md`
- **Twilio Console**: https://console.twilio.com
- **BuilderBot Discord**: https://link.codigoencasa.com/DISCORD
- **Twilio Support**: https://support.twilio.com

---

## ✅ Checklist Final

- [ ] Bot instalado y dependencias instaladas
- [ ] Cuenta Twilio creada
- [ ] Credenciales obtenidas (Account SID, Auth Token, Número)
- [ ] Sandbox activado y número unido
- [ ] Archivo `.env` configurado
- [ ] Bot inicia correctamente
- [ ] Ngrok exponiendo el puerto
- [ ] Webhook configurado en Twilio
- [ ] Mensaje de prueba enviado ✅
- [ ] Bot respondió correctamente ✅

---

**Tiempo total**: ~10 minutos
**Dificultad**: ⭐⭐ (Fácil)
**Estado**: ✅ Listo para producción

---

**Última actualización**: 2025-11-18
