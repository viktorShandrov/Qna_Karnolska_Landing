import React from 'react';
import { LeafOrnament } from './LeafOrnament';
import { Heart, Sprout, ShieldCheck } from 'lucide-react';
import { APPROACH_DATA } from '../data/content';

export const Approach: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'heart':
        return <Heart className="w-8 h-8 text-[#747D68] stroke-[1.25]" />;
      case 'leaf':
        return <Sprout className="w-8 h-8 text-[#747D68] stroke-[1.25]" />;
      case 'shield':
        return <ShieldCheck className="w-8 h-8 text-[#747D68] stroke-[1.25]" />;
      default:
        return <Heart className="w-8 h-8 text-[#747D68] stroke-[1.25]" />;
    }
  };

  return (
    <section id="approach" className="py-20 md:py-28 bg-[#FBF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2C2A29] uppercase tracking-wider">
            МОЯТ ПОДХОД
          </h2>
          <LeafOrnament className="w-5 h-5 text-[#747D68]" />
          <p className="text-xs uppercase tracking-[0.25em] text-[#706D69] mt-2 font-medium">
            Основни ценности и принципи в терапевтичната практика
          </p>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
          {APPROACH_DATA.map((item) => (
            <div 
              key={item.id} 
              className="flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-300 hover:bg-[#F2EEE6]/60 group"
            >
              
              {/* Minimal Line Art Icon Container */}
              <div className="w-16 h-16 rounded-full bg-[#F2EEE6] border border-[#E2DDD5] flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#EAE4D9]">
                {getIcon(item.iconName)}
              </div>

              {/* Title */}
              <h3 className="font-serif text-lg sm:text-xl font-medium text-[#2C2A29] uppercase tracking-wider mb-3">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#4A4846] leading-relaxed font-light max-w-xs">
                {item.description}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
