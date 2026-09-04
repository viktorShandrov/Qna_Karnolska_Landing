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
import { MessageCircle } from 'lucide-react';

export function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState<string | undefined>(undefined);
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<ServiceItem | null>(null);
  const [selectedArticleForDetail, setSelectedArticleForDetail] = useState<ArticleItem | null>(null);
  const [articles, setArticles] = useState<ArticleItem[]>(() => getStoredArticles());
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    // Fetch latest articles from Neon Database on load
    fetchArticlesFromDb().then((data) => {
      if (data && data.length > 0) {
        setArticles(data);
      }
    });

    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
          onSelectArticle={(article) => setSelectedArticleForDetail(article)}
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
        onClose={() => setSelectedArticleForDetail(null)}
        onOpenBooking={() => {
          setSelectedArticleForDetail(null);
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
        onPreviewArticle={(article) => setSelectedArticleForDetail(article)}
      />
    </div>
  );
}

export default App;
