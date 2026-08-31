import React from 'react';
import { LeafOrnament } from './LeafOrnament';
import { SERVICES_DATA, ServiceItem } from '../data/content';
import { ArrowRight } from 'lucide-react';

interface ServicesProps {
  onSelectService: (service: ServiceItem) => void;
  onOpenBooking: (serviceName?: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService, onOpenBooking: _onOpenBooking }) => {
  return (
    <section id="services" className="py-20 md:py-28 bg-[#FBF9F5] border-t border-[#E2DDD5]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2C2A29] uppercase tracking-wider">
            УСЛУГИ
          </h2>
          <LeafOrnament className="w-5 h-5 text-[#747D68]" />
          <p className="text-xs uppercase tracking-[0.25em] text-[#706D69] mt-2 font-medium">
            Терапевтична подкрепа според вашите индивидуални нужди
          </p>
        </div>

        {/* 3 Symmetrical Cards with Arched Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {SERVICES_DATA.map((service) => (
            <div
              key={service.id}
              className="bg-[#F2EEE6] rounded-2xl border border-[#E2DDD5] p-6 sm:p-7 flex flex-col items-center text-center transition-all duration-300 hover:shadow-card hover:-translate-y-1.5 group"
            >
              
              {/* Arched Top Image Container */}
              <div className="w-full max-w-[240px] aspect-[3/4] overflow-hidden rounded-t-[130px] rounded-b-lg mb-6 relative bg-[#E5DFD4] shadow-sm">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 group-hover:filter group-hover:brightness-[1.02]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#2C2A29]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Title */}
              <h3 className="font-serif text-lg sm:text-xl font-medium text-[#2C2A29] uppercase tracking-wider mb-3 leading-snug">
                {service.title}
              </h3>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-[#4A4846] leading-relaxed font-light mb-7 flex-grow">
                {service.shortDescription}
              </p>

              {/* Outlined Pill Button */}
              <button
                onClick={() => onSelectService(service)}
                className="w-full max-w-[200px] border border-[#676F5C] hover:bg-[#676F5C] text-[#2C2A29] hover:text-white rounded-full py-2.5 px-5 text-[11px] uppercase tracking-[0.18em] font-medium transition-all duration-300 flex items-center justify-center gap-2 group/btn"
              >
                <span>НАУЧИ ПОВЕЧЕ</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" />
              </button>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
