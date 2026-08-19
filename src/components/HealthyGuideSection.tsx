import { useState, MouseEvent } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Check, 
  ShieldAlert, 
  ExternalLink,
  Flame,
  Award,
  Globe,
  AlertTriangle,
  Heart,
  Droplet,
  Sun,
  Mountain,
  Compass,
  CheckCircle2,
  Store,
  MapPin,
  Utensils,
  Grid,
  List,
  Search,
  Apple,
  Fish,
  Wheat,
  ShieldCheck,
  Layers,
  Leaf
} from 'lucide-react';
import { MITOS_ALIMENTACION, FOOD_GROUPS } from '../data/wikiData';
import { INIA_NATIVE_PRODUCTS, SABORES_URUBAMBA_DISHES, MERCADO_URUBAMBA_INFO } from '../data/iniaData';
import { IniaProduct, NutritionalBadgeType, FoodItem } from '../types';

export function HealthyGuideSection() {
  const [openMythId, setOpenMythId] = useState<string | null>('mito-1');
  const [activeTab, setActiveTab] = useState<
    'inia-urubamba' | 'alimentos-grupos' | 'mensajes' | 'nutrientes' | 'regiones' | 'octogonos' | 'mitos'
  >('inia-urubamba');

  // State for INIA Valle Sagrado tab
  const [selectedCropCategory, setSelectedCropCategory] = useState<string>('todos');
  const [searchCrop, setSearchCrop] = useState<string>('');
  const [viewModeCrop, setViewModeCrop] = useState<'cards' | 'table'>('cards');

  // State for Food Groups tab
  const [selectedFoodGroup, setSelectedFoodGroup] = useState<number>(0);
  const [activeFoodItem, setActiveFoodItem] = useState<FoodItem | null>(null);

  const toggleMyth = (id: string) => {
    setOpenMythId(openMythId === id ? null : id);
  };

  const cropCategories = [
    { id: 'todos', label: 'Todos los Cultivos (12)', icon: '🌱' },
    { id: 'grano', label: 'Granos Andinos', icon: '🌾' },
    { id: 'tuberculo', label: 'Tubérculos', icon: '🥔' },
    { id: 'leguminosa', label: 'Leguminosas', icon: '🫘' },
    { id: 'fruta', label: 'Frutas Nativas', icon: '🫐' },
    { id: 'raiz', label: 'Raíces Funcionales', icon: '🌿' },
  ];

  const filteredIniaProducts = INIA_NATIVE_PRODUCTS.filter((prod) => {
    const matchesCat = selectedCropCategory === 'todos' || prod.categoria === selectedCropCategory;
    const matchesSearch = prod.producto.toLowerCase().includes(searchCrop.toLowerCase()) ||
                          prod.informacion.toLowerCase().includes(searchCrop.toLowerCase()) ||
                          prod.valorNutricional.toLowerCase().includes(searchCrop.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getBadgeStyle = (tipo: NutritionalBadgeType) => {
    switch (tipo) {
      case 'proteinas':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'fibra':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'hierro':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'vitaminas':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'energia':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      case 'antioxidantes':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  const getGroupIcon = (iconName: string) => {
    switch (iconName) {
      case 'Apple':
        return Apple;
      case 'Fish':
        return Fish;
      case 'Wheat':
        return Wheat;
      case 'ShieldCheck':
      default:
        return ShieldCheck;
    }
  };

  const mensajesMinsa = [
    { num: '01', titulo: 'Alimentos Naturales y Frescos', desc: 'Elige y disfruta todos los días de la variedad de alimentos naturales disponibles en tu localidad, reduciendo el consumo de productos ultraprocesados.' },
    { num: '02', titulo: 'Verduras de Varios Colores', desc: 'Acompaña tus almuerzos y cenas con ensaladas de verduras frescas o cocidas de distintos colores (rojo, verde, naranja, morado).' },
    { num: '03', titulo: 'Frutas Frescas de Estación', desc: 'Consume al menos 3 porciones de fruta al día. Aprovecha las frutas locales de estación por su mayor frescura, sabor y contenido vitamínico.' },
    { num: '04', titulo: 'Menestras 2 a 3 Veces por Semana', desc: 'Fortalece tu cuerpo consumiendo lentejas, frejoles, garbanzos, arvejas, pallares o tarwi. Combínalas con cereales para una proteína vegetal completa.' },
    { num: '05', titulo: 'Pescados Azules e Hidratación', desc: 'Incluye pescados como bonito, jurel, caballa o trucha al menos 2 veces por semana por su alto contenido de ácidos grasos Omega-3.' },
    { num: '06', titulo: 'Prevención de Anemia (Hierro)', desc: 'Consume alimentos de origen animal ricos en hierro como sangrecita, bazo, hígado o carnes rojas para prevenir la anemia infantil y del adulto.' },
    { num: '07', titulo: 'Lácteos o Proteínas Ligeras', desc: 'Incluye queso fresco pasteurizado, leche o yogur natural para asegurar el aporte de calcio y aminoácidos para la salud ósea.' },
    { num: '08', titulo: 'Hidratación con Agua Pura', desc: 'Bebe entre 6 y 8 vasos de agua hervida o purificada al día. Evita reemplazar el agua con gaseosas o refrescos azucarados en caja o sobre.' },
    { num: '09', titulo: 'Modera Azúcar, Dulces y Postres', desc: 'Disminuye el azúcar que agregas a las bebidas e infusiones. Prefiere los sabores naturales de las frutas e infusiones de hierbas aromáticas.' },
    { num: '10', titulo: 'Controla la Sal y Alimentos con Octógonos', desc: 'Reduce el uso de sal en las comidas y evita alimentos que lleven los octógonos de advertencia: ALTO EN SODIO, GRASAS SATURADAS o AZÚCAR.' },
    { num: '11', titulo: 'Cocina en Casa y Come en Compañía', desc: 'Comparte la comida en familia o con amigos en un ambiente agradable, masticando despacio y libre de pantallas distractores.' },
    { num: '12', titulo: 'Actividad Física Diaria (30 min)', desc: 'Mantén tu cuerpo activo caminando, bailando o haciendo deporte al menos 30 minutos al día para proteger el corazón y mantener un peso saludable.' },
  ];

  const regionesNutricionales = [
    {
      region: 'Costa Peruana',
      icono: '🌊',
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      destacados: [
        { nombre: 'Pescados Azules (Bonito, Caballa, Jurel)', aporte: 'Omega-3 DHA/EPA para cerebro y sistema cardiovascular.' },
        { nombre: 'Palta Fuerte y Hass', aporte: 'Grasas monoinsaturadas y vitamina E antioxidante.' },
        { nombre: 'Limón Sutil y Cítricos', aporte: 'Vitamina C que potencia la absorción de hierro vegetal.' },
        { nombre: 'Espárragos y Alcachofas', aporte: 'Fibra prebiótica y minerales diuréticos.' },
      ]
    },
    {
      region: 'Sierra Andina & Cusco',
      icono: '🏔️',
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      destacados: [
        { nombre: 'Quinua, Kiwicha y Cañihua', aporte: 'Proteínas completas con aminoácidos esenciales y fósforo.' },
        { nombre: 'Papas Nativas y Camote', aporte: 'Carbohidratos complejos de absorción lenta y antocianinas.' },
        { nombre: 'Tarwi (Chocho Andino)', aporte: 'Más del 40% de proteína vegetal y calcio biodisponible.' },
        { nombre: 'Maíz Morado y Maíz Gigante', aporte: 'Poderoso antioxidante natural gracias a las antocianinas.' },
      ]
    },
    {
      region: 'Amazonía & Selva',
      icono: '🌴',
      color: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      destacados: [
        { nombre: 'Camu Camu', aporte: 'La fruta con mayor concentración de vitamina C del planeta (hasta 40x que la naranja).' },
        { nombre: 'Aguaje', aporte: 'Provitamina A (betacarotenos) y fitoestrógenos naturales.' },
        { nombre: 'Sacha Inchi (Maní del Inca)', aporte: 'Aceite vegetal con récord de ácidos grasos Omega-3 y Omega-6.' },
        { nombre: 'Castaña Amazónica', aporte: 'Fuente inigualable de selenio y magnesio para la tiroides.' },
      ]
    }
  ];

  const octogonosData = [
    {
      titulo: 'ALTO EN AZÚCAR',
      peligro: 'Riesgo de sobrepeso, diabetes tipo 2, hígado graso y caries.',
      recomendacion: 'Evita gaseosas, jugos envasados, galletas rellenas y cereales azucarados. Endulza con frutas enteras o canela.',
      color: 'bg-black text-white border-white/20'
    },
    {
      titulo: 'ALTO EN SODIO',
      peligro: 'Asociado a hipertensión arterial, retención de líquidos y daño renal.',
      recomendacion: 'Modera snacks embolsados, sopas instantáneas, embutidos y cubitos de sazonador. Sazona con hierbas frescas y ajo.',
      color: 'bg-black text-white border-white/20'
    },
    {
      titulo: 'ALTO EN GRASAS SATURADAS',
      peligro: 'Eleva el colesterol LDL (“malo”) y aumenta el riesgo de infarto cardíaco.',
      recomendacion: 'Limita frituras industriales, comida chatarra y bollería. Prefiere cocinar al vapor, a la plancha o al horno.',
      color: 'bg-black text-white border-white/20'
    },
    {
      titulo: 'CONTIENE GRASAS TRANS',
      peligro: 'El tipo de grasa más perjudicial para el sistema cardiovascular.',
      recomendacion: 'Evita productos con aceites vegetales parcialmente hidrogenados (margarinas industriales, coberturas de repostería comercial).',
      color: 'bg-black text-white border-white/20'
    },
  ];

  return (
    <section id="guia-saludable" className="py-16 md:py-24 bg-gradient-to-br from-[#193225] via-[#1f3b2c] to-[#152a1e] text-[#f5efe2] relative overflow-hidden">
      
      {/* Decorative Background Lighting */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#c1512f]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-[#748158]/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Guide Header */}
        <div className="max-w-4xl mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#c1512f]/20 text-[#e8b69e] mb-3 border border-[#c1512f]/30">
            <BookOpen className="w-4 h-4 text-[#e8b69e]" />
            <span>Enciclopedia Nutricional, Cultivos Nativos INIA & Saberes del Perú</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.12]">
            Guía Integral de Alimentación & Saberes Andinos
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#d9e1d6] leading-relaxed">
            Toda la información científica y tradicional unificada en un solo lugar: cultivos nativos representativos de <strong>Urubamba y el Valle Sagrado (INIA/MINAM)</strong>, grupos de alimentos, los 12 mensajes oficiales del <strong>MINSA/INS</strong>, lectura de octógonos y desmitificación nutricional.
          </p>
        </div>

        {/* Unified Navigation Tabs Bar */}
        <div className="flex flex-wrap gap-2 mb-8 p-1.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
          <button
            onClick={() => setActiveTab('inia-urubamba')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'inia-urubamba'
                ? 'bg-[#c1512f] text-white shadow-lg scale-102'
                : 'text-[#d9e1d6] hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🏔️</span>
            <span>Valle Sagrado & INIA (Cultivos Nativos)</span>
          </button>

          <button
            onClick={() => setActiveTab('alimentos-grupos')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'alimentos-grupos'
                ? 'bg-[#c1512f] text-white shadow-lg scale-102'
                : 'text-[#d9e1d6] hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🍎</span>
            <span>Grupos de Alimentos & Superfoods</span>
          </button>

          <button
            onClick={() => setActiveTab('mensajes')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'mensajes'
                ? 'bg-[#c1512f] text-white shadow-lg scale-102'
                : 'text-[#d9e1d6] hover:text-white hover:bg-white/10'
            }`}
          >
            <span>📋</span>
            <span>12 Mensajes MINSA</span>
          </button>

          <button
            onClick={() => setActiveTab('nutrientes')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'nutrientes'
                ? 'bg-[#c1512f] text-white shadow-lg scale-102'
                : 'text-[#d9e1d6] hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🥗</span>
            <span>Nutrientes Esenciales</span>
          </button>

          <button
            onClick={() => setActiveTab('regiones')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'regiones'
                ? 'bg-[#c1512f] text-white shadow-lg scale-102'
                : 'text-[#d9e1d6] hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🇵🇪</span>
            <span>Biodiversidad Regional</span>
          </button>

          <button
            onClick={() => setActiveTab('octogonos')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'octogonos'
                ? 'bg-[#c1512f] text-white shadow-lg scale-102'
                : 'text-[#d9e1d6] hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🛑</span>
            <span>Guía de Octógonos</span>
          </button>

          <button
            onClick={() => setActiveTab('mitos')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'mitos'
                ? 'bg-[#c1512f] text-white shadow-lg scale-102'
                : 'text-[#d9e1d6] hover:text-white hover:bg-white/10'
            }`}
          >
            <span>💡</span>
            <span>Mitos vs Realidad</span>
          </button>
        </div>

        {/* Tab Contents Container */}
        <div className="space-y-8">
          
          {/* ========================================================================= */}
          {/* TAB 1: VALLE SAGRADO & INIA (Cultivos Nativos, Sabores y Mercado) */}
          {/* ========================================================================= */}
          {activeTab === 'inia-urubamba' && (
            <div className="space-y-10 animate-in fade-in duration-200">
              
              {/* Header Card for INIA */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#fffbf2] text-[#26241d] border border-[#e5d9bf] shadow-xl space-y-6">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e5d9bf]">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#c1512f] mb-1">
                      <Award className="w-4 h-4" />
                      <span>Investigación INIA & MINAM • Cusco, Perú</span>
                    </div>
                    <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1f3b2c]">
                      Productos e Ingredientes representativos de Urubamba y del Valle Sagrado de los Incas
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5c5847] mt-1 leading-relaxed">
                      Información técnica sobre descripción botánica, usos culinarios tradicionales y perfil nutricional de los cultivos andinos.
                    </p>
                  </div>
                </div>

                {/* Nutritional Badges Legend */}
                <div className="p-4 rounded-2xl bg-[#f5efe2] border border-[#d3c3a0]">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#748158] block mb-2">
                    Etiquetas de Valor Nutricional del INIA:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      <span>🥚</span>
                      <span>Proteínas</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                      <span>🌾</span>
                      <span>Fibra</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
                      <span>🩸</span>
                      <span>Hierro</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-900 border border-orange-300">
                      <span>🍊</span>
                      <span>Vitaminas</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-900 border border-yellow-300">
                      <span>⚡</span>
                      <span>Energía</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">
                      <span>🛡️</span>
                      <span>Antioxidantes</span>
                    </span>
                  </div>
                </div>

                {/* Filter and Search Bar for crops */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {cropCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCropCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                          selectedCropCategory === cat.id
                            ? 'bg-[#1f3b2c] text-[#f5efe2] border-[#1f3b2c] shadow-xs'
                            : 'bg-white text-[#1f3b2c] border-[#d3c3a0] hover:bg-[#e5d9bf]'
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 sm:w-60">
                      <Search className="w-3.5 h-3.5 text-[#748158] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Buscar cultivo (maíz, quinua...)"
                        value={searchCrop}
                        onChange={(e) => setSearchCrop(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#d3c3a0] bg-white text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
                      />
                    </div>

                    <div className="flex items-center border border-[#d3c3a0] rounded-xl overflow-hidden bg-white p-0.5">
                      <button
                        onClick={() => setViewModeCrop('cards')}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          viewModeCrop === 'cards' ? 'bg-[#1f3b2c] text-white' : 'text-[#748158] hover:text-[#1f3b2c]'
                        }`}
                        title="Vista en tarjetas"
                      >
                        <Grid className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setViewModeCrop('table')}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          viewModeCrop === 'table' ? 'bg-[#1f3b2c] text-white' : 'text-[#748158] hover:text-[#1f3b2c]'
                        }`}
                        title="Vista en tabla técnica"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Display Crops: Cards or Table */}
                {viewModeCrop === 'cards' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredIniaProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="p-5 rounded-2xl bg-white border-2 border-[#d3c3a0] flex flex-col justify-between gap-3 shadow-xs hover:border-[#1f3b2c] transition-all"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl p-2 rounded-xl bg-[#f5efe2] border border-[#d3c3a0]">
                              {prod.icono}
                            </span>
                            <div>
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#c1512f] block">
                                {prod.categoria}
                              </span>
                              <h4 className="font-editorial text-lg font-bold text-[#1f3b2c] leading-tight">
                                {prod.producto}
                              </h4>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {prod.etiquetas.map((tag, idx) => (
                              <span
                                key={idx}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${getBadgeStyle(tag.tipo)}`}
                              >
                                <span>{tag.icono}</span>
                                <span>{tag.texto}</span>
                              </span>
                            ))}
                          </div>

                          <p className="text-xs text-[#5c5847] leading-relaxed">
                            {prod.informacion}
                          </p>

                          <div className="p-2.5 rounded-xl bg-[#f5efe2] border border-[#e5d9bf] text-xs">
                            <strong className="text-[#1f3b2c] block mb-0.5 text-[11px] font-bold">
                              Valor Nutricional:
                            </strong>
                            <span className="text-[#5c5847] text-[11px] leading-relaxed">
                              {prod.valorNutricional}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#e5d9bf] space-y-1">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#748158] block">
                            Productos que se elaboran:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {prod.productosElaborados.map((item, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-[#f5efe2] border border-[#d3c3a0] text-[10px] text-[#1f3b2c]"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border-2 border-[#d3c3a0] bg-white shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#1f3b2c] text-[#f5efe2] uppercase text-[9px] tracking-wider font-extrabold">
                        <tr>
                          <th className="py-3 px-3">Producto</th>
                          <th className="py-3 px-3">Información & Origen</th>
                          <th className="py-3 px-3">Valor Nutricional / Aporte</th>
                          <th className="py-3 px-3">Etiquetas</th>
                          <th className="py-3 px-3">Productos Elaborados</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e5d9bf]">
                        {filteredIniaProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-[#f5efe2]/70 transition-colors">
                            <td className="py-3 px-3 font-bold text-[#1f3b2c] whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span className="text-lg">{p.icono}</span>
                                <div>
                                  <div className="font-editorial text-xs font-bold">{p.producto}</div>
                                  <span className="text-[8px] text-[#748158] uppercase font-bold">{p.categoria}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-[#5c5847] max-w-xs text-[11px] leading-relaxed">
                              {p.informacion}
                              <span className="block text-[9px] text-[#748158] mt-0.5 font-semibold">📍 {p.origenValle}</span>
                            </td>
                            <td className="py-3 px-3 text-[#5c5847] max-w-xs text-[11px] leading-relaxed">
                              {p.valorNutricional}
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex flex-wrap gap-1">
                                {p.etiquetas.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[8px] font-bold border ${getBadgeStyle(tag.tipo)}`}
                                  >
                                    <span>{tag.icono}</span>
                                    <span>{tag.texto}</span>
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-[#26241d]">
                              <ul className="list-disc list-inside space-y-0.5 text-[10px] text-[#5c5847]">
                                {p.productosElaborados.map((item, idx) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>

              {/* Sabores de Urubamba Subcard */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#fffbf2] text-[#26241d] border border-[#e5d9bf] shadow-xl space-y-6">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#c1512f]">
                  <Utensils className="w-4 h-4" />
                  <span>Platos Típicos Tradicionales del Cusco</span>
                </div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1f3b2c]">
                  Sabores de Urubamba y del Valle Sagrado
                </h3>
                <p className="text-xs sm:text-sm text-[#5c5847] leading-relaxed">
                  Las recetas emblemáticas que combinan los cultivos nativos del Valle Sagrado:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
                  {SABORES_URUBAMBA_DISHES.map((plato) => (
                    <div
                      key={plato.id}
                      className="p-5 rounded-2xl bg-white border-2 border-[#d3c3a0] flex flex-col justify-between gap-3 shadow-xs hover:border-[#1f3b2c] transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl p-2 rounded-xl bg-[#f5efe2] border border-[#d3c3a0]">
                            {plato.icono}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#1f3b2c] text-[#f5efe2] font-mono font-bold">
                            {plato.iconoNutricional}
                          </span>
                        </div>

                        <h4 className="font-editorial text-base font-bold text-[#1f3b2c]">
                          {plato.nombre}
                        </h4>

                        <p className="text-xs text-[#5c5847] leading-relaxed">
                          {plato.descripcion}
                        </p>

                        <div className="p-2.5 rounded-xl bg-[#f5efe2] border border-[#e5d9bf] space-y-1 text-xs">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#748158] block">
                            Ingredientes Clave:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {plato.ingredientesClave.map((ing, i) => (
                              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#1f3b2c] border border-[#d3c3a0]">
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#e5d9bf] flex items-center justify-between text-xs">
                        <span className="text-[10px] text-[#c1512f] font-bold">
                          {plato.etiquetas[0]}
                        </span>
                        <span className="text-[9px] text-[#748158]">
                          Valle Sagrado
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mercado de Productores de Urubamba Subcard */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white/10 text-white backdrop-blur-md border border-white/15 shadow-xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#e5d9bf] text-xs font-bold uppercase tracking-wider border border-white/10">
                  <Store className="w-3.5 h-3.5 text-[#c1512f]" />
                  <span>Comercio Directo y Soberanía Alimentaria</span>
                </div>

                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
                  {MERCADO_URUBAMBA_INFO.nombre}
                </h3>

                <p className="text-xs sm:text-sm text-[#d9e1d6] leading-relaxed max-w-3xl">
                  {MERCADO_URUBAMBA_INFO.descripcion}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#e5d9bf] pb-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#c1512f]" />
                    <span>{MERCADO_URUBAMBA_INFO.ubicacion}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>📅</span>
                    <span>{MERCADO_URUBAMBA_INFO.diasPrincipales}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  {MERCADO_URUBAMBA_INFO.pilares.map((pilar, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <div className="flex items-center gap-1 text-xs font-bold text-[#e5d9bf]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{pilar.titulo}</span>
                      </div>
                      <p className="text-[10px] text-[#d9e1d6] leading-relaxed">
                        {pilar.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: GRUPOS DE ALIMENTOS & SUPERALIMENTOS */}
          {/* ========================================================================= */}
          {activeTab === 'alimentos-grupos' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="p-6 sm:p-8 rounded-3xl bg-[#fffbf2] text-[#26241d] border border-[#e5d9bf] shadow-xl space-y-6">
                
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#748158] mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#c1512f]" />
                    <span>Clasificación Nutricional & Propiedades</span>
                  </div>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1f3b2c]">
                    Grupos de Alimentos Saludables y Superalimentos
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5c5847] mt-1">
                    Explora las propiedades de los alimentos de la tierra y del mar peruano:
                  </p>
                </div>

                {/* Group Selector Tabs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {FOOD_GROUPS.map((group, idx) => {
                    const Icon = getGroupIcon(group.icono);
                    const isSelected = selectedFoodGroup === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedFoodGroup(idx);
                          setActiveFoodItem(null);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#1f3b2c] text-[#f5efe2] border-[#1f3b2c] shadow-md scale-[1.02]'
                            : 'bg-white text-[#26241d] border-[#d3c3a0] hover:border-[#1f3b2c]'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-[#f5efe2]/20 text-[#f5efe2]' : 'bg-[#e5d9bf] text-[#1f3b2c]'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-[#c1512f] text-white' : 'bg-[#e5d9bf] text-[#1f3b2c]'
                          }`}>
                            {group.items.length} alimentos
                          </span>
                        </div>

                        <div>
                          <h4 className="font-editorial text-sm sm:text-base font-bold leading-snug">
                            {group.grupo}
                          </h4>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Group Details & Items */}
                <div className="p-5 rounded-2xl bg-[#f5efe2] border border-[#d3c3a0] space-y-4">
                  <div>
                    <h4 className="font-editorial text-xl font-bold text-[#1f3b2c]">
                      {FOOD_GROUPS[selectedFoodGroup].grupo}
                    </h4>
                    <p className="text-xs text-[#5c5847] mt-0.5 leading-relaxed">
                      {FOOD_GROUPS[selectedFoodGroup].descripcion}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {FOOD_GROUPS[selectedFoodGroup].items.map((item, idx) => {
                      const isItemActive = activeFoodItem?.nombre === item.nombre;
                      return (
                        <div
                          key={idx}
                          onClick={() => setActiveFoodItem(isItemActive ? null : item)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                            isItemActive
                              ? 'bg-[#dfe9d9] border-[#748158] shadow-xs ring-2 ring-[#748158]'
                              : 'bg-white border-[#e5d9bf] hover:border-[#748158]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-[#1f3b2c]">
                              {item.nombre}
                            </span>
                            <span className="w-4 h-4 rounded-full bg-[#1f3b2c]/10 flex items-center justify-center text-[9px] text-[#1f3b2c] font-bold">
                              ✓
                            </span>
                          </div>

                          <p className="text-[11px] text-[#5c5847] leading-relaxed">
                            {item.beneficio}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: 12 MENSAJES MINSA */}
          {/* ========================================================================= */}
          {activeTab === 'mensajes' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#fffbf2] text-[#26241d] border border-[#e5d9bf] shadow-xl">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#c1512f] mb-2">
                  <Award className="w-4 h-4" />
                  <span>Lineamientos Oficiales del Ministerio de Salud del Perú</span>
                </div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1f3b2c] mb-2">
                  Los 12 Mensajes Clave para una Vida Saludable
                </h3>
                <p className="text-xs sm:text-sm text-[#5c5847] leading-relaxed max-w-3xl">
                  Publicadas por el Centro Nacional de Alimentación y Nutrición (CENAN - INS), estas directrices resumen las mejores prácticas basadas en la evidencia y en la riqueza agroecológica del Perú.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
                  {mensajesMinsa.map((item) => (
                    <div
                      key={item.num}
                      className="p-4 rounded-2xl bg-[#f5efe2] border border-[#e5d9bf] flex flex-col gap-2 hover:border-[#748158] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold font-mono px-2 py-0.5 rounded-md bg-[#1f3b2c] text-[#f5efe2]">
                          #{item.num}
                        </span>
                      </div>
                      <h4 className="font-editorial text-base font-bold text-[#1f3b2c] leading-snug">
                        {item.titulo}
                      </h4>
                      <p className="text-xs text-[#5c5847] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: NUTRIENTES ESENCIALES */}
          {/* ========================================================================= */}
          {activeTab === 'nutrientes' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#fffbf2] text-[#26241d] border border-[#e5d9bf] shadow-xl space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1f3b2c]">
                  Nutrientes Esenciales del Organismo
                </h3>
                <p className="text-xs sm:text-sm text-[#5c5847] mt-1">
                  Los macronutrientes y micronutrientes cumplen funciones biológicas insustituibles en el cuerpo humano:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-[#f5efe2] border border-[#e5d9bf] space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#c1512f]">Combustible Principal</span>
                  <h4 className="font-editorial text-lg font-bold text-[#1f3b2c]">Carbohidratos Complejos</h4>
                  <p className="text-xs text-[#5c5847] leading-relaxed">
                    Brindan energía sostenida sin picos bruscos de glucosa. Prefiere fuentes andinas e integrales como quinua, camote, avena entera, papas con piel y maíz gigante.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#f5efe2] border border-[#e5d9bf] space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#c1512f]">Estructura y Reparación</span>
                  <h4 className="font-editorial text-lg font-bold text-[#1f3b2c]">Proteínas de Alto Valor</h4>
                  <p className="text-xs text-[#5c5847] leading-relaxed">
                    Fundamentales para músculos, anticuerpos y síntesis celular. Destacan los pescados frescos, huevos de corral, pollo, lentejas, frejoles y tarwi andino.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#f5efe2] border border-[#e5d9bf] space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#c1512f]">Hormonas y Protección</span>
                  <h4 className="font-editorial text-lg font-bold text-[#1f3b2c]">Grasas Saludables (Lípidos)</h4>
                  <p className="text-xs text-[#5c5847] leading-relaxed">
                    Protegen el corazón y permiten absorber vitaminas A, D, E y K. Fuentes clave: palta peruana, aceite de oliva virgen extra, semillas de chía, linaza y frutos secos.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#f5efe2] border border-[#e5d9bf] space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#748158]">Microbiota y Saciedad</span>
                  <h4 className="font-editorial text-lg font-bold text-[#1f3b2c]">Fibra Dietética</h4>
                  <p className="text-xs text-[#5c5847] leading-relaxed">
                    Regula el tránsito intestinal, equilibra la microbiota y reduce el colesterol LDL. Presente en frutas enteras, verduras variadas, legumbres y raíces como el yacón.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#f5efe2] border border-[#e5d9bf] space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#748158]">Inmunidad y Enzimas</span>
                  <h4 className="font-editorial text-lg font-bold text-[#1f3b2c]">Vitaminas y Minerales</h4>
                  <p className="text-xs text-[#5c5847] leading-relaxed">
                    Hierro (contra la anemia), zinc, calcio, vitamina C, vitamina A y complejo B. Obtenidos al combinar alimentos de todos los colores del plato.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#f5efe2] border border-[#e5d9bf] space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#748158]">Medio Vital</span>
                  <h4 className="font-editorial text-lg font-bold text-[#1f3b2c]">Agua Pura</h4>
                  <p className="text-xs text-[#5c5847] leading-relaxed">
                    Facilita el transporte de nutrientes, regula la temperatura corporal y ayuda a la eliminación natural de toxinas. Meta diaria: 6 a 8 vasos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: BIODIVERSIDAD REGIONAL */}
          {/* ========================================================================= */}
          {activeTab === 'regiones' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#fffbf2] text-[#26241d] border border-[#e5d9bf] shadow-xl">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#c1512f] mb-2">
                  <Compass className="w-4 h-4" />
                  <span>Riqueza Agroecológica del Perú</span>
                </div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1f3b2c] mb-2">
                  Alimentos Emblemáticos de la Costa, Sierra y Selva
                </h3>
                <p className="text-xs sm:text-sm text-[#5c5847] leading-relaxed">
                  Aprovechar los alimentos nativos y de proximidad garantiza mayor densidad nutricional, menor huella de carbono y precios accesibles.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
                  {regionesNutricionales.map((reg) => (
                    <div
                      key={reg.region}
                      className="p-5 rounded-2xl bg-[#f5efe2] border-2 border-[#d3c3a0] flex flex-col gap-3"
                    >
                      <div className="flex items-center gap-2 pb-2 border-b border-[#d3c3a0]">
                        <span className="text-2xl">{reg.icono}</span>
                        <h4 className="font-editorial text-lg font-bold text-[#1f3b2c]">
                          {reg.region}
                        </h4>
                      </div>

                      <div className="space-y-3">
                        {reg.destacados.map((item, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-white border border-[#e5d9bf] text-xs">
                            <strong className="text-[#1f3b2c] block mb-0.5 font-bold">
                              • {item.nombre}
                            </strong>
                            <span className="text-[#5c5847] leading-relaxed">
                              {item.aporte}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: GUÍA DE OCTÓGONOS */}
          {/* ========================================================================= */}
          {activeTab === 'octogonos' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#fffbf2] text-[#26241d] border border-[#e5d9bf] shadow-xl space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#c1512f]">
                <AlertTriangle className="w-4 h-4" />
                <span>Ley N° 30021 de Promoción de la Alimentación Saludable</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1f3b2c]">
                Cómo Interpretar los Octógonos de Advertencia en Perú
              </h3>
              <p className="text-xs sm:text-sm text-[#5c5847] leading-relaxed max-w-3xl">
                Los octógonos negros son sellos obligatorios en productos procesados que superan los límites seguros de nutrientes críticos establecidos por el MINSA. Evitar su consumo frecuente previene enfermedades no transmisibles.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {octogonosData.map((octo, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-black text-white border-2 border-neutral-800 flex flex-col justify-between gap-3 shadow-lg"
                  >
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white text-black font-extrabold text-xs tracking-wider uppercase mb-3">
                        <span>🛑</span>
                        <span>{octo.titulo}</span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <p className="text-rose-400 font-bold">
                          ⚠️ Efecto en la salud: <span className="text-neutral-200 font-normal">{octo.peligro}</span>
                        </p>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] text-[#e5d9bf] leading-relaxed">
                      <strong>Recomendación:</strong> {octo.recomendacion}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: MITOS VS REALIDAD */}
          {/* ========================================================================= */}
          {activeTab === 'mitos' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#fffbf2] text-[#26241d] border border-[#e5d9bf] shadow-xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#748158]">
                <ShieldAlert className="w-4 h-4 text-[#c1512f]" />
                <span>Desmitificando la Nutrición</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1f3b2c]">
                Mitos Comunes sobre la Alimentación
              </h3>
              <p className="text-xs sm:text-sm text-[#5c5847]">
                Haz clic en cada afirmación para conocer lo que indica la evidencia científica actual:
              </p>

              <div className="space-y-3 pt-2">
                {MITOS_ALIMENTACION.map((mito) => {
                  const isOpen = openMythId === mito.id;
                  return (
                    <div
                      key={mito.id}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        isOpen ? 'bg-[#f5efe2] border-[#748158]' : 'bg-white border-[#e5d9bf]'
                      }`}
                    >
                      <button
                        onClick={() => toggleMyth(mito.id)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <span className="font-editorial font-bold text-sm sm:text-base text-[#1f3b2c]">
                          {mito.mito}
                        </span>
                        <span className="p-1.5 rounded-full bg-[#1f3b2c]/10 text-[#1f3b2c] shrink-0">
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 space-y-2 text-xs text-[#5c5847] border-t border-[#e5d9bf]/80 animate-in fade-in duration-150">
                          <div className="p-3 rounded-xl bg-emerald-100/80 border border-emerald-300 text-emerald-950 font-medium">
                            <strong className="text-emerald-900 block mb-0.5 font-bold">✓ Realidad:</strong>
                            {mito.realidad}
                          </div>
                          <p className="leading-relaxed pt-1">
                            {mito.explicacion}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Institutional footer banner */}
          <div className="p-6 rounded-3xl bg-white/10 text-white backdrop-blur-md border border-white/15 shadow-xl space-y-3">
            <h4 className="font-editorial text-xl font-bold text-[#e5d9bf]">
              Fuentes y Referencias Oficiales
            </h4>
            <p className="text-xs text-[#d9e1d6] leading-relaxed">
              Esta enciclopedia se nutre de los registros técnicos del <strong>INIA (Instituto Nacional de Innovación Agraria)</strong>, el <strong>Ministerio del Ambiente (MINAM)</strong>, el <strong>Ministerio de Salud del Perú (MINSA / INS CENAN)</strong>, la <strong>OPS</strong> y la <strong>FAO</strong>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 text-[11px] text-[#f5efe2]">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#e8b69e] shrink-0" />
                <span>INIA & MINAM Cultivos Nativos</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#e8b69e] shrink-0" />
                <span>MINSA / INS CENAN Guías</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#e8b69e] shrink-0" />
                <span>Ley N° 30021 (Octógonos)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#e8b69e] shrink-0" />
                <span>FAO & OPS Nutrición Andina</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
