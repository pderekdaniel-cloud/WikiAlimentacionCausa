export type RecipeCategory = 'todas' | 'ensalada' | 'bebida' | 'desayuno' | 'pescado' | 'postre' | 'andino' | 'otros';

export interface Recipe {
  id: string;
  nombre: string;
  categoria: RecipeCategory;
  etiqueta: string;
  imagen: string;
  desc: string;
  tiempo: string;
  porciones: string;
  dificultad: 'Fácil' | 'Media' | 'Difícil';
  calorias: string;
  autor: string;
  esComunidad?: boolean;
  ingredientes: string[];
  pasos: string[];
  destacada?: boolean;
  fechaCreacion?: string;
  likes?: number;
}

export interface FoodItem {
  nombre: string;
  beneficio?: string;
  icono?: string;
  origen?: string;
}

export interface FoodGroup {
  grupo: string;
  icono: string;
  descripcion: string;
  color: string;
  items: FoodItem[];
}

export interface NutritionalTip {
  id: string;
  numero: string;
  titulo: string;
  descripcion: string;
  categoria: 'habitos' | 'cocina' | 'nutricion';
}

export interface BaseHabit {
  numero: string;
  titulo: string;
  descripcion: string;
  icono?: string;
}

export interface MythItem {
  id: string;
  mito: string;
  realidad: string;
  explicacion: string;
}

export type RestaurantCategory = 'todos' | 'saludable' | 'andino' | 'pescados' | 'vegano' | 'cafeteria';

export interface RestaurantAd {
  id: string;
  nombre: string;
  categoria: RestaurantCategory;
  especialidad: string;
  platoEstrella: string;
  ubicacion: string;
  distrito: string;
  ciudad: string;
  imagen: string;
  descripcion: string;
  precioRango: '$' | '$$' | '$$$';
  calificacion: number;
  telefono: string;
  whatsapp: string;
  enlaceMenu?: string;
  planSuscripcion: 'basico' | 'destacado' | 'anual';
  precioMensual: number;
  esAnuncianteVerificado?: boolean;
  esUsuarioLocal?: boolean;
  fechaActivacion?: string;
  etiquetaPromocion?: string;
}

export interface AdPricingPlan {
  id: 'basico' | 'destacado' | 'anual';
  nombre: string;
  precioBase: number;
  moneda: string;
  frecuencia: string;
  descripcion: string;
  caracteristicas: string[];
  destacado?: boolean;
  cuposDisponibles: number;
}

export type NutritionalBadgeType = 'proteinas' | 'fibra' | 'hierro' | 'vitaminas' | 'energia' | 'antioxidantes';

export interface IniaProduct {
  id: string;
  producto: string;
  categoria: 'grano' | 'tuberculo' | 'leguminosa' | 'fruta' | 'raiz';
  icono: string;
  informacion: string;
  valorNutricional: string;
  etiquetas: {
    tipo: NutritionalBadgeType;
    texto: string;
    icono: string;
  }[];
  productosElaborados: string[];
  origenValle: string;
}

export interface UrubambaDish {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  ingredientesClave: string[];
  etiquetas: string[];
  perfilNutricional: string;
  iconoNutricional: string;
}
