import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify the token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jose.jwtVerify(token, secret);
      
      // Token is valid, allow the request
      return NextResponse.next();
    } catch (err) {
      // Token is invalid
      console.error('Token verification failed:', err);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Don't allow accessing login page if already authenticated
  if (request.nextUrl.pathname === '/login') {
    const token = request.cookies.get('auth_token')?.value;
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jose.jwtVerify(token, secret);
        return NextResponse.redirect(new URL('/admin', request.url));
      } catch (error) {
        console.error('Token verification failed:', error);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login']
}; 