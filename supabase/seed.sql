-- Seed data for development (only run in development environment)
-- This assumes you have a test user with a known UUID

-- Insert sample ingredients (replace 'your-user-uuid' with actual user UUID)
INSERT INTO ingredientes (nombre, descripcion, unidad_medida, precio_por_unidad, stock_actual, stock_minimo, proveedor, categoria, user_id) VALUES
('Leche Entera', 'Leche fresca entera 3.5% grasa', 'litros', 1.50, 25.0, 10.0, 'Lácteos del Valle', 'dairy', 'your-user-uuid'),
('Crema de Leche', 'Crema para batir 35% grasa', 'litros', 3.20, 8.0, 5.0, 'Lácteos del Valle', 'dairy', 'your-user-uuid'),
('Azúcar Refinada', 'Azúcar blanca refinada', 'kg', 0.80, 15.0, 5.0, 'Azucarera Nacional', 'sweeteners', 'your-user-uuid'),
('Vainilla Natural', 'Extracto de vainilla puro', 'ml', 0.25, 200.0, 50.0, 'Esencias Premium', 'flavorings', 'your-user-uuid'),
('Huevos', 'Huevos frescos grandes', 'unidades', 0.15, 60.0, 24.0, 'Granja San José', 'other', 'your-user-uuid'),
('Chocolate Negro', 'Chocolate 70% cacao', 'kg', 8.50, 3.0, 2.0, 'Chocolates Finos', 'flavorings', 'your-user-uuid'),
('Fresas Frescas', 'Fresas de temporada', 'kg', 4.20, 5.0, 3.0, 'Frutas del Campo', 'fruits', 'your-user-uuid'),
('Almendras', 'Almendras peladas', 'kg', 12.00, 2.0, 1.0, 'Frutos Secos Premium', 'nuts', 'your-user-uuid'),
('Estabilizante', 'Estabilizante para helados', 'kg', 15.00, 1.0, 0.5, 'Aditivos Industriales', 'additives', 'your-user-uuid'),
('Vasos 250ml', 'Vasos biodegradables', 'unidades', 0.08, 500.0, 100.0, 'Envases Eco', 'packaging', 'your-user-uuid');

-- Insert sample recipes
INSERT INTO recetas (nombre, descripcion, categoria, tiempo_preparacion, rendimiento, unidad_rendimiento, precio_sugerido, margen_ganancia, user_id) VALUES
('Helado de Vainilla Clásico', 'Helado cremoso de vainilla tradicional', 'ice_cream', 45, 1.0, 'litros', 8.00, 60.0, 'your-user-uuid'),
('Helado de Chocolate', 'Helado intenso de chocolate negro', 'ice_cream', 50, 1.0, 'litros', 9.50, 65.0, 'your-user-uuid'),
('Sorbete de Fresa', 'Sorbete refrescante de fresas naturales', 'sorbet', 30, 1.0, 'litros', 7.00, 70.0, 'your-user-uuid');

-- Get recipe IDs for ingredients (you'll need to replace these with actual UUIDs after recipes are created)
-- For demonstration, using placeholder UUIDs - in real implementation, you'd query the inserted recipes

-- Sample recipe ingredients for Helado de Vainilla
-- INSERT INTO receta_ingredientes (receta_id, ingrediente_id, cantidad, unidad, costo_unitario, costo_total) VALUES
-- ('recipe-uuid-1', 'ingredient-uuid-1', 0.5, 'litros', 1.50, 0.75),
-- ('recipe-uuid-1', 'ingredient-uuid-2', 0.2, 'litros', 3.20, 0.64),
-- ('recipe-uuid-1', 'ingredient-uuid-3', 0.15, 'kg', 0.80, 0.12),
-- ('recipe-uuid-1', 'ingredient-uuid-4', 10.0, 'ml', 0.25, 2.50),
-- ('recipe-uuid-1', 'ingredient-uuid-5', 4.0, 'unidades', 0.15, 0.60);

-- Sample presentations
-- INSERT INTO presentaciones (receta_id, nombre, descripcion, tamaño_porcion, unidad_porcion, precio_venta, costo_por_porcion, margen_ganancia) VALUES
-- ('recipe-uuid-1', 'Vaso 250ml', 'Porción individual en vaso', 0.25, 'litros', 2.50, 1.00, 60.0),
-- ('recipe-uuid-1', 'Tarrina 500ml', 'Tarrina familiar', 0.5, 'litros', 4.50, 2.00, 55.6),
-- ('recipe-uuid-1', 'Tarrina 1L', 'Tarrina familiar grande', 1.0, 'litros', 8.00, 4.00, 50.0);

-- Note: The above INSERT statements for receta_ingredientes and presentaciones are commented out
-- because they require actual UUIDs from the inserted recipes and ingredients.
-- In a real implementation, you would either:
-- 1. Use a script that queries the inserted records to get their UUIDs
-- 2. Use specific UUIDs that you control
-- 3. Create the relationships through your application interface
