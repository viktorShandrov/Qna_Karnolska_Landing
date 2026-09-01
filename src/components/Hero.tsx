import React from 'react';
import { LeafOrnament } from './LeafOrnament';
import { HERO_DATA } from '../data/content';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  return (
    <section id="hero" className="relative min-h-screen w-full flex items-center overflow-hidden bg-[#EAE6DE]">
      
      {/* Right Side Container: Anchors portrait to the right half at 100% natural scale */}
      <div className="absolute top-0 right-0 w-full lg:w-[100%] xl:w-[100%] h-full bg-[#EAE6DE] flex justify-end">
        <img
          src={HERO_DATA.image}
          alt="Яна Кърнолска – Психолог"
          className="w-full h-full object-cover object-[85%_15%] sm:object-[75%_12%] lg:object-[60%_15%]"
          loading="eager"
        />
        {/* Soft edge blending gradient */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F4F0E8] to-transparent hidden lg:block pointer-events-none opacity-40" />
      </div>

      {/* Left Side: Large Curved Arch Dome Overlay with Hero Text */}
      <div className="relative z-10 w-full min-h-screen flex items-center">
        {/* justify-end on mobile anchors the card to the bottom to reveal the face at top */}
        <div className="w-full lg:w-[48%] xl:w-[45%] min-h-screen bg-transparent lg:bg-[#F4F0E8] flex flex-col justify-end lg:justify-center items-center px-4 sm:px-8 lg:px-14 pt-28 pb-8 sm:pb-12 lg:py-12 shadow-none relative lg:rounded-r-[420px] lg:border-r lg:border-[#E5DFD4]/80">
          
          {/* Variant 1: Dark Glassmorphism filter on mobile positioned at bottom */}
          <div className="w-full max-w-md flex flex-col items-center text-center bg-black/40 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-4 sm:p-7 lg:p-0 rounded-3xl border border-white/20 lg:border-none shadow-2xl lg:shadow-none text-[#ffffdd] lg:text-[#2C2A29] mb-0 sm:mb-6 lg:mb-0">
            
            {/* Name Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[76px] font-normal text-[#ffffdd] lg:text-[#2C2A29] tracking-tight leading-[1.08] drop-shadow-md lg:drop-shadow-none">
              {HERO_DATA.name}
            </h1>

            {/* Subtitle: Psychologist */}
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal tracking-[0.22em] text-[#ffffdd] lg:text-[#2C2A29] uppercase mt-1.5 mb-0.5 drop-shadow-md lg:drop-shadow-none">
              {HERO_DATA.title}
            </h2>

            {/* Filigree Leaf Divider with Hairlines */}
            <div className="w-full my-1.5 sm:my-2 text-[#ffffdd]/80 lg:text-[#747D68]">
              <LeafOrnament withLines={true} className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            {/* Slogan */}
            <h3 className="font-serif text-base sm:text-lg lg:text-xl text-[#ffffdd] lg:text-[#2C2A29] font-medium lg:font-normal tracking-wide mt-1 mb-2 sm:mb-3 drop-shadow-md lg:drop-shadow-none">
              {HERO_DATA.slogan}
            </h3>

            {/* Description (3 neat lines in classical serif) */}
            <p className="font-serif text-[#ffffdd] lg:text-[#4A4846] text-sm sm:text-base md:text-lg lg:text-[22.5px] leading-relaxed max-w-xs sm:max-w-md mb-5 sm:mb-6 lg:mb-8 font-medium lg:font-normal drop-shadow-md lg:drop-shadow-none">
              Тук ще намерите пространство,<br />
              в което да бъдете чути, разбрани и<br />
              приети такива, каквито сте.
            </p>

            {/* Pill Button: ЗАПАЗИ ЧАС */}
            <button
              onClick={onOpenBooking}
              className="bg-[#78806A] hover:bg-[#636B56] text-white px-7 py-2.5 sm:px-9 sm:py-3 rounded-full text-[11px] sm:text-xs uppercase tracking-[0.22em] font-normal transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
              {HERO_DATA.ctaButton}
            </button>

          </div>

        </div>
      </div>

    </section>
  );
};
