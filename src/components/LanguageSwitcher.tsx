import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * High-precision vector Bulgarian Flag
 */
export const BulgarianFlag: React.FC<{ className?: string }> = ({ className = 'w-4 h-3' }) => (
  <svg
    viewBox="0 0 640 480"
    className={`inline-block overflow-hidden rounded-[2px] shadow-sm border border-black/10 flex-shrink-0 ${className}`}
    aria-hidden="true"
  >
    <g fillRule="evenodd" strokeWidth="1pt">
      <path fill="#ffffff" d="M0 0h640v160H0z" />
      <path fill="#00966e" d="M0 160h640v160H0z" />
      <path fill="#d62612" d="M0 320h640v160H0z" />
    </g>
  </svg>
);

/**
 * High-precision vector Union Jack (UK / English Flag)
 */
export const UkFlag: React.FC<{ className?: string }> = ({ className = 'w-4 h-3' }) => (
  <svg
    viewBox="0 0 60 30"
    className={`inline-block overflow-hidden rounded-[2px] shadow-sm border border-black/10 flex-shrink-0 ${className}`}
    aria-hidden="true"
  >
    <clipPath id="s">
      <path d="M0,0 v30 h60 v-30 z" />
    </clipPath>
    <clipPath id="t">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
    </clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

interface LanguageSwitcherProps {
  className?: string;
  size?: 'sm' | 'md';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className = '',
  size = 'md'
}) => {
  const { language, setLanguage } = useLanguage();

  const isSmall = size === 'sm';

  return (
    <div 
      className={`inline-flex items-center p-0.5 sm:p-1 bg-[#EFEAE1]/90 backdrop-blur-sm rounded-full border border-[#DDD5C7] shadow-xs select-none transition-all ${className}`}
      role="group"
      aria-label="Language selector / Смяна на езика"
    >
      {/* Bulgarian Option */}
      <button
        type="button"
        onClick={() => setLanguage('bg')}
        className={`flex items-center gap-1.5 rounded-full transition-all duration-200 ${
          isSmall 
            ? 'px-2 py-1 text-[10px]' 
            : 'px-2.5 py-1 text-[11px]'
        } font-semibold uppercase tracking-wider ${
          language === 'bg'
            ? 'bg-[#78806A] text-white shadow-sm'
            : 'text-[#5A6350] hover:text-[#2C2A29] hover:bg-[#E4DED3]/60'
        }`}
        aria-pressed={language === 'bg'}
        title="Български език (Bulgarian)"
      >
        <BulgarianFlag className={isSmall ? 'w-3.5 h-2.5' : 'w-4 h-3'} />
        <span>BG</span>
      </button>

      {/* English Option */}
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-1.5 rounded-full transition-all duration-200 ${
          isSmall 
            ? 'px-2 py-1 text-[10px]' 
            : 'px-2.5 py-1 text-[11px]'
        } font-semibold uppercase tracking-wider ${
          language === 'en'
            ? 'bg-[#78806A] text-white shadow-sm'
            : 'text-[#5A6350] hover:text-[#2C2A29] hover:bg-[#E4DED3]/60'
        }`}
        aria-pressed={language === 'en'}
        title="English"
      >
        <UkFlag className={isSmall ? 'w-3.5 h-2.5' : 'w-4 h-3'} />
        <span>EN</span>
      </button>
    </div>
  );
};
