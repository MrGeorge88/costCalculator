'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectOption } from '@/components/ui/Select';
import { useIngredients, IngredientFormData } from '@/hooks/useIngredients';

interface IngredientFormProps {
  ingredientId?: string;
  onSave?: () => void;
  onCancel?: () => void;
}

const initialFormData: IngredientFormData = {
  nombre: '',
  descripcion: '',
  unidad_medida: '',
  precio_por_unidad: '',
  stock_actual: '',
  stock_minimo: '',
  proveedor: '',
  categoria: '',
  fecha_vencimiento: ''
};

export function IngredientForm({ ingredientId, onSave, onCancel }: IngredientFormProps) {
  const t = useTranslations('inventory');
  const router = useRouter();
  const { createIngredient, updateIngredient, getIngredient } = useIngredients();

  const [formData, setFormData] = useState<IngredientFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<IngredientFormData>>({});
  const [isEditing, setIsEditing] = useState(false);

  // Cargar datos del ingrediente si estamos editando
  useEffect(() => {
    if (ingredientId) {
      setIsEditing(true);
      loadIngredientData();
    }
  }, [ingredientId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadIngredientData = async () => {
    if (!ingredientId) return;

    try {
      setLoading(true);
      const ingredient = await getIngredient(ingredientId);

      setFormData({
        nombre: ingredient.nombre,
        descripcion: ingredient.descripcion || '',
        unidad_medida: ingredient.unidad_medida,
        precio_por_unidad: ingredient.precio_por_unidad.toString(),
        stock_actual: ingredient.stock_actual.toString(),
        stock_minimo: ingredient.stock_minimo.toString(),
        proveedor: ingredient.proveedor || '',
        categoria: ingredient.categoria,
        fecha_vencimiento: ingredient.fecha_vencimiento || ''
      });
    } catch (error) {
      console.error('Error loading ingredient:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions: SelectOption[] = [
    { value: 'dairy', label: t('categories.dairy') },
    { value: 'fruits', label: t('categories.fruits') },
    { value: 'nuts', label: t('categories.nuts') },
    { value: 'sweeteners', label: t('categories.sweeteners') },
    { value: 'flavorings', label: t('categories.flavorings') },
    { value: 'additives', label: t('categories.additives') },
    { value: 'packaging', label: t('categories.packaging') },
    { value: 'other', label: t('categories.other') }
  ];

  const unitOptions: SelectOption[] = [
    { value: 'kg', label: 'Kilogramos (kg)' },
    { value: 'g', label: 'Gramos (g)' },
    { value: 'litros', label: 'Litros (L)' },
    { value: 'ml', label: 'Mililitros (ml)' },
    { value: 'unidades', label: 'Unidades' },
    { value: 'cajas', label: 'Cajas' },
    { value: 'paquetes', label: 'Paquetes' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof IngredientFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<IngredientFormData> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.unidad_medida) {
      newErrors.unidad_medida = 'La unidad de medida es requerida';
    }

    if (!formData.precio_por_unidad || parseFloat(formData.precio_por_unidad) <= 0) {
      newErrors.precio_por_unidad = 'El precio debe ser mayor a 0';
    }

    if (!formData.stock_actual || parseFloat(formData.stock_actual) < 0) {
      newErrors.stock_actual = 'El stock actual debe ser mayor o igual a 0';
    }

    if (!formData.stock_minimo || parseFloat(formData.stock_minimo) < 0) {
      newErrors.stock_minimo = 'El stock mínimo debe ser mayor o igual a 0';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isEditing && ingredientId) {
        await updateIngredient(ingredientId, formData);
      } else {
        await createIngredient(formData);
      }

      // Limpiar formulario si es creación
      if (!isEditing) {
        setFormData(initialFormData);
      }

      // Ejecutar callback si existe
      if (onSave) {
        onSave();
      } else {
        // Redirigir al inventario
        router.push('/inventory');
      }

    } catch (error: any) {
      console.error('Error saving ingredient:', error);
      setErrors({
        nombre: error.message || 'Error al guardar el ingrediente'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label={t('name')}
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          error={errors.nombre}
          placeholder="Ej: Leche Entera"
          required
        />

        <Select
          label={t('category')}
          name="categoria"
          value={formData.categoria}
          onChange={handleInputChange}
          options={categoryOptions}
          error={errors.categoria}
          placeholder="Seleccionar categoría"
          required
        />

        <div className="md:col-span-2">
          <Input
            label={t('description')}
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            placeholder="Descripción opcional del ingrediente"
          />
        </div>

        <Select
          label={t('measurementUnit')}
          name="unidad_medida"
          value={formData.unidad_medida}
          onChange={handleInputChange}
          options={unitOptions}
          error={errors.unidad_medida}
          placeholder="Seleccionar unidad"
          required
        />

        <Input
          label={t('unitPrice')}
          name="precio_por_unidad"
          type="number"
          step="0.01"
          min="0"
          value={formData.precio_por_unidad}
          onChange={handleInputChange}
          error={errors.precio_por_unidad}
          placeholder="0.00"
          required
        />

        <Input
          label={t('currentStock')}
          name="stock_actual"
          type="number"
          step="0.01"
          min="0"
          value={formData.stock_actual}
          onChange={handleInputChange}
          error={errors.stock_actual}
          placeholder="0"
          required
        />

        <Input
          label={t('minimumStock')}
          name="stock_minimo"
          type="number"
          step="0.01"
          min="0"
          value={formData.stock_minimo}
          onChange={handleInputChange}
          error={errors.stock_minimo}
          placeholder="0"
          required
        />

        <Input
          label={t('supplier')}
          name="proveedor"
          value={formData.proveedor}
          onChange={handleInputChange}
          placeholder="Nombre del proveedor"
        />

        <Input
          label={t('expirationDate')}
          name="fecha_vencimiento"
          type="date"
          value={formData.fecha_vencimiento}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel || (() => router.back())}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          loading={loading}
        >
          {isEditing ? 'Actualizar' : t('save')}
        </Button>
      </div>
    </form>
  );
}
