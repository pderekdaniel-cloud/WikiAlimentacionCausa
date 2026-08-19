import { MouseEvent } from 'react';
import { ArrowUp, Heart, Sparkles, BookOpen, Store } from 'lucide-react';

export function WikiFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="wiki-site-footer" className="bg-[#15271d] text-[#e5d9bf] pt-14 pb-10 border-t border-[#1f3b2c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Branding & Navigation Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-white/10">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f5efe2] text-[#1f3b2c] flex items-center justify-center shadow-md">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d="M5 19c6.8 0 12-4.8 14-14-8.4.8-13 5.5-14 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 17c2.7-3 5.6-5.5 9.4-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold text-white leading-tight">
                Wiki Alimentación <span className="text-[#c1512f] font-normal italic">Causa</span>
              </h3>
              <p className="text-[11px] text-[#a7b99a] uppercase tracking-widest font-extrabold -mt-0.5">
                Saberes que nutren
              </p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <nav className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
            <a href="#inicio" onClick={(e) => scrollToSection(e, '#inicio')} className="hover:text-white transition-colors">
              Inicio
            </a>
            <a href="#recetas" onClick={(e) => scrollToSection(e, '#recetas')} className="hover:text-white transition-colors">
              Recetas
            </a>
            <a href="#restaurantes" onClick={(e) => scrollToSection(e, '#restaurantes')} className="hover:text-white transition-colors text-[#e5d9bf] hover:text-[#c1512f]">
              Restaurantes
            </a>
            <a href="#plato-interactivo" onClick={(e) => scrollToSection(e, '#plato-interactivo')} className="hover:text-white transition-colors">
              Plato Equilibrado
            </a>
            <a href="#consejos" onClick={(e) => scrollToSection(e, '#consejos')} className="hover:text-white transition-colors">
              Consejos
            </a>
            <a href="#guia-saludable" onClick={(e) => scrollToSection(e, '#guia-saludable')} className="hover:text-white transition-colors text-[#e8b69e]">
              Guía & INIA
            </a>
          </nav>

        </div>

        {/* Bottom Bar with Motto & Back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#a7b99a]">
          <div className="text-center sm:text-left space-y-1">
            <p>© {new Date().getFullYear()} Wiki Alimentación — Espacio colaborativo y directorio gastronómico.</p>
            <p className="font-editorial italic text-white text-sm">
              "Desde la puna hasta las mesas del Perú y el mundo"
            </p>
          </div>

          <button
            id="footer-scroll-top-btn"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#f5efe2] hover:text-white transition-colors cursor-pointer border border-white/10"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
