# 🍦 Calculadora de Costos de Helados

Una aplicación web moderna para calcular costos de producción de helados, gestionar inventarios y simular escenarios de precios. Construida con Next.js 13, TypeScript, Tailwind CSS y Supabase.

![Next.js](https://img.shields.io/badge/Next.js-13-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)

## 🎯 Estado del Proyecto

**Progreso General: 75% Completado**

### ✅ Completado
- Estructura base del proyecto con Next.js 13 + TypeScript
- Configuración de Tailwind CSS v3 con tema personalizado
- Internacionalización completa (Español/Inglés)
- Esquema de base de datos PostgreSQL completo
- Row Level Security (RLS) configurado
- Componentes UI base y layout principal
- Páginas principales creadas
- Sistema de autenticación configurado
- Migraciones y configuración de Supabase

### 🔄 En Progreso
- Resolución de problemas de estilos en producción
- Implementación de funcionalidad CRUD

### ❌ Pendiente
- Autenticación UI (Login/Register)
- CRUD completo para ingredientes y recetas
- Cálculos automáticos de costos
- Testing completo

## ✨ Características

- 📊 **Gestión de Inventario**: Control completo de ingredientes y materias primas
- 🧾 **Cálculo de Recetas**: Creación de recetas con cálculo automático de costos
- 📦 **Presentaciones Comerciales**: Fraccionamiento en diferentes tamaños de venta
- 🎯 **Simulador de Escenarios**: Análisis de impacto de cambios de precios
- 🌍 **Multiidioma**: Soporte para Español e Inglés
- 🔐 **Autenticación Segura**: Sistema de usuarios con Supabase Auth
- 📱 **Responsive**: Diseño adaptativo para todos los dispositivos

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18.18.0 o superior
- npm, yarn, pnpm o bun
- Cuenta en [Supabase](https://supabase.com)

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/MrGeorge88/costCalculator.git
cd costCalculator
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
NODE_ENV=production
```

4. **Configurar base de datos**
- Ve a tu proyecto en Supabase
- Abre el SQL Editor
- Ejecuta el script `SUPABASE_PRODUCTION_SETUP.sql`
- Esto creará todas las tablas, funciones y políticas necesarias

5. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🏗️ Arquitectura

### Stack Tecnológico

- **Frontend**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: Supabase Auth
- **Internacionalización**: next-intl
- **Testing**: Jest + Testing Library
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

### Estructura del Proyecto

```
src/
├── app/[locale]/          # Rutas internacionalizadas
├── components/            # Componentes React
│   ├── dashboard/         # Componentes del dashboard
│   ├── inventory/         # Gestión de inventario
│   ├── recipes/           # Gestión de recetas
│   ├── simulator/         # Simulador de escenarios
│   └── ui/               # Componentes UI reutilizables
├── lib/                  # Utilidades y configuraciones
├── types/                # Definiciones de tipos TypeScript
└── middleware.ts         # Middleware de Next.js
```

## 📊 Base de Datos

### Esquema Principal

- **ingredientes**: Gestión de materias primas
- **recetas**: Recetas con cálculo automático de costos
- **receta_ingredientes**: Relación entre recetas e ingredientes
- **presentaciones**: Presentaciones comerciales

### Características de Seguridad

- Row Level Security (RLS) habilitado
- Políticas por usuario para aislamiento de datos
- Triggers automáticos para cálculos
- Validaciones a nivel de base de datos

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Tests en modo watch
npm run test:watch

# Tests con cobertura
npm run test:ci
```

## 🌐 Internacionalización

La aplicación soporta múltiples idiomas:

- **Español** (es) - Idioma por defecto
- **Inglés** (en)

Los archivos de traducción se encuentran en `/messages/`.

## 📁 Archivos de Configuración

### Para Supabase
- `SUPABASE_PRODUCTION_SETUP.sql` - Script completo para configurar la base de datos

### Para Producción
- `PRODUCTION_ROADMAP.md` - Roadmap detallado para despliegue
- `PRODUCTION_ENV_SETUP.md` - Configuración de variables de entorno
- `IMPLEMENTATION_GUIDE.md` - Guía completa de implementación

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Variables de Entorno para Producción

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
NODE_ENV=production
```

## 📚 Documentación

Para documentación detallada, consulta:

- [Guía de Implementación](./IMPLEMENTATION_GUIDE.md)
- [Documentación de la API](./docs/api.md)
- [Guía de Contribución](./CONTRIBUTING.md)

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

Si tienes preguntas o necesitas ayuda:

- 📧 Email: soporte@ejemplo.com
- 💬 Discord: [Servidor de la comunidad](https://discord.gg/ejemplo)
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/ice-cream-cost-calculator/issues)

---

Desarrollado con ❤️ para la industria heladera
