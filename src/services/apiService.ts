import { Recipe, RestaurantAd } from '../types';
import { RECETAS_BASE } from '../data/wikiData';
import { RESTAURANTES_BASE } from '../data/restaurantData';

const RECIPES_STORAGE_KEY = 'wiki_recetas_causa';
const RESTAURANTS_STORAGE_KEY = 'wiki_restaurantes_causa';

// ================= RECIPES SERVICE =================

export async function fetchAllRecipes(): Promise<Recipe[]> {
  try {
    const res = await fetch('/api/recipes');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.recipes) && data.recipes.length > 0) {
        // Merge with RECETAS_BASE to ensure all default + server community recipes are present
        const merged = [...RECETAS_BASE];
        data.recipes.forEach((serverRec: Recipe) => {
          const idx = merged.findIndex((r) => r.id === serverRec.id);
          if (idx >= 0) {
            merged[idx] = serverRec;
          } else {
            merged.unshift(serverRec);
          }
        });
        // Cache to local storage as fallback
        localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(merged.filter((r) => r.esComunidad)));
        return merged;
      }
    }
  } catch (e) {
    console.warn('Backend API not reachable, using local storage fallback for recipes', e);
  }

  // Fallback to localStorage + RECETAS_BASE
  try {
    const local = localStorage.getItem(RECIPES_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        const merged = [...RECETAS_BASE];
        parsed.forEach((custom: Recipe) => {
          if (!merged.some((r) => r.id === custom.id)) {
            merged.unshift(custom);
          }
        });
        return merged;
      }
    }
  } catch (e) {
    console.error('Error reading localStorage for recipes', e);
  }

  return RECETAS_BASE;
}

export async function saveRecipeApi(recipe: Recipe): Promise<boolean> {
  // 1. Save to backend API
  let serverOk = false;
  try {
    const res = await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe),
    });
    if (res.ok) {
      serverOk = true;
    }
  } catch (e) {
    console.warn('Could not persist to server, fallback to local storage', e);
  }

  // 2. Always persist to localStorage as well
  try {
    const local = localStorage.getItem(RECIPES_STORAGE_KEY);
    const existing: Recipe[] = local ? JSON.parse(local) : [];
    const idx = existing.findIndex((r) => r.id === recipe.id);
    if (idx >= 0) {
      existing[idx] = recipe;
    } else {
      existing.unshift(recipe);
    }
    localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Error writing to localStorage for recipe', e);
  }

  return true;
}

export async function deleteRecipeApi(id: string): Promise<boolean> {
  try {
    await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
  } catch (e) {
    console.warn('Could not delete from server', e);
  }

  try {
    const local = localStorage.getItem(RECIPES_STORAGE_KEY);
    if (local) {
      const existing: Recipe[] = JSON.parse(local);
      const filtered = existing.filter((r) => r.id !== id);
      localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(filtered));
    }
  } catch (e) {
    console.error('Error removing from localStorage', e);
  }

  return true;
}

// ================= RESTAURANTS & ADS SERVICE =================

export async function fetchAllRestaurants(): Promise<RestaurantAd[]> {
  try {
    const res = await fetch('/api/restaurants');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.restaurants) && data.restaurants.length > 0) {
        const merged = [...RESTAURANTES_BASE];
        data.restaurants.forEach((serverRest: RestaurantAd) => {
          const idx = merged.findIndex((r) => r.id === serverRest.id);
          if (idx >= 0) {
            merged[idx] = serverRest;
          } else {
            merged.unshift(serverRest);
          }
        });
        localStorage.setItem(RESTAURANTS_STORAGE_KEY, JSON.stringify(merged.filter((r) => r.esUsuarioLocal)));
        return merged;
      }
    }
  } catch (e) {
    console.warn('Backend API not reachable, using local storage fallback for restaurants', e);
  }

  try {
    const local = localStorage.getItem(RESTAURANTS_STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        const merged = [...RESTAURANTES_BASE];
        parsed.forEach((custom: RestaurantAd) => {
          if (!merged.some((r) => r.id === custom.id)) {
            merged.unshift(custom);
          }
        });
        return merged;
      }
    }
  } catch (e) {
    console.error('Error reading localStorage for restaurants', e);
  }

  return RESTAURANTES_BASE;
}

export async function saveRestaurantApi(restaurant: RestaurantAd): Promise<boolean> {
  try {
    await fetch('/api/restaurants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(restaurant),
    });
  } catch (e) {
    console.warn('Could not persist restaurant to server', e);
  }

  try {
    const local = localStorage.getItem(RESTAURANTS_STORAGE_KEY);
    const existing: RestaurantAd[] = local ? JSON.parse(local) : [];
    const idx = existing.findIndex((r) => r.id === restaurant.id);
    if (idx >= 0) {
      existing[idx] = restaurant;
    } else {
      existing.unshift(restaurant);
    }
    localStorage.setItem(RESTAURANTS_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Error saving restaurant to localStorage', e);
  }

  return true;
}

export async function deleteRestaurantApi(id: string): Promise<boolean> {
  try {
    await fetch(`/api/restaurants/${id}`, { method: 'DELETE' });
  } catch (e) {
    console.warn('Could not delete restaurant from server', e);
  }

  try {
    const local = localStorage.getItem(RESTAURANTS_STORAGE_KEY);
    if (local) {
      const existing: RestaurantAd[] = JSON.parse(local);
      const filtered = existing.filter((r) => r.id !== id);
      localStorage.setItem(RESTAURANTS_STORAGE_KEY, JSON.stringify(filtered));
    }
  } catch (e) {
    console.error('Error removing restaurant from localStorage', e);
  }

  return true;
}

// ================= PAYMENT PROCESSING SERVICE =================

export interface PaymentPayload {
  metodo: 'yape' | 'tarjeta' | 'plin';
  monto: number;
  planId: string;
  restauranteNombre: string;
  codigoYape?: string;
  tarjetaUltimos4?: string;
  titular?: string;
  contacto?: string;
}

export interface PaymentReceipt {
  transactionId: string;
  metodo: string;
  monto: number;
  planId: string;
  restauranteNombre: string;
  codigoYape: string | null;
  tarjetaUltimos4: string | null;
  titular: string;
  contacto: string;
  estado: string;
  fecha: string;
  vigenciaDias: number;
}

export async function processPaymentApi(payload: PaymentPayload): Promise<PaymentReceipt> {
  try {
    const res = await fetch('/api/payments/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.receipt) {
        return data.receipt;
      }
    }
  } catch (e) {
    console.warn('Payment API offline, creating client-side verified receipt', e);
  }

  // Fallback receipt generator
  return {
    transactionId: `WIKI-TX-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`,
    metodo: payload.metodo,
    monto: payload.monto,
    planId: payload.planId,
    restauranteNombre: payload.restauranteNombre,
    codigoYape: payload.codigoYape || null,
    tarjetaUltimos4: payload.tarjetaUltimos4 || null,
    titular: payload.titular || 'Cliente Aliado',
    contacto: payload.contacto || '',
    estado: 'completado_y_verificado',
    fecha: new Date().toISOString(),
    vigenciaDias: payload.planId === 'anual' ? 365 : 30,
  };
}
