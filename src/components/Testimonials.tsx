import React from 'react';
import { LeafOrnament } from './LeafOrnament';
import { TESTIMONIALS_DATA } from '../data/content';
import { Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-[#556050] text-[#FBF9F5] relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-wider text-[#FBF9F5] uppercase">
            КАКВО СПОДЕЛЯТ МОИТЕ КЛИЕНТИ
          </h2>
          <LeafOrnament className="w-5 h-5 text-cream-300" />
          <p className="text-xs uppercase tracking-[0.25em] text-cream-200/80 mt-2 font-medium">
            Истински истории за личностна трансформация и спокойствие
          </p>
        </div>

        {/* 3 Testimonial Quote Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS_DATA.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white/[0.04] backdrop-blur-sm border border-white/20 hover:border-white/40 rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.07] group"
            >
              
              {/* Quote Icon */}
              <div>
                <div className="mb-4 text-cream-300 opacity-60 group-hover:opacity-100 transition-opacity">
                  <Quote className="w-6 h-6 rotate-180" />
                </div>

                {/* Quote Text */}
                <p className="font-serif italic text-sm sm:text-base leading-relaxed text-cream-100/95 font-normal mb-6">
                  {testimonial.quote}
                </p>
              </div>

              {/* Author & Initial */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="font-serif text-lg font-medium text-cream-100">
                  {testimonial.author}
                </span>
                {testimonial.details && (
                  <span className="text-[11px] uppercase tracking-wider text-cream-300/70 font-light">
                    {testimonial.details}
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>

        {/* Trust disclaimer */}
        <div className="text-center mt-12 text-xs text-cream-200/60 font-light tracking-wide">
          * Имената на клиентите са съкратени с цел спазване на пълна конфиденциалност и професионална етика.
        </div>

      </div>
    </section>
  );
};
