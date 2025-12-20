# Authentication System Documentation

## Overview
Bu dokümantasyon, uygulamada implement edilen yeni authentication sistemini açıklar. Sistem, NextAuth.js ile JWT token yönetimini birleştirir ve localStorage'da token saklar.

## Features

### 1. Token Management
- **Login**: Eski token varsa silinir, yeni token localStorage'a yazılır
- **Logout**: Token localStorage'dan temizlenir ve NextAuth session sonlandırılır
- **Token Validation**: Token'ın geçerliliği kontrol edilir
- **Automatic Storage**: Login sonrası token otomatik olarak localStorage'a yazılır

### 2. Centralized Authentication
- **useAuth Hook**: Tüm auth işlemleri için merkezi hook
- **AuthContext**: Uygulama genelinde auth state paylaşımı
- **Auth Utilities**: Token işlemleri için yardımcı fonksiyonlar

### 3. Security Features
- **Middleware Protection**: Protected sayfalar için otomatik auth kontrolü
- **Session Management**: NextAuth ile güvenli session yönetimi
- **Token Refresh**: Otomatik token yenileme

## File Structure

```
src/
├── utils/
│   └── auth.js                 # Auth utility functions
├── hooks/
│   └── useAuth.js              # Centralized auth hook
├── context/
│   └── useAuthContext.jsx      # Auth context provider
├── components/wrappers/
│   └── AppProvidersWrapper.jsx # App-level providers
├── app/
│   ├── api/auth/[...nextauth]/
│   │   ├── route.js            # NextAuth API route
│   │   └── options.js          # NextAuth configuration
│   ├── (authentication)/auth-advance/sign-in/
│   │   └── components/
│   │       └── useSignIn.js    # Sign-in logic
│   ├── debug-token/
│   │   └── page.jsx            # Token debugging page
│   └── auth-test/
│       └── page.jsx            # Auth testing page
└── middleware.js                # Route protection middleware
```

## Usage

### 1. Basic Authentication

```jsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { isAuthenticated, userInfo, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return (
    <div>
      <h1>Welcome {userInfo?.username}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 2. Token Operations

```jsx
import { getUserIdFromToken, storeToken, clearToken } from '@/utils/auth';

// Token'dan user ID al
const userId = getUserIdFromToken();

// Token kaydet (eski token'ı sil)
storeToken(newToken, true);

// Token temizle
clearToken();
```

### 3. Protected Routes

Middleware otomatik olarak protected sayfaları korur:

```javascript
// middleware.js
const protectedPages = [
  '/feed',
  '/profile', 
  '/settings',
  '/help'
];
```

## Authentication Flow

### 1. Login Process
1. User credentials ile login form submit edilir
2. `useSignIn` hook `useAuth.login()` çağırır
3. NextAuth credentials provider API'yi çağırır
4. API'den JWT token döner
5. Token NextAuth session'a eklenir
6. Session callback'te token localStorage'a yazılır
7. User authenticated state'e geçer

### 2. Token Storage
- **Login**: `storeToken(token, true)` - Eski token silinir, yeni yazılır
- **Session Update**: NextAuth session değiştiğinde otomatik token güncelleme
- **Validation**: Her token işleminde geçerlilik kontrolü

### 3. Logout Process
1. `useAuth.logout()` çağırılır
2. localStorage'dan token temizlenir
3. Auth state sıfırlanır
4. NextAuth session sonlandırılır
5. User login sayfasına yönlendirilir

## API Integration

### 1. Follow/Unfollow Requests
```javascript
const userId = getUserIdFromToken();
const token = getToken();

const response = await fetch('/api/user-follow/follow', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    follower_id: userId,
    following_id: targetUserId
  })
});
```

### 2. Token Validation
```javascript
if (!hasValidToken()) {
  // Token geçersiz, login sayfasına yönlendir
  window.location.href = '/auth-advance/sign-in';
}
```

## Testing

### 1. Debug Token Page
`/debug-token` sayfasında:
- Token bilgileri görüntülenir
- Token decode edilir
- Follow request test edilir
- Logout işlemi test edilir

### 2. Auth Test Page
`/auth-test` sayfasında:
- Complete auth flow test edilir
- Login/logout işlemleri test edilir
- Auth state monitoring yapılır

## Configuration

### 1. Environment Variables
```bash
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. NextAuth Options
```javascript
// options.js
export const options = {
  providers: [CredentialsProvider],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user?.access_token) {
        token.access_token = user.access_token;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token.access_token) {
        session.access_token = token.access_token;
      }
      return session;
    }
  }
};
```

## Troubleshooting

### 1. Token Not Stored
- Browser console'da hata mesajlarını kontrol edin
- NextAuth session'ın doğru çalıştığından emin olun
- `/debug-token` sayfasında token durumunu kontrol edin

### 2. Follow/Unfollow Issues
- Console'da user ID loglarını kontrol edin
- Token'ın geçerli olduğundan emin olun
- API endpoint'lerin doğru olduğunu kontrol edin

### 3. Auth State Issues
- `useAuth` hook'unun doğru import edildiğinden emin olun
- AuthProvider'ın AppProvidersWrapper'da olduğunu kontrol edin
- Browser localStorage'da token'ın bulunduğunu doğrulayın

## Best Practices

1. **Always use useAuth hook** for authentication operations
2. **Check token validity** before making API calls
3. **Handle auth errors gracefully** with proper user feedback
4. **Use middleware protection** for sensitive routes
5. **Monitor auth state** in development with debug pages

## Security Considerations

1. **JWT tokens** are stored in localStorage (consider httpOnly cookies for production)
2. **Token expiration** is handled by NextAuth
3. **CSRF protection** is provided by NextAuth
4. **Route protection** is enforced by middleware
5. **Session management** is handled securely by NextAuth
