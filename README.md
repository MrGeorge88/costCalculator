# 🍦 Calculadora de Costos de Helados

Una aplicación web moderna para calcular costos de producción de helados, gestionar inventarios y simular escenarios de precios. Construida con Next.js 14, TypeScript, Tailwind CSS y Supabase.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

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
git clone https://github.com/tu-usuario/ice-cream-cost-calculator.git
cd ice-cream-cost-calculator
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
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
```

4. **Configurar base de datos**
```bash
# Instalar Supabase CLI
npm install -g supabase

# Ejecutar migraciones
supabase db push

# Opcional: Cargar datos de ejemplo
supabase db reset --with-seed
```

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

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Variables de Entorno para Producción

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
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
