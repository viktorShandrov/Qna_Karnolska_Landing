import React, { useEffect, useState } from 'react';
import { X, Clock, Calendar, CheckCircle2, MessageCircle, Heart, Link2, Check } from 'lucide-react';
import { ArticleItem } from '../data/content';
import { LeafOrnament } from './LeafOrnament';
import { useLanguage } from '../i18n/LanguageContext';
import { getArticleShareUrl, copyTextToClipboard } from '../utils/share';

interface ArticleModalProps {
  article: ArticleItem | null;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article: rawArticle,
  onClose,
  onOpenBooking,
}) => {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [rawArticle?.id]);

  const handleCopyLink = async () => {
    if (!rawArticle) return;
    const url = getArticleShareUrl(rawArticle.id, language);
    const success = await copyTextToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2500);
    }
  };

  // Localize article content if a translation is available
  const article: ArticleItem | null = rawArticle ? (() => {
    if (language === 'en') {
      if (rawArticle.titleEn && rawArticle.titleEn.trim()) {
        return {
          ...rawArticle,
          title: rawArticle.titleEn,
          category: rawArticle.categoryEn || rawArticle.category,
          readTime: rawArticle.readTimeEn || rawArticle.readTime,
          date: rawArticle.dateEn || rawArticle.date,
          excerpt: rawArticle.excerptEn || rawArticle.excerpt,
          quote: rawArticle.quoteEn || rawArticle.quote,
          fullContent: (rawArticle.fullContentEn && rawArticle.fullContentEn.length > 0) ? rawArticle.fullContentEn : rawArticle.fullContent,
          keyTakeaways: (rawArticle.keyTakeawaysEn && rawArticle.keyTakeawaysEn.length > 0) ? rawArticle.keyTakeawaysEn : rawArticle.keyTakeaways,
        };
      }
      const translated = t.articles.items.find(a => a.id === rawArticle.id);
      if (translated) {
        return {
          ...rawArticle,
          title: translated.title,
          category: translated.category,
          readTime: translated.readTime,
          date: translated.date,
          excerpt: translated.excerpt,
          quote: translated.quote || rawArticle.quote,
          fullContent: translated.fullContent,
          keyTakeaways: translated.keyTakeaways || rawArticle.keyTakeaways,
        };
      }
    }
    return rawArticle;
  })() : null;

  useEffect(() => {
    if (rawArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [rawArticle]);

  // Dynamically update document.title and canonical link for the article
  useEffect(() => {
    if (!article || !rawArticle) return;

    const previousTitle = document.title;
    const authorSuffix = language === 'en' ? 'Yana Karnolska' : 'Яна Кърнолска';
    document.title = `${article.title} | ${authorSuffix}`;

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://yanapsychology.com';
    const hasBgPrefix = typeof window !== 'undefined' && window.location.pathname.startsWith('/bg');
    const pathPrefix = language === 'en' ? '/en' : (hasBgPrefix ? '/bg' : '');
    const articleCanonical = `${origin}${pathPrefix}/?article=${encodeURIComponent(rawArticle.id)}`;

    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const previousCanonical = canonicalEl ? canonicalEl.getAttribute('href') : null;

    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', articleCanonical);

    return () => {
      document.title = previousTitle;
      if (canonicalEl) {
        if (previousCanonical) {
          canonicalEl.setAttribute('href', previousCanonical);
        } else {
          const homePath = language === 'en' ? '/en/' : (hasBgPrefix ? '/bg/' : '/');
          canonicalEl.setAttribute('href', `${origin}${homePath}`);
        }
      }
    };
  }, [article?.title, rawArticle?.id, language]);

  if (!rawArticle || !article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#2C2A29]/65 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <article className="relative bg-[#FBF9F5] w-full max-w-3xl rounded-3xl sm:rounded-[36px] border border-[#E2DDD5] shadow-2xl overflow-hidden z-10 my-6 sm:my-10 transform transition-all duration-300 max-h-[90vh] flex flex-col">
        
        {/* Sticky Header with Close Button & Copy Link */}
        <header className="sticky top-0 z-30 bg-[#FBF9F5]/90 backdrop-blur-md px-6 py-4 border-b border-[#E8E2D7] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#747D68] font-semibold truncate">
            <span>{article.category}</span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className={`px-3 py-1.5 rounded-full text-xs font-serif flex items-center gap-1.5 transition-all active:scale-95 border ${
                copied
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm'
                  : 'bg-[#EAE4D8] hover:bg-[#DDD6C8] text-[#3A3836] border-[#D8D1C2]'
              }`}
              title={copied ? t.articleModal.linkCopied : t.articleModal.shareTooltip}
              aria-label={t.articleModal.copyLink}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-[11px] font-medium tracking-wide">
                    {t.articleModal.linkCopied}
                  </span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5 text-[#5A6350]" />
                  <span className="text-[11px] font-medium tracking-wide hidden sm:inline">
                    {t.articleModal.copyLink}
                  </span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#EAE4D8] hover:bg-[#DDD6C8] text-[#4A4846] flex items-center justify-center transition-colors focus:outline-none"
              aria-label={t.articleModal.closeLabel}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto px-6 sm:px-10 lg:px-12 py-6 sm:py-8 space-y-8">
          
          {/* Article Title & Metadata */}
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#2C2A29] uppercase tracking-wide leading-tight mb-4">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-[#7A7773] font-serif">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#747D68]" />
                {article.readTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#747D68]" />
                {article.date}
              </span>
              <span>•</span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 text-[#676F5C] hover:text-[#2C2A29] underline decoration-[#A8A296] underline-offset-4 transition-colors cursor-pointer"
                title={t.articleModal.shareTooltip}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">{t.articleModal.linkCopied}</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5" />
                    <span>{t.articleModal.copyLink}</span>
                  </>
                )}
              </button>
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
              loading="eager"
            />
          </div>

          {/* Featured Quote / Key Excerpt */}
          {article.quote && (
            <div className="relative bg-[#F4F0E8] border-l-4 border-[#747D68] p-5 sm:p-7 rounded-r-2xl my-6">
              <p className="font-serif text-lg sm:text-xl text-[#3A3836] italic leading-relaxed">
                „{article.quote}“
              </p>
              <span className="block mt-2 text-xs uppercase tracking-[0.18em] text-[#747D68] font-medium">
                {t.articleModal.authorAttribution}
              </span>
            </div>
          )}

          {/* Main Article Paragraphs */}
          <div className="space-y-4 sm:space-y-5 text-[#3E3C3A] font-serif text-base sm:text-lg lg:text-[20px] leading-relaxed font-normal">
            {article.fullContent && article.fullContent.length > 0 ? (
              article.fullContent.map((paragraph, idx) => (
                <p key={idx}>
                  {paragraph}
                </p>
              ))
            ) : (
              <div className="space-y-3 py-4 animate-pulse">
                <div className="h-4 bg-[#E8E2D7] rounded w-full"></div>
                <div className="h-4 bg-[#E8E2D7] rounded w-11/12"></div>
                <div className="h-4 bg-[#E8E2D7] rounded w-4/5"></div>
                <div className="h-4 bg-[#E8E2D7] rounded w-full mt-4"></div>
                <div className="h-4 bg-[#E8E2D7] rounded w-10/12"></div>
              </div>
            )}
          </div>

          {/* Key Takeaways Box */}
          {article.keyTakeaways && article.keyTakeaways.length > 0 && (
            <div className="bg-[#EFEAE1] border border-[#DDD5C7] rounded-2xl p-6 sm:p-7 my-8">
              <h2 className="font-serif text-lg sm:text-xl font-normal text-[#2C2A29] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#747D68]" />
                <span>{t.articleModal.keyTakeawaysTitle}</span>
              </h2>
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

          {/* Share Article Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#F4F0E8] border border-[#E2DDD5]">
            <div className="text-center sm:text-left">
              <span className="text-xs uppercase tracking-[0.16em] text-[#747D68] font-semibold block mb-0.5">
                {language === 'en' ? 'Share this article' : 'Споделете статията'}
              </span>
              <p className="text-xs text-[#6A6763] font-serif">
                {language === 'en' ? 'Copy direct link to share with someone who might find it helpful' : 'Копирайте директна връзка, за да я изпратите на близък или в социалните мрежи'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-full text-xs font-serif flex items-center gap-2 transition-all active:scale-95 border flex-shrink-0 shadow-xs ${
                copied
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                  : 'bg-white hover:bg-[#EAE4D8] text-[#2C2A29] border-[#DDD5C7]'
              }`}
              title={copied ? t.articleModal.linkCopied : t.articleModal.shareTooltip}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{t.articleModal.linkCopied}</span>
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4 text-[#676F5C]" />
                  <span>{t.articleModal.copyLink}</span>
                </>
              )}
            </button>
          </div>

          {/* Call to Action & Booking Prompt */}
          <div className="bg-[#525D4D] text-[#FBF9F5] rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center">
            <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-wider mb-2 uppercase">
              {t.articleModal.ctaHeading}
            </h2>
            <p className="font-serif text-sm sm:text-base text-[#FBF9F5]/90 max-w-md mb-5 leading-relaxed font-light">
              {t.articleModal.ctaDescription}
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenBooking();
              }}
              className="bg-[#78806A] hover:bg-[#636B56] text-white px-8 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all shadow hover:shadow-lg flex items-center gap-2 active:scale-95 border border-white/20"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.articleModal.ctaButton}</span>
            </button>
          </div>

        </div>

      </article>
    </div>
  );
};
