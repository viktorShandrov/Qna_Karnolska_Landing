import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { MonogramLogo } from './MonogramLogo';
import { CONTACT_DATA } from '../data/content';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'НАЧАЛО', href: '#hero' },
    { name: 'УСЛУГИ', href: '#services' },
    { name: 'ЗА МЕН', href: '#about' },
    { name: 'СТАТИИ', href: '#articles' },
    { name: 'ПОДХОД', href: '#approach' },
    { name: 'ОТЗИВИ', href: '#testimonials' },
    { name: 'КОНТАКТИ', href: '#contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass-nav py-3.5 shadow-sm border-b border-[#E2DDD5]/60' 
          : 'bg-transparent py-5 lg:py-6'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <MonogramLogo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 lg:space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[11px] lg:text-xs uppercase tracking-[0.22em] text-[#363330] hover:text-[#747D68] font-normal transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* CTA Button (Desktop) */}
          <div className="hidden md:flex items-center">
            <button
              onClick={onOpenBooking}
              className="bg-[#78806A] hover:bg-[#636B56] text-white px-7 py-2.5 rounded-full text-[11px] uppercase tracking-[0.2em] font-normal transition-all duration-300 shadow-sm hover:shadow active:scale-95"
            >
              ЗАПАЗИ ЧАС
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onOpenBooking}
              className="bg-[#78806A] text-white px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-normal mr-1"
            >
              Запази час
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-[#2C2A29] hover:text-[#4E5848] hover:bg-cream-300/60 focus:outline-none transition-colors"
              aria-label="Меню"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div 
        className={`md:hidden fixed inset-x-0 top-[70px] 	bg-[#FBF9F5]/95 backdrop-blur-lg border-b border-[#E2DDD5] shadow-2xl transition-all duration-300 ease-in-out origin-top z-50 ${
          isMobileMenuOpen ? 'opacity-100 max-h-[520px] py-6' : 'opacity-0 max-h-0 overflow-hidden pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xs uppercase tracking-[0.2em] text-[#2C2A29] hover:text-[#4E5848] font-medium py-2.5 border-b border-[#E2DDD5]/50 transition-colors"
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
              ЗАПАЗИ ЧАС
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
