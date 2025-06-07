# 🔧 Configuración de Variables de Entorno para Producción

## 📋 Variables Requeridas

### 🔐 Supabase (CRÍTICO)
```bash
# URL de tu proyecto Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co

# Clave pública (anon key) de Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Clave de servicio (service role) - SOLO PARA OPERACIONES ADMIN
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 🌐 Next.js
```bash
# URL base de tu aplicación
NEXTAUTH_URL=https://tu-dominio.com

# Secret para JWT (genera uno único)
NEXTAUTH_SECRET=tu-secret-super-seguro-aqui

# Entorno de producción
NODE_ENV=production
```

### 🗄️ Base de Datos (Opcional)
```bash
# URL directa de PostgreSQL (para migraciones)
DATABASE_URL=postgresql://postgres:password@db.proyecto.supabase.co:5432/postgres
```

---

## 🚀 Configuración en Vercel

### Paso 1: Acceder a Variables de Entorno
1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** > **Environment Variables**

### Paso 2: Agregar Variables
Agrega cada variable con estos valores:

| Variable | Valor | Entorno |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://tu-proyecto.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIs...` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIs...` | Production, Preview |
| `NEXTAUTH_URL` | `https://tu-dominio.com` | Production |
| `NEXTAUTH_URL` | `https://preview-url.vercel.app` | Preview |
| `NEXTAUTH_URL` | `http://localhost:3000` | Development |
| `NEXTAUTH_SECRET` | `tu-secret-generado` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

### Paso 3: Generar NEXTAUTH_SECRET
```bash
# Opción 1: Usar OpenSSL
openssl rand -base64 32

# Opción 2: Usar Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Opción 3: Online (https://generate-secret.vercel.app/32)
```

---

## 🔧 Configuración en Supabase

### Paso 1: Obtener Credenciales
1. Ve a tu [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** > **API**
4. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### Paso 2: Configurar Autenticación
1. Ve a **Authentication** > **Settings**
2. En **Site URL**, agrega: `https://tu-dominio.com`
3. En **Redirect URLs**, agrega:
   ```
   https://tu-dominio.com/auth/callback
   https://tu-dominio.com/es/auth/callback
   https://tu-dominio.com/en/auth/callback
   ```

### Paso 3: Configurar CORS (si es necesario)
1. Ve a **Settings** > **API**
2. En **CORS origins**, agrega:
   ```
   https://tu-dominio.com
   https://*.vercel.app
   ```

---

## 🔍 Verificación de Configuración

### Checklist de Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` configurada
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurada
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurada (solo prod/preview)
- [ ] `NEXTAUTH_URL` configurada para cada entorno
- [ ] `NEXTAUTH_SECRET` generada y configurada
- [ ] `NODE_ENV=production` en producción

### Checklist de Supabase
- [ ] Site URL configurada
- [ ] Redirect URLs configuradas
- [ ] CORS configurado (si necesario)
- [ ] Base de datos migrada
- [ ] RLS habilitado y funcionando

### Pruebas de Conectividad
```bash
# Probar conexión a Supabase (en tu aplicación)
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Anon Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

# Verificar autenticación
const { data, error } = await supabase.auth.getSession()
console.log('Auth session:', data, error)
```

---

## 🚨 Seguridad

### ⚠️ NUNCA Expongas Estas Variables
- `SUPABASE_SERVICE_ROLE_KEY` (solo server-side)
- `DATABASE_URL` (solo server-side)
- `NEXTAUTH_SECRET` (solo server-side)

### ✅ Variables Públicas (OK para client-side)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXTAUTH_URL`

### 🔒 Mejores Prácticas
1. **Rotar secrets regularmente**
2. **Usar diferentes secrets por entorno**
3. **No commitear archivos .env a Git**
4. **Usar variables específicas por entorno**
5. **Monitorear acceso a variables sensibles**

---

## 🐛 Troubleshooting

### Error: "Invalid API key"
- ✅ Verifica que `NEXT_PUBLIC_SUPABASE_ANON_KEY` sea correcta
- ✅ Asegúrate de que no tenga espacios extra
- ✅ Verifica que el proyecto de Supabase esté activo

### Error: "CORS policy"
- ✅ Agrega tu dominio a CORS origins en Supabase
- ✅ Verifica que la URL sea exacta (con/sin www)

### Error: "Redirect URI mismatch"
- ✅ Agrega todas las URLs de redirect en Supabase Auth
- ✅ Incluye URLs de preview de Vercel si es necesario

### Error: "Environment variable not found"
- ✅ Verifica que la variable esté en Vercel
- ✅ Asegúrate de que esté en el entorno correcto
- ✅ Redeploy después de agregar variables

---

## 📝 Template de Variables

### Para Vercel (.env.production)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Next.js
NEXTAUTH_URL=https://tu-dominio.com
NEXTAUTH_SECRET=tu-secret-super-seguro-de-32-caracteres
NODE_ENV=production

# Opcional
DATABASE_URL=postgresql://postgres:password@db.proyecto.supabase.co:5432/postgres
```

### Para Desarrollo Local (.env.local)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-para-desarrollo
NODE_ENV=development
```

---

## ✅ Configuración Completa

Una vez configuradas todas las variables:

1. **Redeploy tu aplicación** en Vercel
2. **Prueba la autenticación** en producción
3. **Verifica la conexión** a la base de datos
4. **Prueba todas las funcionalidades** críticas

¡Tu aplicación debería estar lista para producción! 🚀
