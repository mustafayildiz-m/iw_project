# WebSocket Chat Sistemi Entegrasyonu

Bu dokümanda, NestJS backend'inizdeki WebSocket tabanlı chat sistemini frontend'e nasıl entegre ettiğimizi açıklıyoruz.

## 🚀 Özellikler

### ✅ Tamamlanan Özellikler
- **Real-time mesajlaşma** (Socket.io ile)
- **JWT authentication** entegrasyonu
- **Online kullanıcı takibi**
- **Mesaj geçmişi** ve conversation yönetimi
- **Yazıyor durumu** göstergesi
- **Mesaj durumu** (gönderildi, iletildi, okundu)
- **Modern ve responsive UI**
- **Emoji picker** entegrasyonu
- **Mesaj arama** özelliği

### 📱 UI/UX Özellikleri
- **3 sütunlu layout**: Conversation listesi, mesaj alanı, online kullanıcılar
- **Responsive tasarım**: Mobil ve desktop uyumlu
- **Mesaj baloncukları**: Gönderen/alıcı farklı taraflarda
- **Otomatik scroll**: Yeni mesajlarda otomatik aşağı kayma
- **Loading states**: Yükleme durumları
- **Error handling**: Hata yönetimi

## 🛠️ Teknik Detaylar

### Kullanılan Teknolojiler
- **Socket.io-client**: WebSocket bağlantısı
- **React Hook Form**: Form yönetimi
- **Yup**: Form validasyonu
- **Bootstrap**: UI framework
- **Emoji Mart**: Emoji picker
- **Context API**: State management

### Dosya Yapısı
```
src/
├── context/
│   └── useWebSocketChatContext.jsx    # WebSocket context
├── components/
│   └── chat/
│       ├── ConversationList.jsx       # Conversation listesi
│       ├── MessageList.jsx            # Mesaj listesi
│       ├── MessageInput.jsx           # Mesaj gönderme formu
│       └── OnlineUsers.jsx            # Online kullanıcılar
├── app/(social)/(with-topbar)/messaging/
│   └── page.jsx                       # Ana chat sayfası
└── assets/scss/components/
    └── _chat.scss                     # Chat stilleri
```

## 🔧 Kurulum ve Kullanım

### 1. Backend Gereksinimleri
Backend'inizde şu endpoint'lerin mevcut olması gerekiyor:

**REST API:**
- `GET /chat/conversations` - Kullanıcının conversation'larını getir
- `GET /chat/conversations/:id/messages` - Conversation mesajlarını getir
- `GET /chat/online-users` - Online kullanıcıları getir
- `GET /chat/search?q=query` - Mesajlarda arama yap

**WebSocket Events:**
- `sendMessage` - Mesaj gönder
- `newMessage` - Yeni mesaj geldiğinde
- `messageSent` - Mesaj gönderildiğinde
- `userOnline/userOffline` - Kullanıcı durumu değişiklikleri
- `typing` - Yazıyor durumu
- `markAsRead` - Mesaj okundu olarak işaretle

### 2. Environment Variables
`.env.local` dosyanızda şu değişkenleri tanımlayın:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. JWT Token
Kullanıcının JWT token'ı `localStorage`'da saklanmalı ve `getToken()` fonksiyonu ile erişilebilir olmalı.

## 📋 API Response Formatları

### Conversation Formatı
```json
{
  "id": "string",
  "participantId": "number",
  "participantName": "string",
  "participantAvatar": "string",
  "lastMessage": "string",
  "lastMessageTime": "Date",
  "unreadCount": "number",
  "isOnline": "boolean"
}
```

### Message Formatı
```json
{
  "id": "string",
  "content": "string",
  "senderId": "number",
  "receiverId": "number",
  "timestamp": "Date",
  "status": "sent|delivered|read",
  "senderName": "string",
  "conversationId": "string"
}
```

## 🎯 Kullanım

### Ana Chat Sayfası
`http://localhost:3001/messaging` adresine giderek chat sistemini kullanabilirsiniz.

### Test Sayfası
`http://localhost:3001/chat-test` adresinde WebSocket bağlantısını ve tüm özellikleri test edebilirsiniz.

## 🔍 Debug ve Test

### Test Sayfası Özellikleri
- **Bağlantı durumu** kontrolü
- **Conversation listesi** görüntüleme
- **Online kullanıcılar** listesi
- **Mesaj gönderme** testi
- **Socket bilgileri** görüntüleme

### Console Logları
WebSocket bağlantısı ve mesaj olayları console'da loglanır:
- `WebSocket connected`
- `New message received: [message]`
- `Message sent: [message]`
- `User online: [userId]`
- `User offline: [userId]`

## 🐛 Sorun Giderme

### Yaygın Sorunlar

1. **WebSocket bağlantı hatası**
   - Backend'in çalıştığından emin olun
   - JWT token'ın geçerli olduğunu kontrol edin
   - CORS ayarlarını kontrol edin

2. **Mesajlar görünmüyor**
   - Conversation seçildiğinden emin olun
   - API endpoint'lerinin doğru çalıştığını kontrol edin

3. **Real-time güncellemeler çalışmıyor**
   - Socket.io bağlantısını kontrol edin
   - Event isimlerinin backend ile eşleştiğini kontrol edin

### Debug Adımları
1. Browser console'u açın
2. Network tab'ında WebSocket bağlantısını kontrol edin
3. Test sayfasını kullanarak bağlantı durumunu kontrol edin
4. Backend loglarını kontrol edin

## 🔄 Geliştirme

### Yeni Özellik Ekleme
1. İlgili komponenti düzenleyin
2. WebSocket context'ine gerekli state ve fonksiyonları ekleyin
3. Backend'de gerekli endpoint'leri oluşturun
4. Test edin

### Stil Değişiklikleri
`src/assets/scss/components/_chat.scss` dosyasını düzenleyerek stilleri değiştirebilirsiniz.

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. Console loglarını kontrol edin
2. Test sayfasını kullanın
3. Backend loglarını kontrol edin
4. Network tab'ında API çağrılarını kontrol edin

---

**Not**: Bu sistem tamamen real-time çalışır ve backend'inizdeki WebSocket server'ına bağlıdır. Backend'in çalışmadığı durumlarda sistem çalışmayacaktır.
