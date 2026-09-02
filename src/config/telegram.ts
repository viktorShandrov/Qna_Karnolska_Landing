/**
 * Telegram Bot API Configuration
 * 
 * To update the Chat ID:
 * 1. Replace 'YOUR_TEST_CHAT_ID' below with the psychologist's actual Telegram Chat ID, OR
 * 2. Set VITE_TELEGRAM_CHAT_ID in your environment / .env file.
 */
const getEnvVar = (key: string): string | undefined => {
  try {
    return (import.meta as Record<string, any>)?.env?.[key];
  } catch {
    return undefined;
  }
};

export const TELEGRAM_BOT_TOKEN = getEnvVar('VITE_TELEGRAM_BOT_TOKEN') || '8909434781:AAGk1jPav9l3QFcHGzdINNln-W5P3Enaolc';

export const TELEGRAM_CHAT_ID = getEnvVar('VITE_TELEGRAM_CHAT_ID') || '6259693114';

export const TELEGRAM_CONFIG = {
  BOT_TOKEN: TELEGRAM_BOT_TOKEN,
  CHAT_ID: TELEGRAM_CHAT_ID,
};
