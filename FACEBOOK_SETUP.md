# 🔵 Configuración de Facebook Messenger

Tu bot ya está **100% listo** para funcionar con Facebook Messenger. Solo necesitas configurar el webhook en Meta for Developers.

---

## ✅ Lo que YA tienes configurado

- ✅ Provider de Meta instalado (`@builderbot/provider-meta`)
- ✅ Código del bot para Facebook (`src/app-ai-meta.js`)
- ✅ Código para WhatsApp + Facebook simultáneos (`src/app-ai-all.js`)
- ✅ Credenciales agregadas al archivo `.env`
- ✅ Scripts en `package.json`

**Tu página de Facebook**: Ventas
**Page ID**: 157509357455686

---

## 🌐 Paso 1: Configurar Webhook en Meta for Developers

### 1.1 Ir a Meta for Developers

1. Ve a: https://developers.facebook.com
2. Click en **"Mis Apps"** (arriba derecha)
3. Selecciona tu aplicación (la que tiene el Page ID `157509357455686`)

### 1.2 Agregar Producto Messenger (si no lo has hecho)

1. En el menú lateral, busca **"Agregar producto"**
2. Encuentra **"Messenger"** y click en **"Configurar"**

### 1.3 Configurar el Webhook

1. En **Messenger > Configuración**, busca la sección **"Webhooks"**
2. Click en **"Agregar URL de devolución de llamada"** o **"Editar URL"**
3. Completa el formulario:

   **URL de devolución de llamada**:
   ```
   https://asistente-whatsapp-builderbot-production-387d.up.railway.app/webhook
   ```

   **Verificar token**:
   ```
   12345
   ```

4. Click en **"Verificar y guardar"**

### 1.4 Suscribir a Eventos

1. En la misma página de Webhooks, busca tu página "Ventas"
2. Click en **"Agregar suscripciones"**
3. Selecciona estos eventos:
   - ✅ `messages` - Para recibir mensajes
   - ✅ `messaging_postbacks` - Para botones (opcional)
4. Click en **"Guardar"**

---

## 🚀 Paso 2: Desplegar a Railway

Tienes **3 opciones** para ejecutar el bot:

### Opción A: Solo Facebook Messenger
```bash
npm run start:meta
```

### Opción B: Solo WhatsApp (Twilio)
```bash
npm run start:twilio
```

### Opción C: AMBOS (WhatsApp + Facebook) ⭐ RECOMENDADO
```bash
npm run start:all
```

### 2.1 Actualizar Railway

Para que Railway use ambos canales, actualiza el archivo `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node ./src/app-ai-all.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 2.2 Agregar Variables de Entorno en Railway

Ve a tu proyecto en Railway y agrega estas variables (reemplaza con tus valores reales):

```bash
META_PAGE_ACCESS_TOKEN=tu_token_de_acceso_aqui
META_VERIFY_TOKEN=tu_verify_token_aqui
META_PAGE_ID=tu_page_id_aqui
META_APP_SECRET=tu_app_secret_aqui
```

### 2.3 Hacer Push y Deploy

```bash
git add .
git commit -m "Agregar soporte para Facebook Messenger"
git push origin master
```

Railway automáticamente volverá a desplegar el bot.

---

## 🧪 Paso 3: Probar Facebook Messenger

### 3.1 Probar con tu cuenta (Modo Desarrollo)

1. Ve a tu página de Facebook "Ventas"
2. Click en **"Enviar mensaje"** o busca la página en Messenger
3. Escribe: **"Hola"**
4. El bot debería responder usando OpenAI

### 3.2 Verificar logs en Railway

```bash
railway logs
```

Deberías ver algo como:

```
🚀 Iniciando BuilderBot MULTI-CANAL: WhatsApp + Facebook Messenger...

📋 Configuración Global:
   🤖 OpenAI Assistant ID: asst_MUL0tboZj83t0rui8MNCjgxZ
   🌐 Puerto: 3008

📱 Configurando WhatsApp (Twilio)...
   📞 Account SID: ACXXXXXXXXXX
   📱 Número: whatsapp:+14155238886
   ✅ WhatsApp configurado
   🔗 Webhook: https://tu-app.up.railway.app/webhook

📘 Configurando Facebook Messenger (Meta)...
   📘 Page ID: XXXXXXXXXX
   🔐 Verify Token: tu_verify_token
   ✅ Facebook Messenger configurado
   🔗 Webhook: https://tu-app.up.railway.app/webhook

═══════════════════════════════════════════════════════
✅ Bot MULTI-CANAL iniciado correctamente
═══════════════════════════════════════════════════════

📱 WhatsApp (Twilio): ACTIVO
   💡 Envía un mensaje a tu número de Twilio para probar

📘 Facebook Messenger (Meta): ACTIVO
   💡 Envía un mensaje a tu página de Facebook para probar
```

---

## ⚠️ Modo Producción: Hacer el Bot Público

Por defecto, tu app de Facebook está en **Modo de desarrollo**. Solo tú puedes probarla.

Para que **cualquier persona** pueda escribirle a tu página:

### Paso 1: Completar Información de la App

1. Ve a **Configuración > Básica** en Meta for Developers
2. Completa estos campos obligatorios:
   - **URL de política de privacidad**: Crea una página simple (ejemplo en Google Sites)
   - **URL de términos de servicio**: Crea una página simple
   - **Icono de la app**: Sube un logo (1024x1024 px)
   - **Categoría**: Selecciona "Negocios y páginas"

### Paso 2: Solicitar Permisos

1. Ve a **Revisión de la app > Permisos y funciones**
2. Busca `pages_messaging`
3. Click en **"Solicitar revisión avanzada"**
4. Completa el formulario explicando:
   - "Bot de servicio al cliente con IA para responder preguntas"
   - Adjunta video mostrando cómo funciona el bot
5. Envía la solicitud

### Paso 3: Esperar Aprobación

- Meta tarda **1-3 días hábiles** en revisar
- Recibirás un email cuando sea aprobado
- Una vez aprobado, cambia el switch a **"Activo"**

**Hasta entonces**, puedes agregar usuarios de prueba:
1. Ve a **Roles > Probadores**
2. Agrega usuarios por email o ID de Facebook
3. Ellos podrán probar el bot

---

## 📊 Comparación: WhatsApp vs Facebook

| Característica | WhatsApp (Twilio) | Facebook Messenger |
|----------------|-------------------|-------------------|
| **Costo por mensaje** | $0.005 USD | **GRATIS** ✅ |
| **Límite de mensajes** | Ilimitado (con pago) | Ilimitado |
| **Usuarios globales** | 2+ billones | 1.3+ billones |
| **Aprobación de plantillas** | Sí (24-48h) | No para mensajes básicos |
| **Modo desarrollo** | No aplica | Sí (hasta aprobación) |
| **Multimedia** | Imágenes, videos, PDFs | Imágenes, videos, GIFs |
| **Configuración** | Simple (Twilio) | Media (Meta) |

---

## ⚡ Comandos Útiles

### Ejecutar localmente

```bash
# Solo Facebook
npm run dev:meta

# Solo WhatsApp
npm run dev:twilio

# Ambos canales
npm run dev:all
```

### Ver logs en Railway

```bash
railway logs --follow
```

### Reiniciar el bot en Railway

```bash
railway restart
```

---

## ⚠️ Problemas Comunes

### Error: "The parameter verify_token does not match"

**Causa**: El `META_VERIFY_TOKEN` no coincide entre Railway y Meta for Developers

**Solución**:
1. Verifica que en Railway tengas: `META_VERIFY_TOKEN=12345`
2. Verifica que en Meta for Developers pusiste: `12345`
3. Ambos deben ser **exactamente iguales**

---

### Error: "Invalid OAuth access token"

**Causa**: El `META_PAGE_ACCESS_TOKEN` expiró o es incorrecto

**Solución**:
1. Ve a Meta for Developers
2. Ve a **Messenger > Configuración > Tokens de acceso**
3. Genera un nuevo token
4. Actualiza la variable en Railway

---

### El bot no responde en Facebook

**Posibles causas**:

1. **Webhook no verificado**:
   - Ve a Webhooks en Meta for Developers
   - Verifica que el webhook esté en verde (verificado)

2. **Eventos no suscritos**:
   - Verifica que hayas suscrito al evento `messages`
   - En Webhooks > Campos de suscripción

3. **Bot no desplegado**:
   - Verifica logs en Railway: `railway logs`
   - Asegúrate que diga "Facebook Messenger (Meta): ACTIVO"

---

### El bot responde en WhatsApp pero no en Facebook

**Causa**: Falta alguna configuración de Meta

**Solución**:
1. Verifica las variables de entorno en Railway
2. Verifica el webhook en Meta for Developers
3. Revisa los logs: `railway logs`
4. Busca mensajes de error específicos

---

## 🎯 Resumen

✅ **Código listo**: Ya tienes todo configurado
✅ **Variables agregadas**: En `.env` y Railway
✅ **3 modos de ejecución**: Meta solo, Twilio solo, o ambos

**Próximos pasos**:
1. Configurar webhook en Meta for Developers (Paso 1)
2. Actualizar Railway con las variables de Meta (Paso 2)
3. Hacer push del código actualizado
4. Probar enviando un mensaje a tu página de Facebook
5. (Opcional) Solicitar revisión para modo producción

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Railway: `railway logs`
2. Verifica las variables de entorno
3. Consulta la [documentación oficial de Meta](https://developers.facebook.com/docs/messenger-platform)
