import { useState, useEffect, useMemo } from 'react';
import { Recipe, RecipeCategory, RestaurantAd } from './types';
import { RECETAS_BASE } from './data/wikiData';
import { RESTAURANTES_BASE } from './data/restaurantData';
import { WikiHeader } from './components/WikiHeader';
import { WikiHero } from './components/WikiHero';
import { RecipeGrid } from './components/RecipeGrid';
import { RecipeModal } from './components/RecipeModal';
import { RecipeEditorModal } from './components/RecipeEditorModal';
import { RestaurantDirectorySection } from './components/RestaurantDirectorySection';
import { AdBookingModal } from './components/AdBookingModal';
import { HealthyPlateSimulator } from './components/HealthyPlateSimulator';
import { TipsAndBasesSection } from './components/TipsAndBasesSection';
import { HealthyGuideSection } from './components/HealthyGuideSection';
import { WikiFooter } from './components/WikiFooter';
import { 
  fetchAllRecipes, 
  saveRecipeApi, 
  deleteRecipeApi,
  fetchAllRestaurants,
  saveRestaurantApi,
  deleteRestaurantApi 
} from './services/apiService';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // Recipes state
  const [recipes, setRecipes] = useState<Recipe[]>(RECETAS_BASE);
  // Restaurants state
  const [restaurants, setRestaurants] = useState<RestaurantAd[]>(RESTAURANTES_BASE);
  // Toast alert notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const favs = localStorage.getItem('wiki_favoritos');
      return favs ? JSON.parse(favs) : ['cebiche-clasico-peruano', 'causa-limena-pollo-palta'];
    } catch {
      return ['cebiche-clasico-peruano', 'causa-limena-pollo-palta'];
    }
  });

  // Search & Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<RecipeCategory>('todas');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  // Modals state
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isAdBookingOpen, setIsAdBookingOpen] = useState(false);
  const [selectedAdPlan, setSelectedAdPlan] = useState<'basico' | 'destacado' | 'anual'>('basico');

  // Load persistent recipes and restaurants from server/local on mount
  useEffect(() => {
    fetchAllRecipes().then((data) => {
      if (data && data.length > 0) {
        setRecipes(data);
      }
    });

    fetchAllRestaurants().then((data) => {
      if (data && data.length > 0) {
        setRestaurants(data);
      }
    });
  }, []);

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wiki_favoritos', JSON.stringify(favorites));
    } catch (e) {
      console.error('Error saving favorites', e);
    }
  }, [favorites]);

  // Section Observer for active nav highlighting
  useEffect(() => {
    const sectionIds = ['inicio', 'recetas', 'alimentos', 'restaurantes', 'plato-interactivo', 'consejos', 'guia-saludable'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Category counts calculation
  const categoryCounts = useMemo(() => {
    const counts: Record<RecipeCategory, number> = {
      todas: recipes.length,
      ensalada: 0,
      bebida: 0,
      desayuno: 0,
      pescado: 0,
      postre: 0,
      andino: 0,
      otros: 0,
    };
    recipes.forEach((r) => {
      if (counts[r.categoria] !== undefined) {
        counts[r.categoria]++;
      } else {
        counts.otros++;
      }
    });
    return counts;
  }, [recipes]);

  // Filtered recipes list
  const filteredRecipes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return recipes.filter((r) => {
      // Favorites filter
      if (showFavoritesOnly && !favorites.includes(r.id)) {
        return false;
      }

      // Category filter
      if (activeCategory !== 'todas' && r.categoria !== activeCategory) {
        return false;
      }

      // Search query
      if (query) {
        const searchable = [
          r.nombre,
          r.desc,
          r.etiqueta,
          r.autor,
          ...r.ingredientes,
        ].join(' ').toLowerCase();

        return searchable.includes(query);
      }

      return true;
    });
  }, [recipes, searchQuery, activeCategory, showFavoritesOnly, favorites]);

  // Favorites toggle handler
  const handleToggleFavorite = (recipeId: string) => {
    setFavorites((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Recipe saving with persistent API + Local Storage
  const handleSaveRecipe = async (newOrUpdated: Recipe) => {
    // 1. Update state immediately
    setRecipes((prev) => {
      const idx = prev.findIndex((r) => r.id === newOrUpdated.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newOrUpdated;
        return copy;
      }
      return [newOrUpdated, ...prev];
    });

    // 2. Persist to server and localStorage
    await saveRecipeApi(newOrUpdated);
    showToast(`✓ Receta "${newOrUpdated.nombre}" guardada permanentemente.`);
  };

  // Recipe deletion handler
  const handleDeleteRecipe = async (recipeId: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
    await deleteRecipeApi(recipeId);
    showToast('Receta eliminada correctamente.');

    if (selectedRecipe?.id === recipeId) {
      setSelectedRecipe(null);
    }
  };

  // Restaurant Ad Saving & Persistence
  const handleSaveRestaurantAd = async (newAd: RestaurantAd) => {
    setRestaurants((prev) => [newAd, ...prev.filter((r) => r.id !== newAd.id)]);
    await saveRestaurantApi(newAd);
    showToast(`✓ Anuncio de "${newAd.nombre}" activado y guardado.`);
  };

  // Restaurant Ad Deletion
  const handleDeleteRestaurantAd = async (id: string) => {
    setRestaurants((prev) => prev.filter((r) => r.id !== id));
    await deleteRestaurantApi(id);
    showToast('Anuncio retirado del directorio.');
  };

  const handleOpenPublisher = (recipeToEdit?: Recipe) => {
    setEditingRecipe(recipeToEdit || null);
    setIsEditorOpen(true);
  };

  const handleOpenAdBooking = (plan: 'basico' | 'destacado' | 'anual' = 'basico') => {
    setSelectedAdPlan(plan);
    setIsAdBookingOpen(true);
  };

  const handleScrollToRecipes = () => {
    const el = document.getElementById('recetas');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('todas');
    setShowFavoritesOnly(false);
  };

  return (
    <div className="min-h-screen bg-[#f5efe2] text-[#26241d] flex flex-col grain-pattern relative">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div 
          id="toast-notification"
          className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#1f3b2c] text-[#f5efe2] border border-[#748158] shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Navigation */}
      <WikiHeader
        onOpenPublisher={() => handleOpenPublisher()}
        onOpenAdBooking={() => handleOpenAdBooking('basico')}
        favoritesCount={favorites.length}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={() => {
          setShowFavoritesOnly(!showFavoritesOnly);
          handleScrollToRecipes();
        }}
        activeSection={activeSection}
      />

      <main id="main-content" className="flex-1">
        
        {/* 2. Editorial Hero with Live Search & Categories */}
        <WikiHero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          categoryCounts={categoryCounts}
          onExploreRecipes={handleScrollToRecipes}
        />

        {/* 3. Recipes Directory with Interactive Cards */}
        <RecipeGrid
          recipes={filteredRecipes}
          onOpenRecipe={(recipe) => setSelectedRecipe(recipe)}
          onEditRecipe={(recipe) => handleOpenPublisher(recipe)}
          onDeleteRecipe={handleDeleteRecipe}
          onOpenPublisher={() => handleOpenPublisher()}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onResetFilters={handleResetFilters}
          totalFiltered={filteredRecipes.length}
        />

        {/* 4. Restaurants Directory & Dynamic Advertising Space */}
        <RestaurantDirectorySection
          restaurants={restaurants}
          onOpenBookingModal={handleOpenAdBooking}
          onDeleteRestaurant={handleDeleteRestaurantAd}
        />

        {/* 5. Interactive Healthy Plate Simulator */}
        <HealthyPlateSimulator />

        {/* 6. Daily Nutrition Bases & Practical Tips */}
        <TipsAndBasesSection />

        {/* 7. Comprehensive Scientific & Educational Healthy Guide (Includes Valle Sagrado INIA, Alimentos, MINSA) */}
        <HealthyGuideSection />

      </main>

      {/* 9. Footer */}
      <WikiFooter />

      {/* Detail Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          isFavorite={favorites.includes(selectedRecipe.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Recipe Publisher / Editor Modal */}
      <RecipeEditorModal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingRecipe(null);
        }}
        onSaveRecipe={handleSaveRecipe}
        editingRecipe={editingRecipe}
      />

      {/* Restaurant Advertising Booking & Subscription Modal */}
      <AdBookingModal
        isOpen={isAdBookingOpen}
        onClose={() => setIsAdBookingOpen(false)}
        onSaveRestaurant={handleSaveRestaurantAd}
        initialPlan={selectedAdPlan}
      />

    </div>
  );
}
