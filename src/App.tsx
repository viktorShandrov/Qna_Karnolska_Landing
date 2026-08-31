import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { About } from './components/About';
import { Approach } from './components/Approach';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { ServiceModal } from './components/ServiceModal';
import { ServiceItem } from './data/content';
import { MessageCircle } from 'lucide-react';

export function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState<string | undefined>(undefined);
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<ServiceItem | null>(null);

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
        <Approach />
        <Testimonials />
      </main>

      {/* Footer */}
      <Footer />

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
    </div>
  );
}

export default App;
