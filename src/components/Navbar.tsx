import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Calendar } from 'lucide-react';
import { MonogramLogo } from './MonogramLogo';

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
    { name: 'ЗА МЕН', href: '#about' },
    { name: 'УСЛУГИ', href: '#services' },
    { name: 'ПОДХОД', href: '#approach' },
    { name: 'ОТЗИВИ', href: '#testimonials' },
    { name: 'КОНТАКТИ', href: '#contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'glass-nav py-3.5 shadow-sm border-b border-[#E2DDD5]/60' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <MonogramLogo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 lg:space-x-9">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs uppercase tracking-[0.18em] text-[#4A4846] hover:text-[#4E5848] font-medium transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#4E5848] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* CTA Button (Desktop) */}
          <div className="hidden md:flex items-center">
            <button
              onClick={onOpenBooking}
              className="bg-[#676F5C] hover:bg-[#4E5848] text-white px-6 py-2.5 rounded-full text-xs uppercase tracking-[0.16em] font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>ЗАПАЗИ ЧАС</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onOpenBooking}
              className="bg-[#676F5C] text-white px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-medium mr-1"
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
        className={`md:hidden fixed inset-x-0 top-[70px] bg-cream-100/98 backdrop-blur-xl border-b border-[#E2DDD5] shadow-xl transition-all duration-300 ease-in-out origin-top ${
          isMobileMenuOpen ? 'opacity-100 max-h-[500px] py-6' : 'opacity-0 max-h-0 overflow-hidden pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm uppercase tracking-[0.2em] text-[#2C2A29] hover:text-[#4E5848] font-medium py-2 border-b border-[#E2DDD5]/40 transition-colors"
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
              className="w-full bg-[#676F5C] hover:bg-[#4E5848] text-white py-3 rounded-full text-xs uppercase tracking-[0.18em] font-medium text-center shadow transition-all"
            >
              ЗАПАЗИ ЧАС ЗА КОНСУЛТАЦИЯ
            </button>
            
            <a 
              href="tel:+359888123456" 
              className="flex items-center justify-center gap-2 text-xs text-[#747D68] tracking-wider py-1"
            >
              <Phone className="w-3.5 h-3.5" />
              +359 888 123 456
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
