import { useState, useEffect, MouseEvent } from 'react';
import { 
  Plus, 
  Menu, 
  X, 
  Heart,
  Search,
  Store,
  Sparkles
} from 'lucide-react';

interface WikiHeaderProps {
  onOpenPublisher: () => void;
  onOpenAdBooking: () => void;
  favoritesCount: number;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  activeSection: string;
}

export function WikiHeader({
  onOpenPublisher,
  onOpenAdBooking,
  favoritesCount,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  activeSection,
}: WikiHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#inicio', label: 'Inicio', id: 'inicio' },
    { href: '#recetas', label: 'Recetas', id: 'recetas' },
    { href: '#restaurantes', label: 'Restaurantes', id: 'restaurantes' },
    { href: '#plato-interactivo', label: 'Plato Equilibrado', id: 'plato-interactivo' },
    { href: '#guia-saludable', label: 'Guía & INIA', id: 'guia-saludable' },
  ];

  const scrollToSection = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      id="wiki-site-header"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#f5efe2]/95 backdrop-blur-md shadow-md border-b border-[#d3c3a0]/80 py-3' 
          : 'bg-[#f5efe2] border-b border-[#e5d9bf] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        
        {/* Brand Logo & Editorial Emblem */}
        <a 
          id="wiki-brand-logo"
          href="#inicio" 
          onClick={(e) => scrollToSection(e, '#inicio')}
          className="flex items-center gap-2.5 group cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1f3b2c] text-[#f5efe2] flex items-center justify-center shadow-md shadow-[#1f3b2c]/20 group-hover:scale-105 transition-transform duration-200">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 sm:w-6 sm:h-6">
              <path d="M5 19c6.8 0 12-4.8 14-14-8.4.8-13 5.5-14 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 17c2.7-3 5.6-5.5 9.4-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-editorial text-lg sm:text-xl font-bold tracking-tight text-[#1f3b2c] leading-tight">
              Wiki Alimentación <span className="text-[#c1512f] font-normal italic">Causa</span>
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-extrabold text-[#748158] -mt-0.5">
              Saberes que nutren
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav id="wiki-desktop-nav" className="hidden xl:flex items-center gap-1 bg-[#e5d9bf]/40 p-1 rounded-full border border-[#d3c3a0]/60">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                id={`nav-${link.id}`}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#1f3b2c] text-[#f5efe2] shadow-sm'
                    : 'text-[#1f3b2c] hover:bg-[#e5d9bf]/80 opacity-85 hover:opacity-100'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right Actions: Favorites, Ad booking & Publish recipe */}
        <div className="flex items-center gap-2">
          
          {/* Favorites filter toggle */}
          {favoritesCount > 0 && (
            <button
              id="header-favorites-toggle-btn"
              onClick={onToggleFavoritesOnly}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                showFavoritesOnly
                  ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                  : 'bg-[#fffbf2] border-[#d3c3a0] text-[#1f3b2c] hover:border-rose-300'
              }`}
              title={showFavoritesOnly ? 'Mostrar todas las recetas' : 'Ver mis recetas guardadas'}
            >
              <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-rose-500 text-rose-500' : 'text-rose-500'}`} />
              <span>{favoritesCount}</span>
            </button>
          )}

          {/* Quick Ad Booking Button */}
          <button
            id="header-ad-booking-btn"
            onClick={onOpenAdBooking}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#fffbf2] border border-[#d3c3a0] text-xs font-extrabold text-[#1f3b2c] hover:border-[#1f3b2c] transition-colors cursor-pointer"
            title="Publicitar restaurante por S/ 2.90"
          >
            <Store className="w-3.5 h-3.5 text-[#c1512f]" />
            <span>Publicidad (S/ 2.90)</span>
          </button>

          {/* Primary Action Button: Publicar Receta */}
          <button
            id="header-publish-recipe-btn"
            onClick={onOpenPublisher}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[#c1512f] hover:bg-[#9c3f22] text-white text-xs font-extrabold shadow-md shadow-[#c1512f]/25 hover:shadow-[#c1512f]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Publicar</span> receta
          </button>

          {/* Mobile Menu Trigger */}
          <button
            id="header-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl border border-[#d3c3a0] bg-[#fffbf2] text-[#1f3b2c] cursor-pointer"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          id="wiki-mobile-drawer"
          className="xl:hidden border-b border-[#d3c3a0] bg-[#f5efe2] px-4 pt-3 pb-6 space-y-1.5 shadow-xl mt-2 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              id={`mobile-nav-${link.id}`}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="flex items-center justify-between px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#1f3b2c] hover:bg-[#e5d9bf] transition-colors"
            >
              <span>{link.label}</span>
              <span className="text-[#748158] text-xs">→</span>
            </a>
          ))}

          <div className="pt-3 border-t border-[#d3c3a0] flex flex-col gap-2">
            <button
              id="mobile-drawer-ad-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdBooking();
              }}
              className="w-full py-2.5 rounded-xl border-2 border-[#1f3b2c] bg-[#fffbf2] text-[#1f3b2c] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Store className="w-4 h-4 text-[#c1512f]" />
              <span>Alquilar Espacio Publicitario (S/ 2.90)</span>
            </button>

            <button
              id="mobile-drawer-publish-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPublisher();
              }}
              className="w-full py-2.5 rounded-xl bg-[#c1512f] text-white text-xs font-bold shadow-md shadow-[#c1512f]/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar receta en la comunidad</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
