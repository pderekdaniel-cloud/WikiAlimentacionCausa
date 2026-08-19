import { useState, useMemo } from 'react';
import { 
  Store, 
  MapPin, 
  Phone, 
  Star, 
  Sparkles, 
  UtensilsCrossed, 
  ExternalLink, 
  Plus, 
  Zap, 
  ShieldCheck, 
  Search, 
  Trash2,
  CheckCircle,
  MessageCircle,
  Tag
} from 'lucide-react';
import { RestaurantAd, RestaurantCategory } from '../types';
import { PLANES_PUBLICIDAD } from '../data/restaurantData';

interface RestaurantDirectorySectionProps {
  restaurants: RestaurantAd[];
  onOpenBookingModal: (plan?: 'basico' | 'destacado' | 'anual') => void;
  onDeleteRestaurant: (id: string) => void;
}

export function RestaurantDirectorySection({
  restaurants,
  onOpenBookingModal,
  onDeleteRestaurant,
}: RestaurantDirectorySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<RestaurantCategory>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: RestaurantCategory; label: string; emoji: string }[] = [
    { id: 'todos', label: 'Todos los Locales', emoji: '🍽️' },
    { id: 'saludable', label: 'Saludable & Bowls', emoji: '🥗' },
    { id: 'andino', label: 'Andino & Orgánico', emoji: '🌾' },
    { id: 'pescados', label: 'Pescados & Mariscos', emoji: '🐟' },
    { id: 'vegano', label: 'Vegano & Plant-Based', emoji: '🌱' },
    { id: 'cafeteria', label: 'Cafés & Desayunos', emoji: '☕' },
  ];

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      const matchesCat = selectedCategory === 'todos' || r.categoria === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q || [
        r.nombre,
        r.especialidad,
        r.platoEstrella,
        r.distrito,
        r.ciudad,
        r.descripcion,
      ].join(' ').toLowerCase().includes(q);

      return matchesCat && matchesQuery;
    });
  }, [restaurants, selectedCategory, searchQuery]);

  const confirmDelete = (id: string, name: string) => {
    if (window.confirm(`¿Deseas retirar el anuncio de "${name}" del directorio?`)) {
      onDeleteRestaurant(id);
    }
  };

  return (
    <section id="restaurantes" className="py-16 md:py-24 bg-[#fffdf8] border-t border-b border-[#d3c3a0]/80 relative overflow-hidden">
      
      {/* Background soft glow */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#c1512f]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#748158]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#e5d9bf]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#c1512f]/10 text-[#c1512f] mb-3 border border-[#c1512f]/20">
              <Store className="w-3.5 h-3.5" />
              <span>Directorio Gastronómico & Espacio Publicitario</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1f3b2c]">
              Restaurantes & Huariques Saludables
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#5c5847] max-w-2xl leading-relaxed">
              Descubre lugares de comida consciente, cocina andina, opciones veganas y huariques recomendados. Si tienes un restaurante saludable, alquila tu espacio publicitario por suscripción.
            </p>
          </div>

          {/* Quick CTA to rent ad spot */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              id="rent-ad-slot-header-btn"
              onClick={() => onOpenBookingModal('basico')}
              className="px-5 py-3 rounded-2xl bg-[#c1512f] hover:bg-[#9c3f22] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-[#c1512f]/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Alquilar Espacio (desde S/ 2.90/mes)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Demand Banner Card */}
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1f3b2c] via-[#2a4d3b] to-[#1a3325] text-white border-2 border-[#d3c3a0] shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#e5d9bf] text-xs font-extrabold tracking-wider uppercase border border-white/10">
                <Zap className="w-3.5 h-3.5 text-[#c1512f]" />
                <span>Modelo de Suscripción Dinámica</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold leading-tight">
                Publicita tu Restaurante o Menú Saludable en la Wiki
              </h3>
              <p className="text-xs sm:text-sm text-[#d9e1d6] leading-relaxed max-w-xl">
                Llega a comensales interesados en comida nutritiva, orgánica y andina. La tarifa se adapta según la demanda de cupos disponibles, iniciando en <strong>S/ 2.90 / mes</strong>.
              </p>

              {/* Demand status indicator */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-white font-bold">Demanda: 84% de cupos ocupados</span>
                </div>
                <div className="text-[#e5d9bf]">
                  Tarifa base actual: <strong>S/ 2.90 / mes</strong>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                id="banner-rent-ad-btn"
                onClick={() => onOpenBookingModal('basico')}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#c1512f] hover:bg-[#9c3f22] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Alquilar por S/ 2.90 / mes</span>
                <span>→</span>
              </button>
              <button
                id="banner-view-plans-btn"
                onClick={() => onOpenBookingModal('destacado')}
                className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors cursor-pointer text-center"
              >
                Ver Plan Destacado (S/ 5.90)
              </button>
            </div>

          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Category tabs */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`rest-cat-btn-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  selectedCategory === cat.id
                    ? 'bg-[#1f3b2c] text-[#f5efe2] border-[#1f3b2c] shadow-xs'
                    : 'bg-[#f5efe2] text-[#1f3b2c] border-[#d3c3a0] hover:border-[#1f3b2c]'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#748158] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por distrito o plato..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#d3c3a0] bg-[#fffbf2] text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
            />
          </div>

        </div>

        {/* Restaurants Directory Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mb-16">
          {filteredRestaurants.map((rest) => (
            <article
              key={rest.id}
              id={`restaurant-card-${rest.id}`}
              className="bg-[#fffbf2] rounded-3xl border-2 border-[#d3c3a0] overflow-hidden flex flex-col shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
            >
              {/* Image Cover */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-[#1f3b2c]">
                <img
                  src={rest.imagen}
                  alt={rest.nombre}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1f3b2c]/85 via-transparent to-transparent pointer-events-none" />

                {/* Promo Badge */}
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#c1512f] text-white shadow-md">
                  {rest.etiquetaPromocion || 'Local Aliado'}
                </span>

                {/* Verification Pill */}
                {rest.esAnuncianteVerificado && (
                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fffbf2]/90 text-[#1f3b2c] backdrop-blur-md flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verificado</span>
                  </span>
                )}

                {/* Rating & Location Tag on Image Bottom */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#e5d9bf]" />
                    <span>{rest.distrito}, {rest.ciudad}</span>
                  </span>

                  <span className="flex items-center gap-1 bg-[#1f3b2c]/80 px-2 py-0.5 rounded-md border border-[#e5d9bf]/30">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{rest.calificacion.toFixed(1)}</span>
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 sm:p-6 flex flex-col flex-1 gap-3">
                
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#748158]">
                    {rest.especialidad}
                  </span>
                  <h3 className="font-editorial text-xl font-bold text-[#1f3b2c] leading-snug group-hover:text-[#c1512f] transition-colors mt-0.5">
                    {rest.nombre}
                  </h3>
                </div>

                {/* Plato Estrella Highlight Box */}
                <div className="p-3 rounded-2xl bg-[#f5efe2] border border-[#e5d9bf] text-xs">
                  <span className="font-extrabold text-[#c1512f] flex items-center gap-1 text-[10px] uppercase tracking-wider mb-0.5">
                    <UtensilsCrossed className="w-3 h-3" />
                    Plato Estrella:
                  </span>
                  <p className="font-bold text-[#1f3b2c] leading-tight">
                    {rest.platoEstrella}
                  </p>
                </div>

                <p className="text-xs text-[#5c5847] leading-relaxed line-clamp-2">
                  {rest.descripcion}
                </p>

                {/* Address reference */}
                <div className="text-[11px] text-[#748158] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#c1512f] shrink-0" />
                  <span className="truncate">{rest.ubicacion}</span>
                </div>

                {/* Card Actions */}
                <div className="pt-3 mt-auto border-t border-[#e5d9bf] flex items-center gap-2">
                  <a
                    id={`restaurant-whatsapp-link-${rest.id}`}
                    href={`https://wa.me/${rest.whatsapp}?text=Hola,%20vi%20su%20restaurante%20en%20Wiki%20Alimentaci%C3%B3n.%20%C2%BFDeseo%20conocer%20su%20men%C3%BA%20y%20hacer%20un%20pedido?`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp / Pedir</span>
                  </a>

                  {rest.enlaceMenu && (
                    <a
                      id={`restaurant-menu-link-${rest.id}`}
                      href={rest.enlaceMenu}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl border border-[#d3c3a0] bg-[#fffbf2] hover:bg-[#e5d9bf] text-[#1f3b2c] transition-colors cursor-pointer"
                      title="Ver carta digital"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {rest.esUsuarioLocal && (
                    <button
                      onClick={() => confirmDelete(rest.id, rest.nombre)}
                      className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                      title="Eliminar mi anuncio"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            </article>
          ))}
        </div>

        {/* Transparent Advertising Subscription Plans Grid */}
        <div className="bg-[#f5efe2] rounded-3xl border-2 border-[#d3c3a0] p-6 sm:p-10 shadow-lg">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1f3b2c]/10 text-[#1f3b2c] mb-2 border border-[#1f3b2c]/20">
              <Tag className="w-3.5 h-3.5 text-[#c1512f]" />
              <span>Tarifas Claras y Flexibles</span>
            </div>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1f3b2c]">
              Planes de Suscripción Publicitaria
            </h3>
            <p className="text-xs sm:text-sm text-[#5c5847] mt-1">
              Elige el espacio ideal para posicionar tu cocina ante miles de personas que buscan comer rico y sano.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANES_PUBLICIDAD.map((plan) => (
              <div
                key={plan.id}
                className={`p-6 sm:p-8 rounded-3xl border-2 flex flex-col justify-between transition-all ${
                  plan.destacado
                    ? 'bg-[#1f3b2c] text-[#f5efe2] border-[#1f3b2c] shadow-xl relative scale-102'
                    : 'bg-[#fffbf2] text-[#26241d] border-[#d3c3a0] shadow-sm'
                }`}
              >
                {plan.destacado && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#c1512f] text-white shadow-md">
                    Más Popular
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="font-editorial text-xl font-bold leading-tight">
                      {plan.nombre}
                    </h4>
                    <p className={`text-xs mt-1 ${plan.destacado ? 'text-[#d9e1d6]' : 'text-[#5c5847]'}`}>
                      {plan.descripcion}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 py-2 border-t border-b border-black/10">
                    <span className="font-editorial text-3xl sm:text-4xl font-extrabold">
                      {plan.moneda} {plan.precioBase.toFixed(2)}
                    </span>
                    <span className={`text-xs font-bold ${plan.destacado ? 'text-[#e5d9bf]' : 'text-[#748158]'}`}>
                      /{plan.frecuencia}
                    </span>
                  </div>

                  {/* Features list */}
                  <ul className="space-y-2 text-xs">
                    {plan.caracteristicas.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${plan.destacado ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-black/10">
                  <button
                    onClick={() => onOpenBookingModal(plan.id)}
                    className={`w-full py-3 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                      plan.destacado
                        ? 'bg-[#c1512f] hover:bg-[#9c3f22] text-white shadow-md'
                        : 'bg-[#1f3b2c] hover:bg-[#33604a] text-[#f5efe2]'
                    }`}
                  >
                    Alquilar este Espacio ({plan.moneda} {plan.precioBase.toFixed(2)})
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
