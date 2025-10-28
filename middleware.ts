import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes
const protectedRoutes = [
  // '/dashboard', // temporalmente público para permitir acceso sin autenticación
  '/me',
  '/users',
  '/profile',
  '/register-installation',
  '/installations',
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token');
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  /* if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      return response;
    }
  } */

  // If user is logged in and tries to access login page, redirect to dashboard
  if (token && (pathname === '/login' || pathname === '/register')) {
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};