# Timeline Posts Feature

Bu özellik, kullanıcıların takip ettikleri kişilerin ve alimlerin gönderilerini görüntülemelerini sağlar.

## API Endpoint

```
GET /user-posts/timeline/{userId}
Authorization: Bearer {token}
Content-Type: application/json
```

## API Response Structure

API'den gelen yanıt iki tür gönderi içerir:

### User Posts
```json
{
  "type": "user",
  "id": 3,
  "user_id": 1,
  "scholar_id": null,
  "content": "Bir açıklama",
  "title": "Bir başlık",
  "image_url": null,
  "video_url": null,
  "created_at": "2025-07-04T18:30:33.000Z",
  "updated_at": "2025-07-04T18:30:33.000Z",
  "timeAgo": "1 ay önce"
}
```

### Scholar Posts
```json
{
  "type": "scholar",
  "id": "a777d133-18a8-443b-96bf-ea992ed4795a",
  "user_id": null,
  "scholar_id": 1,
  "content": "<p>tek rar post</p>",
  "title": null,
  "image_url": null,
  "video_url": null,
  "created_at": "2025-07-04T18:10:53.948Z",
  "updated_at": "2025-07-04T18:28:28.865Z",
  "timeAgo": "1 ay önce"
}
```

## Components

### Posts Component

Ana timeline gönderileri bileşeni. Hem kullanıcı hem de alim gönderilerini destekler.

```jsx
import Posts from '@/app/(social)/profile/feed/components/Posts';

// Varsayılan kullanıcı ID (18) ile kullanım
<Posts />

// Belirli bir kullanıcı ID ile kullanım
<Posts userId={123} />
```

### useTimelinePosts Hook

Timeline gönderilerini yönetmek için özel hook.

```jsx
import { useTimelinePosts } from '@/hooks/useTimelinePosts';

const { posts, loading, error, refetch } = useTimelinePosts(userId);
```

## Features

- ✅ **Loading States**: Yükleme sırasında spinner gösterimi
- ✅ **Error Handling**: Hata durumlarında kullanıcı dostu mesajlar
- ✅ **Empty States**: Gönderi bulunamadığında bilgilendirici mesajlar
- ✅ **Post Types**: User ve Scholar gönderilerini farklı şekilde render etme
- ✅ **Media Support**: Resim ve video desteği
- ✅ **Responsive Design**: Mobil uyumlu tasarım
- ✅ **Refetch Capability**: Hata durumunda tekrar deneme özelliği

## Usage Examples

### Basic Implementation

```jsx
// src/app/(social)/profile/feed/page.jsx
import Posts from './components/Posts';

export default function FeedPage() {
  return (
    <div className="container">
      <h1>Takip Ettiklerinizin Gönderileri</h1>
      <Posts userId={18} />
    </div>
  );
}
```

### With Dynamic User ID

```jsx
// src/app/(social)/profile/[userId]/feed/page.jsx
import Posts from '@/app/(social)/profile/feed/components/Posts';

export default function UserFeedPage({ params }) {
  return (
    <div className="container">
      <h1>Kullanıcı {params.userId} Feed'i</h1>
      <Posts userId={parseInt(params.userId)} />
    </div>
  );
}
```

### Custom Hook Usage

```jsx
import { useTimelinePosts } from '@/hooks/useTimelinePosts';

function CustomTimelineComponent() {
  const { posts, loading, error, refetch } = useTimelinePosts(18);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.title || 'Başlıksız'}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
```

## Configuration

### Environment Variables

`.env.local` dosyasında API URL'ini tanımlayın:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Authentication

Token'lar localStorage'dan alınır. Kullanıcı giriş yapmış olmalıdır.

## Styling

Bileşen Bootstrap 5 ve özel CSS sınıfları kullanır. Tema değişiklikleri için:

```scss
// src/assets/scss/_custom-react.scss
.timeline-post {
  .card {
    border-radius: 0.75rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  }
}
```

## Future Enhancements

- [ ] **Pagination**: Sayfalama desteği
- [ ] **Infinite Scroll**: Sonsuz kaydırma
- [ ] **Real-time Updates**: Gerçek zamanlı güncellemeler
- [ ] **Post Interactions**: Beğeni, yorum, paylaşım işlevleri
- [ ] **User Details**: Kullanıcı profil bilgileri
- [ ] **Content Filtering**: İçerik filtreleme seçenekleri
- [ ] **Search**: Gönderi arama özelliği

## Troubleshooting

### Common Issues

1. **Token Not Found**: Kullanıcının giriş yapmış olduğundan emin olun
2. **API Connection Error**: API URL'inin doğru olduğunu kontrol edin
3. **CORS Issues**: Backend'de CORS ayarlarını kontrol edin

### Debug Mode

Geliştirme sırasında console.log'ları etkinleştirin:

```jsx
const { posts, loading, error, refetch } = useTimelinePosts(userId);

useEffect(() => {

}, [posts, loading, error]);
```

## Contributing

Bu özelliği geliştirmek için:

1. Yeni özellikler için feature branch oluşturun
2. Test coverage ekleyin
3. Documentation güncelleyin
4. Pull request gönderin

## License

Bu proje MIT lisansı altında lisanslanmıştır.
