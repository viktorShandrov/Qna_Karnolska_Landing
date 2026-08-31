import React from 'react';
import { LeafOrnament } from './LeafOrnament';
import { HERO_DATA } from '../data/content';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  return (
    <section id="hero" className="relative min-h-[90vh] lg:min-h-screen flex items-center pt-24 pb-16 md:py-32 overflow-hidden bg-[#FBF9F5]">
      {/* Soft organic curved architectural background shape */}
      <div 
        className="absolute top-0 left-0 w-full lg:w-[60%] h-full bg-[#F3EFE7]/50 rounded-br-[180px] lg:rounded-br-[280px] -z-10 pointer-events-none transition-all duration-700" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Text & Hero Content */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left z-10 pt-4 lg:pt-0">
            
            {/* Main Name Heading */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal text-[#2C2A29] tracking-tight leading-[1.08]">
              {HERO_DATA.name}
            </h1>

            {/* Subtitle: Psychologist */}
            <span className="font-sans text-xs sm:text-sm font-semibold tracking-[0.35em] text-[#747D68] uppercase mt-2 mb-1">
              {HERO_DATA.title}
            </span>

            {/* Botanical filigree leaf icon */}
            <div className="my-2">
              <LeafOrnament className="w-6 h-6 text-[#747D68]" />
            </div>

            {/* Slogan */}
            <h2 className="font-serif text-xl sm:text-2xl text-[#2C2A29] font-medium tracking-wide mt-3 mb-2">
              {HERO_DATA.slogan}
            </h2>

            {/* Description */}
            <p className="text-[#4A4846] text-sm sm:text-base leading-relaxed max-w-md font-light italic mt-1 mb-8">
              „{HERO_DATA.description}“
            </p>

            {/* CTA Button */}
            <div>
              <button
                onClick={onOpenBooking}
                className="bg-[#676F5C] hover:bg-[#4E5848] text-white px-9 py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-2 group"
              >
                <span>{HERO_DATA.ctaButton}</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
              </button>
            </div>

            {/* Subtle trust badge / micro details */}
            <div className="flex items-center gap-6 mt-10 text-[11px] uppercase tracking-widest text-[#706D69] font-medium pt-6 border-t border-[#E2DDD5]/70 w-full justify-center lg:justify-start">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#747D68]"></span>
                Индивидуален подход
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#747D68]"></span>
                Пълна конфиденциалност
              </span>
            </div>

          </div>

          {/* Right Column: Hero Portrait */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end relative">
            
            {/* Delicate ambient glow / background frame */}
            <div className="relative w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[500px]">
              
              {/* Decorative arch accent outline */}
              <div className="absolute -inset-2.5 sm:-inset-4 border border-[#747D68]/25 rounded-t-[140px] sm:rounded-t-[180px] rounded-b-[40px] pointer-events-none -z-10 transform translate-x-2 translate-y-2" />

              {/* Portrait Image Container */}
              <div className="relative w-full overflow-hidden rounded-t-[130px] sm:rounded-t-[170px] rounded-b-[36px] shadow-card bg-[#EDE8DF] aspect-[4/5] group">
                <img
                  src={HERO_DATA.image}
                  alt="Яна Кирилова – Психолог"
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="eager"
                />
                
                {/* Subtle warm overlay gradient for editorial feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A29]/20 via-transparent to-transparent pointer-events-none" />
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
