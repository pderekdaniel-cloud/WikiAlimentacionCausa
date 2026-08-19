import { useState, FormEvent, useId } from 'react';
import { 
  X, 
  Store, 
  Sparkles, 
  Check, 
  MapPin, 
  Phone, 
  UtensilsCrossed, 
  CreditCard, 
  ShieldCheck, 
  Zap,
  Image as ImageIcon,
  CheckCircle2,
  Copy,
  CheckCheck,
  QrCode,
  Lock,
  Receipt,
  Download,
  Printer,
  Smartphone
} from 'lucide-react';
import { RestaurantAd, RestaurantCategory } from '../types';
import { PLANES_PUBLICIDAD } from '../data/restaurantData';
import { processPaymentApi, PaymentReceipt } from '../services/apiService';

interface AdBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRestaurant: (restaurant: RestaurantAd) => void;
  initialPlan?: 'basico' | 'destacado' | 'anual';
}

export function AdBookingModal({
  isOpen,
  onClose,
  onSaveRestaurant,
  initialPlan = 'basico',
}: AdBookingModalProps) {
  const [step, setStep] = useState<'formulario' | 'pago' | 'exito'>('formulario');
  const [selectedPlan, setSelectedPlan] = useState<'basico' | 'destacado' | 'anual'>(initialPlan);
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'tarjeta' | 'plin'>('yape');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedYape, setCopiedYape] = useState(false);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);

  // Yape Details
  const YAPE_PHONE_NUMBER = '974 262 199';
  const YAPE_HOLDER = 'Wiki Alimentación Causa S.A.C.';
  const [codigoYape, setCodigoYape] = useState('');
  const [yapeError, setYapeError] = useState('');

  // Credit Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  // Restaurant Form State
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState<RestaurantCategory>('saludable');
  const [especialidad, setEspecialidad] = useState('Cocina Saludable & Orgánica');
  const [platoEstrella, setPlatoEstrella] = useState('');
  const [distrito, setDistrito] = useState('Miraflores');
  const [ciudad, setCiudad] = useState('Lima');
  const [ubicacion, setUbicacion] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [enlaceMenu, setEnlaceMenu] = useState('');
  const [imagen, setImagen] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precioRango, setPrecioRango] = useState<'$' | '$$' | '$$$'>('$$');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const currentPlan = PLANES_PUBLICIDAD.find((p) => p.id === selectedPlan) || PLANES_PUBLICIDAD[0];

  // Card brand detector
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'VISA';
    if (/^5[1-5]/.test(clean)) return 'MASTERCARD';
    if (/^3[47]/.test(clean)) return 'AMEX';
    return 'TARJETA';
  };

  const handleCardNumberChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      setCardExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`);
    } else {
      setCardExpiry(digits);
    }
  };

  const copyYapeNumber = () => {
    navigator.clipboard.writeText(YAPE_PHONE_NUMBER.replace(/\s/g, ''));
    setCopiedYape(true);
    setTimeout(() => setCopiedYape(false), 2500);
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!nombre.trim()) errs.nombre = 'Ingresa el nombre del restaurante.';
    if (!platoEstrella.trim()) errs.platoEstrella = 'Indica el plato o especialidad saludable.';
    if (!whatsapp.trim()) errs.whatsapp = 'Ingresa tu número de WhatsApp para contacto.';
    if (!descripcion.trim()) errs.descripcion = 'Escribe una breve descripción del local.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToPayment = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStep('pago');
  };

  const validatePayment = () => {
    if (paymentMethod === 'yape' || paymentMethod === 'plin') {
      const code = codigoYape.trim();
      if (!code) {
        setYapeError('Ingresa el código de aprobación de 6 dígitos o número de operación de Yape.');
        return false;
      }
      if (code.length < 4) {
        setYapeError('El código debe tener al menos 4-6 dígitos.');
        return false;
      }
      setYapeError('');
      return true;
    }

    if (paymentMethod === 'tarjeta') {
      const errs: Record<string, string> = {};
      const cleanNum = cardNumber.replace(/\s+/g, '');
      if (cleanNum.length < 15) errs.number = 'Número de tarjeta inválido (16 dígitos).';
      if (!cardHolder.trim()) errs.holder = 'Ingresa el nombre del titular tal como figura en la tarjeta.';
      if (cardExpiry.length < 5) errs.expiry = 'Fecha inválida (MM/AA).';
      if (cardCvv.length < 3) errs.cvv = 'CVV inválido (3-4 dígitos).';
      setCardErrors(errs);
      return Object.keys(errs).length === 0;
    }

    return true;
  };

  const handleConfirmSubscription = async () => {
    if (!validatePayment()) return;

    setIsProcessing(true);

    const fallbackImgs = [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    ];
    const randomImg = fallbackImgs[Math.floor(Math.random() * fallbackImgs.length)];

    const newAd: RestaurantAd = {
      id: `anuncio-${Date.now()}`,
      nombre: nombre.trim(),
      categoria,
      especialidad: especialidad.trim() || 'Cocina Saludable',
      platoEstrella: platoEstrella.trim(),
      ubicacion: ubicacion.trim() || `${distrito}, ${ciudad}`,
      distrito: distrito.trim(),
      ciudad: ciudad.trim(),
      imagen: imagen.trim() || randomImg,
      descripcion: descripcion.trim(),
      precioRango,
      calificacion: 5.0,
      telefono: whatsapp.trim(),
      whatsapp: whatsapp.replace(/\D/g, ''),
      enlaceMenu: enlaceMenu.trim() || 'https://instagram.com',
      planSuscripcion: selectedPlan,
      precioMensual: currentPlan.precioBase,
      esAnuncianteVerificado: true,
      esUsuarioLocal: true,
      fechaActivacion: new Date().toLocaleDateString('es-PE'),
      etiquetaPromocion: selectedPlan === 'destacado' ? '⭐ Anunciante Destacado' : '⚡ Nuevo en el Directorio',
    };

    try {
      const generatedReceipt = await processPaymentApi({
        metodo: paymentMethod,
        monto: currentPlan.precioBase,
        planId: selectedPlan,
        restauranteNombre: nombre.trim(),
        codigoYape: paymentMethod === 'yape' || paymentMethod === 'plin' ? codigoYape : undefined,
        tarjetaUltimos4: paymentMethod === 'tarjeta' ? cardNumber.slice(-4) : undefined,
        titular: paymentMethod === 'tarjeta' ? cardHolder : nombre,
        contacto: whatsapp,
      });

      setReceipt(generatedReceipt);
      onSaveRestaurant(newAd);
      setStep('exito');
    } catch (e) {
      console.error('Error processing payment', e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div 
      id="ad-booking-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1f3b2c]/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="ad-booking-modal-container"
        className="bg-[#fffbf2] border-2 border-[#d3c3a0] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-[#f5efe2] border-b border-[#e5d9bf] flex items-center justify-between shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#c1512f] mb-1">
              <Store className="w-3.5 h-3.5" />
              <span>Espacio Publicitario & Suscripción de Restaurantes</span>
            </div>
            <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#1f3b2c]">
              {step === 'formulario' && 'Alquila tu Espacio Publicitario'}
              {step === 'pago' && 'Pago y Activación Inmediata'}
              {step === 'exito' && '¡Registro de demostración!'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#fffbf2] hover:bg-[#e5d9bf] text-[#1f3b2c] transition-colors cursor-pointer border border-[#d3c3a0]"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          
          {/* ================= STEP 1: RESTAURANT FORM ================= */}
          {step === 'formulario' && (
            <form onSubmit={handleProceedToPayment} className="space-y-5">
              
              {/* Dynamic Demand Pricing Badge */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1f3b2c] to-[#33604a] text-white flex items-center justify-between gap-3 shadow-sm">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#e5d9bf] flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[#c1512f]" />
                    Tarifa Promocional por Demanda
                  </span>
                  <div className="font-editorial font-bold text-lg">
                    Suscripción desde <span className="text-[#e5d9bf]">S/ 2.90 / mes</span>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md border border-emerald-400/30">
                    Cupos Disponibles
                  </span>
                </div>
              </div>

              {/* Select Ad Plan */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1f3b2c] mb-2">
                  Selecciona tu Plan de Publicidad
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {PLANES_PUBLICIDAD.map((p) => {
                    const isSelected = selectedPlan === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPlan(p.id)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#1f3b2c] text-[#f5efe2] border-[#1f3b2c] shadow-md scale-102'
                            : 'bg-[#fffdfa] border-[#d3c3a0] text-[#26241d] hover:border-[#1f3b2c]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isSelected ? 'text-[#e5d9bf]' : 'text-[#748158]'}`}>
                            {p.id === 'basico' ? 'Base' : p.id === 'destacado' ? 'Top' : 'Ahorro'}
                          </span>
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isSelected ? 'bg-[#c1512f] text-white' : 'border border-[#d3c3a0]'
                          }`}>
                            {isSelected && '✓'}
                          </span>
                        </div>
                        <div className="font-editorial font-bold text-base">
                          {p.moneda} {p.precioBase.toFixed(2)}
                          <span className="text-xs font-normal opacity-80">/{p.frecuencia}</span>
                        </div>
                        <div className="text-[11px] mt-1 font-medium line-clamp-1 opacity-85">
                          {p.nombre}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Restaurant Details Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1f3b2c] mb-1">
                    Nombre del Restaurante / Local *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sabor Verde & Orgánico"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#d3c3a0] bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
                  />
                  {errors.nombre && <span className="text-[10px] text-rose-500 mt-0.5 block">{errors.nombre}</span>}
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1f3b2c] mb-1">
                    Categoría Gastronómica *
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as RestaurantCategory)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#d3c3a0] bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
                  >
                    <option value="saludable">🥗 Comida Saludable & Bowls</option>
                    <option value="andino">🌾 Comida Andina & Superfoods</option>
                    <option value="pescados">🐟 Cevichería & Pescados Azules</option>
                    <option value="vegano">🌱 Vegano / Plant-Based</option>
                    <option value="cafeteria">☕ Cafetería & Desayunos</option>
                  </select>
                </div>
              </div>

              {/* Plato Estrella & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1f3b2c] mb-1">
                    Plato Estrella / Especialidad *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Bowl de Quinua con Trucha a la Plancha"
                    value={platoEstrella}
                    onChange={(e) => setPlatoEstrella(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#d3c3a0] bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
                  />
                  {errors.platoEstrella && <span className="text-[10px] text-rose-500 mt-0.5 block">{errors.platoEstrella}</span>}
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1f3b2c] mb-1">
                    WhatsApp para Pedidos / Reservas *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 987654321"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#d3c3a0] bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
                  />
                  {errors.whatsapp && <span className="text-[10px] text-rose-500 mt-0.5 block">{errors.whatsapp}</span>}
                </div>
              </div>

              {/* Distrito & Ubicación */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1f3b2c] mb-1">
                    Distrito y Ciudad
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Distrito (Ej. Miraflores)"
                      value={distrito}
                      onChange={(e) => setDistrito(e.target.value)}
                      className="w-1/2 px-3 py-2 text-xs rounded-xl border border-[#d3c3a0] bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
                    />
                    <input
                      type="text"
                      placeholder="Ciudad (Ej. Lima)"
                      value={ciudad}
                      onChange={(e) => setCiudad(e.target.value)}
                      className="w-1/2 px-3 py-2 text-xs rounded-xl border border-[#d3c3a0] bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1f3b2c] mb-1">
                    Dirección o Referencia
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Av. Larco 450"
                    value={ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#d3c3a0] bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
                  />
                </div>
              </div>

              {/* Foto URL & Menú */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1f3b2c] mb-1">
                    URL de Foto de Portada (Opcional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... (o dejar vacío)"
                    value={imagen}
                    onChange={(e) => setImagen(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#d3c3a0] bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1f3b2c] mb-1">
                    Enlace a Carta / Menú o Redes
                  </label>
                  <input
                    type="url"
                    placeholder="https://tumenudigital.com o instagram.com/..."
                    value={enlaceMenu}
                    onChange={(e) => setEnlaceMenu(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#d3c3a0] bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1f3b2c] mb-1">
                  Descripción de tu Propuesta Saludable *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe tus ingredientes frescos, opciones sin gluten, vegetarianas o técnicas saludables..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#d3c3a0] bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c] leading-relaxed"
                />
                {errors.descripcion && <span className="text-[10px] text-rose-500 mt-0.5 block">{errors.descripcion}</span>}
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-[#d3c3a0] bg-[#fffbf2] text-[#1f3b2c] text-xs font-bold hover:bg-[#e5d9bf] transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  id="proceed-to-payment-btn"
                  className="px-6 py-2.5 rounded-xl bg-[#c1512f] hover:bg-[#9c3f22] text-white text-xs font-extrabold shadow-md shadow-[#c1512f]/30 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Continuar a Medios de Pago ({currentPlan.moneda} {currentPlan.precioBase.toFixed(2)})</span>
                  <span>→</span>
                </button>
              </div>

            </form>
          )}

          {/* ================= STEP 2: DEMO PAYMENT FLOW ================= */}
          {step === 'pago' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-950">
                <strong>Modo demostración:</strong> este proyecto escolar no realiza cobros reales ni verifica pagos con Yape, Plin o tarjetas. Los datos introducidos aquí solo simulan el flujo de contratación y no sustituyen una pasarela de pagos.
              </div>
              
              {/* Order Summary Pill */}
              <div className="p-4 rounded-2xl bg-[#f5efe2] border border-[#e5d9bf] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#748158] block">
                    Publicidad para: {nombre}
                  </span>
                  <strong className="text-sm text-[#1f3b2c]">{currentPlan.nombre}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#5c5847] block">Monto total:</span>
                  <strong className="text-xl font-editorial text-[#c1512f]">
                    {currentPlan.moneda} {currentPlan.precioBase.toFixed(2)}
                  </strong>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1f3b2c] mb-2">
                  Elige tu Método de Pago
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  
                  {/* Yape */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('yape')}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'yape'
                        ? 'bg-[#742284] text-white border-[#742284] shadow-md ring-2 ring-purple-400 scale-102'
                        : 'bg-[#fffdfa] border-[#d3c3a0] text-[#1f3b2c] hover:border-purple-600'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                    <span className="font-bold text-xs">Yape Oficial</span>
                  </button>

                  {/* Tarjeta de Crédito */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('tarjeta')}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'tarjeta'
                        ? 'bg-[#1f3b2c] text-white border-[#1f3b2c] shadow-md ring-2 ring-[#748158] scale-102'
                        : 'bg-[#fffdfa] border-[#d3c3a0] text-[#1f3b2c] hover:border-[#1f3b2c]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="font-bold text-xs">Tarjeta Crédito/Débito</span>
                  </button>

                  {/* Plin */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('plin')}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'plin'
                        ? 'bg-[#00a9e0] text-white border-[#00a9e0] shadow-md ring-2 ring-sky-300 scale-102'
                        : 'bg-[#fffdfa] border-[#d3c3a0] text-[#1f3b2c] hover:border-sky-500'
                    }`}
                  >
                    <Zap className="w-5 h-5" />
                    <span className="font-bold text-xs">Plin</span>
                  </button>

                </div>
              </div>

              {/* ---------------- YAPE PAYMENT INTERACTION ---------------- */}
              {paymentMethod === 'yape' && (
                <div className="p-5 rounded-3xl bg-gradient-to-br from-[#4b145b] to-[#742284] text-white space-y-4 shadow-lg animate-in fade-in duration-200">
                  
                  <div className="flex items-center justify-between pb-3 border-b border-white/20">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-white text-[#742284] font-extrabold flex items-center justify-center text-xs">
                        Y
                      </div>
                      <span className="font-bold text-sm">Yapear al Número Oficial de la Wiki</span>
                    </div>
                    <span className="text-xs bg-emerald-400 text-emerald-950 font-bold px-2 py-0.5 rounded-full">
                      Monto: S/ {currentPlan.precioBase.toFixed(2)}
                    </span>
                  </div>

                  {/* Real Phone Number Box */}
                  <div className="p-4 rounded-2xl bg-black/25 border border-white/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-purple-200 block uppercase tracking-wider font-extrabold">
                        Número de Yape Verificado
                      </span>
                      <strong className="text-xl sm:text-2xl font-mono text-white tracking-wider">
                        +51 {YAPE_PHONE_NUMBER}
                      </strong>
                      <span className="text-[11px] text-purple-200 block mt-0.5 font-medium">
                        Titular: <strong>{YAPE_HOLDER}</strong>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={copyYapeNumber}
                      className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/30"
                    >
                      {copiedYape ? (
                        <>
                          <CheckCheck className="w-4 h-4 text-emerald-300" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Input for 6-Digit Yape Code */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-purple-100">
                      Ingresa el Código de Aprobación de Yape (o N° de Operación) *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={8}
                        placeholder="Ej. 491823"
                        value={codigoYape}
                        onChange={(e) => setCodigoYape(e.target.value.replace(/\D/g, ''))}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white text-[#26241d] text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-gray-400"
                      />
                      <a
                        href={`https://wa.me/51974262199?text=Hola,%20acabo%20de%20hacer%20un%20Yape%20de%20S/%20${currentPlan.precioBase.toFixed(2)}%20para%20activar%20el%20anuncio%20de%20mi%20restaurante:%20${nombre}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shrink-0 transition-colors"
                      >
                        <span>Enviar por WhatsApp</span>
                      </a>
                    </div>
                    {yapeError && <span className="text-xs text-rose-300 font-bold block">{yapeError}</span>}
                  </div>

                </div>
              )}

              {/* ---------------- PLIN PAYMENT INTERACTION ---------------- */}
              {paymentMethod === 'plin' && (
                <div className="p-5 rounded-3xl bg-gradient-to-br from-[#005a87] to-[#00a9e0] text-white space-y-4 shadow-lg animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-white/20">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-300" />
                      <span className="font-bold text-sm">Transferir vía Plin</span>
                    </div>
                    <span className="text-xs bg-white/20 font-bold px-2 py-0.5 rounded-full">
                      S/ {currentPlan.precioBase.toFixed(2)}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/25 border border-white/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-sky-200 block uppercase tracking-wider font-extrabold">
                        Número de Plin
                      </span>
                      <strong className="text-xl font-mono text-white">
                        +51 {YAPE_PHONE_NUMBER}
                      </strong>
                      <span className="text-[11px] text-sky-200 block">
                        Titular: {YAPE_HOLDER}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={copyYapeNumber}
                      className="px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1"
                    >
                      {copiedYape ? '¡Copiado!' : 'Copiar'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-sky-100 mb-1">
                      Código / N° de Operación de Plin *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. PLIN-889102"
                      value={codigoYape}
                      onChange={(e) => setCodigoYape(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white text-[#26241d] text-sm font-mono font-bold focus:outline-none placeholder:text-gray-400"
                    />
                    {yapeError && <span className="text-xs text-rose-300 font-bold mt-1 block">{yapeError}</span>}
                  </div>
                </div>
              )}

              {/* ---------------- DEMO CREDIT CARD INTERACTION ---------------- */}
              {paymentMethod === 'tarjeta' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  
                  {/* Interactive Visual Credit Card Simulator */}
                  <div className="p-5 rounded-2xl bg-gradient-to-tr from-[#1f3b2c] via-[#2d513d] to-[#152a1e] text-white shadow-lg border border-[#748158]/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-6 rounded bg-amber-400/80 border border-amber-200 flex items-center justify-center">
                          <div className="w-5 h-4 border border-amber-800/40 rounded-xs"></div>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-[#d9e1d6] tracking-widest">
                          Contactless
                        </span>
                      </div>

                      <span className="font-editorial text-lg font-bold tracking-widest text-[#e5d9bf]">
                        {getCardBrand(cardNumber)}
                      </span>
                    </div>

                    <div className="font-mono text-lg sm:text-xl font-bold tracking-widest text-center py-2 text-white">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-white/15">
                      <div>
                        <span className="text-[9px] text-[#a7b99a] uppercase block">Titular</span>
                        <strong className="tracking-wider uppercase">{cardHolder || 'NOMBRE DEL TITULAR'}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-[#a7b99a] uppercase block">Expira</span>
                        <strong className="tracking-wider font-mono">{cardExpiry || 'MM/AA'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Card Inputs Form */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1f3b2c] mb-1">
                        Número de Tarjeta *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          maxLength={19}
                          placeholder="4557 1234 5678 9010"
                          value={cardNumber}
                          onChange={(e) => handleCardNumberChange(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border border-[#d3c3a0] bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
                        />
                        <CreditCard className="w-4 h-4 text-[#748158] absolute right-3 top-1/2 -translate-y-1/2" />
                      </div>
                      {cardErrors.number && <span className="text-[10px] text-rose-500 mt-0.5 block">{cardErrors.number}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1f3b2c] mb-1">
                        Nombre en la Tarjeta *
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. JUAN CARLOS PEREZ"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        className="w-full px-3.5 py-2.5 text-xs uppercase font-bold rounded-xl border border-[#d3c3a0] bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
                      />
                      {cardErrors.holder && <span className="text-[10px] text-rose-500 mt-0.5 block">{cardErrors.holder}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1f3b2c] mb-1">
                          Expiración (MM/AA) *
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={(e) => handleExpiryChange(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border border-[#d3c3a0] bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
                        />
                        {cardErrors.expiry && <span className="text-[10px] text-rose-500 mt-0.5 block">{cardErrors.expiry}</span>}
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1f3b2c] mb-1">
                          CVV / CVC (3 dígitos) *
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border border-[#d3c3a0] bg-[#fffdfa] text-[#26241d] focus:outline-none focus:border-[#1f3b2c]"
                        />
                        {cardErrors.cvv && <span className="text-[10px] text-rose-500 mt-0.5 block">{cardErrors.cvv}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#dfe9d9] border border-[#a7b99a] text-[11px] text-[#1f3b2c] flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-800 shrink-0" />
                    <span>Conexión cifrada de 256 bits. Se debitará <strong>{currentPlan.moneda} {currentPlan.precioBase.toFixed(2)}</strong>.</span>
                  </div>

                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-[#e5d9bf]">
                <button
                  type="button"
                  onClick={() => setStep('formulario')}
                  className="px-4 py-2 text-xs font-bold text-[#748158] hover:text-[#1f3b2c] cursor-pointer"
                >
                  ← Modificar datos del local
                </button>

                <button
                  type="button"
                  id="confirm-payment-and-activate-btn"
                  disabled={isProcessing}
                  onClick={handleConfirmSubscription}
                  className="px-6 py-3 rounded-xl bg-[#c1512f] hover:bg-[#9c3f22] text-white text-xs font-extrabold shadow-md shadow-[#c1512f]/30 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Verificando y activando publicidad...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>
                        Pagar {currentPlan.moneda} {currentPlan.precioBase.toFixed(2)} y Activar Anuncio
                      </span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* ================= STEP 3: SUCCESS & DIGITAL INVOICE ================= */}
          {step === 'exito' && receipt && (
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-editorial text-2xl font-bold text-[#1f3b2c]">
                  ¡Suscripción Publicitaria Activada!
                </h3>
                <p className="text-xs text-[#5c5847]">
                  El anuncio de tu restaurante ya está publicado y visible en el Directorio Gastronómico.
                </p>
              </div>

              {/* Verified Digital Receipt */}
              <div className="p-5 rounded-3xl bg-[#f5efe2] border-2 border-[#d3c3a0] space-y-3.5 shadow-sm text-xs font-sans">
                <div className="flex items-center justify-between pb-2 border-b border-[#e5d9bf]">
                  <div className="flex items-center gap-1.5 font-bold text-[#1f3b2c]">
                    <Receipt className="w-4 h-4 text-[#c1512f]" />
                    <span>Comprobante de Suscripción Oficial</span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                    {receipt.estado}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#748158] block">Código de Transacción:</span>
                    <strong className="font-mono text-[#1f3b2c]">{receipt.transactionId}</strong>
                  </div>
                  <div>
                    <span className="text-[#748158] block">Fecha de Emisión:</span>
                    <span className="text-[#1f3b2c]">{new Date(receipt.fecha).toLocaleDateString('es-PE')}</span>
                  </div>
                  <div>
                    <span className="text-[#748158] block">Restaurante Anunciante:</span>
                    <strong className="text-[#1f3b2c]">{receipt.restauranteNombre}</strong>
                  </div>
                  <div>
                    <span className="text-[#748158] block">Medio de Pago:</span>
                    <span className="text-[#1f3b2c] capitalize">{receipt.metodo}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#e5d9bf] flex items-center justify-between">
                  <span className="font-bold text-[#1f3b2c]">Monto Total Pagado:</span>
                  <strong className="text-base font-editorial text-[#c1512f]">
                    S/ {receipt.monto.toFixed(2)} (Vigencia {receipt.vigenciaDias} días)
                  </strong>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-[#1f3b2c] hover:bg-[#33604a] text-[#f5efe2] text-xs font-extrabold shadow-md transition-colors cursor-pointer"
                >
                  Ir al Directorio y Ver mi Restaurante →
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
