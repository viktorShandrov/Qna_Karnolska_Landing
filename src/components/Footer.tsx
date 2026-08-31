import React from 'react';
import { MonogramLogo } from './MonogramLogo';
import { Phone, Mail, MapPin } from 'lucide-react';
import { CONTACT_DATA } from '../data/content';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-[#F2EEE6] text-[#2C2A29] pt-16 pb-8 border-t border-[#E2DDD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#E2DDD5]/80 items-start">
          
          {/* Left Column: Monogram Logo */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
            <MonogramLogo size="md" />
            <p className="text-xs text-[#706D69] mt-4 max-w-xs font-light leading-relaxed">
              Индивидуална терапия и семейно консултиране в защитено и приемащо пространство.
            </p>
          </div>

          {/* Center Column: Direct Contacts */}
          <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left space-y-3.5">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#747D68] font-semibold mb-1">
              КОНТАКТИ
            </h4>
            
            <a 
              href={`tel:${CONTACT_DATA.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-3 text-sm text-[#2C2A29] hover:text-[#4E5848] transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-white/60 border border-[#E2DDD5] flex items-center justify-center text-[#747D68] group-hover:bg-[#676F5C] group-hover:text-white transition-all">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">{CONTACT_DATA.phone}</span>
            </a>

            <a 
              href={`mailto:${CONTACT_DATA.email}`}
              className="flex items-center gap-3 text-sm text-[#2C2A29] hover:text-[#4E5848] transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-white/60 border border-[#E2DDD5] flex items-center justify-center text-[#747D68] group-hover:bg-[#676F5C] group-hover:text-white transition-all">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <span>{CONTACT_DATA.email}</span>
            </a>

            <div className="flex items-center gap-3 text-sm text-[#4A4846]">
              <div className="w-8 h-8 rounded-full bg-white/60 border border-[#E2DDD5] flex items-center justify-center text-[#747D68]">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span>{CONTACT_DATA.location}</span>
            </div>
          </div>

          {/* Right Column: Social Links */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#747D68] font-semibold mb-4">
              ПОСЛЕДВАЙ МЕ
            </h4>
            
            {/* Social Icons */}
            <div className="flex items-center space-x-3">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-white/80 border border-[#E2DDD5] flex items-center justify-center text-[#4A4846] hover:bg-[#676F5C] hover:text-white hover:border-[#676F5C] transition-all duration-300 transform hover:scale-110 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white/80 border border-[#E2DDD5] flex items-center justify-center text-[#4A4846] hover:bg-[#676F5C] hover:text-white hover:border-[#676F5C] transition-all duration-300 transform hover:scale-110 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-white/80 border border-[#E2DDD5] flex items-center justify-center text-[#4A4846] hover:bg-[#676F5C] hover:text-white hover:border-[#676F5C] transition-all duration-300 transform hover:scale-110 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
            </div>

            <p className="text-[11px] text-[#706D69] mt-4 font-light">
              Понеделник – Петък: 09:00 – 19:00
            </p>
          </div>

        </div>

        {/* Sub-footer Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#706D69] font-light gap-3">
          <div>
            © {new Date().getFullYear()} Яна Кирилова – Психолог. Всички права запазени.
          </div>

          <div className="flex items-center space-x-4">
            <a href="#hero" className="hover:text-[#4E5848] transition-colors underline-offset-4 hover:underline">
              Политика за поверителност
            </a>
            <span>|</span>
            <a href="#hero" className="hover:text-[#4E5848] transition-colors underline-offset-4 hover:underline">
              Общи условия
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
