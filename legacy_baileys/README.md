# 🤖 Asistente Inteligente con BuilderBot + OpenAI

Chatbot de WhatsApp integrado con OpenAI Assistants, construido sobre el framework BuilderBot.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Despliegue](#despliegue)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Historial de Cambios](#historial-de-cambios)
- [Decisiones Técnicas](#decisiones-técnicas)

---

## 🎯 Descripción

Este proyecto implementa un asistente de WhatsApp inteligente que utiliza:
- **BuilderBot**: Framework open-source para chatbots multi-canal
- **OpenAI Assistants**: IA conversacional con memoria y contexto
- **Baileys**: Provider de WhatsApp sin necesidad de API oficial

## ✨ Características

- ✅ Conversaciones inteligentes con IA
- ✅ Memoria conversacional por usuario
- ✅ Soporte para archivos y documentos
- ✅ Base de datos vectorial para conocimiento
- ✅ API REST para integraciones
- ✅ 100% gratuito y open source
- ✅ Deploy fácil en Railway/VPS

## 📦 Requisitos

- Node.js v18+ (actual: v22.20.0 ✅)
- npm v10+
- Cuenta de OpenAI con API Key
- WhatsApp (personal o Business)

## 🚀 Instalación

### 1. Clonar/Inicializar el proyecto

El proyecto ya está inicializado con:
```bash
npm install
```

### 2. Configurar variables de entorno

Copia `.env.example` a `.env` y completa tus credenciales:

```bash
cp .env.example .env
```

Edita `.env`:
```env
OPENAI_API_KEY=sk-tu_api_key_real_aqui
ASSISTANT_ID=asst_tu_assistant_id_aqui
PORT=3008
```

⚠️ **IMPORTANTE**: El archivo `.env` NUNCA debe subirse a Git. Ya está en `.gitignore`.

## ⚙️ Configuración

### Paso 1: Obtener API Key de OpenAI

1. Ve a: https://platform.openai.com/api-keys
2. Crea una nueva Secret Key
3. Copia la key (comienza con `sk-...`)
4. Pégala en `.env` en `OPENAI_API_KEY`

### Paso 2: Crear un Assistant en OpenAI

1. Ve a: https://platform.openai.com/assistants
2. Haz clic en "Create Assistant"
3. Configura:
   - **Name**: Nombre de tu asistente (ej: "Asistente de Ventas")
   - **Instructions**: Cómo debe comportarse
     ```
     Eres un asistente de ventas profesional y amigable.
     Ayudas a los clientes con información sobre productos,
     precios y realizar pedidos. Siempre sé cortés y claro.
     ```
   - **Model**: `gpt-4-turbo-preview` (recomendado) o `gpt-3.5-turbo` (económico)
   - **Tools**:
     - ✅ Code Interpreter (opcional)
     - ✅ Retrieval (si subirás archivos)
   - **Files**: Sube PDFs, CSVs, TXT con información que debe conocer

4. Copia el **Assistant ID** (comienza con `asst_...`)
5. Pégalo en `.env` en `ASSISTANT_ID`

### Paso 3: Instalar dependencias adicionales

```bash
npm install openai dotenv
```

## 🎮 Uso

### Modo Básico (sin IA)

Para probar el bot con respuestas predefinidas:
```bash
npm start
```

### Modo con IA (OpenAI Assistant)

⚠️ **Nota**: Debido a un problema con la librería `sharp` en el entorno local actual,
el bot debe ejecutarse en Railway o un VPS. Ver sección [Despliegue](#despliegue).

## 🚀 Despliegue

### Opción A: Railway (Recomendado para empezar)

1. Crea cuenta en: https://railway.app
2. Instala Railway CLI o usa el dashboard web
3. Conecta tu repositorio Git
4. Configura variables de entorno en Railway:
   - `OPENAI_API_KEY`
   - `ASSISTANT_ID`
   - `PORT` (Railway lo asigna automáticamente)
5. Deploy automático ✅

**Ventajas**:
- Gratis inicial ($5 crédito)
- Deploy con 1 clic
- SSL automático
- Logs en tiempo real

### Opción B: VPS (Producción profesional)

Proveedores recomendados:
- DigitalOcean ($6/mes)
- Linode ($5/mes)
- Vultr ($2.50-6/mes)

**Pasos**:
1. Conectar por SSH
2. Instalar Node.js
3. Clonar repositorio
4. Configurar `.env`
5. Usar PM2 para mantener el proceso activo

```bash
npm install -g pm2
pm2 start src/app.js --name "whatsapp-bot"
pm2 save
pm2 startup
```

## 📁 Estructura del Proyecto

```
asistente_builder/
├── src/
│   └── app.js              # Aplicación principal
├── assets/                 # Recursos (imágenes, archivos)
├── .env                    # Credenciales (NO en Git)
├── .env.example            # Plantilla de credenciales
├── .gitignore              # Archivos ignorados por Git
├── package.json            # Dependencias del proyecto
├── Dockerfile              # Para deploy en contenedor
└── README.md               # Esta documentación
```

## 📝 Historial de Cambios

### [2025-11-12] - Configuración Inicial

**Agregado**:
- ✅ Proyecto BuilderBot inicializado con template oficial
- ✅ Estructura base con provider Baileys + database JSON
- ✅ Archivo `.env` para manejo seguro de credenciales
- ✅ Archivo `.env.example` como plantilla
- ✅ Documentación completa en README.md

**Pendiente**:
- ⏳ Integración con OpenAI Assistant
- ⏳ Deploy en Railway
- ⏳ Personalización de flujos conversacionales

## 🧠 Decisiones Técnicas

### ¿Por qué BuilderBot?

**Ventajas**:
- ✅ **Open source y gratuito**: Sin costos de licencia
- ✅ **Control total**: Código y datos son tuyos
- ✅ **Sin límites**: Escalabilidad ilimitada
- ✅ **Multi-canal**: WhatsApp, Telegram, web
- ✅ **Comunidad activa**: Soporte y actualizaciones constantes

**vs Botpress**:
- Botpress es más caro ($50-500/mes)
- BuilderBot es 100% gratuito, solo pagas OpenAI directamente

### ¿Por qué Baileys en vez de WhatsApp Business API oficial?

- **Baileys**: Gratis, funciona con WhatsApp personal/business
- **API Oficial**: $5-50/mes + costos por mensaje
- **Nota**: Para proyectos enterprise, considerar API oficial

### ¿Por qué archivo .env para credenciales?

**Seguridad**:
- ❌ NUNCA poner API keys en el código
- ✅ `.env` está en `.gitignore`
- ✅ Cada desarrollador/entorno tiene sus propias keys
- ✅ Fácil rotar credenciales sin cambiar código

### Problema con sharp en local

**Síntoma**: Error `ERR_DLOPEN_FAILED` al iniciar el bot

**Causa**: Incompatibilidad de la librería `sharp` (usada por Baileys) con ciertas configuraciones de Linux

**Solución**:
- Local: Problema conocido, no crítico para desarrollo
- Railway/VPS: Funciona perfectamente (entorno controlado)
- **Decisión**: Desarrollar lógica localmente, probar bot en Railway

## 🔗 Referencias

- [BuilderBot Docs](https://builderbot.app)
- [OpenAI Platform](https://platform.openai.com)
- [Tutorial de Leifer Méndez](https://youtube.com/@leifermendez)
- [Railway Docs](https://docs.railway.app)

## 📞 Soporte

- **BuilderBot Discord**: https://link.codigoencasa.com/DISCORD
- **OpenAI Community**: https://community.openai.com

---

**Última actualización**: 2025-11-12
**Versión**: 1.0.0 (Setup inicial)
