-- ============================================================================
-- CONFIGURACIÓN DE SUPABASE PARA PRODUCCIÓN
-- Calculadora de Costos de Helados
-- 
-- INSTRUCCIONES:
-- 1. Crea un nuevo proyecto en Supabase (https://supabase.com)
-- 2. Ve a SQL Editor en tu dashboard de Supabase
-- 3. Copia y pega este script completo
-- 4. Ejecuta el script
-- 5. Verifica que todas las tablas se hayan creado correctamente
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TIPOS PERSONALIZADOS
-- ============================================================================

-- Categorías de ingredientes
CREATE TYPE categoria_ingrediente AS ENUM (
  'dairy',        -- Lácteos (leche, crema, queso crema)
  'fruits',       -- Frutas (fresas, mango, piña)
  'nuts',         -- Frutos secos (almendras, nueces, pistachos)
  'sweeteners',   -- Endulzantes (azúcar, miel, stevia)
  'flavorings',   -- Saborizantes (vainilla, chocolate, café)
  'additives',    -- Aditivos (estabilizantes, colorantes)
  'packaging',    -- Empaque (vasos, cucharas, servilletas)
  'other'         -- Otros
);

-- Categorías de recetas
CREATE TYPE categoria_receta AS ENUM (
  'ice_cream',     -- Helado tradicional
  'sorbet',        -- Sorbete
  'gelato',        -- Gelato
  'frozen_yogurt', -- Yogurt helado
  'popsicle',      -- Paleta
  'sundae',        -- Sundae
  'milkshake',     -- Malteada
  'other'          -- Otros
);

-- ============================================================================
-- TABLA: INGREDIENTES
-- ============================================================================
CREATE TABLE ingredientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  unidad_medida VARCHAR(50) NOT NULL, -- kg, litros, unidades, etc.
  precio_por_unidad DECIMAL(10,2) NOT NULL CHECK (precio_por_unidad >= 0),
  stock_actual DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
  stock_minimo DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (stock_minimo >= 0),
  proveedor VARCHAR(255),
  categoria categoria_ingrediente NOT NULL,
  fecha_vencimiento DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLA: RECETAS
-- ============================================================================
CREATE TABLE recetas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  categoria categoria_receta NOT NULL,
  tiempo_preparacion INTEGER, -- en minutos
  rendimiento DECIMAL(10,2) NOT NULL CHECK (rendimiento > 0), -- cantidad que produce
  unidad_rendimiento VARCHAR(50) NOT NULL, -- litros, porciones, etc.
  costo_total DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (costo_total >= 0),
  precio_sugerido DECIMAL(10,2) CHECK (precio_sugerido >= 0),
  margen_ganancia DECIMAL(5,2) CHECK (margen_ganancia >= 0 AND margen_ganancia <= 100),
  activa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLA: RECETA_INGREDIENTES (Relación Many-to-Many)
-- ============================================================================
CREATE TABLE receta_ingredientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receta_id UUID NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
  ingrediente_id UUID NOT NULL REFERENCES ingredientes(id) ON DELETE CASCADE,
  cantidad DECIMAL(10,3) NOT NULL CHECK (cantidad > 0),
  unidad VARCHAR(50) NOT NULL,
  costo_unitario DECIMAL(10,2) NOT NULL CHECK (costo_unitario >= 0),
  costo_total DECIMAL(10,2) NOT NULL CHECK (costo_total >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(receta_id, ingrediente_id) -- Un ingrediente solo puede estar una vez por receta
);

-- ============================================================================
-- TABLA: PRESENTACIONES
-- ============================================================================
CREATE TABLE presentaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receta_id UUID NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL, -- "Vaso pequeño", "Vaso grande", etc.
  descripcion TEXT,
  tamaño_porcion DECIMAL(10,2) NOT NULL CHECK (tamaño_porcion > 0),
  unidad_porcion VARCHAR(50) NOT NULL, -- ml, gramos, etc.
  precio_venta DECIMAL(10,2) NOT NULL CHECK (precio_venta >= 0),
  costo_por_porcion DECIMAL(10,2) NOT NULL CHECK (costo_por_porcion >= 0),
  margen_ganancia DECIMAL(5,2) NOT NULL CHECK (margen_ganancia >= 0 AND margen_ganancia <= 100),
  activa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================================================

-- Índices para ingredientes
CREATE INDEX idx_ingredientes_user_id ON ingredientes(user_id);
CREATE INDEX idx_ingredientes_categoria ON ingredientes(categoria);
CREATE INDEX idx_ingredientes_stock_bajo ON ingredientes(stock_actual, stock_minimo) 
  WHERE stock_actual <= stock_minimo;

-- Índices para recetas
CREATE INDEX idx_recetas_user_id ON recetas(user_id);
CREATE INDEX idx_recetas_categoria ON recetas(categoria);
CREATE INDEX idx_recetas_activa ON recetas(activa);

-- Índices para receta_ingredientes
CREATE INDEX idx_receta_ingredientes_receta_id ON receta_ingredientes(receta_id);
CREATE INDEX idx_receta_ingredientes_ingrediente_id ON receta_ingredientes(ingrediente_id);

-- Índices para presentaciones
CREATE INDEX idx_presentaciones_receta_id ON presentaciones(receta_id);
CREATE INDEX idx_presentaciones_activa ON presentaciones(activa);

-- ============================================================================
-- FUNCIONES Y TRIGGERS
-- ============================================================================

-- Función para actualizar timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_ingredientes_updated_at 
  BEFORE UPDATE ON ingredientes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recetas_updated_at 
  BEFORE UPDATE ON recetas 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_presentaciones_updated_at 
  BEFORE UPDATE ON presentaciones 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para calcular costo total de receta
CREATE OR REPLACE FUNCTION calculate_recipe_cost(recipe_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_cost DECIMAL(10,2) := 0;
BEGIN
  SELECT COALESCE(SUM(costo_total), 0) INTO total_cost
  FROM receta_ingredientes
  WHERE receta_id = recipe_id;
  
  UPDATE recetas 
  SET costo_total = total_cost, updated_at = NOW()
  WHERE id = recipe_id;
  
  RETURN total_cost;
END;
$$ LANGUAGE plpgsql;

-- Trigger para recalcular costo cuando cambian ingredientes
CREATE OR REPLACE FUNCTION recalculate_recipe_cost()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM calculate_recipe_cost(OLD.receta_id);
    RETURN OLD;
  ELSE
    PERFORM calculate_recipe_cost(NEW.receta_id);
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_recalculate_recipe_cost
  AFTER INSERT OR UPDATE OR DELETE ON receta_ingredientes
  FOR EACH ROW EXECUTE FUNCTION recalculate_recipe_cost();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE ingredientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recetas ENABLE ROW LEVEL SECURITY;
ALTER TABLE receta_ingredientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentaciones ENABLE ROW LEVEL SECURITY;

-- Políticas para ingredientes
CREATE POLICY "Users can view their own ingredients" ON ingredientes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ingredients" ON ingredientes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ingredients" ON ingredientes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ingredients" ON ingredientes
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para recetas
CREATE POLICY "Users can view their own recipes" ON recetas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recipes" ON recetas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes" ON recetas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes" ON recetas
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para receta_ingredientes
CREATE POLICY "Users can view recipe ingredients for their recipes" ON receta_ingredientes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM recetas 
      WHERE recetas.id = receta_ingredientes.receta_id 
      AND recetas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert recipe ingredients for their recipes" ON receta_ingredientes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM recetas 
      WHERE recetas.id = receta_ingredientes.receta_id 
      AND recetas.user_id = auth.uid()
    )
    AND
    EXISTS (
      SELECT 1 FROM ingredientes 
      WHERE ingredientes.id = receta_ingredientes.ingrediente_id 
      AND ingredientes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update recipe ingredients for their recipes" ON receta_ingredientes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM recetas 
      WHERE recetas.id = receta_ingredientes.receta_id 
      AND recetas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete recipe ingredients for their recipes" ON receta_ingredientes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM recetas 
      WHERE recetas.id = receta_ingredientes.receta_id 
      AND recetas.user_id = auth.uid()
    )
  );

-- Políticas para presentaciones
CREATE POLICY "Users can view presentations for their recipes" ON presentaciones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM recetas 
      WHERE recetas.id = presentaciones.receta_id 
      AND recetas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert presentations for their recipes" ON presentaciones
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM recetas 
      WHERE recetas.id = presentaciones.receta_id 
      AND recetas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update presentations for their recipes" ON presentaciones
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM recetas 
      WHERE recetas.id = presentaciones.receta_id 
      AND recetas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete presentations for their recipes" ON presentaciones
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM recetas 
      WHERE recetas.id = presentaciones.receta_id 
      AND recetas.user_id = auth.uid()
    )
  );

-- ============================================================================
-- VERIFICACIÓN FINAL
-- ============================================================================

-- Verificar que todas las tablas se crearon correctamente
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('ingredientes', 'recetas', 'receta_ingredientes', 'presentaciones')
ORDER BY tablename;

-- Verificar que RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('ingredientes', 'recetas', 'receta_ingredientes', 'presentaciones')
ORDER BY tablename;

-- ============================================================================
-- CONFIGURACIÓN COMPLETADA
-- ============================================================================

-- ✅ Base de datos configurada correctamente
-- ✅ Tablas creadas con restricciones
-- ✅ Índices optimizados
-- ✅ Triggers para cálculos automáticos
-- ✅ Row Level Security habilitado
-- ✅ Políticas de seguridad configuradas

-- PRÓXIMOS PASOS:
-- 1. Configurar variables de entorno en tu aplicación
-- 2. Generar tipos TypeScript: npm run db:generate-types
-- 3. Probar la conexión desde tu aplicación
-- 4. Insertar datos de prueba si es necesario
