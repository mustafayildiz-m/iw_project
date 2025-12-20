import { NextResponse } from 'next/server';

// Public sayfalar - authentication gerektirmeyen sayfalar
const publicPages = [
  '/auth-advance/sign-in',
  '/auth/sign-in', 
  '/auth/sign-up',
  '/auth/forgot-pass',
  '/api/auth',
  '/_next',
  '/favicon.ico'
];

// Protected sayfalar - authentication gerektiren sayfalar
const protectedPages = [
  '/feed',
  '/profile',
  '/settings',
  '/messaging',
  '/chat',
  '/social'
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Ana sayfa yönlendirmesi
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/feed/home', request.url));
  }
  
  // Public sayfalar için middleware çalıştırma
  if (publicPages.some(page => pathname.startsWith(page))) {
    return NextResponse.next();
  }
  
  // Protected sayfalar için token kontrolü
  if (protectedPages.some(page => pathname.startsWith(page))) {
    const token = request.cookies.get('next-auth.session-token')?.value || 
                  request.cookies.get('__Secure-next-auth.session-token')?.value;
    
    // Token yoksa login sayfasına yönlendir
    if (!token) {
      const loginUrl = new URL('/auth-advance/sign-in', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

// Middleware'in çalışacağı path'ler
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};