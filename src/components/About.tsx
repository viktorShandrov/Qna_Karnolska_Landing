import React, { useState } from 'react';
import { LeafOrnament } from './LeafOrnament';
import { ABOUT_DATA } from '../data/content';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface AboutProps {
  onOpenBooking: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenBooking: _onOpenBooking }) => {
  const [showExtended, setShowExtended] = useState(false);
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 md:py-28 bg-[#525D4D] text-[#FBF9F5] relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Arched Interior Photo (Quarter arch top-right) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[4/4.5] overflow-hidden rounded-tr-[180px] sm:rounded-tr-[240px] lg:rounded-tr-[280px] rounded-tl-lg rounded-b-lg">
              <img
                src={ABOUT_DATA.image}
                alt={t.about.imageAlt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column: Text & Content */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Heading */}
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-[0.25em] text-[#FBF9F5] uppercase">
              {t.about.sectionTitle}
            </h2>

            {/* Botanical Leaf Ornament */}
            <div className="my-1.5">
              <LeafOrnament withLines={false} className="w-10 h-10 text-[#FBF9F5]/80" />
            </div>

            {/* Paragraphs in pure classical Serif upright */}
            <div className="space-y-4 text-[#FBF9F5]/95 font-serif text-lg lg:text-[22.5px] leading-relaxed font-normal mt-4 mb-7 max-w-2xl">
              {t.about.paragraphs.map((p, idx) => (
                <p key={idx}>
                  {p}
                </p>
              ))}

              {showExtended && (
                <div className="pt-4 space-y-3 text-base text-[#FBF9F5]/90 border-t border-white/20 mt-4 animate-fadeIn">
                  <p className="leading-relaxed font-serif">
                    {t.about.extendedBio}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
                    {t.about.credentials.map((cred, idx) => (
                      <div key={idx} className={`flex items-center gap-2 ${idx === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                        <CheckCircle2 className="w-4 h-4 text-cream-300 flex-shrink-0" />
                        <span className="font-serif text-sm">{cred}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Button */}
            <div>
              <button
                onClick={() => setShowExtended(!showExtended)}
                className="bg-[#6B7563] hover:bg-[#5E6856] text-[#FBF9F5] px-8 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-normal transition-all duration-300 shadow-none hover:shadow-sm active:scale-95"
              >
                {showExtended ? t.about.ctaButtonLess : t.about.ctaButtonMore}
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
