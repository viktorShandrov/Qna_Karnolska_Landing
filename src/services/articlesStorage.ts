import { ARTICLES_DATA, ArticleItem } from '../data/content';

const STORAGE_KEY = 'yk_articles_data_v1';
const ADMIN_PASS_KEY = 'yk_admin_password_v1';
const DEFAULT_PASSWORD = 'yana2026';

export const getStoredArticles = (): ArticleItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Initialize with default articles
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ARTICLES_DATA));
      return ARTICLES_DATA;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return ARTICLES_DATA;
  } catch (error) {
    console.error('Failed to load articles from storage:', error);
    return ARTICLES_DATA;
  }
};

export const saveArticlesToStorage = (articles: ArticleItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch (error) {
    console.error('Failed to save articles to storage:', error);
  }
};

export const resetArticlesToDefault = (): ArticleItem[] => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ARTICLES_DATA));
    return ARTICLES_DATA;
  } catch (error) {
    console.error('Failed to reset articles:', error);
    return ARTICLES_DATA;
  }
};

export const verifyAdminPassword = (password: string): boolean => {
  try {
    const currentPass = localStorage.getItem(ADMIN_PASS_KEY) || DEFAULT_PASSWORD;
    return password.trim() === currentPass.trim();
  } catch {
    return password.trim() === DEFAULT_PASSWORD;
  }
};

export const updateAdminPassword = (oldPass: string, newPass: string): { success: boolean; message: string } => {
  try {
    if (!verifyAdminPassword(oldPass)) {
      return { success: false, message: 'Текущата парола е невалидна.' };
    }
    if (!newPass || newPass.trim().length < 4) {
      return { success: false, message: 'Новата парола трябва да съдържа поне 4 символа.' };
    }
    localStorage.setItem(ADMIN_PASS_KEY, newPass.trim());
    return { success: true, message: 'Паролата е променена успешно!' };
  } catch {
    return { success: false, message: 'Възникна грешка при запис на паролата.' };
  }
};
