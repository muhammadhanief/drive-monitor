import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

export async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');
  
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');

  if (!sessionCookie && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (sessionCookie) {
    const payload = await decrypt(sessionCookie.value);
    
    // If invalid token and trying to access protected route
    if (!payload && !isLoginPage) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('session');
      return response;
    }

    // If valid token and trying to access login page, redirect to dashboard
    if (payload && isLoginPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/grafik/:path*',
    '/login'
  ]
};
