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
  const textColor = lightMode ? 'text-white' : 'text-[#2C2A29]';
  const subColor = lightMode ? 'text-cream-200' : 'text-[#747D68]';
  
  const logoSizes = {
    sm: { symbol: 'text-2xl', name: 'text-xs', sub: 'text-[9px]' },
    md: { symbol: 'text-3xl md:text-4xl', name: 'text-sm md:text-base', sub: 'text-[10px] md:text-xs' },
    lg: { symbol: 'text-5xl', name: 'text-lg', sub: 'text-xs' }
  };

  return (
    <a 
      href="#hero" 
      className={`inline-flex flex-col items-center select-none group transition-transform duration-300 hover:scale-[1.02] ${className}`}
    >
      <div className={`font-serif leading-none tracking-tight font-medium ${textColor} ${logoSizes[size].symbol} flex items-center justify-center`}>
        <span className="italic relative -mr-1">Я</span>
        <span className="font-light">К</span>
      </div>
      <div className="flex flex-col items-center mt-1">
        <span className={`font-serif tracking-wider uppercase font-medium ${textColor} ${logoSizes[size].name}`}>
          Яна Кирилова
        </span>
        <span className={`font-sans tracking-[0.25em] uppercase font-light ${subColor} ${logoSizes[size].sub}`}>
          Психолог
        </span>
      </div>
    </a>
  );
};
