import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Get the token from cookies
  const token = request.cookies.get('authToken')?.value;
  
  // 2. Define which pages are protected
  // We want to protect the Home Page "/" and the Team Page "/team"
  const isProtectedPath = request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/team') || request.nextUrl.pathname.startsWith('/products') || request.nextUrl.pathname.startsWith('/analytics');

  // 3. If user is on a protected page BUT has no token -> Redirect to Login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. If user is ALREADY logged in but tries to go to Login -> Redirect to Home
  if (request.nextUrl.pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Only run middleware on these paths

 // ... (Your existing middleware function stays the same) ...

export const config = {
  matcher: [
    '/', 
    '/login', 
    '/team/:path*', 
    '/products/:path*',   
    '/analytics/:path*'   
  ],
};
