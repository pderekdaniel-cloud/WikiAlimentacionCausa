import { useState, useMemo } from 'react';
import { 
  X, 
  Clock, 
  Users, 
  Flame, 
  ChefHat, 
  Check, 
  Sparkles, 
  Printer, 
  Share2, 
  Heart,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { Recipe } from '../types';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export function RecipeModal({ recipe, onClose, isFavorite, onToggleFavorite }: RecipeModalProps) {
  const [activeTab, setActiveTab] = useState<'ingredientes' | 'pasos'>('ingredientes');
  const [servingMultiplier, setServingMultiplier] = useState<number>(1);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [copiedShare, setCopiedShare] = useState(false);

  if (!recipe) return null;

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const toggleStep = (idx: number) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const resetChecks = () => {
    setCheckedIngredients({});
    setCheckedSteps({});
  };

  // Scale ingredient numbers based on serving multiplier
  const scaledIngredients = useMemo(() => {
    if (servingMultiplier === 1) return recipe.ingredientes;

    return recipe.ingredientes.map((item) => {
      // Replace numbers with scaled numbers (e.g., "2 tazas" -> "4 tazas" for 2x)
      return item.replace(/(\d+(?:\/\d+)?(?:\.\d+)?)/g, (match) => {
        // Parse fraction like 1/2 or decimal/integer
        if (match.includes('/')) {
          const [num, den] = match.split('/').map(Number);
          const val = (num / den) * servingMultiplier;
          return Number.isInteger(val) ? String(val) : val.toFixed(1).replace('.0', '');
        }
        const val = parseFloat(match) * servingMultiplier;
        return Number.isInteger(val) ? String(val) : val.toFixed(1).replace('.0', '');
      });
    });
  }, [recipe.ingredientes, servingMultiplier]);

  const totalIngredients = recipe.ingredientes.length;
  const readyIngredients = Object.values(checkedIngredients).filter(Boolean).length;
  const totalSteps = recipe.pasos.length;
  const readySteps = Object.values(checkedSteps).filter(Boolean).length;
  const stepProgress = totalSteps > 0 ? (readySteps / totalSteps) * 100 : 0;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      id="recipe-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1f3b2c]/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="recipe-detail-modal-container"
        className="bg-[#fffbf2] border-2 border-[#d3c3a0] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Hero Cover Image */}
        <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-[#1f3b2c] shrink-0">
          <img 
            src={recipe.imagen} 
            alt={recipe.nombre}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1f3b2c] via-[#1f3b2c]/40 to-transparent" />

          {/* Close & Favorite Top Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              id="recipe-modal-favorite-btn"
              onClick={() => onToggleFavorite(recipe.id)}
              className="p-2.5 rounded-full bg-[#fffbf2]/90 hover:bg-[#fffbf2] text-[#1f3b2c] backdrop-blur-md transition-transform active:scale-95 cursor-pointer shadow-md"
              title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#c1512f] text-[#c1512f]' : 'text-[#1f3b2c]'}`} />
            </button>

            <button
              id="recipe-modal-close-btn"
              onClick={onClose}
              className="p-2.5 rounded-full bg-[#fffbf2]/90 hover:bg-[#fffbf2] text-[#1f3b2c] backdrop-blur-md transition-transform active:scale-95 cursor-pointer shadow-md"
              aria-label="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Tag in cover */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#c1512f] text-white shadow-xs inline-block mb-2">
              {recipe.etiqueta || recipe.categoria}
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold leading-tight">
              {recipe.nombre}
            </h2>
            <div className="text-xs text-[#e5d9bf] mt-1 flex items-center gap-2">
              <span>Publicado por: <strong className="text-white">{recipe.autor}</strong></span>
              {recipe.esComunidad && (
                <span className="px-2 py-0.2 rounded-md bg-[#748158] text-[10px] font-bold">Comunidad</span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          
          {/* Description */}
          <p className="text-sm sm:text-base text-[#5c5847] leading-relaxed">
            {recipe.desc}
          </p>

          {/* Metadata Ticker Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-[#f5efe2] border border-[#e5d9bf]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1f3b2c]">
              <Clock className="w-4 h-4 text-[#c1512f]" />
              <div>
                <div className="text-[10px] text-[#748158] font-normal">Tiempo</div>
                <div>{recipe.tiempo}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-[#1f3b2c]">
              <Users className="w-4 h-4 text-[#748158]" />
              <div>
                <div className="text-[10px] text-[#748158] font-normal">Porciones</div>
                <div>{Number(recipe.porciones) ? Number(recipe.porciones) * servingMultiplier : recipe.porciones}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-[#1f3b2c]">
              <ChefHat className="w-4 h-4 text-[#1f3b2c]" />
              <div>
                <div className="text-[10px] text-[#748158] font-normal">Dificultad</div>
                <div>{recipe.dificultad}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-[#1f3b2c]">
              <Flame className="w-4 h-4 text-[#c1512f]" />
              <div>
                <div className="text-[10px] text-[#748158] font-normal">Energía</div>
                <div>{recipe.calorias}</div>
              </div>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex items-center justify-between gap-3 border-b border-[#e5d9bf] pb-3">
            <div className="flex gap-2">
              <button
                id="recipe-tab-ingredients-btn"
                onClick={() => setActiveTab('ingredientes')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'ingredientes'
                    ? 'bg-[#1f3b2c] text-[#f5efe2] shadow-sm'
                    : 'bg-[#f5efe2] text-[#1f3b2c] hover:bg-[#e5d9bf]'
                }`}
              >
                🥣 Ingredientes ({readyIngredients}/{totalIngredients})
              </button>

              <button
                id="recipe-tab-steps-btn"
                onClick={() => setActiveTab('pasos')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'pasos'
                    ? 'bg-[#1f3b2c] text-[#f5efe2] shadow-sm'
                    : 'bg-[#f5efe2] text-[#1f3b2c] hover:bg-[#e5d9bf]'
                }`}
              >
                ☑️ Paso a paso ({readySteps}/{totalSteps})
              </button>
            </div>

            {/* Reset checkmarks button */}
            {(readyIngredients > 0 || readySteps > 0) && (
              <button
                onClick={resetChecks}
                className="text-[11px] font-bold text-[#748158] hover:text-[#c1512f] flex items-center gap-1 cursor-pointer"
                title="Reiniciar lista"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reiniciar</span>
              </button>
            )}
          </div>

          {/* Tab 1: Ingredients with Servings Scaler */}
          {activeTab === 'ingredientes' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Servings Multiplier Buttons */}
              <div className="flex items-center justify-between bg-[#f5efe2] p-2.5 rounded-xl border border-[#e5d9bf] text-xs">
                <span className="font-bold text-[#1f3b2c]">Ajustar porciones:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((mult) => (
                    <button
                      key={mult}
                      onClick={() => setServingMultiplier(mult)}
                      className={`px-2.5 py-1 rounded-lg font-extrabold text-xs transition-all cursor-pointer ${
                        servingMultiplier === mult
                          ? 'bg-[#c1512f] text-white shadow-xs'
                          : 'bg-[#fffbf2] text-[#1f3b2c] border border-[#d3c3a0] hover:border-[#1f3b2c]'
                      }`}
                    >
                      {mult}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Ingredients Interactive Checklist */}
              <div className="space-y-2">
                <span className="text-xs text-[#748158] font-bold block">
                  Haz clic en cada ingrediente a medida que lo prepares:
                </span>
                <ul className="space-y-2">
                  {scaledIngredients.map((item, idx) => {
                    const isChecked = !!checkedIngredients[idx];
                    return (
                      <li
                        key={idx}
                        id={`recipe-ingredient-item-${idx}`}
                        onClick={() => toggleIngredient(idx)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-[#dfe9d9]/60 border-[#a7b99a] text-[#748158] line-through opacity-70'
                            : 'bg-[#fffbf2] border-[#e5d9bf] text-[#26241d] hover:border-[#748158]'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isChecked 
                            ? 'bg-[#748158] border-[#748158] text-white' 
                            : 'border-[#d3c3a0] bg-[#fffbf2]'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs sm:text-sm font-medium">{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Step-by-Step Cooking Guide */}
          {activeTab === 'pasos' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Progress bar */}
              <div className="space-y-1.5 bg-[#f5efe2] p-3 rounded-xl border border-[#e5d9bf]">
                <div className="flex items-center justify-between text-xs font-bold text-[#1f3b2c]">
                  <span>Progreso de preparación</span>
                  <span>{readySteps} de {totalSteps} completados</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#d3c3a0] overflow-hidden">
                  <div 
                    className="h-full bg-[#c1512f] rounded-full transition-all duration-300"
                    style={{ width: `${stepProgress}%` }}
                  />
                </div>
              </div>

              {/* Steps list */}
              <ol className="space-y-3">
                {recipe.pasos.map((paso, idx) => {
                  const isDone = !!checkedSteps[idx];
                  return (
                    <li
                      key={idx}
                      id={`recipe-step-item-${idx}`}
                      onClick={() => toggleStep(idx)}
                      className={`flex gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer ${
                        isDone
                          ? 'bg-[#dfe9d9]/60 border-[#a7b99a] text-[#748158]'
                          : 'bg-[#fffbf2] border-[#e5d9bf] text-[#26241d] hover:border-[#1f3b2c] shadow-xs'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 border ${
                        isDone
                          ? 'bg-[#748158] border-[#748158] text-white'
                          : 'border-[#c1512f] text-[#c1512f] bg-[#fffbf2]'
                      }`}>
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                        <p className={isDone ? 'line-through opacity-80' : 'font-normal'}>
                          {paso}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              {readySteps === totalSteps && totalSteps > 0 && (
                <div className="p-4 rounded-2xl bg-[#dfe9d9] border border-[#a7b99a] text-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-[#1f3b2c] text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-editorial font-bold text-base text-[#1f3b2c]">
                    ¡Receta lista para servir y disfrutar!
                  </h4>
                  <p className="text-xs text-[#5c5847]">
                    Comparte esta experiencia con tus seres queridos y promueve hábitos saludables.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#f5efe2] border-t border-[#e5d9bf] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-[#fffbf2] border border-[#d3c3a0] text-xs font-bold text-[#1f3b2c] hover:border-[#1f3b2c] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#748158]" />
              <span>{copiedShare ? '¡Enlace copiado!' : 'Compartir'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#fffbf2] border border-[#d3c3a0] text-xs font-bold text-[#1f3b2c] hover:border-[#1f3b2c] transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#748158]" />
              <span>Imprimir</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1f3b2c] hover:bg-[#33604a] text-[#f5efe2] text-xs font-bold transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
