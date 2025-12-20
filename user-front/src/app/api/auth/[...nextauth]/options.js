import CredentialsProvider from 'next-auth/providers/credentials';

export const options = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email:',
          type: 'text',
          placeholder: 'Enter your username'
        },
        password: {
          label: 'Password',
          type: 'password'
        }
      },
      async authorize(credentials, req) {
        try {
          // Server-side'da Docker network içinden backend'e erişim için
          // Docker içindeyse 'backend' hostname'ini, değilse NEXT_PUBLIC_API_URL'i kullan
          const apiUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
          const response = await fetch(`${apiUrl}/auth/callback/credentials`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password
            })
          });

          const data = await response.json();

          if (response.ok && data.ok && data.user) {
            // API'den dönen kullanıcı bilgilerini NextAuth formatına çevir
            return {
              id: data.user.id.toString(),
              email: data.user.email,
              username: data.user.username,
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              role: data.user.role,
              photoUrl: data.user.photoUrl,
              access_token: data.access_token
            };
          }

          // Giriş başarısız - Backend'den gelen hata mesajını al
          const errorMessage = data.message || 'auth.invalidCredentials';
          console.error('Authentication failed:', errorMessage);

          // Error message'ı i18n key olarak döndür
          if (errorMessage.includes('devre dışı') || errorMessage.includes('disabled')) {
            throw new Error('auth.accountDisabled');
          } else if (errorMessage.includes('Geçersiz') || errorMessage.includes('Invalid')) {
            throw new Error('auth.invalidCredentials');
          }
          throw new Error(errorMessage);
        } catch (error) {
          console.error('Authentication error:', error);
          // Backend'den gelen hata mesajını kullan veya fallback
          const errorMsg = error.message || 'auth.invalidCredentials';
          throw new Error(errorMsg);
        }
      }
    })
  ],
  // NEXTAUTH_URL ekle - production için
  url: process.env.NEXTAUTH_URL || 'http://localhost:3001',
  secret: 'kvwLrfri/MBznUCofIoRH9+NvGu6GqvVdqO3mor1GuA=',
  pages: {
    signIn: '/auth-advance/sign-in'
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async jwt({ token, user, account }) {
      // JWT token'a kullanıcı bilgilerini ekle
      if (user) {
        token.user = user;

        // Eğer access_token varsa, bunu da token'a ekle
        if (user.access_token) {
          token.access_token = user.access_token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Session'a kullanıcı bilgilerini ekle
      if (token.user) {
        session.user = {
          id: token.user.id,
          email: token.user.email,
          name: `${token.user.firstName} ${token.user.lastName}`,
          username: token.user.username,
          firstName: token.user.firstName,
          lastName: token.user.lastName,
          role: token.user.role,
          photoUrl: token.user.photoUrl,
          bio: token.user.bio,
          booksCount: token.user.booksCount,
          articlesCount: token.user.articlesCount,
          visitsCount: token.user.visitsCount
        };

        // Access token'ı session'a da ekle (client-side'da kullanmak için)
        if (token.access_token) {
          session.access_token = token.access_token;
        }
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 * 1000, // 24 saat
    updateAge: 60 * 60 * 1000, // 1 saat
  },
  jwt: {
    maxAge: 24 * 60 * 60 * 1000, // 24 saat
  },
  // Session kontrolünü optimize et
  useSecureCookies: false, // Development için false
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false // Development için false
      }
    }
  }
};
