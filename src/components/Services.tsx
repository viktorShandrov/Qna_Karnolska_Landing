import React from 'react';
import { LeafOrnament } from './LeafOrnament';
import { SERVICES_DATA, ServiceItem } from '../data/content';

interface ServicesProps {
  onSelectService: (service: ServiceItem) => void;
  onOpenBooking?: (serviceName?: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  return (
    <section id="services" className="py-14 sm:py-20 md:py-32 bg-[#FBF9F5]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14 md:mb-20">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-[#2C2A29] uppercase tracking-[0.25em]">
            УСЛУГИ
          </h2>
          <div className="flex justify-center -mt-1">
            <LeafOrnament withLines={false} className="w-8 h-8 md:w-10 md:h-10 text-[#676F5C]" />
          </div>
        </div>

        {/* 3 Symmetrical Arch Cards (compact on mobile, expansive on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch">
          {SERVICES_DATA.map((service) => (
            <div
              key={service.id}
              className="bg-[#F4F0E8] w-full max-w-[290px] sm:max-w-[340px] md:max-w-none mx-auto rounded-t-[120px] sm:rounded-t-[150px] lg:rounded-t-[180px] rounded-b-none overflow-hidden flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
            >
              
              {/* Arched Top Image (compact height on mobile) */}
              <div className="w-full max-h-[220px] sm:max-h-[260px] md:max-h-none aspect-[4/3.5] md:aspect-[4/4.2] overflow-hidden rounded-t-[120px] sm:rounded-t-[150px] lg:rounded-t-[180px] relative bg-[#E8E2D7]">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Card Content Area */}
              <div className="p-5 sm:p-6 md:p-8 lg:px-9 flex flex-col items-center flex-grow w-full justify-between">
                <div>
                  {/* Title */}
                  <h3 className="font-serif text-sm sm:text-base md:text-lg font-normal text-[#2C2A29] uppercase tracking-wider mb-2.5 md:mb-4 leading-snug">
                    {service.title}
                  </h3>

                  {/* Short Description */}
                  <p className="font-serif text-sm sm:text-base md:text-lg lg:text-[22.5px] text-[#4A4846] leading-relaxed font-normal mb-5 md:mb-8 max-w-xs sm:max-w-sm mx-auto">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Outlined Pill Button */}
                <button
                  onClick={() => onSelectService(service)}
                  className="border border-[#BDB6A8] hover:border-[#676F5C] hover:bg-[#676F5C] text-[#2C2A29] hover:text-white rounded-full py-2 px-6 md:py-2.5 md:px-8 text-[10px] md:text-[11px] uppercase tracking-[0.18em] font-normal transition-all duration-300 shadow-none hover:shadow-sm active:scale-95"
                >
                  НАУЧИ ПОВЕЧЕ
                </button>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
