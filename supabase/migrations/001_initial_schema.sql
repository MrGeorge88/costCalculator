-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE categoria_ingrediente AS ENUM (
  'dairy', 'fruits', 'nuts', 'sweeteners', 
  'flavorings', 'additives', 'packaging', 'other'
);

CREATE TYPE categoria_receta AS ENUM (
  'ice_cream', 'sorbet', 'gelato', 'frozen_yogurt', 
  'popsicle', 'sundae', 'milkshake', 'other'
);

-- Ingredientes table
CREATE TABLE ingredientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  unidad_medida VARCHAR(50) NOT NULL,
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

-- Recetas table
CREATE TABLE recetas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  categoria categoria_receta NOT NULL,
  tiempo_preparacion INTEGER, -- en minutos
  rendimiento DECIMAL(10,2) NOT NULL CHECK (rendimiento > 0),
  unidad_rendimiento VARCHAR(50) NOT NULL,
  costo_total DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (costo_total >= 0),
  precio_sugerido DECIMAL(10,2) CHECK (precio_sugerido >= 0),
  margen_ganancia DECIMAL(5,2) CHECK (margen_ganancia >= 0 AND margen_ganancia <= 100),
  activa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Receta_ingredientes table (junction table)
CREATE TABLE receta_ingredientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receta_id UUID NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
  ingrediente_id UUID NOT NULL REFERENCES ingredientes(id) ON DELETE CASCADE,
  cantidad DECIMAL(10,3) NOT NULL CHECK (cantidad > 0),
  unidad VARCHAR(50) NOT NULL,
  costo_unitario DECIMAL(10,2) NOT NULL CHECK (costo_unitario >= 0),
  costo_total DECIMAL(10,2) NOT NULL CHECK (costo_total >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(receta_id, ingrediente_id)
);

-- Presentaciones table
CREATE TABLE presentaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receta_id UUID NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  tamaño_porcion DECIMAL(10,2) NOT NULL CHECK (tamaño_porcion > 0),
  unidad_porcion VARCHAR(50) NOT NULL,
  precio_venta DECIMAL(10,2) NOT NULL CHECK (precio_venta >= 0),
  costo_por_porcion DECIMAL(10,2) NOT NULL CHECK (costo_por_porcion >= 0),
  margen_ganancia DECIMAL(5,2) NOT NULL CHECK (margen_ganancia >= 0 AND margen_ganancia <= 100),
  activa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_ingredientes_user_id ON ingredientes(user_id);
CREATE INDEX idx_ingredientes_categoria ON ingredientes(categoria);
CREATE INDEX idx_ingredientes_stock_bajo ON ingredientes(stock_actual, stock_minimo) WHERE stock_actual <= stock_minimo;

CREATE INDEX idx_recetas_user_id ON recetas(user_id);
CREATE INDEX idx_recetas_categoria ON recetas(categoria);
CREATE INDEX idx_recetas_activa ON recetas(activa);

CREATE INDEX idx_receta_ingredientes_receta_id ON receta_ingredientes(receta_id);
CREATE INDEX idx_receta_ingredientes_ingrediente_id ON receta_ingredientes(ingrediente_id);

CREATE INDEX idx_presentaciones_receta_id ON presentaciones(receta_id);
CREATE INDEX idx_presentaciones_activa ON presentaciones(activa);

-- Functions to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_ingredientes_updated_at 
  BEFORE UPDATE ON ingredientes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recetas_updated_at 
  BEFORE UPDATE ON recetas 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_presentaciones_updated_at 
  BEFORE UPDATE ON presentaciones 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate recipe total cost
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

-- Trigger to recalculate recipe cost when ingredients change
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
