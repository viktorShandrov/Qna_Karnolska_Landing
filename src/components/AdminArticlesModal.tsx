import React, { useState, useEffect } from 'react';
import { 
  X, Lock, Unlock, Plus, Edit3, Trash2, Eye, KeyRound, 
  CheckCircle, AlertCircle, RotateCcw, Image as ImageIcon,
  Save, ArrowLeft, LogOut, Globe
} from 'lucide-react';
import { ArticleItem } from '../data/content';
import { 
  verifyAdminPassword, 
  updateAdminPassword, 
  resetArticlesToDefault,
  saveArticlesToStorage 
} from '../services/articlesStorage';
import { 
  createArticleInDb, 
  updateArticleInDb, 
  deleteArticleInDb,
  fetchArticlesFromDb 
} from '../services/articlesApi';
import { BulgarianFlag, UkFlag } from './LanguageSwitcher';

interface AdminArticlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: ArticleItem[];
  onUpdateArticles: (updatedArticles: ArticleItem[]) => void;
  onPreviewArticle: (article: ArticleItem) => void;
}

const ARTICLE_FOLDER_IMAGES = [
  { id: 'pic1', label: 'Снимка 1 (Природа & Спокойствие)', url: '/Articles Images/pic1.jpeg' },
  { id: 'pic2', label: 'Снимка 2 (Уют & Терапия)', url: '/Articles Images/pic2.jpeg' },
  { id: 'pic3', label: 'Снимка 3 (Баланс & Хармония)', url: '/Articles Images/pic3.jpeg' },
  { id: 'pic4', label: 'Снимка 4 (Светлина & Пространство)', url: '/Articles Images/pic4.jpeg' },
  { id: 'service-individual', label: 'Индивидуална терапия', url: '/Articles Images/service-individual.png' },
  { id: 'service-couples', label: 'Терапия за двойки', url: '/Articles Images/service-couples.png' },
  { id: 'service-online', label: 'Онлайн консултации', url: '/Articles Images/service-online.png' },
];

const CATEGORY_PRESETS_BG = [
  'Личностно развитие',
  'Психотерапия & Спокойствие',
  'Емоционален баланс',
  'Отношения & Връзки',
  'Самооценка & Граници',
  'Справяне със стреса'
];

const CATEGORY_PRESETS_EN = [
  'Personal Growth',
  'Psychotherapy & Calm',
  'Emotional Balance',
  'Relationships & Bonds',
  'Self-Worth & Boundaries',
  'Stress Relief'
];

export const AdminArticlesModal: React.FC<AdminArticlesModalProps> = ({
  isOpen,
  onClose,
  articles,
  onUpdateArticles,
  onPreviewArticle
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Views: 'list' | 'create' | 'edit' | 'password'
  const [activeView, setActiveView] = useState<'list' | 'create' | 'edit' | 'password'>('list');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  // Form Tab: 'bg' (Bulgarian) | 'en' (English)
  const [formTab, setFormTab] = useState<'bg' | 'en'>('bg');

  // Bulgarian Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formReadTime, setFormReadTime] = useState('5 мин четене');
  const [formDate, setFormDate] = useState('');
  const [formImage, setFormImage] = useState('/about-interior-v2.png');
  const [formQuote, setFormQuote] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formFullContent, setFormFullContent] = useState('');
  const [formKeyTakeaways, setFormKeyTakeaways] = useState<string[]>(['']);

  // English Form State
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formCategoryEn, setFormCategoryEn] = useState('');
  const [formReadTimeEn, setFormReadTimeEn] = useState('5 min read');
  const [formDateEn, setFormDateEn] = useState('');
  const [formQuoteEn, setFormQuoteEn] = useState('');
  const [formExcerptEn, setFormExcerptEn] = useState('');
  const [formFullContentEn, setFormFullContentEn] = useState('');
  const [formKeyTakeawaysEn, setFormKeyTakeawaysEn] = useState<string[]>(['']);
  
  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Success Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setLoginError('');
    } else {
      document.body.style.overflow = 'unset';
      setActiveView('list');
    }
  }, [isOpen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(passwordInput)) {
      setIsAuthenticated(true);
      setLoginError('');
      setPasswordInput('');
    } else {
      setLoginError('Грешна парола! Опитайте отново.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    setActiveView('list');
  };

  const handleOpenCreateForm = () => {
    const today = new Date();
    const monthsBg = ['Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'];
    const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const formattedDateBg = `${monthsBg[today.getMonth()]} ${today.getFullYear()}`;
    const formattedDateEn = `${monthsEn[today.getMonth()]} ${today.getFullYear()}`;

    setEditingArticleId(null);
    setFormTab('bg');
    
    // BG defaults
    setFormTitle('');
    setFormCategory('Личностно развитие');
    setFormReadTime('5 мин четене');
    setFormDate(formattedDateBg);
    setFormImage('/Articles Images/pic1.jpeg');
    setFormQuote('');
    setFormExcerpt('');
    setFormFullContent('');
    setFormKeyTakeaways(['']);

    // EN defaults
    setFormTitleEn('');
    setFormCategoryEn('Personal Growth');
    setFormReadTimeEn('5 min read');
    setFormDateEn(formattedDateEn);
    setFormQuoteEn('');
    setFormExcerptEn('');
    setFormFullContentEn('');
    setFormKeyTakeawaysEn(['']);

    setActiveView('create');
  };

  const handleOpenEditForm = (article: ArticleItem, initialTab: 'bg' | 'en' = 'bg') => {
    setEditingArticleId(article.id);
    setFormTab(initialTab);

    // BG fields
    setFormTitle(article.title);
    setFormCategory(article.category);
    setFormReadTime(article.readTime);
    setFormDate(article.date);
    setFormImage(article.image);
    setFormQuote(article.quote || '');
    setFormExcerpt(article.excerpt);
    setFormFullContent(article.fullContent.join('\n\n'));
    setFormKeyTakeaways(article.keyTakeaways && article.keyTakeaways.length > 0 ? article.keyTakeaways : ['']);

    // EN fields
    setFormTitleEn(article.titleEn || '');
    setFormCategoryEn(article.categoryEn || '');
    setFormReadTimeEn(article.readTimeEn || '5 min read');
    setFormDateEn(article.dateEn || '');
    setFormQuoteEn(article.quoteEn || '');
    setFormExcerptEn(article.excerptEn || '');
    setFormFullContentEn(article.fullContentEn && article.fullContentEn.length > 0 ? article.fullContentEn.join('\n\n') : '');
    setFormKeyTakeawaysEn(article.keyTakeawaysEn && article.keyTakeawaysEn.length > 0 ? article.keyTakeawaysEn : ['']);

    setActiveView('edit');
  };

  const handleAddTakeawayField = () => {
    setFormKeyTakeaways([...formKeyTakeaways, '']);
  };

  const handleTakeawayChange = (index: number, value: string) => {
    const updated = [...formKeyTakeaways];
    updated[index] = value;
    setFormKeyTakeaways(updated);
  };

  const handleRemoveTakeawayField = (index: number) => {
    if (formKeyTakeaways.length === 1) {
      setFormKeyTakeaways(['']);
    } else {
      setFormKeyTakeaways(formKeyTakeaways.filter((_, i) => i !== index));
    }
  };

  const handleAddTakeawayFieldEn = () => {
    setFormKeyTakeawaysEn([...formKeyTakeawaysEn, '']);
  };

  const handleTakeawayChangeEn = (index: number, value: string) => {
    const updated = [...formKeyTakeawaysEn];
    updated[index] = value;
    setFormKeyTakeawaysEn(updated);
  };

  const handleRemoveTakeawayFieldEn = (index: number) => {
    if (formKeyTakeawaysEn.length === 1) {
      setFormKeyTakeawaysEn(['']);
    } else {
      setFormKeyTakeawaysEn(formKeyTakeawaysEn.filter((_, i) => i !== index));
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Моля, въведете поне заглавие на статията на български.');
      return;
    }

    const paragraphsBg = formFullContent
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const filteredTakeawaysBg = formKeyTakeaways
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const paragraphsEn = formFullContentEn
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const filteredTakeawaysEn = formKeyTakeawaysEn
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const articleData: ArticleItem = {
      id: editingArticleId || `article-${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory.trim() || 'Обща психология',
      readTime: formReadTime.trim() || '5 мин четене',
      date: formDate.trim() || '2026',
      image: formImage || '/about-interior-v2.png',
      quote: formQuote.trim() || undefined,
      excerpt: formExcerpt.trim() || (paragraphsBg[0] ? paragraphsBg[0].slice(0, 160) + '...' : ''),
      fullContent: paragraphsBg.length > 0 ? paragraphsBg : [formExcerpt.trim()],
      keyTakeaways: filteredTakeawaysBg.length > 0 ? filteredTakeawaysBg : undefined,

      // English localized fields
      titleEn: formTitleEn.trim() || undefined,
      categoryEn: formCategoryEn.trim() || undefined,
      readTimeEn: formReadTimeEn.trim() || undefined,
      dateEn: formDateEn.trim() || undefined,
      quoteEn: formQuoteEn.trim() || undefined,
      excerptEn: formExcerptEn.trim() || (paragraphsEn[0] ? paragraphsEn[0].slice(0, 160) + '...' : undefined),
      fullContentEn: paragraphsEn.length > 0 ? paragraphsEn : undefined,
      keyTakeawaysEn: filteredTakeawaysEn.length > 0 ? filteredTakeawaysEn : undefined,
    };

    let updatedList: ArticleItem[];
    if (editingArticleId) {
      updatedList = articles.map(art => art.id === editingArticleId ? articleData : art);
      showToast('Запазване на промените и превода в Neon...');
      const res = await updateArticleInDb(articleData);
      if (res.success) {
        showToast('Статията и преводът са запазени успешно в Neon!');
      }
    } else {
      updatedList = [articleData, ...articles];
      showToast('Публикуване в Neon базата данни & изпращане на нотификация...');
      const res = await createArticleInDb(articleData);
      if (res.success) {
        showToast('Новата статия е записана успешно и е изпратено известие в Telegram!');
      }
    }

    saveArticlesToStorage(updatedList);
    onUpdateArticles(updatedList);

    // Re-fetch from DB to guarantee sync
    const freshDbArticles = await fetchArticlesFromDb();
    if (freshDbArticles && freshDbArticles.length > 0) {
      onUpdateArticles(freshDbArticles);
    }

    setActiveView('list');
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (window.confirm(`Сигурни ли сте, че искате да изтриете статията:\n\n„${title}“?`)) {
      const updated = articles.filter(art => art.id !== id);
      saveArticlesToStorage(updated);
      onUpdateArticles(updated);
      
      showToast('Изтриване от Neon...');
      await deleteArticleInDb(id);
      
      const freshDbArticles = await fetchArticlesFromDb();
      if (freshDbArticles) {
        onUpdateArticles(freshDbArticles);
      }
      showToast('Статията беше изтрита от Neon базата данни.');
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Внимание: Това ще възстанови първоначалните 3 статии по подразбиране. Желаете ли да продължите?')) {
      const defaults = resetArticlesToDefault();
      onUpdateArticles(defaults);
      showToast('Статиите бяха възстановени по подразбиране.');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'Новите пароли не съвпадат.' });
      return;
    }
    const res = updateAdminPassword(oldPassword, newPassword);
    if (res.success) {
      setPasswordStatus({ type: 'success', message: res.message });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setActiveView('list');
        setPasswordStatus(null);
      }, 2000);
    } else {
      setPasswordStatus({ type: 'error', message: res.message });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#2C2A29]/75 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Main Modal Container */}
      <div className="relative bg-[#FBF9F5] w-full max-w-4xl rounded-3xl border border-[#E2DDD5] shadow-2xl overflow-hidden z-10 my-6 sm:my-8 transform transition-all duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 sm:px-8 py-4 sm:py-5 border-b border-[#E8E2D7] bg-[#F4F0E8] flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#525D4D] text-white flex items-center justify-center shadow-sm">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-normal text-[#2C2A29] uppercase tracking-wider">
                Управление на статии &amp; Преводи
              </h3>
              <p className="text-[11px] text-[#747D68] tracking-wider">
                {isAuthenticated ? 'Администраторски панел • Български & Английски език' : 'Защитена зона за вход'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-cream-200 hover:bg-cream-300 text-[#4A4846] flex items-center justify-center transition-colors focus:outline-none"
            aria-label="Затвори"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast message */}
        {toastMessage && (
          <div className="bg-emerald-700 text-white px-6 py-2.5 text-xs text-center flex items-center justify-center gap-2 transition-all">
            <CheckCircle className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-grow">
          
          {/* LOGIN SCREEN */}
          {!isAuthenticated ? (
            <div className="max-w-sm mx-auto py-8 sm:py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-[#747D68]/15 text-[#525D4D] flex items-center justify-center mx-auto mb-4">
                <Unlock className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-2xl font-normal text-[#2C2A29] uppercase tracking-wider mb-2">
                Вход за психолога
              </h4>
              <p className="text-xs text-[#7A7773] mb-6 font-serif">
                Въведете вашата парола за достъп до редактиране на съдържанието и преводите.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Въведете парола..."
                      autoFocus
                      className="w-full px-4 py-3 rounded-full border border-[#D5CFBF] bg-white text-[#2C2A29] text-sm focus:ring-2 focus:ring-[#747D68] focus:outline-none pr-12 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#747D68] hover:text-[#2C2A29]"
                    >
                      {showPassword ? 'Скрий' : 'Виж'}
                    </button>
                  </div>

                  {loginError && (
                    <div className="flex items-center gap-1.5 text-rose-600 text-xs mt-2 justify-center">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{loginError}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#676F5C] hover:bg-[#525D4D] text-white py-3 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all shadow hover:shadow-md"
                >
                  Влез в панела
                </button>
              </form>
            </div>
          ) : (
            /* AUTHENTICATED PANEL */
            <div>
              {/* Top Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-[#E8E2D7]">
                <div className="flex items-center gap-2">
                  {activeView !== 'list' && (
                    <button
                      onClick={() => setActiveView('list')}
                      className="p-2 rounded-full hover:bg-[#EAE4D8] text-[#525D4D] transition-colors"
                      title="Назад към списъка"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                  <h4 className="font-serif text-xl font-normal text-[#2C2A29] uppercase tracking-wide">
                    {activeView === 'list' && `Публикувани статии (${articles.length})`}
                    {activeView === 'create' && 'Нова статия'}
                    {activeView === 'edit' && 'Редакция на статия & Превод'}
                    {activeView === 'password' && 'Смяна на парола'}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  {activeView === 'list' && (
                    <>
                      <button
                        onClick={handleOpenCreateForm}
                        className="bg-[#676F5C] hover:bg-[#525D4D] text-white px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 transition-all shadow-sm hover:shadow"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Нова статия</span>
                      </button>

                      <button
                        onClick={() => setActiveView('password')}
                        className="bg-[#EFEAE1] hover:bg-[#E2DDD2] text-[#525D4D] px-3.5 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 border border-[#DDD6C8] transition-colors"
                        title="Смяна на парола"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-[#747D68]" />
                        <span className="hidden sm:inline">Парола</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="bg-[#EAE4D8] hover:bg-rose-100 text-[#4A4846] hover:text-rose-700 px-3.5 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors"
                    title="Изход"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Изход</span>
                  </button>
                </div>
              </div>

              {/* VIEW: ARTICLES LIST */}
              {activeView === 'list' && (
                <div className="space-y-4">
                  {articles.length === 0 ? (
                    <div className="text-center py-12 bg-[#F4F0E8] rounded-2xl border border-[#E2DDD5]">
                      <p className="font-serif text-lg text-[#6A6763] mb-4">
                        Няма добавени статии.
                      </p>
                      <button
                        onClick={handleOpenCreateForm}
                        className="bg-[#676F5C] text-white px-6 py-2.5 rounded-full text-xs uppercase tracking-wider"
                      >
                        Добави първата статия
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {articles.map((art, idx) => {
                        const hasEn = Boolean(art.titleEn && art.titleEn.trim());

                        return (
                          <div
                            key={art.id}
                            className="bg-[#F4F0E8] rounded-2xl p-4 sm:p-5 border border-[#E2DDD5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-[#C8C2B3]"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <span className="text-xs font-mono font-bold text-[#747D68] w-5 text-center flex-shrink-0">
                                #{idx + 1}
                              </span>
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#DDD5C7] flex-shrink-0 border border-[#DBD4C7]">
                                <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <span className="inline-block text-[10px] uppercase tracking-[0.18em] px-2.5 py-0.5 rounded-full bg-white text-[#525D4D] font-medium border border-[#E2DDD5]">
                                    {art.category}
                                  </span>

                                  {/* Language Status Badges */}
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    <BulgarianFlag className="w-3 h-2" />
                                    <span>BG</span>
                                  </span>

                                  {hasEn ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                      <UkFlag className="w-3 h-2" />
                                      <span>EN: Готово ✔</span>
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditForm(art, 'en')}
                                      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition-all cursor-pointer"
                                      title="Цъкнете за добавяне на английски превод"
                                    >
                                      <UkFlag className="w-3 h-2" />
                                      <span>EN: Липсва превод ⚠️</span>
                                    </button>
                                  )}
                                </div>

                                <h4 className="font-serif text-base sm:text-lg font-medium text-[#2C2A29] truncate max-w-md">
                                  {art.title}
                                </h4>
                                {hasEn && (
                                  <p className="text-xs text-[#5A6350] italic truncate max-w-md">
                                    EN: {art.titleEn}
                                  </p>
                                )}
                                <p className="text-xs text-[#7A7773] font-serif">
                                  {art.date} • {art.readTime}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[#E5DFD4]">
                              {/* Quick Translate Button */}
                              <button
                                onClick={() => handleOpenEditForm(art, 'en')}
                                className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${
                                  hasEn 
                                    ? 'bg-white hover:bg-[#EAE4D8] text-[#525D4D] border-[#DDD5C7]' 
                                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                                }`}
                                title={hasEn ? 'Редактирай английския превод' : 'Добави английски превод'}
                              >
                                <UkFlag className="w-3.5 h-2.5" />
                                <span className="text-[11px]">{hasEn ? 'EN Превод' : 'Преведи'}</span>
                              </button>

                              <button
                                onClick={() => onPreviewArticle(art)}
                                className="p-2 rounded-lg bg-white hover:bg-[#EAE4D8] text-[#525D4D] border border-[#DDD5C7] transition-colors"
                                title="Преглед на статията"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenEditForm(art, 'bg')}
                                className="p-2 rounded-lg bg-[#676F5C] hover:bg-[#525D4D] text-white transition-colors"
                                title="Редактирай"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteArticle(art.id, art.title)}
                                className="p-2 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 transition-colors"
                                title="Изтрий статията"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Reset Defaults Button */}
                  <div className="pt-6 mt-6 border-t border-[#E8E2D7] flex justify-between items-center text-xs text-[#7A7773]">
                    <span>Статиите се синхронизират автоматично с Neon Postgres базата данни.</span>
                    <button
                      onClick={handleResetDefaults}
                      className="text-[#747D68] hover:text-[#2C2A29] flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Възстанови статиите по подразбиране</span>
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW: CREATE / EDIT FORM WITH LANGUAGE TABS */}
              {(activeView === 'create' || activeView === 'edit') && (
                <form onSubmit={handleSaveArticle} className="space-y-6">
                  
                  {/* Language Selector Tab Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-[#EFEAE1] rounded-2xl border border-[#DDD5C7]">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFormTab('bg')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                          formTab === 'bg'
                            ? 'bg-[#676F5C] text-white shadow-sm'
                            : 'bg-white/70 text-[#525D4D] hover:bg-white'
                        }`}
                      >
                        <BulgarianFlag className="w-4 h-3" />
                        <span>Български текст (BG)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormTab('en')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                          formTab === 'en'
                            ? 'bg-[#676F5C] text-white shadow-sm'
                            : 'bg-white/70 text-[#525D4D] hover:bg-white'
                        }`}
                      >
                        <UkFlag className="w-4 h-3" />
                        <span>Английски превод (EN)</span>
                        {formTitleEn.trim() ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" title="Има въведен английски превод" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" title="Очаква превод" />
                        )}
                      </button>
                    </div>

                    <div className="text-[11px] text-[#747D68] font-medium pr-2">
                      Редактирате: <strong>{formTab === 'bg' ? 'Български оригинал' : 'English Translation'}</strong>
                    </div>
                  </div>

                  {/* === TAB 1: BULGARIAN FORM FIELDS === */}
                  {formTab === 'bg' && (
                    <div className="space-y-6 animate-fadeIn">
                      {/* Title BG */}
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium mb-1.5">
                          Заглавие на статията (Български) *
                        </label>
                        <input
                          type="text"
                          required
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="напр. Граници и себеуважение: Как да казваме „не“..."
                          className="w-full px-4 py-2.5 rounded-xl border border-[#D5CFBF] bg-white text-[#2C2A29] text-sm focus:ring-2 focus:ring-[#747D68] focus:outline-none font-serif"
                        />
                      </div>

                      {/* Category BG & Quick presets */}
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium mb-1.5">
                          Категория / Тема *
                        </label>
                        <input
                          type="text"
                          required
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          placeholder="напр. Личностно развитие"
                          className="w-full px-4 py-2 rounded-xl border border-[#D5CFBF] bg-white text-[#2C2A29] text-sm focus:ring-2 focus:ring-[#747D68] focus:outline-none mb-2"
                        />
                        <div className="flex flex-wrap gap-1.5">
                          {CATEGORY_PRESETS_BG.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setFormCategory(cat)}
                              className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all ${
                                formCategory === cat 
                                  ? 'bg-[#525D4D] text-white border-[#525D4D]' 
                                  : 'bg-white text-[#525D4D] border-[#DDD5C7] hover:bg-[#EAE4D8]'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Read Time & Date BG */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium mb-1.5">
                            Време за четене
                          </label>
                          <input
                            type="text"
                            value={formReadTime}
                            onChange={(e) => setFormReadTime(e.target.value)}
                            placeholder="напр. 5 мин четене"
                            className="w-full px-4 py-2 rounded-xl border border-[#D5CFBF] bg-white text-[#2C2A29] text-sm focus:ring-2 focus:ring-[#747D68] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium mb-1.5">
                            Дата на публикуване
                          </label>
                          <input
                            type="text"
                            value={formDate}
                            onChange={(e) => setFormDate(e.target.value)}
                            placeholder="напр. Септември 2026"
                            className="w-full px-4 py-2 rounded-xl border border-[#D5CFBF] bg-white text-[#2C2A29] text-sm focus:ring-2 focus:ring-[#747D68] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Image Picker */}
                      <div className="bg-[#F4F0E8] p-4 sm:p-5 rounded-2xl border border-[#E2DDD5] space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-semibold flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-[#747D68]" />
                            <span>Снимка на статията (Корица)</span>
                          </label>
                          <span className="text-[11px] text-[#747D68] font-medium">
                            Папка: <strong className="text-[#2C2A29]">Article Images</strong>
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {ARTICLE_FOLDER_IMAGES.map((img) => (
                            <button
                              key={img.id}
                              type="button"
                              onClick={() => setFormImage(img.url)}
                              className={`group relative rounded-xl overflow-hidden border-2 aspect-[4/3] transition-all text-left ${
                                formImage === img.url
                                  ? 'border-[#525D4D] ring-2 ring-[#525D4D]/30 shadow-md'
                                  : 'border-transparent hover:border-[#DDD5C7] opacity-80 hover:opacity-100'
                              }`}
                            >
                              <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                <span className="text-[10px] text-white leading-tight font-medium">
                                  {img.label}
                                </span>
                              </div>
                              {formImage === img.url && (
                                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#525D4D] text-white flex items-center justify-center">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quote BG */}
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium mb-1.5">
                          Акцентен цитат (по желание)
                        </label>
                        <input
                          type="text"
                          value={formQuote}
                          onChange={(e) => setFormQuote(e.target.value)}
                          placeholder="напр. Поставянето на здравословни граници не е стена срещу света..."
                          className="w-full px-4 py-2 rounded-xl border border-[#D5CFBF] bg-white text-[#2C2A29] text-sm focus:ring-2 focus:ring-[#747D68] focus:outline-none italic font-serif"
                        />
                      </div>

                      {/* Excerpt BG */}
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium mb-1.5">
                          Кратко въведение / Резюме *
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={formExcerpt}
                          onChange={(e) => setFormExcerpt(e.target.value)}
                          placeholder="1-2 изречения, показвани на картата на статията..."
                          className="w-full px-4 py-2 rounded-xl border border-[#D5CFBF] bg-white text-[#2C2A29] text-sm focus:ring-2 focus:ring-[#747D68] focus:outline-none font-serif resize-none"
                        />
                      </div>

                      {/* Full Content BG */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium">
                            Пълен текст на статията *
                          </label>
                          <span className="text-[11px] text-[#747D68]">
                            Разделяйте параграфите с празен ред (Enter).
                          </span>
                        </div>
                        <textarea
                          rows={8}
                          required
                          value={formFullContent}
                          onChange={(e) => setFormFullContent(e.target.value)}
                          placeholder="Напишете съдържанието на статията тук..."
                          className="w-full px-4 py-3 rounded-xl border border-[#D5CFBF] bg-white text-[#2C2A29] text-sm focus:ring-2 focus:ring-[#747D68] focus:outline-none font-serif leading-relaxed"
                        />
                      </div>

                      {/* Key Takeaways BG */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium">
                            Практически насоки &amp; Ключови изводи
                          </label>
                          <button
                            type="button"
                            onClick={handleAddTakeawayField}
                            className="text-[11px] uppercase tracking-wider text-[#525D4D] hover:text-[#2C2A29] font-semibold flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Добави точка</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {formKeyTakeaways.map((takeaway, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="text-xs text-[#747D68] w-4 text-right flex-shrink-0">
                                {idx + 1}.
                              </span>
                              <input
                                type="text"
                                value={takeaway}
                                onChange={(e) => handleTakeawayChange(idx, e.target.value)}
                                placeholder="напр. Техники за заземяване и диафрагмено дишане..."
                                className="flex-grow px-3.5 py-2 rounded-xl border border-[#D5CFBF] bg-white text-[#2C2A29] text-xs focus:ring-1 focus:ring-[#747D68] focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveTakeawayField(idx)}
                                className="p-2 text-[#8C867B] hover:text-rose-600 transition-colors"
                                title="Премахни"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* === TAB 2: ENGLISH TRANSLATION FIELDS === */}
                  {formTab === 'en' && (
                    <div className="space-y-6 animate-fadeIn">
                      
                      {/* Bulgarian Reference Box */}
                      <div className="bg-[#EFEAE1] border border-[#DDD5C7] rounded-2xl p-4 sm:p-5 text-xs text-[#4A4846] space-y-2.5">
                        <div className="flex items-center justify-between border-b border-[#DDD5C7]/70 pb-2">
                          <span className="font-semibold text-[#525D4D] uppercase tracking-wider flex items-center gap-1.5">
                            <BulgarianFlag className="w-3.5 h-2.5" />
                            <span>Оригинален текст на български (за справка при превода)</span>
                          </span>
                          <span className="text-[11px] text-[#747D68]">Справка</span>
                        </div>
                        <div className="space-y-1.5">
                          <p><strong>Заглавие (BG):</strong> {formTitle || '— (все още няма въведено заглавие)'}</p>
                          <p><strong>Категория (BG):</strong> {formCategory || '—'}</p>
                          {formQuote && <p><strong>Цитат (BG):</strong> „{formQuote}“</p>}
                          {formExcerpt && <p><strong>Резюме (BG):</strong> {formExcerpt}</p>}
                        </div>
                      </div>

                      {/* English Title */}
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium mb-1.5 flex items-center justify-between">
                          <span>Article Title (English)</span>
                          <span className="text-[10px] text-[#747D68] font-normal">Показва се при избран английски език</span>
                        </label>
                        <input
                          type="text"
                          value={formTitleEn}
                          onChange={(e) => setFormTitleEn(e.target.value)}
                          placeholder="e.g., Boundaries and Self-Worth: How to Say 'No' Without Guilt"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#D5CFBF] bg-white text-[#2C2A29] text-sm focus:ring-2 focus:ring-[#747D68] focus:outline-none font-serif"
                        />
                      </div>

                      {/* English Category & Presets */}
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium mb-1.5">
                          Category / Topic (English)
                        </label>
                        <input
                          type="text"
                          value={formCategoryEn}
                          onChange={(e) => setFormCategoryEn(e.target.value)}
                          placeholder="e.g., Personal Growth"
                          className="w-full px-4 py-2 rounded-xl border border-[#D5CFBF] bg-white text-[#2C2A29] text-sm focus:ring-2 focus:ring-[#747D68] focus:outline-none mb-2"
                        />
                        <div className="flex flex-wrap gap-1.5">
                          {CATEGORY_PRESETS_EN.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setFormCategoryEn(cat)}
                              className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all ${
                                formCategoryEn === cat 
                                  ? 'bg-[#525D4D] text-white border-[#525D4D]' 
                                  : 'bg-white text-[#525D4D] border-[#DDD5C7] hover:bg-[#EAE4D8]'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Read Time & Date EN */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium mb-1.5">
                            Reading Time (English)
                          </label>
                          <input
                            type="text"
                            value={formReadTimeEn}
                            onChange={(e) => setFormReadTimeEn(e.target.value)}
                            placeholder="e.g., 5 min read"
                            className="w-full px-4 py-2 rounded-xl border border-[#D5CFBF] bg-white text-[#2C2A29] text-sm focus:ring-2 focus:ring-[#747D68] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium mb-1.5">
                            Publishing Date (English)
                          </label>
                          <input
                            type="text"
                            value={formDateEn}
                            onChange={(e) => setFormDateEn(e.target.value)}
                            placeholder="e.g., October 2026"
                            className="w-full px-4 py-2 rounded-xl border border-[#D5CFBF] bg-white text-[#2C2A29] text-sm focus:ring-2 focus:ring-[#747D68] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Quote EN */}
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium mb-1.5">
                          Featured Quote (English, optional)
                        </label>
                        <input
                          type="text"
                          value={formQuoteEn}
                          onChange={(e) => setFormQuoteEn(e.target.value)}
                          placeholder="e.g., Setting healthy boundaries is not a wall against the world..."
                          className="w-full px-4 py-2 rounded-xl border border-[#D5CFBF] bg-white text-[#2C2A29] text-sm focus:ring-2 focus:ring-[#747D68] focus:outline-none italic font-serif"
                        />
                      </div>

                      {/* Excerpt EN */}
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium mb-1.5">
                          Short Excerpt / Teaser (English)
                        </label>
                        <textarea
                          rows={2}
                          value={formExcerptEn}
                          onChange={(e) => setFormExcerptEn(e.target.value)}
                          placeholder="1-2 sentences displayed on the article card..."
                          className="w-full px-4 py-2 rounded-xl border border-[#D5CFBF] bg-white text-[#2C2A29] text-sm focus:ring-2 focus:ring-[#747D68] focus:outline-none font-serif resize-none"
                        />
                      </div>

                      {/* Full Content EN */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium">
                            Full Article Content (English)
                          </label>
                          <span className="text-[11px] text-[#747D68]">
                            Separate paragraphs with a blank line (Enter).
                          </span>
                        </div>
                        <textarea
                          rows={8}
                          value={formFullContentEn}
                          onChange={(e) => setFormFullContentEn(e.target.value)}
                          placeholder="Write or paste the English article translation here..."
                          className="w-full px-4 py-3 rounded-xl border border-[#D5CFBF] bg-white text-[#2C2A29] text-sm focus:ring-2 focus:ring-[#747D68] focus:outline-none font-serif leading-relaxed"
                        />
                      </div>

                      {/* Key Takeaways EN */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium">
                            Key Takeaways &amp; Actionable Insights (English)
                          </label>
                          <button
                            type="button"
                            onClick={handleAddTakeawayFieldEn}
                            className="text-[11px] uppercase tracking-wider text-[#525D4D] hover:text-[#2C2A29] font-semibold flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add point</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {formKeyTakeawaysEn.map((takeaway, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="text-xs text-[#747D68] w-4 text-right flex-shrink-0">
                                {idx + 1}.
                              </span>
                              <input
                                type="text"
                                value={takeaway}
                                onChange={(e) => handleTakeawayChangeEn(idx, e.target.value)}
                                placeholder="e.g., Grounding techniques and diaphragmatic breathing..."
                                className="flex-grow px-3.5 py-2 rounded-xl border border-[#D5CFBF] bg-white text-[#2C2A29] text-xs focus:ring-1 focus:ring-[#747D68] focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveTakeawayFieldEn(idx)}
                                className="p-2 text-[#8C867B] hover:text-rose-600 transition-colors"
                                title="Remove"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Actions Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E8E2D7]">
                    <div className="text-xs text-[#747D68] flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>
                        {formTitleEn.trim() 
                          ? '✅ Английският превод е готов за запис' 
                          : 'ℹ️ Можете да запишете само българския текст и да преведете по-късно'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveView('list')}
                        className="px-6 py-2.5 rounded-full border border-[#D5CFBF] text-[#4A4846] hover:bg-[#EAE4D8] text-xs uppercase tracking-wider font-medium transition-colors"
                      >
                        Отказ
                      </button>
                      <button
                        type="submit"
                        className="bg-[#676F5C] hover:bg-[#525D4D] text-white px-8 py-2.5 rounded-full text-xs uppercase tracking-[0.18em] font-medium transition-all shadow hover:shadow-md flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>{editingArticleId ? 'Запази промените & Превода' : 'Публикувай статията'}</span>
                      </button>
                    </div>
                  </div>

                </form>
              )}

              {/* VIEW: CHANGE PASSWORD */}
              {activeView === 'password' && (
                <div className="max-w-md mx-auto py-4">
                  <h4 className="font-serif text-xl font-normal text-[#2C2A29] uppercase tracking-wide mb-4 text-center">
                    Смяна на администраторската парола
                  </h4>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium mb-1">
                        Текуща парола
                      </label>
                      <input
                        type="password"
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#D5CFBF] bg-white text-sm focus:ring-2 focus:ring-[#747D68] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium mb-1">
                        Нова парола
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#D5CFBF] bg-white text-sm focus:ring-2 focus:ring-[#747D68] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium mb-1">
                        Потвърдете новата парола
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#D5CFBF] bg-white text-sm focus:ring-2 focus:ring-[#747D68] focus:outline-none"
                      />
                    </div>

                    {passwordStatus && (
                      <div className={`flex items-center gap-2 text-xs p-3 rounded-lg border ${
                        passwordStatus.type === 'success' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {passwordStatus.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        <span>{passwordStatus.message}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setActiveView('list')}
                        className="px-6 py-2.5 rounded-full border border-[#D5CFBF] text-[#4A4846] hover:bg-[#EAE4D8] text-xs uppercase tracking-wider font-medium"
                      >
                        Отказ
                      </button>
                      <button
                        type="submit"
                        className="bg-[#676F5C] hover:bg-[#525D4D] text-white px-8 py-2.5 rounded-full text-xs uppercase tracking-[0.18em] font-medium transition-all shadow"
                      >
                        Смени паролата
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
