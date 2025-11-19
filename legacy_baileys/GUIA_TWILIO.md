# 🚀 Guía Completa: Migración a Twilio WhatsApp API

## 📋 Índice

1. [¿Por qué Twilio?](#por-qué-twilio)
2. [Prerrequisitos](#prerrequisitos)
3. [Paso 1: Crear cuenta en Twilio](#paso-1-crear-cuenta-en-twilio)
4. [Paso 2: Configurar WhatsApp Sandbox](#paso-2-configurar-whatsapp-sandbox)
5. [Paso 3: Configurar el proyecto](#paso-3-configurar-el-proyecto)
6. [Paso 4: Exponer tu servidor (ngrok)](#paso-4-exponer-tu-servidor-ngrok)
7. [Paso 5: Configurar Webhook en Twilio](#paso-5-configurar-webhook-en-twilio)
8. [Paso 6: Probar el bot](#paso-6-probar-el-bot)
9. [Despliegue en Producción](#despliegue-en-producción)
10. [Solución de Problemas](#solución-de-problemas)

---

## ¿Por qué Twilio?

✅ **Ventajas**:
- API oficial de WhatsApp Business
- Estabilidad 100% garantizada
- Funciona en cualquier hosting (Railway, Render, AWS, etc.)
- Soporte 24/7
- Documentación excelente
- Fácil de implementar

💰 **Costos**:
- Sandbox (pruebas): **GRATIS** (límite: 5 números)
- Producción: ~$0.005-0.01 por mensaje
- Sin costo de setup
- Plan Free de Twilio incluye $15 USD de crédito

---

## Prerrequisitos

- ✅ Cuenta de Twilio (gratis)
- ✅ Node.js instalado
- ✅ Proyecto ya configurado con OpenAI
- ✅ Ngrok para desarrollo local (gratis)

---

## Paso 1: Crear cuenta en Twilio

### 1.1 Registro

1. Ve a: https://www.twilio.com/try-twilio
2. Completa el formulario de registro
3. Verifica tu correo electrónico
4. Verifica tu número de teléfono

### 1.2 Obtener credenciales

1. Ve a tu Dashboard: https://console.twilio.com
2. Busca la sección **Account Info**
3. Copia estos valores:
   - **Account SID** (ejemplo: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
   - **Auth Token** (haz clic en "Show" para verlo)

---

## Paso 2: Configurar WhatsApp Sandbox

El Sandbox es un entorno de prueba GRATIS que te permite probar WhatsApp sin necesidad de una cuenta Business verificada.

### 2.1 Acceder al Sandbox

1. En el Dashboard de Twilio, ve a:
   - **Messaging** → **Try it out** → **Send a WhatsApp message**
   - O directo: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn

### 2.2 Conectar tu WhatsApp

1. Verás un código QR y un número de WhatsApp
2. Abre WhatsApp en tu teléfono
3. Envía el mensaje que te indican (ejemplo: `join <código>`) al número de Twilio
4. Recibirás confirmación: "You are all set!"

### 2.3 Copiar el número de Sandbox

- Copia el número de WhatsApp Sandbox (ejemplo: `whatsapp:+14155238886`)
- Lo necesitarás para el archivo `.env`

---

## Paso 3: Configurar el proyecto

### 3.1 Actualizar variables de entorno

Crea un archivo `.env` con estos valores:

```bash
# OpenAI Configuration (ya las tienes)
OPENAI_API_KEY=sk-proj-tu_api_key_actual
ASSISTANT_ID=asst_tu_assistant_id_actual

# Twilio Configuration (nuevas)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=tu_auth_token_de_twilio
TWILIO_PHONE_NUMBER=whatsapp:+14155238886

# Public URL (la obtendrás en el paso 4)
PUBLIC_URL=https://tu-url-de-ngrok.ngrok-free.app

# Server Configuration
PORT=3008
```

### 3.2 Instalar dependencias

Ya están instaladas, pero si tienes problemas ejecuta:

```bash
npm install @builderbot/provider-twilio twilio
```

---

## Paso 4: Exponer tu servidor (ngrok)

Para desarrollo local, necesitas que Twilio pueda acceder a tu servidor. Usaremos **ngrok**.

### 4.1 Instalar ngrok

**Opción 1: Descarga directa**
```bash
# Linux/Mac
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok
```

**Opción 2: Snap (Linux)**
```bash
sudo snap install ngrok
```

**Opción 3: Descarga desde** https://ngrok.com/download

### 4.2 Crear cuenta en ngrok (gratis)

1. Ve a: https://dashboard.ngrok.com/signup
2. Regístrate gratis
3. Ve a: https://dashboard.ngrok.com/get-started/your-authtoken
4. Copia tu authtoken

### 4.3 Configurar ngrok

```bash
ngrok config add-authtoken TU_AUTH_TOKEN_AQUI
```

### 4.4 Iniciar el bot

```bash
npm run start:twilio
```

Deberías ver:

```
🚀 Iniciando BuilderBot con OpenAI + Twilio WhatsApp...
✅ Provider de Twilio configurado
⚠️  IMPORTANTE: Configura el webhook en Twilio:
   URL: http://localhost:3008/twilio/hook
   Método: POST
✅ Bot iniciado correctamente
```

### 4.5 Exponer el puerto con ngrok

En **otra terminal**, ejecuta:

```bash
ngrok http 3008
```

Verás algo como:

```
Forwarding    https://abc123.ngrok-free.app -> http://localhost:3008
```

**Copia esa URL** (ejemplo: `https://abc123.ngrok-free.app`)

### 4.6 Actualizar .env con la URL pública

Edita tu `.env` y actualiza:

```bash
PUBLIC_URL=https://abc123.ngrok-free.app
```

**Reinicia el bot** para que tome la nueva URL:

```bash
# Ctrl+C para detener
npm run start:twilio
```

---

## Paso 5: Configurar Webhook en Twilio

### 5.1 Ir a configuración de Sandbox

1. Ve a: https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox
2. Busca la sección **Sandbox Configuration**

### 5.2 Configurar el webhook

1. En **"When a message comes in"**:
   - URL: `https://tu-url-de-ngrok.ngrok-free.app/twilio/hook`
   - Método: **POST**

2. Haz clic en **Save**

**Ejemplo**:
```
https://abc123.ngrok-free.app/twilio/hook
```

---

## Paso 6: Probar el bot

### 6.1 Enviar mensaje de prueba

1. Abre WhatsApp en tu teléfono
2. Ve a la conversación con el número de Twilio Sandbox
3. Envía cualquier mensaje, por ejemplo: `Hola`

### 6.2 Verificar logs

En la terminal donde corre el bot deberías ver:

```
💬 [whatsapp:+521234567890]: Hola
```

Y el bot responderá usando OpenAI.

### 6.3 ¡Listo! 🎉

Tu bot de WhatsApp con OpenAI está funcionando con Twilio.

---

## Despliegue en Producción

### Opción 1: Railway

#### 1. Crear nuevo proyecto en Railway

```bash
# Si no tienes Railway CLI:
npm install -g @railway/cli

# Login
railway login

# Crear proyecto
railway init
```

#### 2. Configurar variables de entorno

En el dashboard de Railway (https://railway.app):

1. Ve a tu proyecto → **Variables**
2. Agrega estas variables:

```
OPENAI_API_KEY=sk-proj-...
ASSISTANT_ID=asst_...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=whatsapp:+14155238886
PORT=3008
```

**IMPORTANTE**: NO agregues `PUBLIC_URL` todavía.

#### 3. Configurar el servicio

1. En **Settings** → **Build**:
   - Build Command: `npm install`
   - Start Command: `npm run start:twilio`

2. En **Settings** → **Networking**:
   - Habilita **Public Networking**
   - Copia la URL generada (ejemplo: `https://tu-proyecto.up.railway.app`)

#### 4. Actualizar PUBLIC_URL

1. Agrega la variable:
   ```
   PUBLIC_URL=https://tu-proyecto.up.railway.app
   ```

2. Reinicia el servicio (botón **Restart**)

#### 5. Actualizar webhook en Twilio

1. Ve a: https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox
2. Actualiza la URL del webhook:
   ```
   https://tu-proyecto.up.railway.app/twilio/hook
   ```

### Opción 2: Render.com

Similar a Railway, pero usa el archivo `render.yaml` o configura manualmente.

### Opción 3: Docker

```bash
# Construir imagen
docker build -f Dockerfile.twilio -t whatsapp-bot-twilio .

# Ejecutar (local)
docker run -p 3008:3008 \
  -e OPENAI_API_KEY="sk-proj-..." \
  -e ASSISTANT_ID="asst_..." \
  -e TWILIO_ACCOUNT_SID="AC..." \
  -e TWILIO_AUTH_TOKEN="..." \
  -e TWILIO_PHONE_NUMBER="whatsapp:+14155238886" \
  -e PUBLIC_URL="https://tu-dominio.com" \
  whatsapp-bot-twilio
```

---

## Migrar del Sandbox a Producción

Cuando estés listo para usar un número de WhatsApp Business real:

### 1. Solicitar un número de WhatsApp

1. Ve a: https://console.twilio.com/us1/develop/sms/senders/whatsapp-senders
2. Haz clic en **Get a WhatsApp number**
3. Sigue el proceso de verificación de Meta

### 2. Actualizar configuración

Una vez aprobado, actualiza tu `.env`:

```bash
TWILIO_PHONE_NUMBER=whatsapp:+1234567890  # Tu nuevo número
```

### 3. Configurar webhook del número real

1. Ve a: https://console.twilio.com/us1/develop/sms/senders/whatsapp-senders
2. Selecciona tu número
3. Configura el webhook con la URL de producción

---

## Solución de Problemas

### Error: "Account credentials are required to create a Client"

**Causa**: Variables de entorno no configuradas correctamente.

**Solución**:
```bash
# Verifica que existan:
echo $TWILIO_ACCOUNT_SID
echo $TWILIO_AUTH_TOKEN

# Si están vacías, revisa tu archivo .env
```

### Error: "Unable to create record: The message From/To pair violates a sandbox constraint"

**Causa**: Número no unido al Sandbox.

**Solución**:
1. Envía `join <código>` al número de Sandbox desde tu WhatsApp
2. Espera confirmación

### Bot no responde

**Checklist**:
- [ ] ¿El bot está corriendo? (`npm run start:twilio`)
- [ ] ¿Ngrok está activo? (`ngrok http 3008`)
- [ ] ¿El webhook está configurado en Twilio?
- [ ] ¿La URL del webhook es correcta? (incluye `/twilio/hook`)
- [ ] ¿El número está unido al Sandbox?

### Webhook no recibe mensajes

**Verificar**:
```bash
# Ver logs de ngrok
# En la terminal de ngrok, aparecen las peticiones que recibe
# Si no aparece nada, el webhook no está llegando
```

**Verificar en Twilio**:
1. Ve a: https://console.twilio.com/us1/monitor/logs/debugger
2. Busca errores recientes

---

## Comandos Útiles

```bash
# Desarrollo local
npm run start:twilio          # Iniciar bot con Twilio
npm run dev:twilio            # Modo desarrollo (con nodemon)

# Ngrok
ngrok http 3008               # Exponer puerto local
ngrok http 3008 --domain=tu-dominio.ngrok-free.app  # Con dominio fijo (plan pago)

# Docker
docker build -f Dockerfile.twilio -t bot-twilio .
docker run -p 3008:3008 --env-file .env bot-twilio

# Railway
railway up                    # Desplegar proyecto
railway logs                  # Ver logs
railway vars set KEY=value    # Configurar variable
```

---

## Costos Estimados

### Sandbox (Desarrollo)
- **Costo**: GRATIS
- **Límite**: 5 números de WhatsApp
- **Ideal para**: Pruebas y desarrollo

### Producción

| Volumen mensual | Costo WhatsApp | Costo OpenAI | Total/mes |
|-----------------|----------------|--------------|-----------|
| 1,000 msgs      | $5-10          | $10-20       | $15-30    |
| 5,000 msgs      | $25-45         | $50-100      | $75-145   |
| 10,000 msgs     | $50-90         | $100-200     | $150-290  |

**Hosting**: Gratis (Railway/Render free tier)

---

## Recursos Adicionales

- 📚 Documentación Twilio: https://www.twilio.com/docs/whatsapp
- 💬 BuilderBot Discord: https://link.codigoencasa.com/DISCORD
- 🔧 Twilio Console: https://console.twilio.com
- 📊 Ngrok Dashboard: https://dashboard.ngrok.com
- 🤖 OpenAI Platform: https://platform.openai.com

---

## Siguientes Pasos

1. ✅ Prueba el bot en Sandbox
2. ✅ Despliega en Railway/Render
3. ✅ Prueba con varios usuarios
4. ⏭️ Solicita número de WhatsApp Business real
5. ⏭️ Migra a producción

---

**¿Necesitas ayuda?**

- BuilderBot: https://link.codigoencasa.com/DISCORD
- Twilio Support: https://support.twilio.com

---

**Fecha**: 2025-11-18
**Versión**: 1.0
**Proyecto**: Asistente WhatsApp + OpenAI + Twilio
