import { useState } from 'react';
import { 
  PieChart, 
  Apple, 
  Fish, 
  Wheat, 
  Droplets, 
  Sparkles, 
  CheckCircle2, 
  Info,
  Layers
} from 'lucide-react';

interface PlateSectionInfo {
  id: 'veg' | 'prot' | 'carb' | 'water' | 'fruit';
  titulo: string;
  proporcion: string;
  porcentaje: string;
  color: string;
  bgActive: string;
  icono: any;
  resumen: string;
  alimentosRecomendados: string[];
  beneficios: string;
  consejoPractico: string;
}

export function HealthyPlateSimulator() {
  const [selectedSection, setSelectedSection] = useState<'veg' | 'prot' | 'carb' | 'water' | 'fruit'>('veg');

  const sections: Record<string, PlateSectionInfo> = {
    veg: {
      id: 'veg',
      titulo: 'Verduras, Hojas Verdes y Vegetales',
      proporcion: '½ del plato (50%)',
      porcentaje: '50%',
      color: 'bg-emerald-600 text-white',
      bgActive: 'bg-emerald-50 border-emerald-300 text-emerald-950',
      icono: Apple,
      resumen: 'La base de volumen y micronutrientes. Aporta vitaminas A, C, potasio, antioxidantes y fibra dietética que regula la absorción de azúcares y grasas.',
      alimentosRecomendados: [
        'Espinacas, lechuga romana, acelga y hojas verdes',
        'Tomates, pimientos y zanahorias (betacarotenos)',
        'Brócoli, coliflor y vainitas al vapor',
        'Palta (en porción moderada como grasa saludable)',
        'Pepino, zapallito italiano y rabanitos',
      ],
      beneficios: 'Favorece la microbiota intestinal, genera saciedad prolongada con baja densidad calórica y protege contra la inflamación celular.',
      consejoPractico: 'Intenta que en esta mitad existan al menos 2 o 3 colores diferentes para maximizar el espectro antioxidante.',
    },
    prot: {
      id: 'prot',
      titulo: 'Proteínas de Alto Valor Biológico',
      proporcion: '¼ del plato (25%)',
      porcentaje: '25%',
      color: 'bg-[#c1512f] text-white',
      bgActive: 'bg-rose-50 border-rose-300 text-rose-950',
      icono: Fish,
      resumen: 'Bloques constructores indispensables para mantener la masa muscular, sintetizar hormonas, enzimas y anticuerpos.',
      alimentosRecomendados: [
        'Pescados azules: bonito, jurel, caballa, trucha (ricos en Omega-3)',
        'Huevos de corral (proteína completa con colina)',
        'Pechuga de pollo o pavita sin piel',
        'Menestras: lentejas, garbanzos, frejoles y tarwi',
        'Yogur griego o queso fresco pasteurizado bajo en sal',
      ],
      beneficios: 'Evita la pérdida de tejido magro y regula la hormona del apetito (grelina) brindando energía estable sin picos de glucosa.',
      consejoPractico: 'Cocina a la plancha, al vapor, al horno o en guisos caseros evitando refrituras o apanados pesados.',
    },
    carb: {
      id: 'carb',
      titulo: 'Carbohidratos Complejos & Granos Andinos',
      proporcion: '¼ del plato (25%)',
      porcentaje: '25%',
      color: 'bg-amber-600 text-white',
      bgActive: 'bg-amber-50 border-amber-300 text-amber-950',
      icono: Wheat,
      resumen: 'Combustible cerebral y muscular de liberación gradual. Los granos andinos e integrales aportan energía sostenida sin caídas bruscas.',
      alimentosRecomendados: [
        'Quinua perlada, roja o negra sancochada',
        'Camote amarillo y morado (rico en antioxidantes)',
        'Papa nativa sancochada con cáscara limpia',
        'Arroz integral o avena en copos',
        'Choclo desgranado tierno',
      ],
      beneficios: 'Aportan glucosa limpia para el funcionamiento del cerebro y músculos, manteniendo estables los niveles de insulina.',
      consejoPractico: 'Sancocha o hornea los tubérculos y granos; al enfriarse ligeramente generan almidón resistente, que actúa como prebiótico.',
    },
    water: {
      id: 'water',
      titulo: 'Hidratación Esencial (Agua)',
      proporcion: 'Bebida principal (6-8 vasos/día)',
      porcentaje: 'Vital',
      color: 'bg-sky-600 text-white',
      bgActive: 'bg-sky-50 border-sky-300 text-sky-950',
      icono: Droplets,
      resumen: 'El agua es el medio en el que ocurren todas las reacciones metabólicas celulares, la digestión y el transporte de nutrientes.',
      alimentosRecomendados: [
        'Agua pura fresca',
        'Infusiones de hierbas sin azúcar (manzanilla, menta, anís, muña)',
        'Agua aromatizada naturalmente con rodajas de limón, pepino o menta',
      ],
      beneficios: 'Regula la temperatura corporal, previene la fatiga mental y favorece la función renal.',
      consejoPractico: 'Toma un vaso al despertar y ten siempre una botella reutilizable a mano durante tus actividades.',
    },
    fruit: {
      id: 'fruit',
      titulo: 'Fruta Fresca de Estación',
      proporcion: '1 porción como postre o snack',
      porcentaje: 'Complemento',
      color: 'bg-purple-600 text-white',
      bgActive: 'bg-purple-50 border-purple-300 text-purple-950',
      icono: Apple,
      resumen: 'Dulzor natural acompañado de fibra, flavonoides y agua biológica que complementa tu comida.',
      alimentosRecomendados: [
        'Fresas, arándanos y moras',
        'Granadilla, maracuyá y lúcuma',
        'Plátano de seda o manzana con cáscara',
        'Papaya, piña y melón en cubos',
      ],
      beneficios: 'Satisface el deseo de sabor dulce sin recurrir a azúcares libres refinados ni aditivos artificiales.',
      consejoPractico: 'Prefiere la fruta entera en vez de jugos colados, para no perder la fibra que amortigua la fructosa.',
    },
  };

  const current = sections[selectedSection];
  const IconComponent = current.icono;

  return (
    <section id="plato-interactivo" className="py-14 md:py-20 bg-[#eee7d9]/60 border-t border-b border-[#d3c3a0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1f3b2c]/10 text-[#1f3b2c] mb-3 border border-[#1f3b2c]/20">
            <PieChart className="w-3.5 h-3.5 text-[#c1512f]" />
            <span>Simulador Didáctico</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#1f3b2c]">
            El Plato Saludable Equilibrado
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#5c5847]">
            Toca las diferentes secciones del plato para aprender cómo combinar tus alimentos diarios de manera variada, sabrosa y nutritiva.
          </p>
        </div>

        {/* Interactive Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Visual Plate Component */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* Interactive Plate Disc */}
            <div className="relative w-72 sm:w-88 aspect-square rounded-full bg-[#fffbf2] border-8 border-[#d3c3a0] shadow-2xl p-3 flex items-center justify-center">
              
              {/* Plate Divider Structure */}
              <div className="w-full h-full rounded-full overflow-hidden grid grid-cols-2 relative shadow-inner">
                
                {/* Left 50%: Vegetables */}
                <button
                  id="plate-btn-veg"
                  onClick={() => setSelectedSection('veg')}
                  className={`h-full bg-emerald-100 hover:bg-emerald-200 border-r-2 border-[#fffbf2] p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${
                    selectedSection === 'veg' ? 'ring-4 ring-emerald-600 z-10' : 'opacity-90'
                  }`}
                >
                  <Apple className="w-8 h-8 text-emerald-700 group-hover:scale-110 transition-transform mb-1" />
                  <strong className="font-editorial text-base sm:text-lg text-emerald-900 leading-tight">
                    ½ Vegetales
                  </strong>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider mt-1">
                    50% del plato
                  </span>
                </button>

                {/* Right Column: 25% Protein & 25% Carbohydrates */}
                <div className="h-full grid grid-rows-2">
                  
                  {/* Top Right 25%: Proteins */}
                  <button
                    id="plate-btn-prot"
                    onClick={() => setSelectedSection('prot')}
                    className={`h-full bg-rose-100 hover:bg-rose-200 border-b-2 border-[#fffbf2] p-3 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${
                      selectedSection === 'prot' ? 'ring-4 ring-[#c1512f] z-10' : 'opacity-90'
                    }`}
                  >
                    <Fish className="w-6 h-6 text-[#c1512f] group-hover:scale-110 transition-transform mb-0.5" />
                    <strong className="font-editorial text-xs sm:text-sm text-rose-900 leading-tight">
                      ¼ Proteínas
                    </strong>
                    <span className="text-[9px] text-[#c1512f] font-bold uppercase tracking-wider">
                      25%
                    </span>
                  </button>

                  {/* Bottom Right 25%: Carbs */}
                  <button
                    id="plate-btn-carb"
                    onClick={() => setSelectedSection('carb')}
                    className={`h-full bg-amber-100 hover:bg-amber-200 p-3 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${
                      selectedSection === 'carb' ? 'ring-4 ring-amber-600 z-10' : 'opacity-90'
                    }`}
                  >
                    <Wheat className="w-6 h-6 text-amber-700 group-hover:scale-110 transition-transform mb-0.5" />
                    <strong className="font-editorial text-xs sm:text-sm text-amber-900 leading-tight">
                      ¼ Carbohidratos
                    </strong>
                    <span className="text-[9px] text-amber-700 font-bold uppercase tracking-wider">
                      25%
                    </span>
                  </button>

                </div>

              </div>

              {/* Center Emblem */}
              <div className="absolute w-14 h-14 rounded-full bg-[#1f3b2c] text-[#f5efe2] flex items-center justify-center shadow-lg border-2 border-[#fffbf2] pointer-events-none">
                <span className="font-editorial font-bold text-xs text-center leading-none">
                  Plato<br />Guía
                </span>
              </div>
            </div>

            {/* Companion Items: Water and Fruit buttons */}
            <div className="flex items-center gap-3 mt-5">
              <button
                id="plate-btn-water"
                onClick={() => setSelectedSection('water')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all cursor-pointer text-xs font-bold ${
                  selectedSection === 'water'
                    ? 'bg-sky-100 border-sky-400 text-sky-900 shadow-sm'
                    : 'bg-[#fffbf2] border-[#d3c3a0] text-[#1f3b2c] hover:border-sky-400'
                }`}
              >
                <Droplets className="w-4 h-4 text-sky-600" />
                <span>+ Vaso de Agua</span>
              </button>

              <button
                id="plate-btn-fruit"
                onClick={() => setSelectedSection('fruit')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all cursor-pointer text-xs font-bold ${
                  selectedSection === 'fruit'
                    ? 'bg-purple-100 border-purple-400 text-purple-900 shadow-sm'
                    : 'bg-[#fffbf2] border-[#d3c3a0] text-[#1f3b2c] hover:border-purple-400'
                }`}
              >
                <Apple className="w-4 h-4 text-purple-600" />
                <span>+ Fruta Fresca</span>
              </button>
            </div>

          </div>

          {/* Right Column: Educational Detail Card for selected slice */}
          <div className="lg:col-span-6">
            <div className={`p-6 sm:p-8 rounded-3xl border-2 transition-all duration-300 shadow-lg ${current.bgActive}`}>
              
              {/* Card Header */}
              <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-black/10">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${current.color} shadow-sm`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-75">
                      Proporción recomendada
                    </span>
                    <h3 className="font-editorial text-xl sm:text-2xl font-bold leading-tight">
                      {current.titulo}
                    </h3>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-black/10">
                  {current.proporcion}
                </span>
              </div>

              {/* Summary Description */}
              <p className="text-xs sm:text-sm leading-relaxed mb-4">
                {current.resumen}
              </p>

              {/* Recommended foods checklist */}
              <div className="space-y-2 mb-4 bg-white/70 p-4 rounded-2xl border border-black/5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Opciones sugeridas para incorporar:</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                  {current.alimentosRecomendados.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits and Tip */}
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-white/50 border border-black/5">
                  <strong>💡 Consejo de cocina consciente: </strong>
                  <span>{current.consejoPractico}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
