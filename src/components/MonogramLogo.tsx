import React from 'react';

interface MonogramLogoProps {
  lightMode?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MonogramLogo: React.FC<MonogramLogoProps> = ({ 
  lightMode = false,
  className = "",
  size = 'md'
}) => {
  const textColor = lightMode ? 'text-white' : 'text-[#363330]';
  const subColor = lightMode ? 'text-cream-200' : 'text-[#676F5C]';
  
  const logoSizes = {
    sm: { symbol: 'text-3xl', name: 'text-[11px]', sub: 'text-[9px]' },
    md: { symbol: 'text-4xl md:text-5xl', name: 'text-xs md:text-sm', sub: 'text-[9px] md:text-[10px]' },
    lg: { symbol: 'text-6xl', name: 'text-base', sub: 'text-xs' }
  };

  return (
    <a 
      href="#hero" 
      className={`inline-flex flex-col items-center select-none group transition-transform duration-300 hover:scale-[1.02] ${className}`}
    >
      <div className={`font-serif leading-none tracking-tight font-normal ${textColor} ${logoSizes[size].symbol} flex items-center justify-center`}>
        <span className="italic relative -mr-1.5 font-normal">Я</span>
        <span className="font-light">К</span>
      </div>
      <div className="flex flex-col items-center mt-1 text-center">
        <span className={`font-serif tracking-wider uppercase font-medium ${textColor} ${logoSizes[size].name}`}>
          Яна Кърнолска
        </span>
        <span className={`font-sans tracking-[0.28em] uppercase font-medium ${subColor} ${logoSizes[size].sub}`}>
          Психолог
        </span>
      </div>
    </a>
  );
};
