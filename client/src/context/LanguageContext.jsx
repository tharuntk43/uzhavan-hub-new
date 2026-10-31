import React, { createContext, useContext, useState, useEffect } from 'react';
import enData from '../locales/en.json';
import taData from '../locales/ta.json';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('uzhavan_language') || 'en';
  });

  const translations = language === 'ta' ? taData : enData;

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('uzhavan_language', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Nested key resolver, e.g. t('login.title')
  const t = (keyPath, fallback = '') => {
    if (!keyPath) return fallback;
    const parts = keyPath.split('.');
    let cur = translations;
    for (const p of parts) {
      if (cur && typeof cur === 'object' && p in cur) {
        cur = cur[p];
      } else {
        // Fallback to English if missing in Tamil
        let enCur = enData;
        for (const ep of parts) {
          if (enCur && typeof enCur === 'object' && ep in enCur) {
            enCur = enCur[ep];
          } else {
            return fallback || keyPath;
          }
        }
        return enCur;
      }
    }
    return cur !== undefined ? cur : (fallback || keyPath);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
