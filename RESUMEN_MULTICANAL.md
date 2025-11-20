# 🎯 Resumen: Bot Multi-Canal (WhatsApp + Facebook)

## ✅ Lo que se configuró

Tu bot ahora puede responder en **2 plataformas simultáneamente**:

1. **WhatsApp** (vía Twilio)
2. **Facebook Messenger** (vía Meta)

Ambos usan la **misma IA** de OpenAI (GPT-4o-mini) y el **mismo código**.

---

## 📁 Archivos Importantes

### Código del Bot

| Archivo | Descripción |
|---------|-------------|
| `src/app-ai-all.js` | ⭐ **PRINCIPAL** - WhatsApp + Facebook simultáneos |
| `src/app-ai-twilio.js` | Solo WhatsApp (Twilio) |
| `src/app-ai-meta.js` | Solo Facebook Messenger |
| `src/openai-service.js` | Servicio de OpenAI (compartido) |

### Configuración

| Archivo | Descripción |
|---------|-------------|
| `.env` | Variables de entorno (credenciales) |
| `railway.json` | Configuración de Railway (apunta a `app-ai-all.js`) |
| `package.json` | Scripts npm para ejecutar el bot |

### Documentación

| Archivo | Descripción |
|---------|-------------|
| `FACEBOOK_SETUP.md` | Guía completa de configuración de Facebook |
| `INTEGRACION.md` | Documentación completa de integración WhatsApp |
| `README.md` | Guía rápida del proyecto |

---

## 🔑 Credenciales Configuradas

**NOTA**: Las credenciales reales están en el archivo `.env` (no versionado en git).

### OpenAI
```bash
OPENAI_API_KEY=sk-proj-XXXXXXXXXX
ASSISTANT_ID=asst_XXXXXXXXXX
```

### Twilio (WhatsApp)
```bash
TWILIO_ACCOUNT_SID=ACXXXXXXXXXX
TWILIO_AUTH_TOKEN=XXXXXXXXXX
TWILIO_PHONE_NUMBER=whatsapp:+14155238886
```

### Meta (Facebook)
```bash
META_PAGE_ACCESS_TOKEN=EAAXXXXXXXXXX
META_VERIFY_TOKEN=tu_token_secreto
META_PAGE_ID=157509357455686
META_APP_SECRET=XXXXXXXXXX
```

### Producción
```bash
PUBLIC_URL=https://asistente-whatsapp-builderbot-production-387d.up.railway.app
PORT=3008
```

---

## 🚀 Comandos para Ejecutar el Bot

### Localmente (desarrollo)

```bash
# Ambos canales (WhatsApp + Facebook)
npm run dev:all

# Solo WhatsApp
npm run dev:twilio

# Solo Facebook
npm run dev:meta
```

### Producción (Railway)

Railway ejecutará automáticamente:
```bash
npm run start:all
```

Esto inicia el archivo `src/app-ai-all.js` que tiene ambos providers.

---

## 📝 Próximos Pasos

### 1. Configurar Webhook de Facebook

**Importante**: Debes hacer esto en Meta for Developers para que Facebook funcione.

1. Ve a: https://developers.facebook.com
2. Selecciona tu app
3. Ve a **Messenger > Configuración > Webhooks**
4. Configura:
   - **URL**: `https://asistente-whatsapp-builderbot-production-387d.up.railway.app/webhook`
   - **Verify Token**: `12345`
5. Suscríbete al evento `messages`

**Guía completa**: Ver `FACEBOOK_SETUP.md`

---

### 2. Agregar Variables en Railway

Ve a tu proyecto en Railway y agrega estas 4 variables nuevas:

```bash
META_PAGE_ACCESS_TOKEN=EAAY6XYNBa20BPZClTGn4A5ZCD2qBNv2ZCqWiXnD0RQcHWuJRoyn1QpzfF4kXZCNFH3YnZBG0RQ2S2SMJ8AAqIi3q73duvgiZCRdqCkkrT4ZAJJyZA1YLuJ72J2yjg2blgzaTe65hvwnbmNQH1aQrDhGBpCfk5ZCPm60Kcy82vrgWmpvFZCbi7vIDB8M0vTvZA4qCAYhpzjvmyhlBxluWPZA1Qf3o
META_VERIFY_TOKEN=12345
META_PAGE_ID=157509357455686
META_APP_SECRET=9db3276f3b2a86d3bc2ad2357140acf4
```

---

### 3. Hacer Push a Railway

```bash
git add .
git commit -m "Agregar soporte para Facebook Messenger multi-canal"
git push origin master
```

Railway automáticamente desplegará el bot con ambos canales.

---

### 4. Probar

#### WhatsApp (ya funciona):
- Envía un mensaje a: `whatsapp:+14155238886`
- El bot debería responder

#### Facebook (después de configurar webhook):
- Ve a tu página "Ventas" en Facebook
- Envía un mensaje desde Messenger
- El bot debería responder

---

## 📊 Comparación de Costos

### Por mensaje

| Canal | Costo por mensaje | Costo OpenAI | Total por mensaje |
|-------|------------------|--------------|-------------------|
| **WhatsApp** | $0.005 | ~$0.00003 | **$0.00503** |
| **Facebook** | GRATIS ✅ | ~$0.00003 | **$0.00003** |

### Por 1,000 mensajes mensuales

| Canal | Costo del canal | Costo OpenAI | Total |
|-------|----------------|--------------|-------|
| **WhatsApp** | $5.00 | ~$0.30 | **$5.30** |
| **Facebook** | GRATIS ✅ | ~$0.30 | **$0.30** |

**Conclusión**: Facebook es **17x más barato** que WhatsApp (solo pagas OpenAI).

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────┐
│                   USUARIO                        │
└──────────┬────────────────────────┬──────────────┘
           │                        │
     ┌─────▼──────┐          ┌──────▼─────┐
     │  WhatsApp  │          │  Facebook  │
     │  (Twilio)  │          │ Messenger  │
     └─────┬──────┘          └──────┬─────┘
           │                        │
           │    Webhook: /webhook   │
           └────────┬───────────────┘
                    │
         ┌──────────▼───────────┐
         │   Railway Server     │
         │  (app-ai-all.js)     │
         └──────────┬───────────┘
                    │
         ┌──────────▼───────────┐
         │   BuilderBot         │
         │  (Framework)         │
         └──────────┬───────────┘
                    │
         ┌──────────▼───────────┐
         │  OpenAI Assistant    │
         │  (GPT-4o-mini)       │
         └──────────────────────┘
```

**Flujo**:
1. Usuario envía mensaje (WhatsApp o Facebook)
2. Webhook recibe el mensaje en Railway
3. BuilderBot identifica el canal y procesa
4. OpenAI genera la respuesta
5. BuilderBot envía la respuesta al usuario por el mismo canal

---

## 🔧 Mantenimiento

### Ver logs en Railway

```bash
railway logs --follow
```

### Reiniciar el bot

```bash
railway restart
```

### Actualizar código

```bash
git add .
git commit -m "Descripción del cambio"
git push origin master
```

---

## ⚠️ Importante

### Ambos canales usan el mismo webhook

```
https://asistente-whatsapp-builderbot-production-387d.up.railway.app/webhook
```

BuilderBot automáticamente identifica de qué plataforma viene cada mensaje.

### Base de datos separadas

- WhatsApp + Facebook juntos: `db-multicanal.json`
- Solo WhatsApp: `db.json`
- Solo Facebook: `db-meta.json`

Esto permite mantener las conversaciones separadas si ejecutas los bots individualmente.

---

## 📈 Estadísticas

El bot registra cuántos usuarios activos hay en cada canal:

```bash
# Comando para ver estadísticas
/stats
```

Respuesta:
```
📊 Estadísticas del Bot

👥 Usuarios activos: 5
💬 Conversaciones en memoria: 5
```

---

## 🎯 Ventajas del Sistema Multi-Canal

✅ **Un solo código**: Mantienes 1 bot, no 2 separados
✅ **Misma IA**: Respuestas consistentes en ambos canales
✅ **Costo optimizado**: Facebook es gratis, WhatsApp de pago
✅ **Escalable**: Puedes agregar más canales (Instagram, Telegram, etc.)
✅ **Fácil mantenimiento**: Actualizas 1 archivo, afecta a ambos

---

## 📞 Información de Contacto

**Página de Facebook**: Ventas
**Número WhatsApp**: +14155238886 (Twilio Sandbox)
**Servidor**: https://asistente-whatsapp-builderbot-production-387d.up.railway.app

---

## 🐛 Solución de Problemas

### Facebook no responde

1. ✅ Verifica que el webhook esté configurado en Meta for Developers
2. ✅ Verifica que hayas agregado las variables en Railway
3. ✅ Revisa los logs: `railway logs`
4. ✅ Verifica que el token no haya expirado

### WhatsApp dejó de funcionar

1. ✅ Verifica que las credenciales de Twilio sigan siendo válidas
2. ✅ Revisa los logs: `railway logs`
3. ✅ Verifica el webhook en Twilio Sandbox

### El bot no inicia

1. ✅ Verifica que todas las variables estén en Railway
2. ✅ Revisa los logs de error: `railway logs`
3. ✅ Verifica que `railway.json` apunte a `app-ai-all.js`

---

## 🚀 Siguientes Mejoras (Opcional)

- [ ] Agregar Instagram Direct (BuilderBot también lo soporta)
- [ ] Implementar respuestas con imágenes
- [ ] Agregar botones interactivos en Facebook
- [ ] Crear dashboard de estadísticas
- [ ] Implementar sistema de tickets
- [ ] Agregar base de datos PostgreSQL en lugar de JSON

---

**Última actualización**: 2025-11-19
**Versión del bot**: Multi-Canal v1.0
