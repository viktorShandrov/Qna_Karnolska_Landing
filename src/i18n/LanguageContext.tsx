import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Language, Translations, translations } from './translations';
import { updatePageSeo } from '../utils/seo';

interface LanguageContextType {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'yk_language_pref';

/**
 * Extracts language from current pathname.
 * Returns 'bg' | 'en' or null if not explicitly prefixed.
 */
function getLangFromPathname(pathname: string): Language | null {
  if (pathname.startsWith('/en/') || pathname === '/en') {
    return 'en';
  }
  if (pathname.startsWith('/bg/') || pathname === '/bg') {
    return 'bg';
  }
  return null;
}

/**
 * Normalizes URL path to ensure it starts with /<lang>/
 */
function buildLocalizedUrl(lang: Language, currentPathname: string, search: string, hash: string): string {
  // Strip existing /bg/ or /en/ or /bg or /en prefix if present
  let cleanPath = currentPathname.replace(/^\/(bg|en)(\/|$)/, '/');
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }
  // Ensure we form /<lang>/...
  const prefix = `/${lang}`;
  const localizedPath = cleanPath === '/' ? `${prefix}/` : `${prefix}${cleanPath}`;
  return localizedPath + search + hash;
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'bg';
    
    // 1. Check URL path first (highest priority)
    const fromPath = getLangFromPathname(window.location.pathname);
    if (fromPath) {
      return fromPath;
    }

    // 2. Check localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (stored === 'bg' || stored === 'en') {
        return stored;
      }
    } catch {
      // Ignore localStorage errors
    }

    // 3. Fallback to Bulgarian default
    return 'bg';
  });

  // Ensure URL contains /bg/ or /en/ on initial mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fromPath = getLangFromPathname(window.location.pathname);
    if (!fromPath) {
      // URL has no /bg/ or /en/ prefix, update to /${language}/ without reload
      const newUrl = buildLocalizedUrl(language, window.location.pathname, window.location.search, window.location.hash);
      window.history.replaceState({ lang: language }, '', newUrl);
    } else if (fromPath !== language) {
      // URL has a different prefix than state, sync state
      setLanguageState(fromPath);
    }

    document.documentElement.lang = language;
  }, []);

  // Listen for browser navigation (Back / Forward)
  useEffect(() => {
    const handlePopState = () => {
      const fromPath = getLangFromPathname(window.location.pathname);
      if (fromPath && fromPath !== language) {
        setLanguageState(fromPath);
        document.documentElement.lang = fromPath;
        try {
          localStorage.setItem(STORAGE_KEY, fromPath);
        } catch {}
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [language]);

  const setLanguage = useCallback((newLang: Language) => {
    if (newLang === language) return;

    setLanguageState(newLang);
    document.documentElement.lang = newLang;

    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {}

    // Update URL path while preserving query string (?article=...) and hash (#services)
    const newUrl = buildLocalizedUrl(newLang, window.location.pathname, window.location.search, window.location.hash);
    window.history.pushState({ lang: newLang }, '', newUrl);

    // Update SEO tags for new language
    updatePageSeo({ language: newLang });
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'bg' ? 'en' : 'bg');
  }, [language, setLanguage]);

  const value: LanguageContextType = {
    language,
    t: translations[language],
    setLanguage,
    toggleLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
