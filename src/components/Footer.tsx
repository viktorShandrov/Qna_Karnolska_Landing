import React from 'react';
import { MonogramLogo } from './MonogramLogo';
import { CONTACT_DATA } from '../data/content';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-[#FBF9F5] text-[#2C2A29] pt-20 pb-8">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 3-Column Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 items-center pb-16">
          
          {/* Column 1: Monogram Logo */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <MonogramLogo size="lg" />
          </div>

          {/* Column 2: Direct Contact Details */}
          <div className="flex flex-col items-center md:items-start space-y-3.5 text-xs sm:text-[13.5px] text-[#363330]">
            
            {/* Phone */}
            <a 
              href={`tel:${CONTACT_DATA.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-3.5 hover:text-[#747D68] transition-colors group"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-current stroke-[1.4] text-[#363330]">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-light tracking-wide">{CONTACT_DATA.phone}</span>
            </a>

            {/* Email */}
            <a 
              href={`mailto:${CONTACT_DATA.email}`}
              className="flex items-center gap-3.5 hover:text-[#747D68] transition-colors group"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-current stroke-[1.4] text-[#363330]">
                <rect x="3" y="5" width="18" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-light tracking-wide">{CONTACT_DATA.email}</span>
            </a>

            {/* Location */}
            <div className="flex items-center gap-3.5 text-[#363330]">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-current stroke-[1.4] text-[#363330]">
                <path d="M12 21s-6-5.333-6-10a6 6 0 0 1 12 0c0 4.667-6 10-6 10z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="11" r="2.5" />
              </svg>
              <span className="font-light tracking-wide">{CONTACT_DATA.location}</span>
            </div>

          </div>

          {/* Column 3: Follow Me & Social Circles */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <h3 className="font-serif text-base font-normal tracking-[0.2em] text-[#363330] uppercase mb-4">
              ПОСЛЕДВАЙ МЕ
            </h3>

            <div className="flex items-center space-x-3">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-[#525B4B] text-white flex items-center justify-center hover:bg-[#3D4537] transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M13.5 9H16V6.5h-2.5C11.5 6.5 10 7.8 10 10v2H8v3h2v7h3v-7h2.5l.5-3H13v-1.5c0-.8.4-1.5 1.5-1.5z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-[#525B4B] text-white flex items-center justify-center hover:bg-[#3D4537] transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" strokeWidth="2.5" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-[#525B4B] text-white flex items-center justify-center hover:bg-[#3D4537] transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
            </div>

          </div>

        </div>

        {/* Sub-footer Separator Hairline */}
        <div className="border-t border-[#D9D3C7] pt-5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#706D69] font-light gap-2">
          <div>
            © 2024 Яна Кирилова Психолог. Всички права запазени.
          </div>

          <div>
            <a href="#hero" className="hover:text-[#2C2A29] transition-colors underline-offset-4 hover:underline">
              Политика за поверителност
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
