import { ArticleItem } from '../data/content';
import { getStoredArticles, saveArticlesToStorage } from './articlesStorage';

const API_ENDPOINT = '/api/articles';

export const fetchArticlesFromDb = async (options?: { forceFresh?: boolean }): Promise<ArticleItem[] | null> => {
  try {
    const url = options?.forceFresh ? `${API_ENDPOINT}?t=${Date.now()}` : API_ENDPOINT;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        // Merge with locally stored fullContent if present to preserve cached full text
        const currentStored = getStoredArticles();
        const merged = data.map((art: ArticleItem) => {
          const match = currentStored.find((s) => s.id === art.id);
          if (match && match.fullContent && (!art.fullContent || art.fullContent.length === 0)) {
            return {
              ...art,
              fullContent: match.fullContent,
              keyTakeaways: match.keyTakeaways || art.keyTakeaways,
              quote: match.quote || art.quote,
              fullContentEn: match.fullContentEn || art.fullContentEn,
              keyTakeawaysEn: match.keyTakeawaysEn || art.keyTakeawaysEn,
              quoteEn: match.quoteEn || art.quoteEn,
            };
          }
          return art;
        });

        // Sync with localStorage
        saveArticlesToStorage(merged);
        return merged;
      }
    } else {
      console.warn(`Articles API returned status ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.warn('Neon DB not reachable (offline/local fallback):', error);
  }
  return null;
};

export const fetchArticleById = async (id: string): Promise<ArticleItem | null> => {
  try {
    const response = await fetch(`${API_ENDPOINT}?id=${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.id) {
        // Update local storage cache with the full content
        const stored = getStoredArticles();
        const exists = stored.some((item) => item.id === data.id);
        const updated = exists 
          ? stored.map((item) => (item.id === data.id ? { ...item, ...data } : item))
          : [data, ...stored];
        saveArticlesToStorage(updated);
        return data as ArticleItem;
      }
    }
  } catch (error) {
    console.warn(`Failed to fetch article ${id} from DB:`, error);
  }

  // Fallback to locally stored article
  const localArticle = getStoredArticles().find((a) => a.id === id);
  return localArticle || null;
};

export const createArticleInDb = async (
  article: ArticleItem, 
  adminPassword?: string
): Promise<{ success: boolean; article?: ArticleItem; error?: string }> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': adminPassword || 'yana2026',
      },
      body: JSON.stringify({ ...article, password: adminPassword || 'yana2026' }),
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, article: result.article || article };
    } else {
      const err = await response.json().catch(() => ({}));
      return { success: false, error: err.error || 'Грешка при запис в базата.' };
    }
  } catch (error) {
    console.warn('Database offline, saving locally:', error);
    return { success: true, article };
  }
};

export const updateArticleInDb = async (
  article: ArticleItem, 
  adminPassword?: string
): Promise<{ success: boolean; article?: ArticleItem; error?: string }> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': adminPassword || 'yana2026',
      },
      body: JSON.stringify({ ...article, password: adminPassword || 'yana2026' }),
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, article: result.article || article };
    } else {
      const err = await response.json().catch(() => ({}));
      return { success: false, error: err.error || 'Грешка при обновяване в базата.' };
    }
  } catch (error) {
    console.warn('Database offline, updating locally:', error);
    return { success: true, article };
  }
};

export const deleteArticleInDb = async (
  id: string, 
  adminPassword?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${API_ENDPOINT}?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': adminPassword || 'yana2026',
      },
      body: JSON.stringify({ id, password: adminPassword || 'yana2026' }),
    });

    if (response.ok) {
      return { success: true };
    } else {
      const err = await response.json().catch(() => ({}));
      return { success: false, error: err.error || 'Грешка при изтриване от базата.' };
    }
  } catch (error) {
    console.warn('Database offline, deleting locally:', error);
    return { success: true };
  }
};
