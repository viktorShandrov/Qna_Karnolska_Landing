import React from 'react';
import { ViberIcon } from './ViberIcon';
import { CONTACT_DATA } from '../data/content';
import { useLanguage } from '../i18n/LanguageContext';

interface ViberButtonProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  customText?: string;
  targetBlank?: boolean;
}

export const ViberButton: React.FC<ViberButtonProps> = ({
  size = 'md',
  className = '',
  customText,
  targetBlank = true,
}) => {
  const { t } = useLanguage();
  const text = customText || t.viberChannel.buttonText;
  const href = CONTACT_DATA.viberChannelUrl;

  const sizeStyles = {
    sm: 'px-4 py-2 text-[11px] gap-2 tracking-[0.14em]',
    md: 'px-6 sm:px-7 py-3 text-xs sm:text-[13px] gap-2.5 tracking-[0.16em]',
    lg: 'px-8 py-3.5 text-xs sm:text-sm gap-3 tracking-[0.18em]',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4 sm:w-[18px] sm:h-[18px]',
    lg: 'w-5 h-5',
  };

  return (
    <a
      href={href}
      target={targetBlank ? '_blank' : undefined}
      rel={targetBlank ? 'noopener noreferrer' : undefined}
      aria-label={text}
      className={`group inline-flex items-center justify-center font-serif font-medium uppercase text-white rounded-full transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95 border border-white/25 focus:outline-none focus:ring-2 focus:ring-[#7E5B8E]/50 ${sizeStyles[size]} ${className}`}
      style={{
        backgroundColor: '#735482',
        backgroundImage: 'linear-gradient(135deg, #7E5B8E 0%, #684974 100%)',
      }}
    >
      <span className="flex-shrink-0 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
        <ViberIcon className={iconSizes[size]} />
      </span>
      <span className="truncate">{text}</span>
    </a>
  );
};
