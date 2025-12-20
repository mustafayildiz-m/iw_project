'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { BsGlobe, BsCheckLg, BsArrowRight } from 'react-icons/bs';
import { useLanguages } from '@/hooks/useLanguages';
import { useLanguage } from '@/context/useLanguageContext';
import { useBookCounts } from '@/hooks/useBookCounts';
import { useRouter } from 'next/navigation';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { languages, loading, error } = useLanguages();
  const { t, locale } = useLanguage();
  const { getBookCount } = useBookCounts();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const continueButtonRef = useRef(null);

  // Dil seçildiğinde state'e kaydet ve butona scroll et
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    
    // Dil seçildikten sonra "Görüntüle" butonuna scroll yap
    setTimeout(() => {
      if (continueButtonRef.current) {
        continueButtonRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  // Devam et butonuna tıklandığında yeni sayfaya git
  const handleContinue = () => {
    if (!selectedLanguage) return;
    
    const params = new URLSearchParams({
      languageId: selectedLanguage.id.toString(),
      languageName: selectedLanguage.name,
      languageCode: selectedLanguage.code
    });
    
    router.push(`/feed/books/list?${params.toString()}`);
  };

  // Dil adını mevcut i18n sistemi ile çeviren fonksiyon
  const getLocalizedLanguageName = (language) => {
    return t(`books.languages.${language.name}`) || language.name;
  };


  // Dil kodlarına göre bayrak emoji'leri
  const getFlagEmoji = (code) => {
    const flagMap = {
      // Yaygın Diller
      'tr': '🇹🇷', // Türkçe
      'en': '🇬🇧', // İngilizce
      'ar': '🇸🇦', // Arapça
      'fa': '🇮🇷', // Farsça
      'ur': '🇵🇰', // Urduca
      'de': '🇩🇪', // Almanca
      'fr': '🇫🇷', // Fransızca
      'es': '🇪🇸', // İspanyolca
      'it': '🇮🇹', // İtalyanca
      'ru': '🇷🇺', // Rusça
      'zh': '🇨🇳', // Çince
      'ja': '🇯🇵', // Japonca
      'ko': '🇰🇷', // Korece
      'nl': '🇳🇱', // Hollandaca
      'pt': '🇵🇹', // Portekizce
      'sv': '🇸🇪', // İsveççe
      'no': '🇳🇴', // Norveççe
      'da': '🇩🇰', // Danca
      'fi': '🇫🇮', // Fince
      'el': '🇬🇷', // Yunanca
      'he': '🇮🇱', // İbranice
      'hi': '🇮🇳', // Hintçe
      'bn': '🇧🇩', // Bengalce
      'ta': '🇱🇰', // Tamilce
      'th': '🇹🇭', // Tayca
      'vi': '🇻🇳', // Vietnamca
      'id': '🇮🇩', // Endonezyaca
      'ms': '🇲🇾', // Malayca
      'tl': '🇵🇭', // Tagalog
      'sw': '🇹🇿', // Swahili
      
      // Türk Dilleri
      'kk': '🇰🇿', // Kazakça
      'uz': '🇺🇿', // Özbekçe
      'ky': '🇰🇬', // Kırgızca
      'tk': '🇹🇲', // Türkmence
      'az': '🇦🇿', // Azerbaycan Türkçesi
      'tt': '🇷🇺', // Tatarca
      'ba': '🇷🇺', // Başkurtça
      'cv': '🇷🇺', // Çuvaşça
      'sah': '🇷🇺', // Yakutça
      'bua': '🇷🇺', // Buryatça
      'xal': '🇷🇺', // Kalmıkça
      'tyv': '🇷🇺', // Tuva Türkçesi
      'kjh': '🇷🇺', // Hakasça
      'alt': '🇷🇺', // Altayca
      'cjs': '🇷🇺', // Şorca
      'dlg': '🇷🇺', // Dolganca
      'kim': '🇷🇺', // Tofalarca
      'gag': '🇲🇩', // Gagavuzca
      'kdr': '🇺🇦', // Karaimce
      'crh': '🇺🇦', // Kırım Tatar Türkçesi
      'krc': '🇷🇺', // Karaçay-Balkarca
      'kum': '🇷🇺', // Kumukça
      'nog': '🇷🇺', // Nogayca
      'kaa': '🇺🇿', // Karakalpakça
      'chg': '🏳️', // Çağatay Türkçesi (tarihi)
      'ota': '🇹🇷', // Osmanlı Türkçesi
      'otk': '🏳️', // Eski Türkçe (tarihi)
      'ug': '🇨🇳', // Uygur Türkçesi
      'slr': '🇷🇺', // Salarca
      
      // Diğer Diller
      'ps': '🇦🇫', // Peştuca
      'ha': '🇳🇬', // Hausa
      'ig': '🇳🇬', // Igbo
      'yo': '🇳🇬', // Yoruba
      'lg': '🇺🇬', // Luganda
      'rhg': '🇧🇩', // Rohingya
      'ca': '🇪🇸', // Katalanca
    };
    return flagMap[code] || '🌍';
  };

  if (loading) {
    return (
      <Card className="mb-4">
        <CardBody className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Diller yükleniyor...</p>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-4">
        <CardBody>
          <Alert variant="danger">
            <Alert.Heading>Hata!</Alert.Heading>
            <p>{error}</p>
          </Alert>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="mb-4 border-0 shadow-lg language-selector-container">
      <CardHeader className="bg-gradient text-white border-0" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <CardTitle className="mb-0 d-flex align-items-center">
          <BsGlobe className="me-2" size={24} />
          {t('books.languageSelector.title')}
        </CardTitle>
        <p className="mb-0 mt-2 opacity-90">
          {t('books.languageSelector.subtitle')}
        </p>
      </CardHeader>
      <CardBody className="p-4">
        <Row className="g-3">
          {languages.map((language) => (
            <Col key={language.id} xs={6} sm={4} md={3} lg={2}>
              <Button
                variant={selectedLanguage?.id === language.id ? "primary" : "outline-primary"}
                className={`w-100 p-3 h-100 d-flex flex-column align-items-center justify-content-center position-relative ${
                  selectedLanguage?.id === language.id ? 'shadow' : ''
                }`}
                style={{
                  minHeight: '100px',
                  borderRadius: '15px',
                  border: selectedLanguage?.id === language.id ? '3px solid #667eea' : '2px solid #e9ecef',
                  transition: 'all 0.3s ease',
                  background: selectedLanguage?.id === language.id 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'white'
                }}
                onClick={() => handleLanguageSelect(language)}
                onMouseEnter={(e) => {
                  if (selectedLanguage?.id !== language.id) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedLanguage?.id !== language.id) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                <div 
                  className="mb-2" 
                  style={{ 
                    fontSize: '2rem',
                    filter: selectedLanguage?.id === language.id ? 'none' : 'grayscale(0.3)'
                  }}
                >
                  {getFlagEmoji(language.code)}
                </div>
                <div 
                  className="fw-bold text-center"
                  style={{
                    fontSize: '0.85rem',
                    color: selectedLanguage?.id === language.id ? 'white' : '#495057'
                  }}
                >
                  {getLocalizedLanguageName(language)}
                </div>
                {/* Kitap sayısı badge'i */}
                <div 
                  className="mt-1 px-2 py-1 rounded-pill"
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    backgroundColor: selectedLanguage?.id === language.id 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : '#e9ecef',
                    color: selectedLanguage?.id === language.id 
                      ? 'white' 
                      : '#6c757d',
                    border: selectedLanguage?.id === language.id 
                      ? '1px solid rgba(255, 255, 255, 0.3)' 
                      : '1px solid #dee2e6'
                  }}
                >
                  {getBookCount(language.code)} {t('books.page.bookCount')}
                </div>
                {selectedLanguage?.id === language.id && (
                  <div 
                    className="position-absolute top-0 end-0 m-2"
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#28a745',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <BsCheckLg size={12} color="white" />
                  </div>
                )}
              </Button>
            </Col>
          ))}
        </Row>
        
        {selectedLanguage && (
          <div ref={continueButtonRef} className="text-center mt-4 animate-fade-in">
            <Button
              variant="success"
              size="lg"
              className="px-5 py-3 rounded-pill shadow-lg"
              onClick={handleContinue}
              style={{
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              <BsCheckLg className="me-2" />
              {getLocalizedLanguageName(selectedLanguage)} Kitaplarını Görüntüle
              <BsArrowRight className="ms-2" />
            </Button>
            <div className="mt-2 text-muted small">
              {getBookCount(selectedLanguage.code)} kitap bu dilde mevcut
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default LanguageSelector;
