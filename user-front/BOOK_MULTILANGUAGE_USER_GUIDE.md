# 📚 Çoklu Dil Kitap Sistemi - Kullanıcı Frontend Kılavuzu

## 🎯 Yeni Sayfa Akışı

### Sayfa Yapısı

```
/feed/books
└── Dil seçim sayfası
    └── Dil seç → "Görüntüle" butonu
        └── /feed/books/list?languageId=X&languageName=Türkçe&languageCode=tr
            └── Pagination ile kitap listesi (12'şer)
                └── /feed/books/[id]
                    └── Kitap detay (tüm dil versiyonları)
```

---

## 📄 Sayfalar

### 1️⃣ `/feed/books` - Dil Seçim Sayfası

**Görünüm:**
- 🌍 Tüm diller grid şeklinde
- 🎯 Her dilin yanında kitap sayısı
- ✅ Seçili dil vurgulanır
- ➡️ "Görüntüle" butonu → Yeni sayfaya yönlendirir

**Component:** `LanguageSelector.jsx`
- Dil seçimi yapılır
- Router ile `/feed/books/list` sayfasına gider
- URL parametreleri: languageId, languageName, languageCode

---

### 2️⃣ `/feed/books/list` - Kitaplar Listesi (YENİ!)

**Özellikler:**
- ✅ **Pagination:** 12 kitap/sayfa
- ✅ **Arama:** Başlık, yazar, açıklama, kategori
- ✅ **İstatistikler:** Toplam kitap, sayfa bilgileri
- ✅ **Filtreleme:** Seçili dile göre
- ✅ **Responsive:** Mobil ve desktop uyumlu
- ✅ **Animasyonlar:** Hover efektleri, fade-in

**Layout:**
```
┌─────────────────────────────────────┐
│ 🔙 Dillere Dön | Türkçe Kitapları   │ 
│           🔍 Arama kutusu           │
├─────────────────────────────────────┤
│ 📊 Stats: 30 kitap | 3 sayfa       │
├─────────────────────────────────────┤
│ [Kitap 1] [Kitap 2] [Kitap 3] [...] │
│ [Kitap 5] [Kitap 6] [Kitap 7] [...] │
│ [Kitap 9] [Kitap10] [Kitap11] [...] │
├─────────────────────────────────────┤
│     « 1 2 [3] 4 5 »                │
│  Gösterilen: 25-36 / Toplam: 30    │
└─────────────────────────────────────┘
```

**Kitap Kartı:**
- Kapak resmi (hover'da overlay)
- Başlık (seçili dilde)
- Yazar
- Kategoriler (ilk 2 + sayı)
- Dil sayısı bilgisi

---

### 3️⃣ `/feed/books/[id]` - Kitap Detay

**Güncellenen Özellikler:**
- ✅ Tüm dil versiyonları gösteriliyor
- ✅ Her dil için ayrı kart:
  - Dil adı (Badge)
  - O dildeki başlık
  - O dildeki açıklama
  - O dildeki özet
  - PDF indirme butonu
- ✅ Sol tarafta kapak resmi
- ✅ Sağ tarafta detaylı bilgiler

---

## 🔄 Veri Akışı

### Backend → Frontend Transformation

**Backend Response:**
```json
{
  "id": 17,
  "author": "İmam Gazali",
  "publishDate": "1111-01-01",
  "coverImage": "cover.jpg",
  "translations": [
    {
      "languageId": 3,
      "title": "Kimya-yı Saadet",
      "description": "Türkçe açıklama...",
      "summary": "Türkçe özet...",
      "language": { "id": 3, "name": "Türkçe", "code": "tr" }
    },
    {
      "languageId": 1,
      "title": "The Alchemy of Happiness",
      "description": "English description...",
      "summary": "English summary...",
      "language": { "id": 1, "name": "İngilizce", "code": "en" }
    },
    {
      "languageId": 2,
      "title": "كيمياء السعادة",
      "description": "الوصف العربي...",
      "summary": "الملخص العربي...",
      "language": { "id": 2, "name": "Arapça", "code": "ar" }
    }
  ],
  "categories": ["Tasavvuf", "Ahlak"]
}
```

**Frontend Transform (useBooks hook):**
```javascript
// Kullanıcı Türkçe seçtiyse (languageId: 3)
const book = {
  id: 17,
  author: "İmam Gazali",
  title: "Kimya-yı Saadet",        // ← Türkçe translation'dan
  description: "Türkçe açıklama...", // ← Türkçe translation'dan
  summary: "Türkçe özet...",         // ← Türkçe translation'dan
  translations: [...],               // ← Tüm diller korunur
  categories: ["Tasavvuf", "Ahlak"]
}
```

---

## 🎨 Yeni Özellikler

### 1. Akıllı Pagination
```javascript
// Sayfa 1'deyse: « [1] 2 3 4 5 »
// Sayfa 5'teyse: « 1 ... 3 4 [5] 6 7 ... 10 »
// Sayfa 10'daysa: « 1 ... 6 7 8 9 [10] »
```

### 2. Canlı Arama
- Kullanıcı yazdıkça filtreler
- Başlık, yazar, kategori, açıklamada arar
- Sonuçlar anında güncellenir
- Sayfa 1'e döner

### 3. İstatistik Paneli
- Toplam kitap sayısı
- Mevcut sayfa numarası
- Toplam sayfa sayısı
- Bu sayfadaki kitap sayısı

### 4. Responsive Tasarım
```
Mobile (xs):    1 sütun
Tablet (sm):    2 sütun
Desktop (md):   3 sütun
Large (lg):     4 sütun
```

### 5. Hover Efektleri
- Kitap kartı yukarı kalkar
- Gölge büyür
- Overlay gösterilir
- "Detayları Gör" butonu

---

## 🚀 Kullanım Senaryoları

### Senaryo 1: Normal Kullanım
1. Kullanıcı `/feed/books` sayfasına gider
2. **Türkçe** dilini seçer
3. "Türkçe Kitaplarını Görüntüle" butonuna tıklar
4. `/feed/books/list?languageId=3&languageName=Türkçe&languageCode=tr` sayfasına yönlendirilir
5. 30 kitaptan ilk 12'si gösterilir (sayfa 1)
6. Sayfa 2'ye tıklar → kitap 13-24 gösterilir
7. Bir kitaba tıklar → Detay sayfasına gider
8. Tüm dil versiyonlarını görür

### Senaryo 2: Arama
1. Kitaplar listesinde
2. Arama kutusuna "Gazali" yazar
3. Sadece "Gazali" içeren kitaplar gösterilir
4. Pagination güncellenir

### Senaryo 3: Dil Değiştirme
1. Kitaplar listesinde "Dillere Dön" butonuna tıklar
2. Ana sayfaya geri döner
3. Farklı bir dil seçer (İngilizce)
4. Aynı kitaplar ama İngilizce başlıklarla gösterilir

---

## 📁 Dosya Değişiklikleri

### Yeni Dosyalar
1. ✅ `src/app/(social)/feed/(container)/books/list/page.jsx` (YENİ!)
   - Pagination ile kitap listesi
   - Arama fonksiyonu
   - İstatistik paneli

### Güncellenen Dosyalar
1. ✅ `src/app/(social)/feed/(container)/books/page.jsx`
   - Sadece LanguageSelector gösteriyor
   - Navigation artık yeni sayfaya

2. ✅ `src/app/(social)/feed/(container)/books/components/LanguageSelector.jsx`
   - useRouter eklendi
   - handleContinue router.push yapıyor
   - URL parametreleri geçiyor

3. ✅ `src/hooks/useBooks.js`
   - Translation transform eklendi
   - Seçili dile göre otomatik title/description

4. ✅ `src/app/(social)/feed/(container)/books/[id]/page.jsx`
   - languages → translations
   - Her dil için detaylı kart
   - Daha zengin görünüm

---

## 🎯 URL Parametreleri

### List Page Query Params:
```
?languageId=3           // Dil ID'si (backend filtreleme için)
&languageName=Türkçe    // Dil adı (UI'da gösterim için)
&languageCode=tr        // Dil kodu (opsiyonel, fallback için)
```

---

## 🧪 Test Adımları

### 1. Dil Seçim Sayfası
```
1. http://localhost:3001/feed/books
2. Türkçe seç → Yeşil check işareti görünür
3. "Türkçe Kitaplarını Görüntüle" butonu görünür
4. Butona tıkla
```

### 2. Kitaplar Listesi
```
1. URL değişti: /feed/books/list?languageId=3...
2. Header'da "Türkçe Kitapları" görünür
3. İstatistikler doğru: 30 kitap, 3 sayfa
4. İlk 12 kitap gösterilir
5. Türkçe başlıklar görünür
```

### 3. Pagination
```
1. Sayfa 2'ye tıkla
2. Kitap 13-24 gösterilir
3. URL değişmez (client-side)
4. Sayfa yukarı scroll olur
```

### 4. Arama
```
1. "Gazali" ara
2. 3 kitap bulunur
3. Pagination güncellenir (1 sayfa)
4. "Gösterilen: 1-3 / Toplam: 3"
```

### 5. Detay Sayfası
```
1. Bir kitaba tıkla
2. Tüm dil versiyonları görünür:
   - Türkçe: "Kimya-yı Saadet"
   - İngilizce: "The Alchemy of Happiness"
   - Arapça: "كيمياء السعادة"
3. Her dilde farklı açıklama
```

---

## 🎨 Özellikler

### Pagination
- ✅ 12 kitap/sayfa
- ✅ First, Prev, Next, Last butonları
- ✅ Akıllı sayfa gösterimi (ellipsis)
- ✅ Scroll to top on change

### Arama
- ✅ Başlık arama
- ✅ Yazar arama
- ✅ Kategori arama
- ✅ Açıklama arama
- ✅ Anlık filtreleme

### Görsel
- ✅ Hover efektleri
- ✅ Fade-in animasyonları
- ✅ Gradient başlıklar
- ✅ Badge'ler
- ✅ Responsive grid

---

## 🔑 Önemli Notlar

1. **URL Parametreleri:** Browser'da geri/ileri butonları düzgün çalışır
2. **Pagination:** Client-side (tüm kitaplar yüklenir, frontend'de sayfalanır)
3. **Seçili Dil:** URL'den alınır, state yok
4. **Fallback:** Dil bulunamazsa ilk translation kullanılır

---

## 🎊 Sonuç

Artık kullanıcılar:
- ✅ Dil seçebilir
- ✅ O dildeki kitapları görebilir
- ✅ Pagination ile gezinebilir (12'şer)
- ✅ Arama yapabilir
- ✅ Detayda tüm dilleri görebilir

**İyi okumalar! 📖**

