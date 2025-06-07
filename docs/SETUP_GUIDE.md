# 🚀 Guía de Configuración - Ice Cost Calculator

## 📋 Requisitos Previos

### **Software Requerido**
- **Node.js**: v18.17.0 o superior
- **npm**: v9.0.0 o superior
- **Git**: Para control de versiones

### **Cuentas Necesarias**
- **GitHub**: Para el código fuente
- **Supabase**: Para base de datos y autenticación
- **Vercel**: Para deployment (opcional)

## 🔧 Configuración Local

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/MrGeorge88/costCalculator.git
cd costCalculator
```

### **2. Instalar Dependencias**
```bash
npm install
```

### **3. Configurar Variables de Entorno**
```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar con tus valores
nano .env.local
```

**Variables Requeridas:**
```bash
# Supabase (Obligatorias)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_publica
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio

# Opcionales para desarrollo
NODE_ENV=development
```

### **4. Configurar Supabase**

#### **Crear Proyecto en Supabase**
1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva organización/proyecto
3. Anota la URL y las API keys

#### **Ejecutar Migraciones**
```sql
-- Ejecutar en el SQL Editor de Supabase
-- Ver archivo: supabase/SUPABASE_PRODUCTION_SETUP.sql
```

#### **Configurar Autenticación**
1. Ve a **Authentication > Settings**
2. Configura **Site URL**: `http://localhost:3000`
3. Agrega **Redirect URLs**: `http://localhost:3000/auth/callback`

### **5. Ejecutar la Aplicación**
```bash
# Desarrollo
npm run dev

# Abrir en el navegador
open http://localhost:3000
```

## 🗄️ Configuración de Base de Datos

### **Esquema Principal**
```sql
-- Usuarios (manejado por Supabase Auth)
-- Ingredientes
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  category VARCHAR,
  unit VARCHAR NOT NULL,
  cost_per_unit DECIMAL(10,2) NOT NULL,
  supplier VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Recetas
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR,
  prep_time INTEGER,
  yield_amount DECIMAL(10,2),
  yield_unit VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ingredientes de recetas
CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10,2) NOT NULL,
  unit VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Políticas de Seguridad (RLS)**
```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (usuarios autenticados)
CREATE POLICY "Users can view all ingredients" ON ingredients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage ingredients" ON ingredients
  FOR ALL USING (auth.role() = 'authenticated');
```

## 🎨 Configuración de UI/UX

### **Tema y Colores**
```css
/* tailwind.config.js */
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',      // Azul principal
      secondary: '#10b981',    // Verde secundario
      danger: '#ef4444',       // Rojo para errores
      warning: '#f59e0b',      // Amarillo para warnings
    }
  }
}
```

### **Componentes Principales**
- **Button**: 7 variantes (primary, secondary, outline, ghost, danger, success, warning)
- **Card**: Contenedor principal con sombras
- **Input**: Campos de formulario con validación
- **Modal**: Diálogos y overlays
- **Sidebar**: Navegación principal colapsible

## 🌐 Configuración de Internacionalización

### **Idiomas Soportados**
- **Español (es)**: Idioma principal
- **Inglés (en)**: Idioma secundario

### **Archivos de Traducción**
```
messages/
├── es.json    # Traducciones en español
└── en.json    # Traducciones en inglés
```

### **Uso en Componentes**
```tsx
import { useTranslations } from 'next-intl';

function Component() {
  const t = useTranslations('navigation');
  return <h1>{t('dashboard')}</h1>;
}
```

## 🔐 Configuración de Autenticación

### **Flujos Implementados**
- ✅ **Registro**: Con validación de email
- ✅ **Login**: Con remember me
- ✅ **Password Reset**: Flujo completo
- ✅ **Protected Routes**: Rutas protegidas
- ✅ **Session Management**: Automático

### **Componentes de Auth**
```tsx
import { AuthGuard } from '@/components/auth/AuthGuard';

// Proteger una página completa
<AuthGuard requireAuth={true}>
  <PageContent />
</AuthGuard>

// Proteger una sección específica
<ProtectedSection fallback={<LoginPrompt />}>
  <SensitiveContent />
</ProtectedSection>
```

## 📱 Configuración Responsive

### **Breakpoints**
```css
/* Configuración en tailwind.config.js */
screens: {
  'sm': '640px',   // Mobile large
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Desktop large
  '2xl': '1536px'  // Desktop XL
}
```

### **Sidebar Responsive**
- **< 1024px**: Sidebar overlay (mobile/tablet)
- **≥ 1024px**: Sidebar fijo colapsible (desktop)

## 🧪 Configuración de Testing

### **Jest + Testing Library**
```bash
# Ejecutar tests
npm test

# Coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### **Archivos de Configuración**
- `jest.config.js`: Configuración principal
- `jest.setup.js`: Setup global
- `__tests__/`: Directorio de tests

## 🚀 Deployment

### **Vercel (Recomendado)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variables de entorno
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

### **Variables de Producción**
- Usar las mismas variables que desarrollo
- Cambiar URLs a dominios de producción
- Configurar Supabase para producción

## ✅ Verificación de Configuración

### **Checklist de Desarrollo**
- [ ] Node.js v18+ instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Variables de entorno configuradas
- [ ] Supabase proyecto creado
- [ ] Base de datos migrada
- [ ] Aplicación ejecutándose (`npm run dev`)
- [ ] Autenticación funcionando
- [ ] UI responsive

### **Checklist de Producción**
- [ ] Variables de entorno de producción
- [ ] Supabase configurado para producción
- [ ] Dominio configurado
- [ ] SSL habilitado
- [ ] Analytics configurado
- [ ] Error monitoring activo

## 🆘 Troubleshooting

### **Errores Comunes**
1. **Variables de entorno no cargadas**: Reiniciar servidor de desarrollo
2. **Error de Supabase**: Verificar URL y API keys
3. **Build errors**: Verificar TypeScript y ESLint
4. **Responsive issues**: Verificar breakpoints en Tailwind

### **Logs Útiles**
```bash
# Logs de desarrollo
npm run dev

# Logs de build
npm run build

# Logs de Supabase
# Ver en dashboard de Supabase > Logs
```

¡Configuración completa! La aplicación debería estar funcionando correctamente en desarrollo.
