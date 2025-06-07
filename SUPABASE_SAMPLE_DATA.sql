-- ============================================================================
-- DATOS DE EJEMPLO PARA TESTING
-- Calculadora de Costos de Helados
-- 
-- INSTRUCCIONES:
-- 1. Ejecuta primero SUPABASE_PRODUCTION_SETUP.sql
-- 2. Crea un usuario de prueba en tu aplicación (registro normal)
-- 3. Reemplaza 'YOUR_USER_ID_HERE' con el ID real del usuario
-- 4. Ejecuta este script en el SQL Editor de Supabase
-- 
-- NOTA: Este script es OPCIONAL, solo para tener datos de prueba
-- ============================================================================

-- ⚠️ IMPORTANTE: Reemplaza este UUID con el ID real de tu usuario de prueba
-- Puedes obtenerlo desde: SELECT id FROM auth.users;
-- O desde tu aplicación después de registrarte

-- EJEMPLO DE CÓMO OBTENER TU USER ID:
-- 1. Regístrate en tu aplicación
-- 2. Ve a Supabase Dashboard > Authentication > Users
-- 3. Copia el UUID del usuario
-- 4. Reemplaza 'YOUR_USER_ID_HERE' abajo

-- ============================================================================
-- INGREDIENTES DE EJEMPLO
-- ============================================================================

-- Lácteos
INSERT INTO ingredientes (nombre, descripcion, unidad_medida, precio_por_unidad, stock_actual, stock_minimo, proveedor, categoria, user_id) VALUES
('Leche entera', 'Leche entera fresca para base de helados', 'litros', 1.50, 50.0, 10.0, 'Lácteos San José', 'dairy', 'YOUR_USER_ID_HERE'),
('Crema de leche', 'Crema de leche 35% grasa', 'litros', 3.20, 20.0, 5.0, 'Lácteos San José', 'dairy', 'YOUR_USER_ID_HERE'),
('Leche condensada', 'Leche condensada azucarada', 'kg', 2.80, 15.0, 3.0, 'Nestlé', 'dairy', 'YOUR_USER_ID_HERE');

-- Frutas
INSERT INTO ingredientes (nombre, descripcion, unidad_medida, precio_por_unidad, stock_actual, stock_minimo, proveedor, categoria, user_id) VALUES
('Fresas frescas', 'Fresas frescas de temporada', 'kg', 4.50, 10.0, 2.0, 'Frutas del Valle', 'fruits', 'YOUR_USER_ID_HERE'),
('Mango', 'Mango maduro para helados', 'kg', 3.20, 8.0, 2.0, 'Frutas del Valle', 'fruits', 'YOUR_USER_ID_HERE'),
('Banano', 'Banano maduro', 'kg', 1.80, 12.0, 3.0, 'Frutas del Valle', 'fruits', 'YOUR_USER_ID_HERE');

-- Endulzantes
INSERT INTO ingredientes (nombre, descripcion, unidad_medida, precio_por_unidad, stock_actual, stock_minimo, proveedor, categoria, user_id) VALUES
('Azúcar blanca', 'Azúcar refinada', 'kg', 0.80, 25.0, 5.0, 'Azucarera Nacional', 'sweeteners', 'YOUR_USER_ID_HERE'),
('Miel de abeja', 'Miel natural pura', 'kg', 8.50, 5.0, 1.0, 'Apiarios del Norte', 'sweeteners', 'YOUR_USER_ID_HERE');

-- Saborizantes
INSERT INTO ingredientes (nombre, descripcion, unidad_medida, precio_por_unidad, stock_actual, stock_minimo, proveedor, categoria, user_id) VALUES
('Esencia de vainilla', 'Extracto natural de vainilla', 'ml', 0.15, 500.0, 100.0, 'Sabores Naturales', 'flavorings', 'YOUR_USER_ID_HERE'),
('Cocoa en polvo', 'Cocoa pura sin azúcar', 'kg', 12.50, 3.0, 1.0, 'Chocolates Premium', 'flavorings', 'YOUR_USER_ID_HERE'),
('Chips de chocolate', 'Chips de chocolate semi-dulce', 'kg', 8.90, 5.0, 1.0, 'Chocolates Premium', 'flavorings', 'YOUR_USER_ID_HERE');

-- Frutos secos
INSERT INTO ingredientes (nombre, descripcion, unidad_medida, precio_por_unidad, stock_actual, stock_minimo, proveedor, categoria, user_id) VALUES
('Almendras', 'Almendras peladas', 'kg', 15.50, 2.0, 0.5, 'Frutos Secos del Sur', 'nuts', 'YOUR_USER_ID_HERE'),
('Nueces', 'Nueces peladas', 'kg', 18.20, 1.5, 0.5, 'Frutos Secos del Sur', 'nuts', 'YOUR_USER_ID_HERE');

-- Aditivos
INSERT INTO ingredientes (nombre, descripcion, unidad_medida, precio_por_unidad, stock_actual, stock_minimo, proveedor, categoria, user_id) VALUES
('Estabilizante', 'Estabilizante para helados', 'kg', 25.00, 1.0, 0.2, 'Aditivos Industriales', 'additives', 'YOUR_USER_ID_HERE');

-- Empaque
INSERT INTO ingredientes (nombre, descripcion, unidad_medida, precio_por_unidad, stock_actual, stock_minimo, proveedor, categoria, user_id) VALUES
('Vasos 8oz', 'Vasos desechables 8 onzas', 'unidades', 0.08, 1000.0, 200.0, 'Empaques del Centro', 'packaging', 'YOUR_USER_ID_HERE'),
('Vasos 12oz', 'Vasos desechables 12 onzas', 'unidades', 0.12, 800.0, 150.0, 'Empaques del Centro', 'packaging', 'YOUR_USER_ID_HERE'),
('Cucharas plásticas', 'Cucharas desechables', 'unidades', 0.03, 2000.0, 500.0, 'Empaques del Centro', 'packaging', 'YOUR_USER_ID_HERE');

-- ============================================================================
-- RECETAS DE EJEMPLO
-- ============================================================================

-- Receta 1: Helado de Vainilla Clásico
INSERT INTO recetas (nombre, descripcion, categoria, tiempo_preparacion, rendimiento, unidad_rendimiento, precio_sugerido, margen_ganancia, user_id) VALUES
('Helado de Vainilla Clásico', 'Helado cremoso de vainilla tradicional', 'ice_cream', 45, 2.0, 'litros', 15.00, 60.0, 'YOUR_USER_ID_HERE');

-- Receta 2: Helado de Fresa
INSERT INTO recetas (nombre, descripcion, categoria, tiempo_preparacion, rendimiento, unidad_rendimiento, precio_sugerido, margen_ganancia, user_id) VALUES
('Helado de Fresa Natural', 'Helado con fresas frescas', 'ice_cream', 50, 1.8, 'litros', 18.00, 65.0, 'YOUR_USER_ID_HERE');

-- Receta 3: Helado de Chocolate
INSERT INTO recetas (nombre, descripcion, categoria, tiempo_preparacion, rendimiento, unidad_rendimiento, precio_sugerido, margen_ganancia, user_id) VALUES
('Helado de Chocolate Premium', 'Helado rico en chocolate con chips', 'ice_cream', 55, 1.5, 'litros', 22.00, 70.0, 'YOUR_USER_ID_HERE');

-- ============================================================================
-- INGREDIENTES DE RECETAS (Necesitarás los IDs reales)
-- ============================================================================

-- NOTA: Para agregar los ingredientes a las recetas, necesitarás:
-- 1. Obtener los IDs reales de las recetas e ingredientes creados arriba
-- 2. Ejecutar las siguientes consultas con los IDs correctos

-- Ejemplo para obtener IDs:
-- SELECT id, nombre FROM recetas WHERE user_id = 'YOUR_USER_ID_HERE';
-- SELECT id, nombre FROM ingredientes WHERE user_id = 'YOUR_USER_ID_HERE';

-- Luego usar estos IDs en las siguientes inserciones:

/*
-- Ejemplo de ingredientes para Helado de Vainilla (reemplaza los UUIDs)
INSERT INTO receta_ingredientes (receta_id, ingrediente_id, cantidad, unidad, costo_unitario, costo_total) VALUES
('RECETA_VAINILLA_ID', 'LECHE_ID', 1.0, 'litros', 1.50, 1.50),
('RECETA_VAINILLA_ID', 'CREMA_ID', 0.5, 'litros', 3.20, 1.60),
('RECETA_VAINILLA_ID', 'AZUCAR_ID', 0.3, 'kg', 0.80, 0.24),
('RECETA_VAINILLA_ID', 'VAINILLA_ID', 20.0, 'ml', 0.15, 3.00),
('RECETA_VAINILLA_ID', 'ESTABILIZANTE_ID', 0.02, 'kg', 25.00, 0.50);
*/

-- ============================================================================
-- PRESENTACIONES DE EJEMPLO
-- ============================================================================

/*
-- Ejemplo de presentaciones (reemplaza los UUIDs de recetas)
INSERT INTO presentaciones (receta_id, nombre, descripcion, tamaño_porcion, unidad_porcion, precio_venta, costo_por_porcion, margen_ganancia) VALUES
('RECETA_VAINILLA_ID', 'Vaso Pequeño', 'Porción individual 150ml', 150.0, 'ml', 3.50, 1.20, 65.7),
('RECETA_VAINILLA_ID', 'Vaso Grande', 'Porción familiar 300ml', 300.0, 'ml', 6.50, 2.40, 63.1),
('RECETA_FRESA_ID', 'Vaso Pequeño', 'Porción individual 150ml', 150.0, 'ml', 4.00, 1.50, 62.5),
('RECETA_FRESA_ID', 'Vaso Grande', 'Porción familiar 300ml', 300.0, 'ml', 7.50, 3.00, 60.0);
*/

-- ============================================================================
-- INSTRUCCIONES FINALES
-- ============================================================================

-- Para completar la configuración de datos de ejemplo:

-- 1. Ejecuta este script reemplazando 'YOUR_USER_ID_HERE' con tu ID real
-- 2. Obtén los IDs de las recetas e ingredientes creados:
--    SELECT id, nombre FROM recetas WHERE user_id = 'TU_USER_ID';
--    SELECT id, nombre FROM ingredientes WHERE user_id = 'TU_USER_ID';
-- 3. Usa esos IDs para crear las relaciones en receta_ingredientes
-- 4. Crea las presentaciones usando los IDs de las recetas

-- Ejemplo de consulta para verificar que todo funciona:
-- SELECT r.nombre, COUNT(ri.id) as ingredientes_count, r.costo_total
-- FROM recetas r
-- LEFT JOIN receta_ingredientes ri ON r.id = ri.receta_id
-- WHERE r.user_id = 'TU_USER_ID'
-- GROUP BY r.id, r.nombre, r.costo_total;

-- ============================================================================
-- DATOS DE EJEMPLO LISTOS
-- ============================================================================

-- ✅ 15 ingredientes de ejemplo en diferentes categorías
-- ✅ 3 recetas base (Vainilla, Fresa, Chocolate)
-- ✅ Estructura lista para relaciones y presentaciones
-- ✅ Datos realistas para testing

-- NOTA: Recuerda reemplazar 'YOUR_USER_ID_HERE' con tu ID real antes de ejecutar
