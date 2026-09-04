import { ArticleItem } from '../data/content';
import { getStoredArticles, saveArticlesToStorage } from './articlesStorage';

const API_ENDPOINT = '/api/articles';

export const fetchArticlesFromDb = async (): Promise<ArticleItem[]> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        // Sync with localStorage
        saveArticlesToStorage(data);
        return data;
      }
    }
  } catch (error) {
    console.warn('Neon DB not reachable (offline/local fallback):', error);
  }
  return getStoredArticles();
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
