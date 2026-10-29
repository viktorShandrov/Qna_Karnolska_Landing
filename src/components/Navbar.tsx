import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { MonogramLogo } from './MonogramLogo';
import { CONTACT_DATA } from '../data/content';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.home, href: '#hero' },
    { name: t.nav.services, href: '#services' },
    { name: t.nav.about, href: '#about' },
    { name: t.nav.articles, href: '#articles' },
    { name: t.nav.approach, href: '#approach' },
    { name: t.nav.testimonials, href: '#testimonials' },
    { name: t.nav.contact, href: '#contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass-nav py-3 sm:py-3.5 shadow-sm border-b border-[#E2DDD5]/60' 
          : 'bg-transparent py-4 sm:py-5 lg:py-6'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <MonogramLogo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-9">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[11px] lg:text-xs uppercase tracking-[0.2em] text-[#363330] hover:text-[#747D68] font-normal transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Area: Language Switcher + CTA Button (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher size="md" />

            <button
              onClick={onOpenBooking}
              className="bg-[#78806A] hover:bg-[#636B56] text-white px-6 lg:px-7 py-2.5 rounded-full text-[11px] uppercase tracking-[0.18em] font-normal transition-all duration-300 shadow-sm hover:shadow active:scale-95"
            >
              {t.nav.bookSession}
            </button>
          </div>

          {/* Mobile Right Controls: Language Switcher + Quick Book + Hamburger Menu */}
          <div className="flex md:hidden items-center space-x-1.5 sm:space-x-2">
            <LanguageSwitcher size="sm" />

            <button
              onClick={onOpenBooking}
              className="bg-[#78806A] text-white px-2.5 sm:px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] uppercase tracking-wider font-normal"
            >
              {t.nav.bookSession}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-lg text-[#2C2A29] hover:text-[#4E5848] hover:bg-cream-300/60 focus:outline-none transition-colors"
              aria-label={t.nav.menuLabel}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div 
        className={`md:hidden fixed inset-x-0 top-[62px] sm:top-[70px] bg-[#FBF9F5]/98 backdrop-blur-xl border-b border-[#E2DDD5] shadow-2xl transition-all duration-300 ease-in-out origin-top z-50 ${
          isMobileMenuOpen ? 'opacity-100 max-h-[560px] py-6' : 'opacity-0 max-h-0 overflow-hidden pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col space-y-3.5">
          {/* Mobile Drawer Language Switcher Banner */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD5]/60">
            <span className="text-[11px] uppercase tracking-[0.16em] text-[#747D68] font-medium">
              Език / Language
            </span>
            <LanguageSwitcher size="sm" />
          </div>

          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xs uppercase tracking-[0.2em] text-[#2C2A29] hover:text-[#4E5848] font-medium py-2 border-b border-[#E2DDD5]/40 transition-colors"
            >
              {link.name}
            </a>
          ))}
          
          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full bg-[#78806A] hover:bg-[#636B56] text-white py-3 rounded-full text-xs uppercase tracking-[0.18em] font-medium text-center shadow transition-all"
            >
              {t.nav.bookSession}
            </button>
            
            <a 
              href={`tel:${CONTACT_DATA.phone.replace(/\s+/g, '')}`} 
              className="flex items-center justify-center gap-2 text-xs text-[#747D68] tracking-wider py-1"
            >
              <Phone className="w-3.5 h-3.5" />
              {CONTACT_DATA.phone}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
