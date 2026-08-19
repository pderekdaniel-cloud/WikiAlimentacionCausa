import { useState, useEffect, FormEvent } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  Image as ImageIcon, 
  UploadCloud,
  ChefHat, 
  Clock, 
  Users, 
  Flame,
  CheckCircle2
} from 'lucide-react';
import { Recipe, RecipeCategory } from '../types';

interface RecipeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRecipe: (recipe: Recipe) => void;
  editingRecipe: Recipe | null;
}

export function RecipeEditorModal({
  isOpen,
  onClose,
  onSaveRecipe,
  editingRecipe,
}: RecipeEditorModalProps) {
  const [nombre, setNombre] = useState('');
  const [autor, setAutor] = useState('');
  const [categoria, setCategoria] = useState<RecipeCategory>('ensalada');
  const [etiqueta, setEtiqueta] = useState('');
  const [imagen, setImagen] = useState('');
  const [tiempo, setTiempo] = useState('20 min');
  const [porciones, setPorciones] = useState('2');
  const [dificultad, setDificultad] = useState<'Fácil' | 'Media' | 'Difícil'>('Fácil');
  const [calorias, setCalorias] = useState('320 kcal');
  const [desc, setDesc] = useState('');
  const [ingredientes, setIngredientes] = useState<string[]>(['', '']);
  const [pasos, setPasos] = useState<string[]>(['', '']);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (editingRecipe) {
      setNombre(editingRecipe.nombre);
      setAutor(editingRecipe.autor);
      setCategoria(editingRecipe.categoria);
      setEtiqueta(editingRecipe.etiqueta);
      setImagen(editingRecipe.imagen);
      setTiempo(editingRecipe.tiempo);
      setPorciones(editingRecipe.porciones);
      setDificultad(editingRecipe.dificultad);
      setCalorias(editingRecipe.calorias);
      setDesc(editingRecipe.desc);
      setIngredientes(editingRecipe.ingredientes.length ? editingRecipe.ingredientes : ['', '']);
      setPasos(editingRecipe.pasos.length ? editingRecipe.pasos : ['', '']);
    } else {
      setNombre('');
      setAutor('Comunidad');
      setCategoria('ensalada');
      setEtiqueta('Casera & Saludable');
      setImagen('');
      setTiempo('20 min');
      setPorciones('2');
      setDificultad('Fácil');
      setCalorias('350 kcal');
      setDesc('');
      setIngredientes(['1 taza de verduras frescas picadas', '1 porción de proteína magra', '1 cda de aceite de oliva o limón']);
      setPasos(['Lavar y cortar todos los ingredientes frescos.', 'Cocinar o saltear los elementos según preferencia y servir caliente.']);
    }
    setErrors({});
    setIsSuccess(false);
  }, [editingRecipe, isOpen]);

  if (!isOpen) return null;

  const handleAddIngredient = () => {
    setIngredientes([...ingredientes, '']);
  };

  const handleUpdateIngredient = (index: number, val: string) => {
    const updated = [...ingredientes];
    updated[index] = val;
    setIngredientes(updated);
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredientes.length <= 1) return;
    setIngredientes(ingredientes.filter((_, i) => i !== index));
  };

  const handleAddPaso = () => {
    setPasos([...pasos, '']);
  };

  const handleUpdatePaso = (index: number, val: string) => {
    const updated = [...pasos];
    updated[index] = val;
    setPasos(updated);
  };

  const handleRemovePaso = (index: number) => {
    if (pasos.length <= 1) return;
    setPasos(pasos.filter((_, i) => i !== index));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nombre.trim()) errs.nombre = 'El nombre de la receta es obligatorio.';
    if (!autor.trim()) errs.autor = 'El autor o alias es obligatorio.';
    if (!desc.trim()) errs.desc = 'Escribe una breve descripción de la receta.';
    const validIng = ingredientes.filter((x) => x.trim().length > 0);
    if (validIng.length === 0) errs.ingredientes = 'Añade al menos un ingrediente válido.';
    const validPasos = pasos.filter((x) => x.trim().length > 0);
    if (validPasos.length === 0) errs.pasos = 'Añade al menos un paso de preparación.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const fallbackImages = [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
    ];

    const randomFallback = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];

    const recipeData: Recipe = {
      id: editingRecipe?.id || `receta-comunidad-${Date.now()}`,
      nombre: nombre.trim(),
      autor: autor.trim(),
      categoria,
      etiqueta: etiqueta.trim() || 'Comunidad',
      imagen: imagen.trim() || randomFallback,
      tiempo: tiempo.trim() || '20 min',
      porciones: porciones.trim() || '2',
      dificultad,
      calorias: calorias.trim() || '350 kcal',
      desc: desc.trim(),
      ingredientes: ingredientes.map((x) => x.trim()).filter(Boolean),
      pasos: pasos.map((x) => x.trim()).filter(Boolean),
      esComunidad: true,
      fechaCreacion: editingRecipe?.fechaCreacion || new Date().toISOString(),
      likes: editingRecipe?.likes || 0,
    };

    setIsSuccess(true);
    setTimeout(() => {
      onSaveRecipe(recipeData);
      onClose();
    }, 600);
  };

  return (
    <div 
      id="recipe-editor-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1f3b2c]/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="recipe-editor-modal-container"
        className="bg-[#fffbf2] border-2 border-[#d3c3a0] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#f5efe2] border-b border-[#e5d9bf] flex items-center justify-between shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#c1512f] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{editingRecipe ? 'Modificar Receta' : 'Publicación Comunitaria'}</span>
            </div>
            <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#1f3b2c]">
              {editingRecipe ? 'Editar receta' : 'Comparte tu receta saludable'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#fffbf2] hover:bg-[#e5d9bf] text-[#1f3b2c] transition-colors cursor-pointer border border-[#d3c3a0]"
            aria-label="Cerrar editor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 overflow-y-auto space-y-5 flex-1">
          
          {isSuccess && (
            <div className="p-4 rounded-2xl bg-[#dfe9d9] border border-[#a7b99a] text-center space-y-1">
              <CheckCircle2 className="w-6 h-6 text-[#1f3b2c] mx-auto" />
              <h4 className="font-bold text-[#1f3b2c] text-sm">
                {editingRecipe ? '¡Receta actualizada con éxito!' : '¡Receta publicada en la Wiki!'}
              </h4>
            </div>
          )}

          {/* Nombre y Autor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1f3b2c] mb-1">
                Nombre de la receta *
              </label>
              <input
                id="editor-input-nombre"
                type="text"
                required
                placeholder="Ej. Ensalada Andina de Quinua y Palta"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c] ${
                  errors.nombre ? 'border-rose-500' : 'border-[#d3c3a0]'
                }`}
              />
              {errors.nombre && <span className="text-[10px] text-rose-500 mt-0.5 block">{errors.nombre}</span>}
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1f3b2c] mb-1">
                Autor / Alias *
              </label>
              <input
                id="editor-input-autor"
                type="text"
                required
                placeholder="Tu nombre o seudónimo"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#d3c3a0] bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
              />
            </div>
          </div>

          {/* Categoría y Etiqueta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1f3b2c] mb-1">
                Categoría *
              </label>
              <select
                id="editor-select-categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as RecipeCategory)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#d3c3a0] bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
              >
                <option value="ensalada">🥗 Ensalada</option>
                <option value="desayuno">🥑 Desayuno</option>
                <option value="pescado">🐟 Pescado</option>
                <option value="andino">🌾 Andino & Superalimento</option>
                <option value="bebida">🥤 Bebida / Batido</option>
                <option value="postre">🍓 Postre / Snack</option>
                <option value="otros">🥣 Otros</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1f3b2c] mb-1">
                Etiqueta descriptiva
              </label>
              <input
                id="editor-input-etiqueta"
                type="text"
                placeholder="Ej. Rica en Proteínas, Sin Gluten"
                value={etiqueta}
                onChange={(e) => setEtiqueta(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#d3c3a0] bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
              />
            </div>
          </div>

          {/* Métricas: Tiempo, Porciones, Dificultad, Calorías */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#748158] mb-1">
                Tiempo
              </label>
              <input
                id="editor-input-tiempo"
                type="text"
                placeholder="20 min"
                value={tiempo}
                onChange={(e) => setTiempo(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#d3c3a0] bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#748158] mb-1">
                Porciones
              </label>
              <input
                id="editor-input-porciones"
                type="text"
                placeholder="2"
                value={porciones}
                onChange={(e) => setPorciones(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#d3c3a0] bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#748158] mb-1">
                Dificultad
              </label>
              <select
                id="editor-select-dificultad"
                value={dificultad}
                onChange={(e) => setDificultad(e.target.value as 'Fácil' | 'Media' | 'Difícil')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#d3c3a0] bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
              >
                <option value="Fácil">Fácil</option>
                <option value="Media">Media</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#748158] mb-1">
                Calorías (Aprox)
              </label>
              <input
                id="editor-input-calorias"
                type="text"
                placeholder="320 kcal"
                value={calorias}
                onChange={(e) => setCalorias(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#d3c3a0] bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
              />
            </div>
          </div>

          {/* Foto o Portada de la Receta */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1f3b2c]">
                Portada / Imagen de la Receta
              </label>
              <span className="text-[10px] text-[#748158]">Sube tu foto original o ingresa un enlace</span>
            </div>

            {/* Upload Box / Preview */}
            <div className="p-3.5 rounded-2xl border-2 border-dashed border-[#d3c3a0] bg-[#fffdfa] flex flex-col sm:flex-row items-center gap-4">
              {imagen ? (
                <div className="relative w-28 h-24 rounded-xl overflow-hidden bg-[#1f3b2c] shrink-0 border border-[#d3c3a0]">
                  <img
                    src={imagen}
                    alt="Vista previa portada"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImagen('')}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors"
                    title="Eliminar imagen"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-28 h-24 rounded-xl bg-[#f5efe2] border border-[#d3c3a0] flex flex-col items-center justify-center text-[#748158] shrink-0">
                  <ImageIcon className="w-6 h-6 mb-1 opacity-60" />
                  <span className="text-[9px] font-bold">Sin imagen</span>
                </div>
              )}

              <div className="flex-1 w-full space-y-2">
                {/* File picker button */}
                <label className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-[#1f3b2c] hover:bg-[#33604a] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs">
                  <UploadCloud className="w-4 h-4" />
                  <span>Subir foto desde tu dispositivo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (typeof event.target?.result === 'string') {
                          setImagen(event.target.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>

                {/* Or URL input */}
                <div className="relative">
                  <input
                    id="editor-input-imagen"
                    type="url"
                    placeholder="O pega una URL: https://..."
                    value={imagen}
                    onChange={(e) => setImagen(e.target.value)}
                    className="w-full px-3 py-1.5 text-[11px] rounded-lg border border-[#d3c3a0] bg-white text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1f3b2c] mb-1">
              Descripción de la receta *
            </label>
            <textarea
              id="editor-textarea-desc"
              rows={3}
              required
              placeholder="Explica brevemente los sabores, origen o por qué es una opción saludable..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c] leading-relaxed ${
                errors.desc ? 'border-rose-500' : 'border-[#d3c3a0]'
              }`}
            />
            {errors.desc && <span className="text-[10px] text-rose-500 mt-0.5 block">{errors.desc}</span>}
          </div>

          {/* Dynamic Ingredients Builder */}
          <div className="p-4 rounded-2xl bg-[#f5efe2] border border-[#e5d9bf] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#1f3b2c]">
                Ingredientes necesarios *
              </label>
              <button
                type="button"
                id="editor-add-ingredient-btn"
                onClick={handleAddIngredient}
                className="text-xs font-bold text-[#c1512f] hover:text-[#9c3f22] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir ingrediente</span>
              </button>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {ingredientes.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-5 text-center text-xs font-bold text-[#748158]">{idx + 1}.</span>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 1 taza de quinua cocida o 1 palta madura"
                    value={ing}
                    onChange={(e) => handleUpdateIngredient(idx, e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#d3c3a0] bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
                  />
                  {ingredientes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(idx)}
                      className="p-2 text-[#8a8573] hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar ingrediente"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.ingredientes && <span className="text-[10px] text-rose-500 block">{errors.ingredientes}</span>}
          </div>

          {/* Dynamic Steps Builder */}
          <div className="p-4 rounded-2xl bg-[#f5efe2] border border-[#e5d9bf] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#1f3b2c]">
                Procedimiento paso a paso *
              </label>
              <button
                type="button"
                id="editor-add-step-btn"
                onClick={handleAddPaso}
                className="text-xs font-bold text-[#c1512f] hover:text-[#9c3f22] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir paso</span>
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {pasos.map((paso, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1f3b2c] text-[#f5efe2] text-[10px] font-bold flex items-center justify-center shrink-0 mt-1.5">
                    {idx + 1}
                  </span>
                  <textarea
                    rows={2}
                    required
                    placeholder={`Describe el paso ${idx + 1}...`}
                    value={paso}
                    onChange={(e) => handleUpdatePaso(idx, e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#d3c3a0] bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c] leading-relaxed"
                  />
                  {pasos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePaso(idx)}
                      className="p-2 text-[#8a8573] hover:text-rose-600 rounded-lg transition-colors cursor-pointer mt-1"
                      title="Eliminar paso"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.pasos && <span className="text-[10px] text-rose-500 block">{errors.pasos}</span>}
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-[#e5d9bf] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#d3c3a0] bg-[#fffbf2] text-[#1f3b2c] text-xs font-bold hover:bg-[#e5d9bf] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="editor-submit-btn"
              className="px-6 py-2.5 rounded-xl bg-[#c1512f] hover:bg-[#9c3f22] text-white text-xs font-extrabold shadow-md shadow-[#c1512f]/30 transition-all cursor-pointer"
            >
              {editingRecipe ? 'Guardar Cambios' : 'Publicar Receta en la Wiki'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
