import React, { useState, useEffect } from 'react';
import { 
  X, Lock, Unlock, Plus, Edit3, Trash2, Eye, KeyRound, 
  CheckCircle, AlertCircle, RotateCcw, Upload, Image as ImageIcon,
  Sparkles, Save, ArrowLeft, LogOut
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
  deleteArticleInDb 
} from '../services/articlesApi';

interface AdminArticlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: ArticleItem[];
  onUpdateArticles: (updatedArticles: ArticleItem[]) => void;
  onPreviewArticle: (article: ArticleItem) => void;
}

const PRESET_IMAGES = [
  { label: 'Интериор Кабинет', url: '/about-interior-v2.png' },
  { label: 'Индивидуална терапия', url: '/service-individual.png' },
  { label: 'Терапия за двойки', url: '/service-couples.png' },
  { label: 'Онлайн консултации', url: '/service-online.png' },
  { label: 'Портрет', url: '/hero-portrait.jpg' }
];

const CATEGORY_PRESETS = [
  'Личностно развитие',
  'Психотерапия & Спокойствие',
  'Емоционален баланс',
  'Отношения & Връзки',
  'Самооценка & Граници',
  'Справяне със стреса'
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

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formReadTime, setFormReadTime] = useState('5 мин четене');
  const [formDate, setFormDate] = useState('');
  const [formImage, setFormImage] = useState('/about-interior-v2.png');
  const [formQuote, setFormQuote] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formFullContent, setFormFullContent] = useState('');
  const [formKeyTakeaways, setFormKeyTakeaways] = useState<string[]>(['']);
  
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
      // Reset view on close
      setActiveView('list');
    }
  }, [isOpen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
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
    const months = ['Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'];
    const formattedDate = `${months[today.getMonth()]} ${today.getFullYear()}`;

    setEditingArticleId(null);
    setFormTitle('');
    setFormCategory('Личностно развитие');
    setFormReadTime('5 мин четене');
    setFormDate(formattedDate);
    setFormImage('/about-interior-v2.png');
    setFormQuote('');
    setFormExcerpt('');
    setFormFullContent('');
    setFormKeyTakeaways(['']);
    setActiveView('create');
  };

  const handleOpenEditForm = (article: ArticleItem) => {
    setEditingArticleId(article.id);
    setFormTitle(article.title);
    setFormCategory(article.category);
    setFormReadTime(article.readTime);
    setFormDate(article.date);
    setFormImage(article.image);
    setFormQuote(article.quote || '');
    setFormExcerpt(article.excerpt);
    setFormFullContent(article.fullContent.join('\n\n'));
    setFormKeyTakeaways(article.keyTakeaways && article.keyTakeaways.length > 0 ? article.keyTakeaways : ['']);
    setActiveView('edit');
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
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

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Моля, въведете заглавие на статията.');
      return;
    }

    const paragraphs = formFullContent
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const filteredTakeaways = formKeyTakeaways
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
      excerpt: formExcerpt.trim() || (paragraphs[0] ? paragraphs[0].slice(0, 160) + '...' : ''),
      fullContent: paragraphs.length > 0 ? paragraphs : [formExcerpt.trim()],
      keyTakeaways: filteredTakeaways.length > 0 ? filteredTakeaways : undefined
    };

    let updatedList: ArticleItem[];
    if (editingArticleId) {
      updatedList = articles.map(art => art.id === editingArticleId ? articleData : art);
      showToast('Статията е запазена в базата данни!');
      updateArticleInDb(articleData);
    } else {
      updatedList = [articleData, ...articles];
      showToast('Новата статия е публикувана в базата данни!');
      createArticleInDb(articleData);
    }

    saveArticlesToStorage(updatedList);
    onUpdateArticles(updatedList);
    setActiveView('list');
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (window.confirm(`Сигурни ли сте, че искате да изтриете статията:\n\n„${title}“?`)) {
      const updated = articles.filter(art => art.id !== id);
      saveArticlesToStorage(updated);
      onUpdateArticles(updated);
      deleteArticleInDb(id);
      showToast('Статията беше изтрита от базата данни.');
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
    setPasswordStatus(null);
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'Новите пароли не съвпадат.' });
      return;
    }
    const result = updateAdminPassword(oldPassword, newPassword);
    if (result.success) {
      setPasswordStatus({ type: 'success', message: result.message });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setActiveView('list');
        setPasswordStatus(null);
      }, 1500);
    } else {
      setPasswordStatus({ type: 'error', message: result.message });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#2C2A29]/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Main Container */}
      <div className="relative bg-[#FBF9F5] w-full max-w-4xl rounded-3xl sm:rounded-[36px] border border-[#E2DDD5] shadow-2xl overflow-hidden z-10 my-6 max-h-[92vh] flex flex-col">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#525D4D] text-[#FBF9F5] px-6 py-2.5 rounded-full shadow-lg text-xs tracking-wider flex items-center gap-2 animate-fadeIn border border-white/20">
            <CheckCircle className="w-4 h-4 text-emerald-300" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Top Header */}
        <div className="bg-[#EFEAE1] px-6 sm:px-8 py-4 border-b border-[#E2DDD5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#747D68] text-white flex items-center justify-center shadow-sm">
              {isAuthenticated ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-normal text-[#2C2A29] uppercase tracking-wider">
                Портал за управление на статии
              </h3>
              <p className="text-[11px] text-[#747D68] font-medium tracking-wide">
                Яна Кърнолска – Психолог
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#E2DDD5] hover:bg-[#D5CFBF] text-[#4A4846] flex items-center justify-center transition-colors focus:outline-none"
            aria-label="Затвори"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-grow p-6 sm:p-8">
          
          {/* 1. LOGIN SCREEN */}
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#EAE4D8] border border-[#DDD5C7] flex items-center justify-center mx-auto mb-5 text-[#525D4D]">
                <Lock className="w-7 h-7" />
              </div>

              <h4 className="font-serif text-2xl font-normal text-[#2C2A29] uppercase tracking-wide mb-2">
                Вход с парола
              </h4>
              
              <p className="font-serif text-sm text-[#5A5753] mb-6 leading-relaxed">
                Въведете вашата парола за достъп, за да добавяте, редактирате или премахвате статии от сайта.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Въведете парола..."
                    autoFocus
                    className="w-full px-4 py-3 rounded-full border border-[#D5CFBF] bg-white text-[#2C2A29] text-sm focus:outline-none focus:ring-2 focus:ring-[#747D68] pr-12 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#747D68] hover:text-[#2C2A29] font-medium"
                  >
                    {showPassword ? 'Скрий' : 'Покажи'}
                  </button>
                </div>

                {loginError && (
                  <div className="flex items-center justify-center gap-2 text-xs text-rose-600 bg-rose-50 py-2 rounded-lg border border-rose-200">
                    <AlertCircle className="w-4 h-4" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#676F5C] hover:bg-[#525D4D] text-white py-3 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all shadow hover:shadow-md active:scale-95"
                >
                  ВЛЕЗ В ПАНЕЛА
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-[#E8E2D7] text-xs text-[#7A7773] font-serif">
                <p>Първоначална парола по подразбиране: <strong className="text-[#2C2A29] font-mono">yana2026</strong></p>
                <p className="text-[11px] text-[#9A9793] mt-1">(Можете да я смените по всяко време след влизане)</p>
              </div>
            </div>
          ) : (
            /* 2. AUTHENTICATED ADMIN DASHBOARD */
            <div>
              {/* Dashboard Nav Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#E8E2D7] mb-6">
                <div className="flex items-center gap-2">
                  {activeView !== 'list' && (
                    <button
                      onClick={() => setActiveView('list')}
                      className="inline-flex items-center gap-1.5 text-xs text-[#676F5C] hover:text-[#2C2A29] font-medium px-3 py-1.5 rounded-full bg-[#EAE4D8] transition-colors mr-2"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Назад към списъка</span>
                    </button>
                  )}
                  <span className="font-serif text-lg text-[#2C2A29]">
                    {activeView === 'list' && `Публикувани статии (${articles.length})`}
                    {activeView === 'create' && 'Създаване на нова статия'}
                    {activeView === 'edit' && 'Редакция на статия'}
                    {activeView === 'password' && 'Смяна на парола'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {activeView === 'list' && (
                    <>
                      <button
                        onClick={handleOpenCreateForm}
                        className="bg-[#676F5C] hover:bg-[#525D4D] text-white px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Нова статия</span>
                      </button>

                      <button
                        onClick={() => setActiveView('password')}
                        className="bg-[#EAE4D8] hover:bg-[#DDD5C7] text-[#4A4846] px-3.5 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors"
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
                      {articles.map((art, idx) => (
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
                              <span className="inline-block text-[10px] uppercase tracking-[0.18em] px-2.5 py-0.5 rounded-full bg-white text-[#525D4D] font-medium border border-[#E2DDD5] mb-1">
                                {art.category}
                              </span>
                              <h4 className="font-serif text-base sm:text-lg font-medium text-[#2C2A29] truncate max-w-md">
                                {art.title}
                              </h4>
                              <p className="text-xs text-[#7A7773] font-serif">
                                {art.date} • {art.readTime}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[#E5DFD4]">
                            <button
                              onClick={() => onPreviewArticle(art)}
                              className="p-2 rounded-lg bg-white hover:bg-[#EAE4D8] text-[#525D4D] border border-[#DDD5C7] transition-colors"
                              title="Преглед на статията"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEditForm(art)}
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
                      ))}
                    </div>
                  )}

                  {/* Reset Defaults Button */}
                  <div className="pt-6 mt-6 border-t border-[#E8E2D7] flex justify-between items-center text-xs text-[#7A7773]">
                    <span>Запазва се автоматично на вашето устройство.</span>
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

              {/* VIEW: CREATE / EDIT FORM */}
              {(activeView === 'create' || activeView === 'edit') && (
                <form onSubmit={handleSaveArticle} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium mb-1.5">
                      Заглавие на статията *
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

                  {/* Category & Quick tags */}
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
                      {CATEGORY_PRESETS.map((cat) => (
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

                  {/* Read Time & Date */}
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
                  <div className="bg-[#F4F0E8] p-4 rounded-2xl border border-[#E2DDD5]">
                    <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium mb-2 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#747D68]" />
                      <span>Снимка на статията (Корица)</span>
                    </label>

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#DDD5C7] flex-shrink-0 border-2 border-[#747D68]/40 shadow-sm relative">
                        <img src={formImage} alt="Преглед" className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-grow w-full space-y-2">
                        <input
                          type="text"
                          value={formImage}
                          onChange={(e) => setFormImage(e.target.value)}
                          placeholder="Въведете URL адрес на снимка или изберете отдолу..."
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#D5CFBF] bg-white focus:outline-none font-mono"
                        />
                        
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="inline-flex items-center gap-1.5 bg-white border border-[#DDD5C7] px-3 py-1.5 rounded-lg text-xs text-[#525D4D] font-medium cursor-pointer hover:bg-[#EAE4D8] transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Качи снимка от компютъра</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageFileUpload}
                            />
                          </label>

                          <div className="flex flex-wrap gap-1">
                            {PRESET_IMAGES.map((preset) => (
                              <button
                                key={preset.url}
                                type="button"
                                onClick={() => setFormImage(preset.url)}
                                className={`text-[10px] px-2 py-1 rounded border transition-all ${
                                  formImage === preset.url 
                                    ? 'bg-[#525D4D] text-white border-[#525D4D]' 
                                    : 'bg-white text-[#525D4D] border-[#DDD5C7]'
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lead Quote */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#747D68]" />
                      <span>Ключов цитат / Акцент (по избор)</span>
                    </label>
                    <input
                      type="text"
                      value={formQuote}
                      onChange={(e) => setFormQuote(e.target.value)}
                      placeholder="напр. Поставянето на граници не е егоизъм, а врата към автентичност..."
                      className="w-full px-4 py-2 rounded-xl border border-[#D5CFBF] bg-white text-[#2C2A29] text-sm focus:ring-2 focus:ring-[#747D68] focus:outline-none font-serif italic"
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium mb-1.5">
                      Кратко резюме (за арочната карта на началната страница) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formExcerpt}
                      onChange={(e) => setFormExcerpt(e.target.value)}
                      placeholder="Кратко изречение или два реда, които привличат читателя..."
                      className="w-full px-4 py-2 rounded-xl border border-[#D5CFBF] bg-white text-[#2C2A29] text-sm focus:ring-2 focus:ring-[#747D68] focus:outline-none font-serif"
                    />
                  </div>

                  {/* Full Article Content */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-medium mb-1.5">
                      Пълен текст на статията (раздели параграфите с нов ред) *
                    </label>
                    <textarea
                      rows={6}
                      required
                      value={formFullContent}
                      onChange={(e) => setFormFullContent(e.target.value)}
                      placeholder="Напишете цялата статия тук. Всеки нов абзац разделете с Enter (нов ред)..."
                      className="w-full px-4 py-3 rounded-xl border border-[#D5CFBF] bg-white text-[#2C2A29] text-sm focus:ring-2 focus:ring-[#747D68] focus:outline-none font-serif leading-relaxed"
                    />
                  </div>

                  {/* Key Takeaways */}
                  <div className="bg-[#EFEAE1] p-4 sm:p-5 rounded-2xl border border-[#DDD5C7]">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs uppercase tracking-wider text-[#2C2A29] font-medium">
                        Практически насоки & Ключови изводи
                      </label>
                      <button
                        type="button"
                        onClick={handleAddTakeawayField}
                        className="text-xs text-[#525D4D] hover:text-[#2C2A29] font-medium flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Добави точка</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formKeyTakeaways.map((takeaway, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[#747D68] flex-shrink-0" />
                          <input
                            type="text"
                            value={takeaway}
                            onChange={(e) => handleTakeawayChange(idx, e.target.value)}
                            placeholder={`Практическа насока #${idx + 1}...`}
                            className="flex-grow px-3 py-1.5 rounded-lg border border-[#D5CFBF] bg-white text-xs focus:outline-none font-serif"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveTakeawayField(idx)}
                            className="text-gray-400 hover:text-rose-600 p-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E2D7]">
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
                      <span>{editingArticleId ? 'Запази промените' : 'Публикувай статията'}</span>
                    </button>
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
                        Потвърди новата парола
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
