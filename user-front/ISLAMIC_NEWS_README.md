# İslami Haberler Sistemi

Bu proje, İslami haberleri görüntülemek ve aramak için geliştirilmiş bir web uygulamasıdır.

## 🚀 Özellikler

### Ana Haber Listesi
- Sayfalama ile haber listesi
- Her haber için görsel, başlık, açıklama ve meta bilgiler
- Kategori bazlı renk kodlaması
- Kaynak ve ülke bilgileri

### Arama Sistemi
- Haberlerde metin arama
- Anlık sonuçlar
- Arama temizleme özelliği

### Haber Detay Sayfası
- Tam haber içeriği
- Görsel galeri
- Meta bilgiler (kaynak, tarih, kategori, anahtar kelimeler)
- Orijinal kaynak linki

### Responsive Tasarım
- Mobil uyumlu arayüz
- Bootstrap tabanlı modern tasarım
- Türkçe dil desteği

## 🔧 Teknik Detaylar

### API Endpoints
```bash
# Ana haber listesi
GET http://localhost:3000/islamic-news?limit=20&offset=0

# Haber detayı
GET http://localhost:3000/islamic-news/{id}

# Haber arama
GET http://localhost:3000/islamic-news/search/{query}?limit=20
```

### Kullanılan Teknolojiler
- **Frontend**: Next.js 14, React 18
- **UI Framework**: React Bootstrap
- **State Management**: React Hooks
- **Styling**: SCSS, Bootstrap CSS
- **Icons**: React Icons (Bootstrap Icons)

### Dosya Yapısı
```
src/
├── app/(social)/(with-topbar)/blogs/
│   ├── components/
│   │   ├── IslamicNews.jsx          # Ana haber listesi
│   │   ├── NewsDetail.jsx           # Haber detay komponenti
│   │   ├── SidePenal.jsx            # Yan panel
│   │   └── Footer.jsx               # Alt bilgi
│   ├── news/[newsId]/
│   │   └── page.jsx                 # Haber detay sayfası
│   └── page.jsx                     # Ana blogs sayfası
├── hooks/
│   └── useIslamicNews.js            # Haber verisi yönetimi
└── assets/
    └── scss/                        # Stil dosyaları
```

## 📱 Kullanım

### Ana Sayfa
1. `/blogs` sayfasına gidin
2. Haberler otomatik olarak yüklenir
3. Arama kutusunu kullanarak haber arayın
4. "Daha Fazla Haber Yükle" butonu ile sayfalama yapın

### Haber Detayı
1. Herhangi bir haber kartına tıklayın
2. `/blogs/news/{id}` sayfasına yönlendirilirsiniz
3. Tam haber içeriğini görüntüleyin
4. Orijinal kaynağa gidin

### Arama
1. Üst kısımdaki arama kutusuna anahtar kelime yazın
2. Enter tuşuna basın veya arama butonuna tıklayın
3. Sonuçları görüntüleyin
4. "Aramayı Temizle" ile ana listeye dönün

## 🎨 Özelleştirme

### Renk Temaları
Kategoriler için otomatik renk ataması:
- **politics**: Mavi (primary)
- **lifestyle**: Yeşil (success)
- **top**: Sarı (warning)
- **Diğer**: Gri (info)

### Dil Desteği
- Türkçe: "Türkçe" olarak görüntülenir
- Diğer diller: Orijinal dil adı

### Ülke Bilgileri
- Turkey: "Türkiye" olarak görüntülenir
- Diğer ülkeler: Orijinal ülke adı

## 🚨 Hata Yönetimi

### API Bağlantı Hataları
- Otomatik fallback mesajları
- Kullanıcı dostu hata mesajları
- Yeniden deneme butonları

### Veri Eksikliği
- Varsayılan görsel (logo)
- Boş durum mesajları
- Graceful degradation

## 🔄 Güncellemeler

### v1.0.0
- Temel haber listesi
- Arama fonksiyonu
- Haber detay sayfası
- Responsive tasarım
- Türkçe dil desteği

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. Console loglarını kontrol edin
2. API endpoint'lerinin çalıştığından emin olun
3. Network sekmesinde hataları inceleyin

## 🚀 Gelecek Özellikler

- [ ] Haber kategorileri filtreleme
- [ ] Tarih bazlı filtreleme
- [ ] Haber paylaşım özelliği
- [ ] Favori haberler
- [ ] Haber bildirimleri
- [ ] Offline okuma desteği
