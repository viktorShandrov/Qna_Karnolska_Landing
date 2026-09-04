import React, { useEffect } from 'react';
import { X, Clock, Calendar, CheckCircle2, MessageCircle, Heart } from 'lucide-react';
import { ArticleItem } from '../data/content';
import { LeafOrnament } from './LeafOrnament';

interface ArticleModalProps {
  article: ArticleItem | null;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  onOpenBooking,
}) => {
  useEffect(() => {
    if (article) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [article]);

  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#2C2A29]/65 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-[#FBF9F5] w-full max-w-3xl rounded-3xl sm:rounded-[36px] border border-[#E2DDD5] shadow-2xl overflow-hidden z-10 my-6 sm:my-10 transform transition-all duration-300 max-h-[90vh] flex flex-col">
        
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 z-30 bg-[#FBF9F5]/90 backdrop-blur-md px-6 py-4 border-b border-[#E8E2D7] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#747D68] font-semibold">
            <span>{article.category}</span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#EAE4D8] hover:bg-[#DDD6C8] text-[#4A4846] flex items-center justify-center transition-colors focus:outline-none"
            aria-label="Затвори"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto px-6 sm:px-10 lg:px-12 py-6 sm:py-8 space-y-8">
          
          {/* Article Title & Metadata */}
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#2C2A29] uppercase tracking-wide leading-tight mb-4">
              {article.title}
            </h2>

            <div className="flex items-center justify-center gap-4 text-xs text-[#7A7773] font-serif">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#747D68]" />
                {article.readTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#747D68]" />
                {article.date}
              </span>
            </div>

            <div className="flex justify-center my-3">
              <LeafOrnament withLines={false} className="w-8 h-8 text-[#676F5C]" />
            </div>
          </div>

          {/* Arched Hero Image */}
          <div className="w-full max-w-xl mx-auto aspect-[16/9] sm:aspect-[21/10] overflow-hidden rounded-t-[140px] sm:rounded-t-[180px] rounded-b-2xl relative bg-[#E8E2D7] shadow-md border border-[#E2DDD5]">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Featured Quote / Key Excerpt */}
          {article.quote && (
            <div className="relative bg-[#F4F0E8] border-l-4 border-[#747D68] p-5 sm:p-7 rounded-r-2xl my-6">
              <p className="font-serif text-lg sm:text-xl text-[#3A3836] italic leading-relaxed">
                „{article.quote}“
              </p>
              <span className="block mt-2 text-xs uppercase tracking-[0.18em] text-[#747D68] font-medium">
                – Яна Кърнолска, психолог
              </span>
            </div>
          )}

          {/* Main Article Paragraphs */}
          <div className="space-y-4 sm:space-y-5 text-[#3E3C3A] font-serif text-base sm:text-lg lg:text-[20px] leading-relaxed font-normal">
            {article.fullContent.map((paragraph, idx) => (
              <p key={idx}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Key Takeaways Box */}
          {article.keyTakeaways && article.keyTakeaways.length > 0 && (
            <div className="bg-[#EFEAE1] border border-[#DDD5C7] rounded-2xl p-6 sm:p-7 my-8">
              <h4 className="font-serif text-lg sm:text-xl font-normal text-[#2C2A29] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#747D68]" />
                <span>Практически насоки & Ключови изводи:</span>
              </h4>
              <ul className="space-y-2.5">
                {article.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm sm:text-base font-serif text-[#4A4846]">
                    <CheckCircle2 className="w-4 h-4 text-[#676F5C] flex-shrink-0 mt-1" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Call to Action & Booking Prompt */}
          <div className="bg-[#525D4D] text-[#FBF9F5] rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center">
            <h4 className="font-serif text-xl sm:text-2xl font-normal tracking-wider mb-2 uppercase">
              Имате ли нужда от лична подкрепа?
            </h4>
            <p className="font-serif text-sm sm:text-base text-[#FBF9F5]/90 max-w-md mb-5 leading-relaxed font-light">
              Ако темите в тази статия резонират с вашата лична житейска ситуация, можете да запазите час за индивидуална консултация.
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenBooking();
              }}
              className="bg-[#78806A] hover:bg-[#636B56] text-white px-8 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all shadow hover:shadow-lg flex items-center gap-2 active:scale-95 border border-white/20"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Запази час за консултация</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
