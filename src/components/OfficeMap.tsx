import React from 'react';
import { MapPin, Navigation, Clock, ExternalLink } from 'lucide-react';
import { CONTACT_DATA } from '../data/content';
import { useLanguage } from '../i18n/LanguageContext';

export const OfficeMap: React.FC = () => {
  const { t, language } = useLanguage();

  const addressDisplay = language === 'en'
    ? t.officeMap.addressValue
    : CONTACT_DATA.fullAddress;

  return (
    <section id="contact" className="py-16 sm:py-20 md:py-24 bg-[#FBF9F5] relative overflow-hidden border-t border-[#E8E2D7]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE4D8]/70 border border-[#DDD5C7] text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#676F5C] font-semibold mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#747D68]" />
            <span>{t.officeMap.badge}</span>
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#2C2A29] uppercase tracking-[0.18em] leading-tight">
            {t.officeMap.sectionTitle}
          </h2>

          <p className="font-serif text-sm sm:text-base text-[#676F5C] italic mt-1.5 font-normal tracking-wide">
            {t.officeMap.subtitle}
          </p>
        </div>

        {/* 2-Column Responsive Card: Left Info & Right Map */}
        <div className="bg-[#F5F1EA] rounded-3xl border border-[#DDD5C7] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
          
          {/* Left Column: Details & Practical Directions */}
          <div className="lg:col-span-5 p-7 sm:p-9 lg:p-10 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Address Item */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#E8E1D4] text-[#525D4D] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#DDD5C7]">
                  <MapPin className="w-5 h-5 text-[#525D4D]" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#747D68] font-semibold block mb-0.5">
                    {t.officeMap.addressLabel}
                  </span>
                  <p className="font-serif text-base sm:text-lg font-medium text-[#2C2A29] leading-snug">
                    {addressDisplay}
                  </p>
                  <p className="font-serif text-xs sm:text-sm text-[#5C5955] mt-1 leading-relaxed">
                    {t.officeMap.floorInfo}
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#E8E1D4] text-[#525D4D] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#DDD5C7]">
                  <Clock className="w-5 h-5 text-[#525D4D]" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#747D68] font-semibold block mb-0.5">
                    {t.officeMap.hoursLabel}
                  </span>
                  <p className="font-serif text-sm sm:text-base text-[#2C2A29]">
                    {t.officeMap.hoursValue}
                  </p>
                </div>
              </div>

              {/* Transport & Access */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#E8E1D4] text-[#525D4D] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#DDD5C7]">
                  <Navigation className="w-5 h-5 text-[#525D4D]" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#747D68] font-semibold block mb-0.5">
                    {t.officeMap.transportTitle}
                  </span>
                  <p className="font-serif text-xs sm:text-sm text-[#5C5955] leading-relaxed">
                    {t.officeMap.transportInfo}
                  </p>
                </div>
              </div>

            </div>

            {/* Direct Google Maps Action Button */}
            <div className="pt-8 mt-6 border-t border-[#E3DDD1]">
              <a
                href={CONTACT_DATA.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-xs font-serif uppercase tracking-[0.18em] font-medium bg-[#525D4D] hover:bg-[#3D4739] text-[#FBF9F5] transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 border border-white/10"
              >
                <MapPin className="w-4 h-4" />
                <span>{t.officeMap.openInGoogleMaps}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>

          </div>

          {/* Right Column: Interactive Google Map */}
          <div className="lg:col-span-7 relative min-h-[340px] sm:min-h-[400px] lg:min-h-[460px] bg-[#E8E2D7] border-t lg:border-t-0 lg:border-l border-[#DDD5C7]">
            <iframe
              title={`Карта – ${CONTACT_DATA.fullAddress}`}
              src={CONTACT_DATA.googleMapsEmbedUrl}
              className="w-full h-full min-h-[340px] sm:min-h-[400px] lg:min-h-[460px] border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
            
            {/* Elegant overlay pill on bottom left of map */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-[#DDD5C7] shadow-md pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#747D68] animate-pulse" />
                <span className="text-[11px] font-serif font-semibold tracking-wide text-[#2C2A29] uppercase">
                  Яна Кърнолска – Психолог
                </span>
              </div>
              <p className="text-[11px] font-serif text-[#66635E] mt-0.5">
                {addressDisplay}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
