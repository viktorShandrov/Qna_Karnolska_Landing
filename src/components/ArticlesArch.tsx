import React from 'react';
import { LeafOrnament } from './LeafOrnament';
import { ArticleItem } from '../data/content';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

interface ArticlesArchProps {
  articles: ArticleItem[];
  onSelectArticle: (article: ArticleItem) => void;
}

export const ArticlesArch: React.FC<ArticlesArchProps> = ({ 
  articles, 
  onSelectArticle 
}) => {
  return (
    <section id="articles" className="py-20 sm:py-28 md:py-32 bg-[#F4F0E8] relative overflow-hidden">
      {/* Decorative subtle background arch ambient curves */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-b-[400px] bg-white/30 pointer-events-none -z-0 blur-2xl" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#747D68] font-semibold mb-2 block">
            ПОРТАЛ КЪМ ПОЗНАНИЕТО
          </span>
          
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#2C2A29] uppercase tracking-[0.22em] leading-tight">
            СТАТИИ
          </h2>
          
          <p className="font-serif text-lg sm:text-xl lg:text-2xl text-[#676F5C] italic font-normal tracking-wide mt-1 mb-2">
            размисли и анализи
          </p>

          <div className="flex justify-center -mt-1 mb-4">
            <LeafOrnament withLines={false} className="w-8 h-8 md:w-10 md:h-10 text-[#676F5C]" />
          </div>

          <p className="font-serif text-base sm:text-lg lg:text-[21px] text-[#4A4846] leading-relaxed font-normal max-w-xl mx-auto">
            Потопете се в размисли, психологически анализи и практически насоки за вътрешна хармония и себепознание.
          </p>
        </div>

        {/* 3 Arched Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch">
          {articles.map((article) => (
            <article
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="bg-[#FBF9F5] rounded-t-[140px] sm:rounded-t-[160px] lg:rounded-t-[180px] rounded-b-3xl border border-[#E2DDD5]/80 overflow-hidden flex flex-col items-center text-center transition-all duration-500 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer group"
            >
              {/* Arched Top Image Portal */}
              <div className="w-full aspect-[4/3.8] md:aspect-[4/4.2] overflow-hidden rounded-t-[140px] sm:rounded-t-[160px] lg:rounded-t-[180px] relative bg-[#E8E2D7]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 group-hover:brightness-95"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
                
                {/* Category Badge overlay on bottom */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-max max-w-[90%] pointer-events-none">
                  <span className="inline-block whitespace-nowrap bg-[#FBF9F5]/95 backdrop-blur-sm text-[#525D4D] text-[10px] sm:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.18em] px-3.5 py-1 rounded-full font-medium shadow-sm border border-[#E2DDD5] truncate max-w-full">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Card Content Area */}
              <div className="p-6 sm:p-7 md:p-8 flex flex-col justify-between flex-grow w-full">
                <div>
                  {/* Metadata (Read time & Date) */}
                  <div className="flex items-center justify-center gap-3 text-xs text-[#7A7773] mb-3 font-serif">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#747D68]" />
                      {article.readTime}
                    </span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-lg sm:text-xl lg:text-[22px] font-normal text-[#2C2A29] uppercase tracking-wider leading-snug mb-3.5 group-hover:text-[#525D4D] transition-colors">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="font-serif text-sm sm:text-base lg:text-[17.5px] text-[#4A4846] leading-relaxed font-normal mb-6 line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                {/* Read Button */}
                <div className="pt-2 border-t border-[#E8E2D7]/60 flex items-center justify-center">
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#525D4D] font-semibold group-hover:text-[#384134] transition-colors">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Прочети статията</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>

            </article>
          ))}
        </div>

        {/* Arch Portal Bottom Note */}
        <div className="mt-14 sm:mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#EAE4D8]/80 border border-[#DBD4C7] text-xs sm:text-sm text-[#4A4846] font-serif">
            <span className="w-1.5 h-1.5 rounded-full bg-[#747D68]" />
            <span>Всяка статия е покана за вътрешен диалог, по-дълбоко себепознание и осъзнати решения.</span>
          </div>
        </div>

      </div>
    </section>
  );
};
