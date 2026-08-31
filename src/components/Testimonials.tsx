import React from 'react';
import { LeafOrnament } from './LeafOrnament';
import { TESTIMONIALS_DATA } from '../data/content';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 md:py-32 bg-[#707764] text-[#FBF9F5] relative overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[0.25em] text-[#FBF9F5] uppercase">
            КАКВО СПОДЕЛЯТ МОИТЕ КЛИЕНТИ
          </h2>
          <div className="flex justify-center -mt-1">
            <LeafOrnament withLines={false} className="w-5 h-5 text-[#FBF9F5]/90" />
          </div>
        </div>

        {/* 3 Quote Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch">
          {TESTIMONIALS_DATA.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative border border-white/35 rounded-2xl p-7 sm:p-8 flex flex-col justify-between items-center text-center transition-all duration-300 hover:border-white/60 group min-h-[220px]"
            >
              {/* Quote Mark Notch in Top Left */}
              <div className="absolute -top-3.5 left-7 bg-[#707764] px-2 font-serif text-2xl text-white/90 leading-none select-none">
                “
              </div>

              {/* Quote Content in classical serif */}
              <div className="my-auto pt-2">
                <p className="font-serif text-lg lg:text-[22.5px] leading-relaxed text-[#FBF9F5] font-normal max-w-sm mx-auto">
                  {testimonial.quote}
                </p>
              </div>

              {/* Author */}
              <div className="pt-4 mt-auto">
                <span className="font-serif text-sm sm:text-base text-[#FBF9F5] font-normal tracking-wide">
                  {testimonial.author}
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
