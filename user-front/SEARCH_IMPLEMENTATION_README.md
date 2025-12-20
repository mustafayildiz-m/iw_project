# 🔍 Arama Fonksiyonalitesi Implementasyonu

Bu dokümantasyon, Islamic Windows uygulamasına eklenen arama fonksiyonalitesini açıklar.

## 🚀 Özellikler

### ✅ Tamamlanan Özellikler
- **Gerçek Zamanlı Arama**: Kullanıcı yazarken otomatik arama
- **Çoklu Arama Türü**: Kullanıcılar, alimler ve takipçiler arasında arama
- **Debounced Input**: 300ms gecikme ile API çağrılarını optimize etme
- **Responsive Tasarım**: Mobil ve desktop uyumlu
- **Tab Sistemi**: Arama sonuçlarını kategorilere göre filtreleme
- **Click Outside**: Arama sonuçlarını dışarı tıklayarak kapatma
- **Loading States**: Arama sırasında loading göstergeleri
- **Error Handling**: Hata durumlarında kullanıcı dostu mesajlar

## 🏗️ Mimari

### Context Yapısı
```
src/context/useSearchContext.jsx
├── SearchProvider
├── useSearchContext
├── State Management
├── API Functions
└── Search Logic
```

### Component Yapısı
```
src/components/
├── SearchResults.jsx          # Arama sonuçları component'i
└── layout/TopHeader/
    └── CollapseMenu.jsx       # Arama input'u ve sonuçları
```

### Styling
```
src/assets/scss/components/
└── _search.scss               # Arama component'leri için özel stiller
```

## 🔧 Kurulum ve Kullanım

### 1. Context Provider Ekleme
```jsx
// src/app/(social)/layout.jsx
import { SearchProvider } from '@/context/useSearchContext';

const SocialLayout = ({ children }) => {
  return (
    <AuthProtectionWrapper>
      <SearchProvider>
        <TopHeader />
        {children}
      </SearchProvider>
    </AuthProtectionWrapper>
  );
};
```

### 2. Arama Component'ini Kullanma
```jsx
import { useSearchContext } from '@/context/useSearchContext';

const MyComponent = () => {
  const { performSearch, searchResults, isSearching } = useSearchContext();
  
  // Arama yapma
  const handleSearch = (query) => {
    performSearch(query, 'all'); // 'all', 'users', 'scholars', 'followers'
  };
  
  return (
    // Component JSX
  );
};
```

### 3. Arama Sonuçlarını Görüntüleme
```jsx
import SearchResults from '@/components/SearchResults';

// Arama input'undan sonra otomatik olarak görüntülenir
<SearchResults />
```

## 🌐 API Entegrasyonu

### Backend Endpoints
- `GET /search/users?q={query}&limit={limit}` - Kullanıcı arama
- `GET /search/scholars?q={query}&limit={limit}` - Alim arama  
- `GET /search/followers?q={query}&limit={limit}` - Takipçi arama

### Authentication
- JWT token NextAuth session'dan alınır
- Her API çağrısında Authorization header'ı eklenir

### Error Handling
- Network hataları yakalanır ve kullanıcıya gösterilir
- Boş sonuçlar için uygun mesajlar gösterilir

## 🎨 UI/UX Özellikleri

### Arama Input
- Placeholder: "Ara..."
- Search icon ile birlikte
- Focus durumunda mavi border
- Debounced input (300ms)

### Arama Sonuçları
- Dropdown şeklinde görüntüleme
- Tab sistemi ile kategorilere ayırma
- Her sonuç için profil resmi, isim, username ve bio
- "Profili Gör" butonu ile profil sayfasına yönlendirme
- Hover efektleri
- Responsive tasarım

### Loading States
- Arama sırasında spinner
- "Aranıyor..." mesajı
- Disabled input durumu

## 📱 Responsive Tasarım

### Desktop (≥992px)
- Normal dropdown pozisyonu
- 400px minimum genişlik
- Sidebar'da arama input'u

### Mobile (<768px)
- Full-width arama sonuçları
- Fixed positioning
- Touch-friendly butonlar

## 🎯 Test Etme

### 1. Arama Test Sayfası
```
http://localhost:3001/search-test
```
Bu sayfa ile tüm arama fonksiyonalitesini test edebilirsiniz.

### 2. Ana Sayfa Arama
```
http://localhost:3001/feed/home
```
Üst menüdeki arama input'unu kullanarak arama yapabilirsiniz.

### 3. Test Senaryoları
- Boş arama sorgusu
- Kısmi eşleşme araması
- Büyük/küçük harf duyarlılığı
- Farklı arama türleri
- Responsive davranış
- Error handling

## 🔍 Arama Algoritması

### Debouncing
- Kullanıcı yazmayı bıraktıktan 300ms sonra arama yapılır
- Gereksiz API çağrılarını önler
- Performansı artırır

### Arama Mantığı
1. Input değişikliği algılanır
2. 300ms timer başlatılır
3. Timer dolduğunda API çağrısı yapılır
4. Sonuçlar state'e kaydedilir
5. UI güncellenir

### Filtreleme
- Tüm kategorilerde arama
- Kategori bazında filtreleme
- Sonuç sayısı gösterimi

## 🚨 Bilinen Sorunlar ve Çözümler

### 1. JWT Token Eksikliği
**Sorun**: Session'da accessToken bulunamıyor
**Çözüm**: NextAuth konfigürasyonunu kontrol edin

### 2. CORS Hatası
**Sorun**: Backend'den CORS hatası
**Çözüm**: Backend'de CORS ayarlarını yapılandırın

### 3. API Endpoint Hatası
**Sorun**: 404 veya 500 hataları
**Çözüm**: Backend API endpoint'lerini kontrol edin

## 🔮 Gelecek Geliştirmeler

### Planlanan Özellikler
- [ ] Arama geçmişi
- [ ] Popüler aramalar
- [ ] Gelişmiş filtreler
- [ ] Arama önerileri
- [ ] Voice search
- [ ] Arama analytics

### Performans İyileştirmeleri
- [ ] Result caching
- [ ] Lazy loading
- [ ] Virtual scrolling
- [ ] Search index optimization

## 📚 Kaynaklar

### Dokümantasyon
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [React Bootstrap Documentation](https://react-bootstrap.github.io/)
- [SCSS Documentation](https://sass-lang.com/)

### Backend API
- [Arama API Test Dokümantasyonu](./API_TEST_DOCUMENTATION.md)

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. GitHub Issues'da sorun bildirin
2. Detaylı hata mesajı ekleyin
3. Beklenen davranışı açıklayın
4. Ekran görüntüleri ekleyin

---

**Not**: Bu implementasyon, Islamic Windows uygulamasının mevcut mimarisi üzerine inşa edilmiştir ve NextAuth.js, React Bootstrap ve SCSS teknolojilerini kullanır.
