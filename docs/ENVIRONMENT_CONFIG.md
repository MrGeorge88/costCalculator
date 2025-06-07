# 🔧 Configuración de Variables de Entorno

## 📋 Variables Requeridas

### **Supabase (Obligatorias)**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### **Vercel (Opcionales)**
```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

## 🚀 Configuración Rápida

### 1. **Desarrollo Local**
```bash
# Copia el archivo de ejemplo
cp .env.example .env.local

# Edita las variables con tus valores reales
nano .env.local
```

### 2. **Obtener Credenciales de Supabase**

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **Settings > API**
4. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### 3. **Configuración en Vercel**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Configurar variables de entorno
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

## ⚠️ Solución a Warnings

Los warnings que puedes ver son normales y se deben a:

### **Variables Opcionales**
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` son opcionales
- Solo se necesitan si usas la API de Vercel
- No afectan el funcionamiento de la app

### **Contexto del Cliente**
- Las variables `NEXT_PUBLIC_*` son accesibles en el browser
- Las otras solo están disponibles en el servidor
- Next.js valida esto automáticamente

## 🔍 Validación de Variables

El sistema incluye validación automática:

```typescript
// src/lib/env.ts
export function validateClientEnv() {
  // Valida variables requeridas del cliente
}

export function validateServerEnv() {
  // Valida variables requeridas del servidor
}
```

## 📁 Archivos de Configuración

```
├── .env.local          # Variables locales (no commitear)
├── .env.example        # Plantilla de variables
├── src/lib/env.ts      # Validación de variables
└── src/lib/supabase.ts # Cliente de Supabase
```

## 🛡️ Seguridad

### **Variables Públicas (NEXT_PUBLIC_*)**
- ✅ Accesibles en el browser
- ✅ Seguras para el frontend
- ❌ NO incluir secrets aquí

### **Variables Privadas**
- ✅ Solo en el servidor
- ✅ Para operaciones sensibles
- ✅ Incluir API keys y secrets

## 🔧 Troubleshooting

### **Error: Missing environment variables**
```bash
# Verifica que existan las variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Si están vacías, configúralas
export NEXT_PUBLIC_SUPABASE_URL="tu_url_aqui"
```

### **Warnings en Build**
Los warnings son informativos y no impiden el deployment:
- ✅ La app funciona correctamente
- ✅ Solo indican variables opcionales
- ✅ Se pueden ignorar de forma segura

### **Variables no se cargan**
```bash
# Reinicia el servidor de desarrollo
npm run dev

# Verifica el archivo .env.local
cat .env.local

# Asegúrate de que no haya espacios extra
NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co
```

## 📊 Estado de Variables

| Variable | Requerida | Contexto | Propósito |
|----------|-----------|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Cliente | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Cliente | Clave pública de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Servidor | Operaciones admin |
| `VERCEL_TOKEN` | ❌ | Servidor | API de Vercel |
| `VERCEL_ORG_ID` | ❌ | Servidor | ID de organización |
| `VERCEL_PROJECT_ID` | ❌ | Servidor | ID del proyecto |

## ✅ Verificación Final

```bash
# Ejecuta la app localmente
npm run dev

# Verifica que no haya errores de conexión
# Abre http://localhost:3000
# Revisa la consola del browser
```

Si todo funciona correctamente, los warnings son normales y no requieren acción.

## 🌍 Configuración por Entorno

### **Desarrollo (.env.local)**
```bash
NODE_ENV=development
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev_anon_key
SUPABASE_SERVICE_ROLE_KEY=dev_service_key
```

### **Staging (.env.staging)**
```bash
NODE_ENV=staging
NEXT_PUBLIC_SUPABASE_URL=https://staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=staging_anon_key
SUPABASE_SERVICE_ROLE_KEY=staging_service_key
```

### **Producción (Vercel Dashboard)**
```bash
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod_anon_key
SUPABASE_SERVICE_ROLE_KEY=prod_service_key
```

## 🔄 Migración de Variables

Si cambias de proyecto de Supabase:

1. **Actualizar URLs y Keys**
2. **Migrar datos** (si es necesario)
3. **Actualizar políticas RLS**
4. **Verificar autenticación**
5. **Probar todas las funcionalidades**

## 📝 Notas Importantes

- **Nunca** commitees archivos `.env.local`
- **Siempre** usa `.env.example` como plantilla
- **Verifica** que las variables estén en Vercel para producción
- **Documenta** cualquier nueva variable que agregues
