# 🗄️ Configuración de Supabase

Esta guía te ayudará a configurar Supabase para la aplicación de Calculadora de Costos de Helados.

## 📋 Prerrequisitos

- Cuenta en [Supabase](https://supabase.com)
- [Supabase CLI](https://supabase.com/docs/guides/cli) instalado

## 🚀 Configuración Inicial

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Anota la URL del proyecto y las claves API

### 2. Configurar Variables de Entorno

Copia el archivo `.env.local.example` a `.env.local`:

```bash
cp .env.local.example .env.local
```

Completa las variables con los datos de tu proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
```

### 3. Ejecutar Migraciones

#### Opción A: Usando Supabase CLI (Recomendado)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar proyecto local
supabase init

# Conectar con tu proyecto remoto
supabase link --project-ref tu-project-ref

# Ejecutar migraciones
supabase db push
```

#### Opción B: Ejecutar SQL Manualmente

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a SQL Editor
3. Ejecuta el contenido de `supabase/migrations/001_initial_schema.sql`
4. Ejecuta el contenido de `supabase/migrations/002_rls_policies.sql`

## 🔧 Configuración de Autenticación

### 1. Configurar Proveedores de Auth

En tu dashboard de Supabase:

1. Ve a **Authentication > Settings**
2. Configura **Site URL**: `http://localhost:3000` (desarrollo)
3. Agrega **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://tu-dominio.com/auth/callback` (producción)

### 2. Configurar Email Templates (Opcional)

Personaliza los templates de email en **Authentication > Email Templates**

## 📊 Verificar Configuración

### 1. Verificar Tablas

Ejecuta en SQL Editor:

```sql
-- Verificar que las tablas existen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('ingredientes', 'recetas', 'receta_ingredientes', 'presentaciones');
```

### 2. Verificar RLS

```sql
-- Verificar que RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('ingredientes', 'recetas', 'receta_ingredientes', 'presentaciones');
```

### 3. Verificar Políticas

```sql
-- Ver políticas de RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

## 🌱 Datos de Ejemplo

Para cargar datos de ejemplo:

```bash
# Usando Supabase CLI
supabase db reset --with-seed

# O ejecutar manualmente
psql -h db.tu-proyecto.supabase.co -p 5432 -d postgres -U postgres -f supabase/seed.sql
```

**Nota**: Recuerda reemplazar `'your-user-uuid'` en `seed.sql` con un UUID real de usuario.

## 🔐 Configuración de Seguridad

### 1. Row Level Security (RLS)

Las políticas RLS están configuradas para:
- Usuarios solo pueden ver/editar sus propios datos
- Aislamiento completo entre usuarios
- Validaciones a nivel de base de datos

### 2. Funciones de Base de Datos

- `calculate_recipe_cost()`: Calcula automáticamente el costo total de recetas
- `update_updated_at_column()`: Actualiza timestamps automáticamente
- Triggers para recálculo automático de costos

## 🚀 Despliegue en Producción

### 1. Variables de Entorno

En Vercel o tu plataforma de despliegue:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
```

### 2. Configurar URLs de Producción

En Supabase Dashboard > Authentication > Settings:
- **Site URL**: `https://tu-dominio.com`
- **Redirect URLs**: `https://tu-dominio.com/auth/callback`

## 🔧 Comandos Útiles

```bash
# Ver estado de migraciones
supabase migration list

# Crear nueva migración
supabase migration new nombre_migracion

# Reset base de datos local
supabase db reset

# Generar tipos TypeScript
supabase gen types typescript --project-id tu-project-id > src/types/database.ts

# Ver logs en tiempo real
supabase logs

# Backup de base de datos
supabase db dump > backup.sql
```

## 🐛 Solución de Problemas

### Error: "relation does not exist"
- Verifica que las migraciones se ejecutaron correctamente
- Revisa que estás conectado al proyecto correcto

### Error: "RLS policy violation"
- Verifica que el usuario está autenticado
- Revisa las políticas RLS en el dashboard

### Error: "Invalid JWT"
- Verifica las variables de entorno
- Revisa que las claves API son correctas

### Error de conexión
- Verifica la URL del proyecto
- Revisa la configuración de red/firewall

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Migraciones](https://supabase.com/docs/guides/cli/local-development#database-migrations)

## 🆘 Soporte

Si tienes problemas con la configuración:

1. Revisa los logs de Supabase Dashboard
2. Verifica la configuración paso a paso
3. Consulta la documentación oficial
4. Abre un issue en el repositorio del proyecto
