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
      <div className="absolute top-0 right-0 w-full lg:w-[58%] xl:w-[60%] h-full bg-[#EAE6DE] flex justify-end">
        <img
          src={HERO_DATA.image}
          alt="Яна Кирилова – Психолог"
          className="w-full h-full object-cover object-[center_15%] sm:object-[center_12%] lg:object-[60%_15%]"
          loading="eager"
        />
        {/* Soft edge blending gradient */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F4F0E8] to-transparent hidden lg:block pointer-events-none opacity-40" />
      </div>

      {/* Left Side: Large Curved Arch Dome Overlay with Hero Text */}
      <div className="relative z-10 w-full min-h-screen flex items-center">
        <div className="w-full lg:w-[48%] xl:w-[45%] min-h-screen bg-[#F4F0E8]/98 lg:bg-[#F4F0E8] flex flex-col justify-center items-center px-6 sm:px-12 md:px-16 pt-28 pb-16 shadow-2xl lg:shadow-none relative lg:rounded-r-[420px] lg:border-r border-[#E5DFD4]/80">
          
          <div className="w-full max-w-md flex flex-col items-center text-center">
            
            {/* Name Heading */}
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal text-[#2C2A29] tracking-tight leading-[1.06]">
              {HERO_DATA.name}
            </h1>

            {/* Subtitle: Psychologist */}
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal tracking-[0.22em] text-[#2C2A29] uppercase mt-2 mb-1">
              {HERO_DATA.title}
            </h2>

            {/* Filigree Leaf Divider with Hairlines */}
            <div className="w-full my-2">
              <LeafOrnament withLines={true} className="w-6 h-6 text-[#747D68]" />
            </div>

            {/* Slogan */}
            <h3 className="font-serif text-lg sm:text-xl text-[#2C2A29] font-normal tracking-wide mt-2 mb-3">
              {HERO_DATA.slogan}
            </h3>

            {/* Description (3 neat lines in classical serif) */}
            <p className="font-serif text-[#4A4846] text-lg lg:text-[22.5px] leading-relaxed max-w-xs sm:max-w-md mb-9 font-normal">
              Тук ще намерите пространство,<br />
              в което да бъдете чути, разбрани и<br />
              приети такива, каквито сте.
            </p>

            {/* Pill Button: ЗАПАЗИ ЧАС */}
            <button
              onClick={onOpenBooking}
              className="bg-[#78806A] hover:bg-[#636B56] text-white px-9 py-3 rounded-full text-xs uppercase tracking-[0.22em] font-normal transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
              {HERO_DATA.ctaButton}
            </button>

          </div>

        </div>
      </div>

    </section>
  );
};
