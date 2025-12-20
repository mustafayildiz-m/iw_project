# 🌐 Çoklu Dil Sistemi Kullanım Rehberi

## ✨ Özellikler

- ✅ **URL değişmiyor** - Tüm route'lar aynı kalıyor
- ✅ **3 Dil Desteği**: Türkçe (TR), İngilizce (EN), Arapça (AR)
- ✅ **LocalStorage** - Kullanıcı tercihi saklanıyor
- ✅ **RTL Desteği** - Arapça için otomatik sağdan sola düzen
- ✅ **Context API** - Tüm uygulamada global erişim
- ✅ **Dinamik Yükleme** - Sadece seçili dil yükleniyor

## 📁 Dosya Yapısı

```
src/
  i18n/
    messages/
      tr.json      # Türkçe çeviriler
      en.json      # İngilizce çeviriler
      ar.json      # Arapça çeviriler
  context/
    useLanguageContext.jsx   # Dil yönetimi
  components/
    LanguageSwitcher.jsx     # Dil değiştirici component
```

## 🚀 Nasıl Kullanılır?

### 1. Component'te Çeviri Kullanma

```jsx
'use client';

import { useLanguage } from '@/context/useLanguageContext';

function MyComponent() {
  const { t, locale, changeLocale } = useLanguage();
  
  return (
    <div>
      <h1>{t('auth.signIn')}</h1>
      <p>{t('common.welcome')}</p>
      <button onClick={() => changeLocale('en')}>
        English
      </button>
    </div>
  );
}
```

### 2. Parametreli Çeviri

```jsx
// messages/tr.json
{
  "welcome": "Merhaba {name}, {count} mesajınız var"
}

// Component içinde
t('welcome', { name: 'Mustafa', count: 5 })
// Çıktı: "Merhaba Mustafa, 5 mesajınız var"
```

### 3. Dil Değiştirici Ekleme

**Auth Sayfalarında (Simple variant):**
```jsx
import LanguageSwitcher from '@/components/LanguageSwitcher';

<LanguageSwitcher variant="simple" />
```

**Ana Uygulamada (Dropdown variant):**
```jsx
import LanguageSwitcher from '@/components/LanguageSwitcher';

<LanguageSwitcher />
```

## 📝 Yeni Çeviri Ekleme

### JSON dosyasını düzenle:

**src/i18n/messages/tr.json:**
```json
{
  "myFeature": {
    "title": "Başlık",
    "description": "Açıklama",
    "button": "Tıkla"
  }
}
```

### Component'te kullan:
```jsx
const { t } = useLanguage();

<h1>{t('myFeature.title')}</h1>
<p>{t('myFeature.description')}</p>
<button>{t('myFeature.button')}</button>
```

## 🎯 Desteklenen Diller

| Dil | Kod | Flag | RTL |
|-----|-----|------|-----|
| Türkçe | `tr` | 🇹🇷 | Hayır |
| English | `en` | 🇬🇧 | Hayır |
| العربية | `ar` | 🇸🇦 | Evet |

## 🔧 API Özellikleri

### `useLanguage()` Hook'u

```jsx
const {
  locale,           // Mevcut dil kodu: 'tr', 'en', 'ar'
  changeLocale,     // Dil değiştirme fonksiyonu
  t,                // Çeviri fonksiyonu
  loading,          // Çeviriler yüklenirken true
  supportedLocales, // ['tr', 'en', 'ar']
  isRTL             // Arapça için true
} = useLanguage();
```

## 🎨 RTL (Right-to-Left) Desteği

Arapça seçildiğinde otomatik olarak:
- ✅ `document.dir = 'rtl'`
- ✅ `document.lang = 'ar'`
- ✅ Layout otomatik sağdan sola döner

## 📱 Kullanıcı Deneyimi

1. İlk ziyaret → Tarayıcı dili algılanır
2. Dil değiştirilirse → LocalStorage'da saklanır
3. Sayfa yenilenirse → Tercih korunur
4. Çeviri bulunamazsa → Key gösterilir (fallback)

## 🔍 Debugging

**Console'da dil kontrol:**
```javascript
localStorage.getItem('locale') // Mevcut dil
```

**Dil değiştirme:**
```javascript
localStorage.setItem('locale', 'en')
window.location.reload()
```

## ✅ Entegre Edilmiş Sayfalar

- ✅ Login (/auth-advance/sign-in)
- 🔜 Sign Up (eklenebilir)
- 🔜 Forgot Password (eklenebilir)
- 🔜 Feed pages (eklenebilir)
- 🔜 Profile pages (eklenebilir)

## 🚀 Sonraki Adımlar

1. Diğer auth sayfalarını çeviriye ekle
2. Ana uygulama sayfalarını ekle
3. Backend'den gelen mesajları çevir
4. Tarih/saat formatlarını locale'e göre ayarla
5. Sayı formatlarını locale'e göre ayarla

## 📖 Örnek Kullanım Senaryoları

### Senaryo 1: Yeni Sayfa Eklemek

```jsx
// 1. JSON'lara çeviri ekle
// tr.json
{
  "profile": {
    "editProfile": "Profili Düzenle"
  }
}

// 2. Component'te kullan
import { useLanguage } from '@/context/useLanguageContext';

function ProfilePage() {
  const { t } = useLanguage();
  return <h1>{t('profile.editProfile')}</h1>;
}
```

### Senaryo 2: Dinamik İçerik

```jsx
const { t } = useLanguage();
const userName = "Mustafa";

<p>{t('greeting', { name: userName })}</p>
```

### Senaryo 3: Conditional Rendering

```jsx
const { locale } = useLanguage();

{locale === 'ar' && <div>Arapça özel içerik</div>}
```

## 🛠️ Troubleshooting

**Problem: Çeviriler yüklenmedi**
```bash
# Hard refresh yapın
Cmd + Shift + R (Mac)
Ctrl + Shift + R (Windows)
```

**Problem: RTL düzgün çalışmıyor**
```jsx
// Layout'unuzda kontrol edin
const { isRTL } = useLanguage();
<div dir={isRTL ? 'rtl' : 'ltr'}>...</div>
```

---

**Geliştirildi:** Islamic Windows Team  
**Versiyon:** 1.0.0  
**Tarih:** 30 Eylül 2025
