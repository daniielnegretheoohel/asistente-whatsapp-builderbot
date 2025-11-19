# 🚀 Siguientes Pasos

Guía paso a paso para configurar y deployar tu asistente de WhatsApp.

---

## ✅ Estado Actual

- [x] Proyecto BuilderBot inicializado
- [x] Dependencias instaladas
- [x] Integración con OpenAI creada
- [x] Archivos de configuración listos
- [ ] **API Key de OpenAI configurada** ← SIGUIENTE PASO
- [ ] OpenAI Assistant creado
- [ ] Bot probado en Railway

---

## 📍 PASO 1: Configurar API Key de OpenAI

### ¿Ya tienes una API Key?

**SÍ** → Ve al paso 1.2

**NO** → Sigue desde el paso 1.1

### 1.1. Crear cuenta y obtener API Key

1. **Crear cuenta**:
   - Ve a: https://platform.openai.com/signup
   - Registrate con tu email

2. **Obtener API Key**:
   - Inicia sesión en: https://platform.openai.com
   - Ve a: https://platform.openai.com/api-keys
   - Haz clic en **"Create new secret key"**
   - Dale un nombre: "BuilderBot Assistant"
   - **Copia la key inmediatamente** (comienza con `sk-...`)
   - ⚠️ Solo se muestra UNA VEZ

3. **Configurar método de pago**:
   - Ve a: https://platform.openai.com/account/billing/overview
   - Agrega una tarjeta
   - Establece un límite mensual: $10-20 USD (recomendado)

### 1.2. Configurar la API Key en el proyecto

Abre el archivo `.env` en la carpeta del proyecto y pega tu API Key:

```env
OPENAI_API_KEY=sk-tu_key_aqui_pegala
ASSISTANT_ID=
PORT=3008
```

**⚠️ IMPORTANTE**: NUNCA compartas tu API Key con nadie.

---

## 📍 PASO 2: Crear OpenAI Assistant

### 2.1. Acceder al panel de Assistants

1. Ve a: https://platform.openai.com/assistants
2. Haz clic en **"Create Assistant"**

### 2.2. Configurar tu Assistant

#### Nombre
```
Asistente de [Tu Empresa/Proyecto]
```
Ejemplo: "Asistente de Ventas TechStore"

#### Instructions (Instrucciones)
Aquí defines CÓMO se comportará tu asistente. Ejemplo:

```
Eres un asistente virtual profesional y amigable de [TU EMPRESA].

Tu función principal es:
- Ayudar a los clientes con información sobre productos y servicios
- Responder preguntas frecuentes
- Guiar a los clientes en el proceso de compra
- Proporcionar soporte técnico básico

Reglas importantes:
1. Siempre sé cortés y profesional
2. Si no sabes algo, admítelo y ofrece alternativas
3. Responde de forma concisa pero completa
4. Usa emojis ocasionalmente para ser más amigable
5. Si te piden información que no tienes, pide que contacten a soporte humano

Tono: Amigable, profesional y servicial
Idioma: Español
```

#### Model (Modelo)
Elige uno:
- **gpt-4-turbo-preview** (Más inteligente, ~$0.03/conversación)
- **gpt-3.5-turbo** (Más económico, ~$0.01/conversación)

Recomendación: Empieza con `gpt-3.5-turbo`

#### Tools (Herramientas)
- ☑️ **Code Interpreter**: Si necesitas que haga cálculos o análisis
- ☑️ **Retrieval**: **IMPORTANTE** - Si vas a subir archivos con información
- ☐ **Functions**: Avanzado, déjalo sin marcar por ahora

#### Files (Archivos)
Aquí puedes subir documentos que el asistente debe conocer:

**Ejemplos de archivos útiles**:
- Catálogo de productos (PDF, CSV)
- Preguntas frecuentes (TXT, PDF)
- Políticas de la empresa (PDF)
- Guías de uso (PDF, DOCX)

**Formatos soportados**: PDF, TXT, CSV, DOCX, JSON

### 2.3. Guardar y copiar el Assistant ID

1. Haz clic en **"Save"**
2. El Assistant ID aparecerá arriba (comienza con `asst_...`)
3. **Copia el Assistant ID**
4. Pégalo en tu archivo `.env`:

```env
OPENAI_API_KEY=sk-tu_key_aqui
ASSISTANT_ID=asst-tu_assistant_id_aqui
PORT=3008
```

---

## 📍 PASO 3: Probar Localmente (Opcional)

⚠️ **Nota**: Debido al problema con `sharp`, es probable que NO funcione localmente.
**Solución**: Ir directo al PASO 4 (Deploy en Railway).

Si aún así quieres intentar:

```bash
cd /home/danielnegrete/Datos/Documentos/ProyectoEstudiantes/asistente_builder
npm start:ai
```

---

## 📍 PASO 4: Deploy en Railway

### 4.1. Crear cuenta en Railway

1. Ve a: https://railway.app
2. Haz clic en **"Start a New Project"**
3. Regístrate con GitHub (recomendado)

### 4.2. Subir tu código a GitHub

```bash
cd /home/danielnegrete/Datos/Documentos/ProyectoEstudiantes/asistente_builder

# Inicializar git si no está inicializado
git init

# Agregar todos los archivos
git add .

# Crear commit inicial
git commit -m "Initial commit - BuilderBot con OpenAI"

# Crear repositorio en GitHub y conectarlo
# (O usa la interfaz de GitHub para crear el repo)
git remote add origin https://github.com/tu-usuario/tu-repo.git
git branch -M main
git push -u origin main
```

### 4.3. Conectar Railway con GitHub

1. En Railway, haz clic en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Autoriza Railway a acceder a tu GitHub
4. Selecciona el repositorio que acabas de crear

### 4.4. Configurar Variables de Entorno en Railway

1. En tu proyecto de Railway, ve a la pestaña **"Variables"**
2. Agrega las siguientes variables:

```
OPENAI_API_KEY = sk-tu_api_key_real
ASSISTANT_ID = asst_tu_assistant_id_real
```

⚠️ **NO agregues PORT** - Railway lo asigna automáticamente

### 4.5. Deploy Automático

¡Listo! Railway automáticamente:
- Detectará que es un proyecto Node.js
- Instalará las dependencias
- Ejecutará `npm start:ai`
- Asignará una URL pública

---

## 📍 PASO 5: Conectar WhatsApp

### 5.1. Ver los logs en Railway

1. En Railway, ve a la pestaña **"Logs"**
2. Busca el código QR en los logs
3. O busca un mensaje que diga dónde ver el QR

### 5.2. Escanear QR con WhatsApp

1. Abre WhatsApp en tu teléfono
2. Ve a: **Configuración > Dispositivos vinculados**
3. Toca **"Vincular dispositivo"**
4. Escanea el QR que apareció en los logs de Railway

### 5.3. ¡Probar el bot!

1. Envíate un mensaje a ti mismo en WhatsApp
2. El bot responderá usando tu OpenAI Assistant 🎉

---

## 📍 PASO 6: Personalización (Opcional)

### Mejorar las Instructions del Assistant

Vuelve a https://platform.openai.com/assistants y edita las instrucciones para:
- Agregar más contexto sobre tu negocio
- Definir mejores respuestas
- Agregar información específica

### Subir archivos con información

1. Edita tu Assistant
2. En la sección "Files", sube:
   - Catálogos de productos
   - FAQs
   - Información de la empresa

### Modificar flujos en el código

Edita `src/app-ai.js` para:
- Agregar comandos personalizados
- Cambiar el comportamiento del bot
- Integrar con tu base de datos

---

## ⚠️ Problemas Comunes

### Error: "OPENAI_API_KEY not found"
- Verifica que el archivo `.env` tenga la key correcta
- En Railway, verifica que las variables estén configuradas

### Error: "Assistant ID not found"
- Verifica que copiaste el Assistant ID correcto
- Debe comenzar con `asst_`

### El bot no responde en WhatsApp
- Verifica que el QR se escaneó correctamente
- Revisa los logs en Railway
- Verifica que tengas créditos en OpenAI

### El bot responde muy lento
- Normal - OpenAI puede tomar 2-5 segundos
- Considera usar `gpt-3.5-turbo` si `gpt-4` es muy lento

---

## 📊 Monitoreo de Costos

### Ver uso de OpenAI
https://platform.openai.com/usage

### Establecer límites
https://platform.openai.com/account/limits

### Costos estimados
- **gpt-3.5-turbo**: ~$0.01 por conversación
- **gpt-4-turbo**: ~$0.03 por conversación
- **100 conversaciones/día**: ~$1-3 USD/día

---

## 🎯 Checklist Final

Antes de considerar el proyecto completo:

- [ ] API Key de OpenAI configurada
- [ ] Assistant creado en OpenAI
- [ ] Assistant ID en `.env` / Railway
- [ ] Código subido a GitHub
- [ ] Deploy exitoso en Railway
- [ ] WhatsApp conectado
- [ ] Primera conversación exitosa con el bot
- [ ] Instrucciones del Assistant personalizadas
- [ ] Límite de gasto configurado en OpenAI

---

## 🆘 Soporte

- **BuilderBot**: https://link.codigoencasa.com/DISCORD
- **OpenAI**: https://help.openai.com
- **Railway**: https://docs.railway.app

---

**¡Éxito con tu asistente! 🚀**
