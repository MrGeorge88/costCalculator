export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ingredientes: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          unidad_medida: string
          precio_por_unidad: number
          stock_actual: number
          stock_minimo: number
          proveedor: string | null
          categoria: string
          fecha_vencimiento: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          unidad_medida: string
          precio_por_unidad: number
          stock_actual: number
          stock_minimo: number
          proveedor?: string | null
          categoria: string
          fecha_vencimiento?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          unidad_medida?: string
          precio_por_unidad?: number
          stock_actual?: number
          stock_minimo?: number
          proveedor?: string | null
          categoria?: string
          fecha_vencimiento?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingredientes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      recetas: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          categoria: string
          tiempo_preparacion: number | null
          rendimiento: number
          unidad_rendimiento: string
          costo_total: number
          precio_sugerido: number | null
          margen_ganancia: number | null
          activa: boolean
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          categoria: string
          tiempo_preparacion?: number | null
          rendimiento: number
          unidad_rendimiento: string
          costo_total?: number
          precio_sugerido?: number | null
          margen_ganancia?: number | null
          activa?: boolean
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          categoria?: string
          tiempo_preparacion?: number | null
          rendimiento?: number
          unidad_rendimiento?: string
          costo_total?: number
          precio_sugerido?: number | null
          margen_ganancia?: number | null
          activa?: boolean
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recetas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      receta_ingredientes: {
        Row: {
          id: string
          receta_id: string
          ingrediente_id: string
          cantidad: number
          unidad: string
          costo_unitario: number
          costo_total: number
          created_at: string
        }
        Insert: {
          id?: string
          receta_id: string
          ingrediente_id: string
          cantidad: number
          unidad: string
          costo_unitario: number
          costo_total: number
          created_at?: string
        }
        Update: {
          id?: string
          receta_id?: string
          ingrediente_id?: string
          cantidad?: number
          unidad?: string
          costo_unitario?: number
          costo_total?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "receta_ingredientes_receta_id_fkey"
            columns: ["receta_id"]
            isOneToOne: false
            referencedRelation: "recetas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receta_ingredientes_ingrediente_id_fkey"
            columns: ["ingrediente_id"]
            isOneToOne: false
            referencedRelation: "ingredientes"
            referencedColumns: ["id"]
          }
        ]
      }
      presentaciones: {
        Row: {
          id: string
          receta_id: string
          nombre: string
          descripcion: string | null
          tamaño_porcion: number
          unidad_porcion: string
          precio_venta: number
          costo_por_porcion: number
          margen_ganancia: number
          activa: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          receta_id: string
          nombre: string
          descripcion?: string | null
          tamaño_porcion: number
          unidad_porcion: string
          precio_venta: number
          costo_por_porcion: number
          margen_ganancia: number
          activa?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          receta_id?: string
          nombre?: string
          descripcion?: string | null
          tamaño_porcion?: number
          unidad_porcion?: string
          precio_venta?: number
          costo_por_porcion?: number
          margen_ganancia?: number
          activa?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "presentaciones_receta_id_fkey"
            columns: ["receta_id"]
            isOneToOne: false
            referencedRelation: "recetas"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
