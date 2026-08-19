import { useState } from 'react';
import { Search, X, Sparkles, Flame, Apple, ArrowRight, Heart, BookOpen } from 'lucide-react';
import { RecipeCategory } from '../types';
import heroCoverImg from '../assets/images/cebiche_clasico_1787098557478.jpg';

interface WikiHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: RecipeCategory;
  setActiveCategory: (cat: RecipeCategory) => void;
  categoryCounts: Record<RecipeCategory, number>;
  onExploreRecipes: () => void;
}

export function WikiHero({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  categoryCounts,
  onExploreRecipes,
}: WikiHeroProps) {
  const categories: { clave: RecipeCategory; etiqueta: string; emoji: string }[] = [
    { clave: 'todas', etiqueta: 'Todas', emoji: '✨' },
    { clave: 'ensalada', etiqueta: 'Ensaladas', emoji: '🥗' },
    { clave: 'desayuno', etiqueta: 'Desayunos', emoji: '🥑' },
    { clave: 'pescado', etiqueta: 'Pescados', emoji: '🐟' },
    { clave: 'andino', etiqueta: 'Andinos & Superfoods', emoji: '🌾' },
    { clave: 'bebida', etiqueta: 'Bebidas & Batidos', emoji: '🥤' },
    { clave: 'postre', etiqueta: 'Postres & Snacks', emoji: '🍓' },
    { clave: 'otros', etiqueta: 'Otros', emoji: '🥣' },
  ];

  return (
    <section id="inicio" className="relative overflow-hidden pt-10 pb-14 md:pt-16 md:pb-20">
      
      {/* Background Decorative Andean Halo */}
      <div className="absolute top-10 right-5 w-96 h-96 bg-[#748158]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-5 left-5 w-80 h-80 bg-[#c1512f]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left: Editorial Hero Headline & Search */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1f3b2c]/10 text-[#1f3b2c] text-xs font-extrabold uppercase tracking-wider border border-[#1f3b2c]/20">
              <span className="w-2 h-2 rounded-full bg-[#c1512f] animate-pulse"></span>
              <span>Recetario & Saberes Nutricionales</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1f3b2c] leading-[1.08]">
              Come mejor,<br />
              <span className="italic text-[#c1512f] font-normal">vive mejor.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#5c5847] leading-relaxed max-w-xl">
              Recetas saludables, ingredientes frescos y procedimientos paso a paso explicados de forma clara. Aprende a equilibrar tus comidas y comparte tus propias preparaciones con la comunidad.
            </p>

            {/* Interactive Search Bar */}
            <div className="pt-2">
              <div className="relative max-w-xl">
                <Search className="w-5 h-5 text-[#748158] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="hero-recipe-search-input"
                  type="text"
                  placeholder="Busca por nombre, ingrediente (quinua, palta, salmón)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 text-sm sm:text-base rounded-2xl bg-[#fffbf2] border-2 border-[#d3c3a0] text-[#26241d] placeholder:text-[#8a8573] focus:outline-none focus:border-[#1f3b2c] shadow-lg shadow-[#1f3b2c]/5 transition-all"
                />
                {searchQuery && (
                  <button
                    id="hero-clear-search-btn"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#748158] hover:text-[#1f3b2c] hover:bg-[#e5d9bf]"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Pills Filter */}
            <div className="pt-1">
              <div className="text-xs font-bold uppercase tracking-wider text-[#748158] mb-2.5 flex items-center gap-1.5">
                <span>Categorías de cocina saludable:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const count = categoryCounts[cat.clave] ?? 0;
                  const isActive = activeCategory === cat.clave;
                  return (
                    <button
                      key={cat.clave}
                      id={`hero-cat-btn-${cat.clave}`}
                      onClick={() => {
                        setActiveCategory(cat.clave);
                        onExploreRecipes();
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                        isActive
                          ? 'bg-[#1f3b2c] text-[#f5efe2] border-[#1f3b2c] shadow-sm scale-105'
                          : 'bg-[#fffbf2] text-[#1f3b2c] border-[#d3c3a0] hover:border-[#1f3b2c]'
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.etiqueta}</span>
                      {count > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isActive ? 'bg-[#f5efe2]/20 text-white' : 'bg-[#e5d9bf] text-[#1f3b2c]'
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right: Andean Visual Photo Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Photo Card */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#d3c3a0] shadow-2xl shadow-[#1f3b2c]/15 bg-[#1f3b2c] aspect-4/3 sm:aspect-5/4">
                <img
                  src={heroCoverImg}
                  alt="Platos típicos y nutrición peruana"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1f3b2c]/80 via-transparent to-transparent pointer-events-none" />

                {/* Seal Badge */}
                <div className="absolute top-4 left-4 rounded-full w-24 h-24 bg-[#c1512f] text-white flex flex-col items-center justify-center p-2 text-center -rotate-6 shadow-xl border-2 border-[#fffbf2]">
                  <span className="font-editorial text-xs leading-tight font-bold">Saberes y recetas</span>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold mt-0.5">del Perú</span>
                </div>

                {/* Bottom Photo Caption */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#e5d9bf]">
                    Gastronomía consciente
                  </span>
                  <h3 className="font-editorial text-lg sm:text-xl font-bold leading-tight mt-0.5">
                    Variedad, color y equilibrio en tu mesa
                  </h3>
                </div>
              </div>

              {/* Floating Fact Card */}
              <div className="hidden sm:flex items-center gap-3 p-4 rounded-2xl bg-[#fffbf2] border border-[#d3c3a0] shadow-xl absolute -bottom-6 -left-6 max-w-xs animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div className="w-10 h-10 rounded-xl bg-[#748158]/20 text-[#1f3b2c] flex items-center justify-center shrink-0">
                  <Apple className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-editorial font-bold text-sm text-[#1f3b2c] leading-tight">
                    Comer bien empieza con conocer
                  </h4>
                  <p className="text-[11px] text-[#5c5847] mt-0.5">
                    Explora nutrientes, técnicas de cocción y recetas comunitarias.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
