import { useState } from 'react';
import { 
  CheckCircle2, 
  Lightbulb, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  HeartHandshake, 
  Droplet,
  Utensils
} from 'lucide-react';
import { BASES_HABITOS, CONSEJOS_NUTRICIONALES } from '../data/wikiData';

export function TipsAndBasesSection() {
  const [activeCategory, setActiveCategory] = useState<'todas' | 'habitos' | 'cocina' | 'nutricion'>('todas');

  const filteredTips = activeCategory === 'todas'
    ? CONSEJOS_NUTRICIONALES
    : CONSEJOS_NUTRICIONALES.filter((t) => t.categoria === activeCategory);

  return (
    <section id="consejos" className="py-14 md:py-20 bg-[#eee7d9]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section 1: 6 Bases de una alimentación saludable */}
        <div className="mb-16">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1f3b2c]/10 text-[#1f3b2c] mb-2 border border-[#1f3b2c]/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c1512f]" />
              <span>Pilares Cotidianos</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#1f3b2c]">
              Bases de una Alimentación Saludable
            </h2>
            <p className="text-xs sm:text-sm text-[#5c5847] mt-1">
              Pequeños hábitos diarios que pueden ayudarte a mantener una nutrición variada, equilibrada y sostenible en el tiempo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BASES_HABITOS.map((base) => (
              <div
                key={base.numero}
                className="bg-[#fffbf2] rounded-2xl border border-[#d3c3a0] p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-editorial text-xl font-bold text-[#c1512f] group-hover:scale-110 transition-transform inline-block">
                    {base.numero}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-[#1f3b2c]/10 text-[#1f3b2c] flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                </div>

                <h3 className="font-editorial text-lg font-bold text-[#1f3b2c] mb-2">
                  {base.titulo}
                </h3>
                <p className="text-xs text-[#5c5847] leading-relaxed">
                  {base.descripcion}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* Section 2: Consejos Prácticos con Filtro */}
        <div className="bg-[#fffbf2] rounded-3xl border-2 border-[#d3c3a0] p-6 sm:p-10 shadow-md">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#e5d9bf]">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-[#748158] mb-1">
                <Lightbulb className="w-3.5 h-3.5 text-[#c1512f]" />
                <span>Recomendaciones Prácticas</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1f3b2c]">
                Consejos para la Cocina y el Día a Día
              </h3>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'todas', label: 'Todos' },
                { id: 'nutricion', label: 'Nutrición' },
                { id: 'habitos', label: 'Hábitos' },
                { id: 'cocina', label: 'Cocina & Higiene' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveCategory(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === f.id
                      ? 'bg-[#1f3b2c] text-[#f5efe2] shadow-xs'
                      : 'bg-[#f5efe2] text-[#1f3b2c] hover:bg-[#e5d9bf]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tips List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTips.map((tip) => (
              <div
                key={tip.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#f5efe2] border border-[#e5d9bf] flex gap-3.5 items-start hover:border-[#748158] transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-[#c1512f] text-white flex items-center justify-center font-editorial font-bold text-xs shrink-0 shadow-xs">
                  {tip.numero}
                </div>
                <div className="space-y-1">
                  <h4 className="font-editorial text-base font-bold text-[#1f3b2c] leading-tight">
                    {tip.titulo}
                  </h4>
                  <p className="text-xs text-[#5c5847] leading-relaxed">
                    {tip.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer Note */}
          <div className="mt-8 p-4 rounded-2xl bg-[#dfe9d9] border border-[#a7b99a] text-xs text-[#1f3b2c] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#1f3b2c] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Nota importante:</strong> las necesidades nutricionales varían según edad, estado de salud y nivel de actividad física. Esta wiki es un espacio educativo y colaborativo; consulta siempre a un profesional de la salud o nutrición para planes personalizados.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
