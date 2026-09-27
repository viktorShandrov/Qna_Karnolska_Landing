import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { About } from './components/About';
import { ArticlesArch } from './components/ArticlesArch';
import { Approach } from './components/Approach';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { ServiceModal } from './components/ServiceModal';
import { ArticleModal } from './components/ArticleModal';
import { AdminArticlesModal } from './components/AdminArticlesModal';
import { ServiceItem, ArticleItem } from './data/content';
import { getStoredArticles } from './services/articlesStorage';
import { fetchArticlesFromDb } from './services/articlesApi';
import { updatePageSeo } from './utils/seo';
import { MessageCircle } from 'lucide-react';

export function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState<string | undefined>(undefined);
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<ServiceItem | null>(null);
  const [selectedArticleForDetail, setSelectedArticleForDetail] = useState<ArticleItem | null>(null);
  const [articles, setArticles] = useState<ArticleItem[]>(() => getStoredArticles());
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync SEO metadata whenever selected article changes
  useEffect(() => {
    if (selectedArticleForDetail) {
      updatePageSeo({ article: selectedArticleForDetail });
    } else {
      updatePageSeo();
    }
  }, [selectedArticleForDetail]);

  useEffect(() => {
    // Helper to check URL for article or admin deep links
    const checkUrlRoute = (currentArticles: ArticleItem[]) => {
      const searchParams = new URLSearchParams(window.location.search);
      const articleIdFromQuery = searchParams.get('article');
      const hash = window.location.hash;

      if (hash === '#admin') {
        setIsAdminOpen(true);
      }

      if (articleIdFromQuery) {
        const found = currentArticles.find((a) => a.id === articleIdFromQuery);
        if (found) {
          setSelectedArticleForDetail(found);
        }
      } else if (hash.startsWith('#article-')) {
        const articleIdFromHash = hash.replace('#article-', '');
        const found = currentArticles.find((a) => a.id === articleIdFromHash);
        if (found) {
          setSelectedArticleForDetail(found);
        }
      }
    };

    // Check on initial load
    checkUrlRoute(articles);

    // Fetch latest articles from Neon Database on load
    fetchArticlesFromDb().then((data) => {
      if (data && data.length > 0) {
        setArticles(data);
        checkUrlRoute(data);
      }
    });

    const handlePopState = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const articleId = searchParams.get('article');
      const hash = window.location.hash;

      if (hash === '#admin') {
        setIsAdminOpen(true);
      } else {
        setIsAdminOpen(false);
      }

      if (articleId) {
        const found = articles.find((a) => a.id === articleId);
        setSelectedArticleForDetail(found || null);
      } else {
        setSelectedArticleForDetail(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleSelectArticle = (article: ArticleItem) => {
    setSelectedArticleForDetail(article);
    const newUrl = `${window.location.pathname}?article=${encodeURIComponent(article.id)}`;
    window.history.pushState({ articleId: article.id }, '', newUrl);
  };

  const handleCloseArticle = () => {
    setSelectedArticleForDetail(null);
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('article')) {
      searchParams.delete('article');
      const newQuery = searchParams.toString();
      const newUrl = window.location.pathname + (newQuery ? `?${newQuery}` : '') + window.location.hash;
      window.history.pushState(null, '', newUrl);
    }
  };

  const handleOpenBooking = (serviceId?: string) => {
    setActiveServiceId(serviceId);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  const handleSelectService = (service: ServiceItem) => {
    setSelectedServiceForDetail(service);
  };

  const handleCloseServiceDetail = () => {
    setSelectedServiceForDetail(null);
  };

  const handleBookFromServiceDetail = (serviceId: string) => {
    handleOpenBooking(serviceId);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2C2A29] flex flex-col font-sans selection:bg-[#747D68] selection:text-white">
      {/* Navigation */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      {/* Main Content Sections */}
      <main className="flex-grow">
        <Hero onOpenBooking={() => handleOpenBooking()} />
        <Services 
          onSelectService={handleSelectService} 
          onOpenBooking={handleOpenBooking} 
        />
        <About onOpenBooking={() => handleOpenBooking()} />
        <ArticlesArch 
          articles={articles}
          onSelectArticle={handleSelectArticle}
        />
        <Approach />
        <Testimonials />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Floating Quick Action Button (Mobile/Desktop) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => handleOpenBooking()}
          className="bg-[#676F5C] hover:bg-[#4E5848] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-elevated flex items-center gap-2.5 transition-all duration-300 transform hover:scale-105 active:scale-95 group border border-white/20"
          aria-label="Запази час"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline text-xs font-semibold uppercase tracking-[0.16em]">
            Запази час
          </span>
        </button>
      </div>

      {/* Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        initialServiceId={activeServiceId}
      />

      <ServiceModal
        service={selectedServiceForDetail}
        onClose={handleCloseServiceDetail}
        onBookThisService={handleBookFromServiceDetail}
      />

      <ArticleModal
        article={selectedArticleForDetail}
        onClose={handleCloseArticle}
        onOpenBooking={() => {
          handleCloseArticle();
          handleOpenBooking();
        }}
      />

      <AdminArticlesModal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin') {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }}
        articles={articles}
        onUpdateArticles={(updated) => setArticles(updated)}
        onPreviewArticle={(article) => handleSelectArticle(article)}
      />
    </div>
  );
}

export default App;
