import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Calendar, Clock, Phone, Mail, User, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { SERVICES_DATA } from '../data/content';
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from '../config/telegram';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
}

interface FieldErrors {
  name?: string;
  phone?: string;
  email?: string;
  date?: string;
}

const TIME_SLOT_LABELS: Record<string, string> = {
  morning: 'Сутрин (09:00 - 12:00)',
  afternoon: 'Обяд / Следобед (12:00 - 16:00)',
  evening: 'Късен следобед (16:00 - 19:00)'
};

const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialServiceId
}) => {
  const initialFormState = {
    name: '',
    email: '',
    phone: '',
    serviceId: initialServiceId || 'individual',
    date: '',
    timeSlot: 'morning',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (initialServiceId) {
      setFormData(prev => ({ ...prev, serviceId: initialServiceId }));
    }
  }, [initialServiceId]);

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setError(null);
      setFieldErrors({});
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSubmitted) {
      timer = setTimeout(() => {
        onClose();
      }, 4000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isSubmitted, onClose]);

  if (!isOpen) return null;

  const selectedService = SERVICES_DATA.find(s => s.id === formData.serviceId) || SERVICES_DATA[0];

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};
    const trimmedName = formData.name.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedEmail = formData.email.trim();

    // 1. Name validation
    if (!trimmedName) {
      errors.name = 'Моля, въведете вашето име и фамилия.';
    } else if (trimmedName.length < 2) {
      errors.name = 'Името трябва да съдържа поне 2 символа.';
    }

    // 2. Phone validation
    const phoneRegex = /^[0-9+\s\-()]{6,20}$/;
    if (!trimmedPhone) {
      errors.phone = 'Моля, въведете телефонен номер.';
    } else if (!phoneRegex.test(trimmedPhone)) {
      errors.phone = 'Невалиден телефонен номер (напр. +359 88 123 4567).';
    }

    // 3. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      errors.email = 'Моля, въведете имейл адрес.';
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = 'Невалиден имейл адрес (напр. name@example.com).';
    }

    // 4. Date validation (if date is selected)
    if (formData.date && formData.date < todayStr) {
      errors.date = 'Избраната дата не може да бъде в миналото.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate mandatory & format fields
    if (!validateForm()) {
      setError('Моля, коригирайте маркираните грешки във формата.');
      return;
    }

    setLoading(true);

    try {
      const trimmedName = formData.name.trim();
      const trimmedPhone = formData.phone.trim();
      const trimmedEmail = formData.email.trim();
      const timeOfDayText = TIME_SLOT_LABELS[formData.timeSlot] || formData.timeSlot;
      const dateText = formData.date ? formData.date : 'Не е посочена';
      const notesText = formData.notes.trim() ? formData.notes.trim() : 'Няма въведена бележка';
      const serviceText = selectedService.title;

      // Format message with HTML markup
      const messageText = 
        `🔔 <b>Нова заявка за час!</b>\n\n` +
        `👤 <b>Име:</b> ${escapeHtml(trimmedName)}\n` +
        `📞 <b>Телефон:</b> <a href="tel:${escapeHtml(trimmedPhone)}">${escapeHtml(trimmedPhone)}</a>\n` +
        `✉️ <b>Имейл:</b> ${escapeHtml(trimmedEmail)}\n` +
        `🛋️ <b>Услуга:</b> ${escapeHtml(serviceText)}\n` +
        `📅 <b>Предпочитана дата:</b> ${escapeHtml(dateText)}\n` +
        `⏰ <b>Удобно време:</b> ${escapeHtml(timeOfDayText)}\n` +
        `📝 <b>Бележка:</b> ${escapeHtml(notesText)}`;

      // Make POST request to Telegram API
      const endpoint = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: messageText,
          parse_mode: 'HTML'
        })
      });

      const resData = await response.json();

      if (!response.ok || !resData.ok) {
        throw new Error(resData?.description || 'Failed to send message to Telegram');
      }

      // Success handling
      setFormData(initialFormState);
      setFieldErrors({});
      setIsSubmitted(true);
    } catch (err) {
      console.error('Telegram API submission error:', err);
      setError('Възникна грешка при изпращането. Моля, опитайте отново или се свържете директно по телефона.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    if (fieldErrors[field as keyof FieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

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
              Благодарим ви!
            </h3>

            <p className="text-sm text-[#4A4846] leading-relaxed max-w-sm mb-8 font-light">
              Вашата заявка беше изпратена успешно. Ще се свържем с вас в най-кратък срок за потвърждение на часа.
            </p>

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

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              
              {/* Service Selector */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#4A4846] font-medium mb-1.5">
                  Изберете услуга
                </label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => handleInputChange('serviceId', e.target.value)}
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
                  <User className={`w-4 h-4 absolute left-3.5 top-3 pointer-events-none transition-colors ${fieldErrors.name ? 'text-red-500' : 'text-[#747D68]'}`} />
                  <input
                    type="text"
                    placeholder="напр. Мария Иванова"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full bg-[#F2EEE6] border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#2C2A29] focus:outline-none transition-all ${
                      fieldErrors.name
                        ? 'border-red-400 focus:ring-1 focus:ring-red-400 bg-red-50/30'
                        : 'border-[#E2DDD5] focus:ring-1 focus:ring-[#676F5C]'
                    }`}
                  />
                </div>
                {fieldErrors.name && (
                  <span className="text-[11px] text-red-600 mt-1 block font-medium">
                    {fieldErrors.name}
                  </span>
                )}
              </div>

              {/* Phone & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#4A4846] font-medium mb-1.5">
                    Телефонен номер *
                  </label>
                  <div className="relative">
                    <Phone className={`w-4 h-4 absolute left-3.5 top-3 pointer-events-none transition-colors ${fieldErrors.phone ? 'text-red-500' : 'text-[#747D68]'}`} />
                    <input
                      type="tel"
                      placeholder="+359 88 ..."
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full bg-[#F2EEE6] border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#2C2A29] focus:outline-none transition-all ${
                        fieldErrors.phone
                          ? 'border-red-400 focus:ring-1 focus:ring-red-400 bg-red-50/30'
                          : 'border-[#E2DDD5] focus:ring-1 focus:ring-[#676F5C]'
                      }`}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <span className="text-[11px] text-red-600 mt-1 block font-medium">
                      {fieldErrors.phone}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#4A4846] font-medium mb-1.5">
                    Имейл адрес *
                  </label>
                  <div className="relative">
                    <Mail className={`w-4 h-4 absolute left-3.5 top-3 pointer-events-none transition-colors ${fieldErrors.email ? 'text-red-500' : 'text-[#747D68]'}`} />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full bg-[#F2EEE6] border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#2C2A29] focus:outline-none transition-all ${
                        fieldErrors.email
                          ? 'border-red-400 focus:ring-1 focus:ring-red-400 bg-red-50/30'
                          : 'border-[#E2DDD5] focus:ring-1 focus:ring-[#676F5C]'
                      }`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <span className="text-[11px] text-red-600 mt-1 block font-medium">
                      {fieldErrors.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Date & Time Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#4A4846] font-medium mb-1.5">
                    Предпочитана дата
                  </label>
                  <div className="relative">
                    <Calendar className={`w-4 h-4 absolute left-3.5 top-3 pointer-events-none transition-colors ${fieldErrors.date ? 'text-red-500' : 'text-[#747D68]'}`} />
                    <input
                      type="date"
                      min={todayStr}
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className={`w-full bg-[#F2EEE6] border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#2C2A29] focus:outline-none transition-all ${
                        fieldErrors.date
                          ? 'border-red-400 focus:ring-1 focus:ring-red-400 bg-red-50/30'
                          : 'border-[#E2DDD5] focus:ring-1 focus:ring-[#676F5C]'
                      }`}
                    />
                  </div>
                  {fieldErrors.date && (
                    <span className="text-[11px] text-red-600 mt-1 block font-medium">
                      {fieldErrors.date}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#4A4846] font-medium mb-1.5">
                    Удобно време от деня
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#747D68] absolute left-3.5 top-3 pointer-events-none" />
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => handleInputChange('timeSlot', e.target.value)}
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
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full bg-[#F2EEE6] border border-[#E2DDD5] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#676F5C] transition-all resize-none"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#676F5C] hover:bg-[#4E5848] text-white py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all shadow-sm hover:shadow disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>ИЗПРАЩАНЕ...</span>
                    </>
                  ) : (
                    'ИЗПРАТИ ЗАЯВКА ЗА ЧАС'
                  )}
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



