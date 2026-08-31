import React from 'react';
import { LeafOrnament } from './LeafOrnament';

export const Approach: React.FC = () => {
  return (
    <section id="approach" className="py-24 md:py-32 bg-[#FBF9F5]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16 md:mb-20">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#2C2A29] uppercase tracking-[0.25em]">
            МОЯТ ПОДХОД
          </h2>
          <div className="flex justify-center -mt-1">
            <LeafOrnament withLines={false} className="w-5 h-5 text-[#676F5C]" />
          </div>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 max-w-6xl mx-auto items-start">
          
          {/* Column 1: ЕМПАТИЯ */}
          <div className="flex flex-col items-center text-center group">
            <div className="mb-6 text-[#3E3C3A] transition-transform duration-300 group-hover:scale-105">
              <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 stroke-current">
                <path
                  d="M24 38.5C24 38.5 9 27.5 9 17C9 11.5 13.5 7 19 7C22.2 7 24 9 24 9C24 9 25.8 7 29 7C34.5 7 39 11.5 39 17C39 27.5 24 38.5 24 38.5Z"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3 className="font-serif text-base sm:text-lg font-normal text-[#2C2A29] uppercase tracking-wider mb-3">
              ЕМПАТИЯ
            </h3>

            <p className="font-serif text-lg lg:text-[22.5px] text-[#4A4846] leading-relaxed font-normal max-w-xs sm:max-w-sm">
              Създавам безопасна и подкрепяща<br className="hidden sm:inline" />
              среда, в която можете да бъдете<br className="hidden sm:inline" />
              истински и свободни.
            </p>
          </div>

          {/* Column 2: ИНДИВИДУАЛЕН ПОДХОД */}
          <div className="flex flex-col items-center text-center group">
            <div className="mb-6 text-[#3E3C3A] transition-transform duration-300 group-hover:scale-105">
              <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 stroke-current">
                <path
                  d="M10 38L18 30M18 30C13.5 21 20 10 35 8C37 23 27 30 18 30Z"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18 30C23.5 23.5 29 18 35 8"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h3 className="font-serif text-base sm:text-lg font-normal text-[#2C2A29] uppercase tracking-wider mb-3">
              ИНДИВИДУАЛЕН ПОДХОД
            </h3>

            <p className="font-serif text-lg lg:text-[22.5px] text-[#4A4846] leading-relaxed font-normal max-w-xs sm:max-w-sm">
              Всеки човек е уникален и терапията<br className="hidden sm:inline" />
              се адаптира към вашите нужди<br className="hidden sm:inline" />
              и цели.
            </p>
          </div>

          {/* Column 3: КОНФИДЕНЦИАЛНОСТ */}
          <div className="flex flex-col items-center text-center group">
            <div className="mb-6 text-[#3E3C3A] transition-transform duration-300 group-hover:scale-105">
              <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 stroke-current">
                <circle cx="24" cy="15" r="6.5" strokeWidth="1.2" />
                <path
                  d="M11 38C11 30.5 17 26.5 24 26.5C31 26.5 37 30.5 37 38"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h3 className="font-serif text-base sm:text-lg font-normal text-[#2C2A29] uppercase tracking-wider mb-3">
              КОНФИДЕНЦИАЛНОСТ
            </h3>

            <p className="font-serif text-lg lg:text-[22.5px] text-[#4A4846] leading-relaxed font-normal max-w-xs sm:max-w-sm">
              Вашата история остава между<br className="hidden sm:inline" />
              нас – с уважение, етика<br className="hidden sm:inline" />
              и професионализъм.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
