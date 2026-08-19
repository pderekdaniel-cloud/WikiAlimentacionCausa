import { useState } from 'react';
import { 
  Clock, 
  Users, 
  Flame, 
  ChefHat, 
  Heart, 
  ArrowRight, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Plus,
  BookOpen
} from 'lucide-react';
import { Recipe, RecipeCategory } from '../types';

interface RecipeGridProps {
  recipes: Recipe[];
  onOpenRecipe: (recipe: Recipe) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: string) => void;
  onOpenPublisher: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onResetFilters: () => void;
  totalFiltered: number;
}

export function RecipeGrid({
  recipes,
  onOpenRecipe,
  onEditRecipe,
  onDeleteRecipe,
  onOpenPublisher,
  favorites,
  onToggleFavorite,
  onResetFilters,
  totalFiltered,
}: RecipeGridProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const confirmDelete = (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar la receta "${name}"? Esta acción no se puede deshacer.`)) {
      onDeleteRecipe(id);
    }
  };

  return (
    <section id="recetas" className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#d3c3a0]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#748158] mb-1">
              <BookOpen className="w-3.5 h-3.5 text-[#c1512f]" />
              <span>Colección Comunitaria</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#1f3b2c]">
              Recetas Saludables
            </h2>
            <p className="text-xs sm:text-sm text-[#5c5847] mt-1">
              Platos balanceados, sabrosos y adaptados a ingredientes de fácil acceso.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span 
              id="recipes-count-badge"
              className="px-3 py-1.5 rounded-full bg-[#e5d9bf] text-[#1f3b2c] font-bold text-xs"
            >
              {totalFiltered} {totalFiltered === 1 ? 'receta' : 'recetas'}
            </span>

            <button
              id="grid-publish-recipe-btn"
              onClick={onOpenPublisher}
              className="px-3.5 py-1.5 rounded-xl bg-[#c1512f] hover:bg-[#9c3f22] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva receta</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {recipes.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-[#fffbf2] border-2 border-dashed border-[#d3c3a0] space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#f5efe2] text-[#748158] flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-editorial text-2xl font-bold text-[#1f3b2c]">
              No encontramos recetas que coincidan
            </h3>
            <p className="text-xs sm:text-sm text-[#5c5847] max-w-md mx-auto">
              Prueba cambiando las palabras clave de búsqueda o seleccionando otra categoría.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={onResetFilters}
                className="px-4 py-2 rounded-xl bg-[#1f3b2c] text-[#f5efe2] text-xs font-bold hover:bg-[#33604a] transition-colors cursor-pointer"
              >
                Restablecer filtros
              </button>
              <button
                onClick={onOpenPublisher}
                className="px-4 py-2 rounded-xl bg-[#c1512f] text-white text-xs font-bold hover:bg-[#9c3f22] transition-colors cursor-pointer"
              >
                + Publicar tu receta
              </button>
            </div>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {recipes.map((recipe) => {
              const isFav = favorites.includes(recipe.id);
              return (
                <article
                  key={recipe.id}
                  id={`recipe-card-${recipe.id}`}
                  className="bg-[#fffbf2] rounded-3xl border border-[#d3c3a0] overflow-hidden flex flex-col shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
                >
                  {/* Card Media with Tag & Favorite Button */}
                  <div className="relative h-52 sm:h-56 overflow-hidden bg-[#1f3b2c]">
                    <img
                      src={recipe.imagen}
                      alt={recipe.nombre}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1f3b2c]/80 via-transparent to-transparent pointer-events-none" />

                    {/* Tag badge */}
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#fffbf2]/95 text-[#1f3b2c] shadow-md backdrop-blur-md">
                      {recipe.etiqueta || recipe.categoria}
                    </span>

                    {/* Favorite Heart Button */}
                    <button
                      id={`recipe-card-fav-${recipe.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(recipe.id);
                      }}
                      className="absolute top-3.5 right-3.5 p-2 rounded-full bg-[#fffbf2]/90 hover:bg-[#fffbf2] text-[#1f3b2c] backdrop-blur-md transition-transform active:scale-90 cursor-pointer shadow-md"
                      title={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                      aria-label="Favorito"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-[#c1512f] text-[#c1512f]' : 'text-[#1f3b2c]'}`} />
                    </button>

                    {/* Energy & Time Quick badge on bottom image */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-[11px] font-bold">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#e5d9bf]" />
                        <span>{recipe.tiempo}</span>
                      </span>
                      <span className="flex items-center gap-1 bg-[#1f3b2c]/80 px-2 py-0.5 rounded-md border border-[#e5d9bf]/30">
                        <Flame className="w-3.5 h-3.5 text-[#c1512f]" />
                        <span>{recipe.calorias}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1 gap-3">
                    
                    <div className="space-y-1">
                      <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#1f3b2c] leading-snug group-hover:text-[#c1512f] transition-colors">
                        {recipe.nombre}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5c5847] line-clamp-2 leading-relaxed">
                        {recipe.desc}
                      </p>
                    </div>

                    {/* Micro metadata row */}
                    <div className="grid grid-cols-2 gap-2 py-2.5 my-auto border-t border-b border-[#e5d9bf] text-[11px] text-[#748158] font-bold">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#1f3b2c]" />
                        <span>{recipe.porciones} porciones</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ChefHat className="w-3.5 h-3.5 text-[#c1512f]" />
                        <span>Dificultad: {recipe.dificultad}</span>
                      </div>
                    </div>

                    {/* Card Footer: Author & Actions */}
                    <div className="pt-2 flex flex-col gap-3">
                      <div className="flex items-center justify-between text-[11px] text-[#748158]">
                        <span>Por: <strong className="text-[#1f3b2c]">{recipe.autor}</strong></span>
                        {recipe.esComunidad && (
                          <span className="px-2 py-0.5 rounded-full bg-[#748158]/15 text-[#748158] font-extrabold text-[10px]">
                            Comunidad
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          id={`recipe-card-view-btn-${recipe.id}`}
                          onClick={() => onOpenRecipe(recipe)}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-[#1f3b2c] hover:bg-[#33604a] text-[#f5efe2] text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <span>Ver receta</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        {recipe.esComunidad && (
                          <>
                            <button
                              id={`recipe-card-edit-btn-${recipe.id}`}
                              onClick={() => onEditRecipe(recipe)}
                              className="p-2.5 rounded-xl border border-[#d3c3a0] bg-[#fffbf2] hover:bg-[#e5d9bf] text-[#1f3b2c] transition-colors cursor-pointer"
                              title="Editar receta"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              id={`recipe-card-delete-btn-${recipe.id}`}
                              onClick={() => confirmDelete(recipe.id, recipe.nombre)}
                              className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                              title="Eliminar receta"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
