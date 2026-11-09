import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Calendar, Clock, Phone, Mail, User, MessageSquare, Loader2, AlertCircle, Link2, Check } from 'lucide-react';
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from '../config/telegram';
import { useLanguage } from '../i18n/LanguageContext';
import { getBookingShareUrl, copyTextToClipboard } from '../utils/share';

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
  const { t, language } = useLanguage();

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
  const [copied, setCopied] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleCopyLink = async () => {
    const url = getBookingShareUrl(formData.serviceId, language);
    const success = await copyTextToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

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

  const currentServices = t.services.items;
  const selectedService = currentServices.find(s => s.id === formData.serviceId) || currentServices[0];

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};
    const trimmedName = formData.name.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedEmail = formData.email.trim();

    // 1. Name validation
    if (!trimmedName) {
      errors.name = t.bookingModal.validation.nameRequired;
    } else if (trimmedName.length < 2) {
      errors.name = t.bookingModal.validation.nameMin;
    }

    // 2. Phone validation
    const phoneRegex = /^[0-9+\s\-()]{6,20}$/;
    if (!trimmedPhone) {
      errors.phone = t.bookingModal.validation.phoneRequired;
    } else if (!phoneRegex.test(trimmedPhone)) {
      errors.phone = t.bookingModal.validation.phoneInvalid;
    }

    // 3. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      errors.email = t.bookingModal.validation.emailRequired;
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = t.bookingModal.validation.emailInvalid;
    }

    // 4. Date validation
    if (formData.date && formData.date < todayStr) {
      errors.date = t.bookingModal.validation.datePast;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate mandatory & format fields
    if (!validateForm()) {
      setError(language === 'en' ? 'Please correct the highlighted errors in the form.' : 'Моля, коригирайте маркираните грешки във формата.');
      return;
    }

    setLoading(true);

    try {
      const trimmedName = formData.name.trim();
      const trimmedPhone = formData.phone.trim();
      const trimmedEmail = formData.email.trim();
      const timeSlotKey = formData.timeSlot as 'morning' | 'afternoon' | 'evening';
      const timeOfDayText = t.bookingModal.timeSlots[timeSlotKey] || formData.timeSlot;
      const dateText = formData.date ? formData.date : (language === 'en' ? 'Not specified' : 'Не е посочена');
      const notesText = formData.notes.trim() ? formData.notes.trim() : (language === 'en' ? 'No notes' : 'Няма въведена бележка');
      const serviceText = selectedService.title;

      // Format message with HTML markup
      const messageText = 
        `🔔 <b>Нова заявка за час! (${language.toUpperCase()})</b>\n\n` +
        `👤 <b>Име:</b> ${escapeHtml(trimmedName)}\n` +
        `📞 <b>Телефон:</b> <a href="tel:${escapeHtml(trimmedPhone)}">${escapeHtml(trimmedPhone)}</a>\n` +
        `✉️ <b>Имейл:</b> ${escapeHtml(trimmedEmail)}\n` +
        `🛋️ <b>Услуга:</b> ${escapeHtml(serviceText)}\n` +
        `📅 <b>Предпочитана дата:</b> ${escapeHtml(dateText)}\n` +
        `⏰ <b>Удобно време:</b> ${escapeHtml(timeOfDayText)}\n` +
        `🌐 <b>Език на запитването:</b> ${language.toUpperCase()}\n` +
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
      setError(t.bookingModal.validation.generalError);
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
    // Dynamically update clean URL path without '?' when selected service changes
    if (field === 'serviceId' && typeof window !== 'undefined') {
      const hasEnPrefix = window.location.pathname.startsWith('/en');
      const langPrefix = hasEnPrefix ? '/en' : '';
      const serviceSegment = value && value !== 'all' ? `/${encodeURIComponent(value)}` : '';
      const newPath = `${langPrefix}/booking${serviceSegment}`;

      const searchParams = new URLSearchParams(window.location.search);
      searchParams.delete('booking');
      searchParams.delete('book');
      const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
      const cleanHash = window.location.hash.startsWith('#book') ? '' : window.location.hash;

      const newUrl = `${newPath}${queryString}${cleanHash}`;
      window.history.replaceState({ booking: true, serviceId: value }, '', newUrl);
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
        
        {/* Top-Right Modal Controls: Copy Link + Close */}
        <div className="absolute top-5 right-5 flex items-center gap-2 z-20">
          <button
            type="button"
            onClick={handleCopyLink}
            className={`h-9 px-3 rounded-full flex items-center gap-1.5 text-xs font-serif transition-all active:scale-95 border ${
              copied
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold shadow-xs'
                : 'bg-[#F2ECE1] hover:bg-[#E5DDCF] text-[#4A4846] border-[#DDD5C7]'
            }`}
            title={copied ? (language === 'en' ? 'Direct link copied!' : 'Директният линк е копиран!') : (language === 'en' ? 'Copy direct booking link' : 'Копирай директен линк за споделяне')}
            aria-label="Copy booking link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] font-medium">{language === 'en' ? 'Copied!' : 'Копиран!'}</span>
              </>
            ) : (
              <>
                <Link2 className="w-3.5 h-3.5 text-[#676F5C]" />
                <span className="text-[11px] tracking-wide">{language === 'en' ? 'Share' : 'Сподели'}</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#EAE4D8] hover:bg-[#DDD5C7] text-[#4A4846] flex items-center justify-center transition-colors focus:outline-none"
            aria-label={t.bookingModal.closeLabel}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          /* Success Screen */
          <div className="p-8 sm:p-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#676F5C]/15 text-[#4E5848] flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#2C2A29] font-medium mb-3">
              {t.bookingModal.success.title}
            </h3>

            <p className="text-sm text-[#4A4846] leading-relaxed max-w-sm mb-8 font-light">
              {t.bookingModal.success.message}
            </p>

            <button
              onClick={onClose}
              className="bg-[#676F5C] hover:bg-[#4E5848] text-white px-8 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all"
            >
              {t.bookingModal.closeLabel}
            </button>
          </div>
        ) : (
          /* Booking Form */
          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#747D68] font-semibold">
                {language === 'en' ? 'CONSULTATION' : 'КОНСУЛТАЦИЯ'}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#2C2A29] font-medium mt-1">
                {t.bookingModal.title}
              </h3>
              <p className="text-xs text-[#706D69] mt-1.5 font-light">
                {t.bookingModal.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              
              {/* Service Selector */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#4A4846] font-medium mb-1.5">
                  {t.bookingModal.serviceLabel}
                </label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => handleInputChange('serviceId', e.target.value)}
                  className="w-full bg-[#F2EEE6] border border-[#E2DDD5] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#676F5C] transition-all"
                >
                  {currentServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title} ({service.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#4A4846] font-medium mb-1.5">
                  {t.bookingModal.nameLabel} *
                </label>
                <div className="relative">
                  <User className={`w-4 h-4 absolute left-3.5 top-3 pointer-events-none transition-colors ${fieldErrors.name ? 'text-red-500' : 'text-[#747D68]'}`} />
                  <input
                    type="text"
                    placeholder={t.bookingModal.namePlaceholder}
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
                    {t.bookingModal.phoneLabel} *
                  </label>
                  <div className="relative">
                    <Phone className={`w-4 h-4 absolute left-3.5 top-3 pointer-events-none transition-colors ${fieldErrors.phone ? 'text-red-500' : 'text-[#747D68]'}`} />
                    <input
                      type="tel"
                      placeholder={t.bookingModal.phonePlaceholder}
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
                    {t.bookingModal.emailLabel} *
                  </label>
                  <div className="relative">
                    <Mail className={`w-4 h-4 absolute left-3.5 top-3 pointer-events-none transition-colors ${fieldErrors.email ? 'text-red-500' : 'text-[#747D68]'}`} />
                    <input
                      type="email"
                      placeholder={t.bookingModal.emailPlaceholder}
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
                    {t.bookingModal.dateLabel}
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
                    {t.bookingModal.timeSlotLabel}
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#747D68] absolute left-3.5 top-3 pointer-events-none" />
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => handleInputChange('timeSlot', e.target.value)}
                      className="w-full bg-[#F2EEE6] border border-[#E2DDD5] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#2C2A29] focus:outline-none focus:ring-1 focus:ring-[#676F5C] transition-all"
                    >
                      <option value="morning">{t.bookingModal.timeSlots.morning}</option>
                      <option value="afternoon">{t.bookingModal.timeSlots.afternoon}</option>
                      <option value="evening">{t.bookingModal.timeSlots.evening}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Note / Message */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#4A4846] font-medium mb-1.5">
                  {t.bookingModal.notesLabel}
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-[#747D68] absolute left-3.5 top-3 pointer-events-none" />
                  <textarea
                    rows={2}
                    placeholder={t.bookingModal.notesPlaceholder}
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
                      <span>{t.bookingModal.submitting}</span>
                    </>
                  ) : (
                    t.bookingModal.submitButton
                  )}
                </button>
              </div>

              <p className="text-[10px] text-center text-[#706D69] font-light">
                {language === 'en'
                  ? '* Your data is processed in strict compliance with medical and psychological confidentiality.'
                  : '* Вашите данни се обработват при спазване на строга медицинска и психологическа конфиденциалност.'}
              </p>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
