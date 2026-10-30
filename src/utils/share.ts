import { Language } from '../i18n/translations';

/**
 * Builds a direct shareable URL for an article, respecting the current or target language.
 * E.g. https://domain.com/?article=anxiety-stress
 *   or https://domain.com/en/?article=anxiety-stress
 */
export function getArticleShareUrl(articleId: string, forcedLang?: Language): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://yanapsychology.com';

  let lang: Language = forcedLang || 'bg';
  if (!forcedLang && typeof window !== 'undefined') {
    if (window.location.pathname.startsWith('/en')) {
      lang = 'en';
    } else if (window.location.pathname.startsWith('/bg')) {
      lang = 'bg';
    } else if (document.documentElement.lang === 'en') {
      lang = 'en';
    }
  }

  const hasBgPrefix = typeof window !== 'undefined' && window.location.pathname.startsWith('/bg');
  const pathPrefix = lang === 'en' ? '/en' : (hasBgPrefix ? '/bg' : '');
  return `${origin}${pathPrefix}/?article=${encodeURIComponent(articleId)}`;
}

/**
 * Robust clipboard copy helper with fallback for older browsers or strict iframe/security permissions.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // 1. Modern navigator.clipboard API
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to fallback
    }
  }

  // 2. Fallback using temporary textarea
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}
