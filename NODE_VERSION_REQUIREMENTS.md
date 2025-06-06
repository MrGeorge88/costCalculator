# 📋 Requisitos de Versión de Node.js

## ⚠️ Versión Actual Detectada
- **Node.js**: 18.14.2
- **Requerido**: ^18.18.0 || ^19.8.0 || >= 20.0.0

## 🔧 Solución

Para ejecutar esta aplicación Next.js 14, necesitas actualizar Node.js a una versión compatible.

### Opción 1: Actualizar Node.js (Recomendado)

#### Windows:
1. Ve a [nodejs.org](https://nodejs.org)
2. Descarga la versión LTS (20.x.x o superior)
3. Ejecuta el instalador
4. Reinicia tu terminal

#### Usando nvm (Node Version Manager):
```bash
# Instalar nvm si no lo tienes
# Windows: https://github.com/coreybutler/nvm-windows

# Instalar Node.js 20 LTS
nvm install 20
nvm use 20

# Verificar versión
node --version
```

### Opción 2: Usar una Versión Anterior de Next.js

Si no puedes actualizar Node.js, puedes downgrade Next.js:

```bash
npm install next@13.5.6 @types/node@18.17.0
```

**Nota**: Esto puede requerir ajustes en el código ya que algunas características de Next.js 14 no estarán disponibles.

## ✅ Verificación

Después de actualizar Node.js:

```bash
# Verificar versión
node --version

# Debería mostrar 18.18.0 o superior

# Ejecutar la aplicación
npm run dev
```

## 🚀 Comandos Disponibles

Una vez que tengas la versión correcta de Node.js:

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Ejecutar tests
npm run test

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📞 Soporte

Si tienes problemas con la actualización de Node.js:

1. Verifica que no tengas múltiples versiones instaladas
2. Reinicia tu terminal después de la instalación
3. Verifica las variables de entorno PATH
4. Considera usar nvm para gestionar versiones de Node.js
