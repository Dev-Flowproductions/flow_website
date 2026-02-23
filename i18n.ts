import { getRequestConfig } from 'next-intl/server';
import { routing } from '@/i18n/routing';

// Import all locale files explicitly for edge runtime compatibility
import pt from '@/messages/pt.json';
import en from '@/messages/en.json';
import fr from '@/messages/fr.json';

const messages = {
  pt,
  en,
  fr,
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages: messages[locale as keyof typeof messages] as any,
  };
});
