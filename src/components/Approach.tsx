import React from 'react';
import { LeafOrnament } from './LeafOrnament';
import { useLanguage } from '../i18n/LanguageContext';

export const Approach: React.FC = () => {
  const { t } = useLanguage();

  const renderIcon = (iconName: 'heart' | 'leaf' | 'shield') => {
    switch (iconName) {
      case 'heart':
        return (
          <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 stroke-current">
            <path
              d="M24 38.5C24 38.5 9 27.5 9 17C9 11.5 13.5 7 19 7C22.2 7 24 9 24 9C24 9 25.8 7 29 7C34.5 7 39 11.5 39 17C39 27.5 24 38.5 24 38.5Z"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'leaf':
        return (
          <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 stroke-current">
            <path
              d="M9 39C12 37 15 32 17 28M17 28C13 20 18 9 36 7C39 23 28 31 17 28Z"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 28C22 22 28 15 35 8"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
            <path
              d="M22 22L27 17"
              strokeWidth="1.0"
              strokeLinecap="round"
            />
            <path
              d="M26 17L31 12"
              strokeWidth="1.0"
              strokeLinecap="round"
            />
            <path
              d="M21 24L26 26"
              strokeWidth="1.0"
              strokeLinecap="round"
            />
          </svg>
        );
      case 'shield':
        return (
          <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 stroke-current">
            <circle cx="24" cy="15" r="6.5" strokeWidth="1.2" />
            <path
              d="M11 38C11 30.5 17 26.5 24 26.5C31 26.5 37 30.5 37 38"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        );
    }
  };

  return (
    <section id="approach" className="py-24 md:py-32 bg-[#FBF9F5]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-3 md:mb-20">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#2C2A29] uppercase tracking-[0.25em]">
            {t.approach.sectionTitle}
          </h2>
          <div className="flex justify-center -mt-1">
            <LeafOrnament withLines={false} className="w-10 h-10 text-[#676F5C]" />
          </div>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 max-w-6xl mx-auto items-start">
          {t.approach.items.map((item) => (
            <div key={item.id} className="flex flex-col items-center text-center group">
              <div className="mb-6 text-[#3E3C3A] transition-transform duration-300 group-hover:scale-105">
                {renderIcon(item.iconName)}
              </div>

              <h3 className="font-serif text-base sm:text-lg font-normal text-[#2C2A29] uppercase tracking-wider mb-3">
                {item.title}
              </h3>

              <p className="font-serif text-lg lg:text-[22.5px] text-[#4A4846] leading-relaxed font-normal max-w-xs sm:max-w-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
