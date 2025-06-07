# Guía de Implementación - Calculadora de Costos de Helados

## 📋 Descripción del Proyecto

Esta aplicación web permite a productores de helados calcular costos de producción, gestionar inventarios de ingredientes, crear recetas y simular escenarios de precios. Construida con Next.js 13, TypeScript, Tailwind CSS y Supabase.

## 🎯 Estado Actual del Proyecto (Actualizado)

### ✅ COMPLETADO
- **Estructura base del proyecto** con Next.js 13 y TypeScript
- **Configuración de Tailwind CSS v3** con tema personalizado
- **Internacionalización completa** (Español/Inglés) con next-intl
- **Esquema de base de datos** completo en PostgreSQL/Supabase
- **Row Level Security (RLS)** configurado para multi-tenancy
- **Componentes UI base** (Button, Input, Select, Modal)
- **Layout principal** con Navbar y Sidebar responsivos
- **Páginas principales** creadas (Dashboard, Inventario, Recetas, Simulador)
- **Configuración de Supabase** con migraciones y políticas
- **Sistema de autenticación** configurado
- **Tipos TypeScript** generados para la base de datos
- **CSS de respaldo** para garantizar estilos básicos

### 🔄 EN PROGRESO
- **Resolución de problemas de estilos** en producción
- **Funcionalidad de componentes** (formularios, listas, etc.)

### ❌ PENDIENTE
- **Autenticación UI** (Login/Register/Logout)
- **CRUD completo** para ingredientes y recetas
- **Cálculos automáticos** de costos
- **Simulador de escenarios** funcional
- **Testing** unitario e integración
- **Optimizaciones de rendimiento**
- **Configuración de producción** completa

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico
- **Frontend**: Next.js 14 con App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Internacionalización**: next-intl (Español/Inglés)
- **Testing**: Jest + Testing Library
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

### Estructura de Directorios

```
ice-cream-cost-calculator/
├── .github/
│   └── workflows/
│       └── ci-cd.yml                 # Pipeline CI/CD
├── messages/
│   ├── es.json                       # Traducciones español
│   └── en.json                       # Traducciones inglés
├── public/                           # Archivos estáticos
├── src/
│   ├── app/
│   │   ├── [locale]/                 # Rutas internacionalizadas
│   │   │   ├── layout.tsx            # Layout principal
│   │   │   ├── page.tsx              # Dashboard
│   │   │   ├── inventory/            # Gestión de inventario
│   │   │   ├── recipes/              # Gestión de recetas
│   │   │   ├── presentations/        # Presentaciones comerciales
│   │   │   └── simulator/            # Simulador de escenarios
│   │   ├── globals.css               # Estilos globales
│   │   └── layout.tsx                # Root layout
│   ├── components/
│   │   ├── dashboard/                # Componentes del dashboard
│   │   ├── inventory/                # Componentes de inventario
│   │   ├── layout/                   # Componentes de layout
│   │   ├── recipes/                  # Componentes de recetas
│   │   └── ui/                       # Componentes UI reutilizables
│   ├── lib/
│   │   ├── supabase.ts               # Cliente Supabase
│   │   └── utils.ts                  # Utilidades
│   ├── types/
│   │   └── database.ts               # Tipos de base de datos
│   ├── i18n.ts                       # Configuración i18n
│   └── middleware.ts                 # Middleware Next.js
├── supabase/
│   ├── migrations/                   # Migraciones de BD
│   ├── config.toml                   # Configuración Supabase
│   └── seed.sql                      # Datos de ejemplo
├── .env.local.example                # Variables de entorno ejemplo
├── jest.config.js                    # Configuración Jest
├── next.config.ts                    # Configuración Next.js
├── package.json                      # Dependencias
├── tailwind.config.ts                # Configuración Tailwind
└── tsconfig.json                     # Configuración TypeScript
```

## 🗄️ Esquema de Base de Datos

### Tablas Principales

#### `ingredientes`
- Gestión de materias primas e ingredientes
- Campos: nombre, descripción, unidad_medida, precio_por_unidad, stock_actual, stock_minimo, proveedor, categoria
- RLS habilitado por usuario

#### `recetas`
- Recetas de helados con cálculo automático de costos
- Campos: nombre, descripción, categoria, tiempo_preparacion, rendimiento, costo_total, precio_sugerido, margen_ganancia
- Relación con ingredientes a través de tabla junction

#### `receta_ingredientes`
- Tabla junction entre recetas e ingredientes
- Campos: cantidad, unidad, costo_unitario, costo_total
- Triggers automáticos para recalcular costos

#### `presentaciones`
- Presentaciones comerciales de las recetas
- Campos: tamaño_porcion, precio_venta, costo_por_porcion, margen_ganancia
- Permite múltiples presentaciones por receta

### Características de Seguridad
- Row Level Security (RLS) habilitado
- Políticas por usuario para aislamiento de datos
- Triggers automáticos para cálculos
- Validaciones a nivel de base de datos

## 🚀 Configuración Inicial

### 1. Configuración del Entorno

```bash
# Clonar el repositorio
git clone <repository-url>
cd ice-cream-cost-calculator

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.local.example .env.local
```

### 2. Configuración de Supabase

1. **Crear proyecto en Supabase**:
   - Ir a [supabase.com](https://supabase.com)
   - Crear nuevo proyecto
   - Obtener URL y claves API

2. **Configurar variables de entorno**:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

3. **Ejecutar migraciones**:
```bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar proyecto local
supabase init

# Ejecutar migraciones
supabase db push

# Opcional: Cargar datos de ejemplo
supabase db reset --with-seed
```

### 3. Desarrollo Local

```bash
# Iniciar servidor de desarrollo
npm run dev

# Ejecutar tests
npm run test

# Verificar tipos
npm run type-check

# Linting
npm run lint
```

## 🔧 Convenciones de Código

### Nomenclatura
- **Archivos**: kebab-case (`inventory-list.tsx`)
- **Componentes**: PascalCase (`InventoryList`)
- **Variables/Funciones**: camelCase (`calculateCost`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_INGREDIENTS`)
- **Tipos**: PascalCase (`IngredientType`)

### Estructura de Componentes
```typescript
// Imports
import { useState } from 'react';
import { useTranslations } from 'next-intl';

// Types
interface ComponentProps {
  // props definition
}

// Component
export function ComponentName({ prop }: ComponentProps) {
  const t = useTranslations('namespace');
  
  // Component logic
  
  return (
    // JSX
  );
}
```

### Gestión de Estado
- **Estado local**: useState para componentes simples
- **Estado global**: Context API para datos compartidos
- **Estado del servidor**: Supabase real-time subscriptions

## 🌐 Internacionalización

### Configuración
- Idiomas soportados: Español (es), Inglés (en)
- Idioma por defecto: Español
- Archivos de traducción en `/messages/`

### Uso en Componentes
```typescript
import { useTranslations } from 'next-intl';

export function Component() {
  const t = useTranslations('namespace');
  
  return <h1>{t('title')}</h1>;
}
```

### Agregar Nuevas Traducciones
1. Agregar clave en `messages/es.json`
2. Agregar traducción en `messages/en.json`
3. Usar en componente con `t('key')`

## 🧪 Testing

### Configuración
- **Framework**: Jest + Testing Library
- **Entorno**: jsdom para componentes React
- **Cobertura**: Configurada para src/

### Ejecutar Tests
```bash
npm run test          # Ejecutar una vez
npm run test:watch    # Modo watch
npm run test:ci       # Para CI/CD
```

### Escribir Tests
```typescript
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## 🚀 Despliegue

### Configuración de Vercel

1. **Conectar repositorio**:
   - Importar proyecto desde GitHub
   - Configurar variables de entorno

2. **Variables de entorno en Vercel**:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

3. **Configuración automática**:
   - Build command: `npm run build`
   - Output directory: `.next`
   - Install command: `npm ci`

### CI/CD Pipeline

El pipeline automático incluye:
1. **Testing**: Linting, type-checking, unit tests
2. **Build**: Construcción de la aplicación
3. **Deploy**: Despliegue automático en main branch

### Variables de Entorno para CI/CD
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

## 📊 Monitoreo y Mantenimiento

### Logs y Debugging
- **Desarrollo**: Console logs y React DevTools
- **Producción**: Vercel Analytics y Supabase Dashboard

### Backup de Base de Datos
- Supabase maneja backups automáticos
- Exportar datos: `supabase db dump`

### Actualizaciones
1. Actualizar dependencias regularmente
2. Revisar breaking changes en Next.js/Supabase
3. Ejecutar tests antes de deploy
4. Usar semantic versioning para releases

## 🔒 Seguridad

### Autenticación
- Supabase Auth con email/password
- JWT tokens con refresh automático
- Políticas RLS para aislamiento de datos

### Validación
- Validación client-side con formularios
- Validación server-side en Supabase
- Sanitización de inputs

### Variables Sensibles
- Nunca commitear claves en código
- Usar variables de entorno
- Rotar claves regularmente

## 📚 Recursos Adicionales

### Documentación
- [Next.js 14](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [next-intl](https://next-intl-docs.vercel.app/)

### Herramientas de Desarrollo
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Vercel CLI](https://vercel.com/docs/cli)
- [TypeScript](https://www.typescriptlang.org/docs/)

### Comunidad
- [Next.js Discord](https://discord.gg/nextjs)
- [Supabase Discord](https://discord.supabase.com/)
- [GitHub Issues](link-to-repo-issues)

---

## 🤝 Contribución

Para contribuir al proyecto:
1. Fork el repositorio
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.
