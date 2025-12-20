'use client';

import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useLanguage } from '@/context/useLanguageContext';
import './LanguageSwitcher.css';

const LanguageSwitcher = ({ variant = 'dropdown' }) => {
  const { locale, changeLocale } = useLanguage();
  
  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ];
  
  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];
  
  // Simple button variant (for auth pages)
  if (variant === 'simple') {
    return (
      <div className="d-flex gap-2 justify-content-center align-items-center">
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => changeLocale(lang.code)}
            className={`btn btn-sm ${locale === lang.code ? 'btn-primary' : 'btn-outline-light'}`}
            style={{
              borderRadius: '8px',
              padding: '0.375rem 0.75rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              border: locale === lang.code ? 'none' : '2px solid rgba(255, 255, 255, 0.3)',
              background: locale === lang.code 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                : 'transparent',
              color: locale === lang.code ? '#fff' : 'rgba(255, 255, 255, 0.9)',
              transition: 'all 0.3s ease'
            }}
          >
            {lang.flag} {lang.code.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }
  
  // Dropdown variant (for main app)
  return (
    <Dropdown align="end">
      <Dropdown.Toggle 
        variant="light" 
        size="sm"
        className="d-flex align-items-center gap-2 no-caret language-switcher-toggle"
        style={{
          color: 'var(--bs-body-color)'
        }}
        onMouseEnter={(e) => {
          e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
          e.target.style.borderColor = '#667eea';
        }}
        onMouseLeave={(e) => {
          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
          e.target.style.borderColor = 'var(--bs-border-color)';
        }}
      >
        <span style={{ fontSize: '1.15rem', color: 'inherit' }}>{currentLanguage.flag}</span>
        <span style={{ fontSize: '0.85rem', color: 'inherit' }}>{currentLanguage.code.toUpperCase()}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu className="language-switcher-menu">
        {languages.map(lang => (
          <Dropdown.Item 
            key={lang.code}
            active={locale === lang.code}
            onClick={() => changeLocale(lang.code)}
            className="d-flex align-items-center gap-2 language-switcher-item"
          >
            <span style={{ fontSize: '1.2rem' }}>{lang.flag}</span>
            <span>{lang.name}</span>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageSwitcher;
