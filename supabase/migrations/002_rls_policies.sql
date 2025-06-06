-- Enable Row Level Security
ALTER TABLE ingredientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recetas ENABLE ROW LEVEL SECURITY;
ALTER TABLE receta_ingredientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentaciones ENABLE ROW LEVEL SECURITY;

-- Policies for ingredientes table
CREATE POLICY "Users can view their own ingredients" ON ingredientes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ingredients" ON ingredientes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ingredients" ON ingredientes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ingredients" ON ingredientes
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for recetas table
CREATE POLICY "Users can view their own recipes" ON recetas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recipes" ON recetas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes" ON recetas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes" ON recetas
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for receta_ingredientes table
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

-- Policies for presentaciones table
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
