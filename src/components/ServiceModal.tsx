import React, { useEffect } from 'react';
import { X, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { ServiceItem } from '../data/content';

interface ServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBookThisService: (serviceId: string) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  onClose,
  onBookThisService
}) => {
  useEffect(() => {
    if (service) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [service]);

  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#2C2A29]/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-[#FBF9F5] w-full max-w-2xl rounded-3xl border border-[#E2DDD5] shadow-2xl overflow-hidden z-10 my-8 transform transition-all duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-cream-200 hover:bg-cream-300 text-[#4A4846] flex items-center justify-center transition-colors z-20 focus:outline-none"
          aria-label="Затвори"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 p-6 sm:p-8 items-center">
          
          {/* Arched image */}
          <div className="sm:col-span-5 flex justify-center">
            <div className="w-full max-w-[220px] aspect-[3/4] overflow-hidden rounded-t-[120px] rounded-b-xl relative bg-[#E5DFD4] shadow-md">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="sm:col-span-7 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#747D68] font-semibold">
                УСЛУГА
              </span>
              <h3 className="font-serif text-2xl font-medium text-[#2C2A29] uppercase tracking-wide mt-1">
                {service.title}
              </h3>
              <p className="text-xs text-[#747D68] font-medium mt-1 mb-4 italic">
                {service.subtitle}
              </p>

              <p className="text-xs text-[#4A4846] leading-relaxed font-light mb-4">
                {service.fullDescription}
              </p>

              <div className="mb-5">
                <h4 className="text-[11px] uppercase tracking-wider text-[#2C2A29] font-medium mb-2">
                  Подходяща при:
                </h4>
                <ul className="space-y-1.5">
                  {service.suitableFor.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-[#4A4846]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#676F5C] flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#706D69] mb-6">
                <Clock className="w-3.5 h-3.5 text-[#747D68]" />
                <span>Продължителност на сесията: <strong>{service.duration}</strong></span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  const id = service.id;
                  onClose();
                  onBookThisService(id);
                }}
                className="flex-1 bg-[#676F5C] hover:bg-[#4E5848] text-white py-3 rounded-full text-xs uppercase tracking-[0.18em] font-medium transition-all shadow text-center flex items-center justify-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>ЗАПАЗИ ЧАС ЗА ТАЗИ УСЛУГА</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
