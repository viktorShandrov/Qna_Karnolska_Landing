import React, { useState } from 'react';
import { LeafOrnament } from './LeafOrnament';
import { ABOUT_DATA } from '../data/content';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface AboutProps {
  onOpenBooking: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenBooking }) => {
  const [showExtended, setShowExtended] = useState(false);

  return (
    <section id="about" className="py-20 md:py-28 bg-[#4E5848] text-[#FBF9F5] relative overflow-hidden">
      {/* Decorative ambient background accents */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#5C6656]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#3E4739]/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Arched Interior Photography */}
          <div className="lg:col-span-6 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[440px]">
              
              {/* Subtle outer arch contour */}
              <div className="absolute -inset-3 border border-cream-200/20 rounded-tl-[160px] rounded-br-[40px] pointer-events-none -z-10" />

              {/* Main Image with Quarter/Top-Left Arch as in reference */}
              <div className="relative overflow-hidden rounded-tl-[150px] rounded-br-[36px] rounded-tr-xl rounded-bl-xl shadow-2xl bg-[#3E4739] aspect-[4/4.5] group">
                <img
                  src={ABOUT_DATA.image}
                  alt="Терапевтичен кабинет и уютна атмосфера"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A3026]/40 via-transparent to-transparent pointer-events-none" />
              </div>

            </div>
          </div>

          {/* Right Column: About Content */}
          <div className="lg:col-span-6 text-center lg:text-left">
            
            {/* Heading */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-wider text-[#FBF9F5] uppercase">
              {ABOUT_DATA.title}
            </h2>

            {/* Botanical Ornament */}
            <div className="my-2 flex justify-center lg:justify-start">
              <LeafOrnament className="w-5 h-5 text-cream-300" />
            </div>

            {/* Paragraphs */}
            <div className="space-y-4 text-cream-200/90 text-sm sm:text-base leading-relaxed font-light mt-4 mb-8">
              {ABOUT_DATA.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}

              {showExtended && (
                <div className="pt-3 space-y-3 animate-fadeIn border-t border-cream-200/20 text-cream-100 text-sm">
                  <p>{ABOUT_DATA.extendedBio}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    <div className="flex items-center gap-2 text-xs text-cream-200">
                      <CheckCircle2 className="w-4 h-4 text-olive-300 flex-shrink-0" />
                      <span>Магистър по Психология</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-cream-200">
                      <CheckCircle2 className="w-4 h-4 text-olive-300 flex-shrink-0" />
                      <span>Сертифициран психотерапевт</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-cream-200">
                      <CheckCircle2 className="w-4 h-4 text-olive-300 flex-shrink-0" />
                      <span>Член на ДПБ (Дружество на психолозите)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-cream-200">
                      <CheckCircle2 className="w-4 h-4 text-olive-300 flex-shrink-0" />
                      <span>Регулярна супервизия</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => setShowExtended(!showExtended)}
                className="bg-[#676F5C]/80 hover:bg-[#676F5C] text-white border border-cream-200/30 px-7 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 shadow-sm hover:shadow"
              >
                {showExtended ? 'ПО-МАЛКО' : ABOUT_DATA.ctaButton}
              </button>

              <button
                onClick={onOpenBooking}
                className="bg-cream-100 hover:bg-white text-[#4E5848] px-7 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#676F5C]" />
                <span>ЗАПАЗИ ЧАС</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
