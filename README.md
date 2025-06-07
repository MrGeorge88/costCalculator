# 🍦 Ice Cost Calculator

Una aplicación web profesional para calcular costos de producción de helados artesanales, con gestión completa de inventario, recetas y simulación de escenarios.

![Next.js](https://img.shields.io/badge/Next.js-13-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![Estado](https://img.shields.io/badge/Estado-90%25%20Completado-brightgreen)

## 📚 Documentación

Para información detallada del proyecto, consulta la [documentación completa](./docs/README.md):

- **[Resumen del Proyecto](./docs/PROJECT_OVERVIEW.md)** - Visión general y características
- **[Guía de Configuración](./docs/SETUP_GUIDE.md)** - Configuración paso a paso
- **[Estado de Implementación](./docs/IMPLEMENTATION_STATUS.md)** - Progreso actual
- **[Configuración de Entorno](./docs/ENVIRONMENT_CONFIG.md)** - Variables de entorno
- **[Setup de Supabase](./docs/SUPABASE_SETUP.sql)** - Script de base de datos

## 🎯 Estado del Proyecto

**Progreso General: 90% Completado**

### ✅ Completado (90%)
- ✅ Sistema de autenticación completo (Supabase Auth)
- ✅ UI/UX profesional con sidebar izquierdo
- ✅ Gestión de inventario (CRUD ingredientes)
- ✅ Gestión de recetas (CRUD recetas)
- ✅ Motor de cálculo automático de costos
- ✅ Internacionalización completa (ES/EN)
- ✅ Responsive design mobile-first
- ✅ Variables de entorno configuradas
- ✅ Base de datos Supabase configurada

### 🔄 En Progreso (10%)
- [ ] Testing suite completo
- [ ] Optimización de performance
- [ ] Error boundaries

### 🎯 Listo para Producción
El proyecto está **90% completo** con todas las funcionalidades core implementadas.

## ✨ Características Principales

### 🔐 **Sistema de Autenticación**
- ✅ Registro y login de usuarios
- ✅ Recuperación de contraseña
- ✅ Rutas protegidas con AuthGuard
- ✅ Gestión automática de sesiones

### 📦 **Gestión de Inventario**
- ✅ CRUD completo de ingredientes
- ✅ Categorización por tipo
- ✅ Control de stock y proveedores
- ✅ Búsqueda y filtros avanzados

### 👨‍🍳 **Gestión de Recetas**
- ✅ Creación y edición de recetas
- ✅ Cálculo automático de costos
- ✅ Gestión de ingredientes por receta
- ✅ Categorización y organización

### 🧮 **Motor de Cálculo**
- ✅ Cálculo automático de costos
- ✅ Conversión de unidades
- ✅ Márgenes de ganancia
- ✅ Análisis de rentabilidad

### 🎨 **UI/UX Profesional**
- ✅ Diseño moderno y responsive
- ✅ Sidebar de navegación colapsible
- ✅ Animaciones suaves con Framer Motion
- ✅ Tema profesional consistente

### 🌐 **Internacionalización**
- ✅ Soporte para Español e Inglés
- ✅ Cambio dinámico de idioma
- ✅ URLs localizadas
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
