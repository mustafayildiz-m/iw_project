'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LanguageContext = createContext(undefined);
const SUPPORTED_LOCALES = ['tr', 'en', 'ar', 'de', 'fr', 'ja'];
const DEFAULT_LOCALE = 'en';

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return safe defaults instead of throwing error
    return {
      locale: DEFAULT_LOCALE,
      changeLocale: () => {},
      t: (key) => key,
      loading: true,
      supportedLocales: SUPPORTED_LOCALES,
      isRTL: false
    };
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);

  // Load translations
  const loadMessages = useCallback(async (newLocale) => {
    try {
      setLoading(true);
      const response = await import(`../i18n/messages/${newLocale}.json`);
      setMessages(response.default || response);
      setLoading(false);
    } catch (error) {
      console.error('Error loading translation file:', error);
      // Fallback to default locale
      if (newLocale !== DEFAULT_LOCALE) {
        const fallback = await import(`../i18n/messages/${DEFAULT_LOCALE}.json`);
        setMessages(fallback.default || fallback);
      }
      setLoading(false);
    }
  }, []);

  // Initialize locale from localStorage or default to English
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale');
      
      let initialLocale = DEFAULT_LOCALE; // Default to English
      
      // Only use saved locale if it exists and is supported
      if (savedLocale && SUPPORTED_LOCALES.includes(savedLocale)) {
        initialLocale = savedLocale;
      }
      
      setLocaleState(initialLocale);
      loadMessages(initialLocale);
    }
  }, [loadMessages]);

  // Change locale
  const changeLocale = useCallback((newLocale) => {
    if (!SUPPORTED_LOCALES.includes(newLocale)) {
      console.warn(`Locale ${newLocale} is not supported`);
      return;
    }

    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }
    loadMessages(newLocale);
    
    // Update document direction for RTL languages
    if (typeof window !== 'undefined') {
      document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLocale;
    }
  }, [loadMessages]);

  // Translation function with nested key support
  const t = useCallback((key, params = {}) => {
    const keys = key.split('.');
    let value = messages;
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    if (typeof value !== 'string') {
      return key;
    }
    
    // Replace parameters like {name}
    let result = value;
    Object.keys(params).forEach(param => {
      result = result.replace(`{${param}}`, params[param]);
    });
    
    return result;
  }, [messages]);

  const value = {
    locale,
    changeLocale,
    t,
    loading,
    supportedLocales: SUPPORTED_LOCALES,
    isRTL: locale === 'ar'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
