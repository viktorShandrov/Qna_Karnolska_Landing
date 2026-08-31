import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Calendar, Clock, Phone, Mail, User, MessageSquare } from 'lucide-react';
import { SERVICES_DATA } from '../data/content';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialServiceId
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceId: initialServiceId || 'individual',
    date: '',
    timeSlot: 'morning',
    notes: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialServiceId) {
      setFormData(prev => ({ ...prev, serviceId: initialServiceId }));
    }
  }, [initialServiceId]);

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  const selectedService = SERVICES_DATA.find(s => s.id === formData.serviceId) || SERVICES_DATA[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#2C2A29]/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-[#FBF9F5] w-full max-w-lg rounded-3xl border border-[#E2DDD5] shadow-2xl overflow-hidden z-10 my-8 transform transition-all duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-cream-200 hover:bg-cream-300 text-[#4A4846] flex items-center justify-center transition-colors z-20 focus:outline-none"
          aria-label="Затвори"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* Success Screen */
          <div className="p-8 sm:p-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#676F5C]/15 text-[#4E5848] flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#2C2A29] font-medium mb-3">
              Благодаря ви, {formData.name}!
            </h3>

            <p className="text-sm text-[#4A4846] leading-relaxed max-w-sm mb-6 font-light">
              Вашата заявка за <strong>{selectedService.title}</strong> беше получена успешно. Ще се свържа с вас до 24 часа за потвърждение на точния час.
            </p>

            <div className="bg-[#F2EEE6] rounded-2xl p-4 w-full text-left text-xs text-[#4A4846] space-y-2 border border-[#E2DDD5] mb-6">
              <div className="flex justify-between">
                <span className="text-[#706D69]">Услуга:</span>
                <span className="font-medium text-[#2C2A29]">{selectedService.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#706D69]">Телефон:</span>
                <span className="font-medium text-[#2C2A29]">{formData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#706D69]">Имейл:</span>
                <span className="font-medium text-[#2C2A29]">{formData.email}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="bg-[#676F5C] hover:bg-[#4E5848] text-white px-8 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all"
            >
              ЗАТВОРИ
            </button>
          </div>
        ) : (
          /* Booking Form */
          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#747D68] font-semibold">
                КОНСУЛТАЦИЯ
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#2C2A29] font-medium mt-1">
                Запазете своя час
              </h3>
              <p className="text-xs text-[#706D69] mt-1.5 font-light">
                Попълнете формата и ще се свържа с вас за уточняване на удобен график.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Service Selector */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#4A4846] font-medium mb-1.5">
                  Изберете услуга
                </label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  className="w-full bg-[#F2EEE6] border border-[#E2DDD5] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#676F5C] transition-all"
                >
                  {SERVICES_DATA.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title} ({service.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#4A4846] font-medium mb-1.5">
                  Вашето име и фамилия *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#747D68] absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="напр. Мария Иванова"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F2EEE6] border border-[#E2DDD5] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#676F5C] transition-all"
                  />
                </div>
              </div>

              {/* Phone & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#4A4846] font-medium mb-1.5">
                    Телефонен номер *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#747D68] absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      placeholder="+359 88 ..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#F2EEE6] border border-[#E2DDD5] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#676F5C] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#4A4846] font-medium mb-1.5">
                    Имейл адрес *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#747D68] absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#F2EEE6] border border-[#E2DDD5] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#676F5C] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Date & Time Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#4A4846] font-medium mb-1.5">
                    Предпочитана дата
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#747D68] absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-[#F2EEE6] border border-[#E2DDD5] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#676F5C] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#4A4846] font-medium mb-1.5">
                    Удобно време от деня
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#747D68] absolute left-3.5 top-3 pointer-events-none" />
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className="w-full bg-[#F2EEE6] border border-[#E2DDD5] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#676F5C] transition-all"
                    >
                      <option value="morning">Сутрин (09:00 - 12:00)</option>
                      <option value="afternoon">Обяд / Следобед (12:00 - 16:00)</option>
                      <option value="evening">Късен следобед (16:00 - 19:00)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Note / Message */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#4A4846] font-medium mb-1.5">
                  Кратка бележка или повод за посещение (по желание)
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-[#747D68] absolute left-3.5 top-3 pointer-events-none" />
                  <textarea
                    rows={2}
                    placeholder="Споделете накратко каква подкрепа търсите..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-[#F2EEE6] border border-[#E2DDD5] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#676F5C] transition-all resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#676F5C] hover:bg-[#4E5848] text-white py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all shadow-sm hover:shadow disabled:opacity-70"
                >
                  {loading ? 'ИЗПРАЩАНЕ...' : 'ИЗПРАТИ ЗАЯВКА ЗА ЧАС'}
                </button>
              </div>

              <p className="text-[10px] text-center text-[#706D69] font-light">
                * Вашите данни се обработват при спазване на строга медицинска и психологическа конфиденциалност.
              </p>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
