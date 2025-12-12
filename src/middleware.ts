// --- START OF FILE src/middleware.ts ---
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Simple check for protected routes
  const token = request.cookies.get('session_token')
  const isProtected = request.nextUrl.pathname.startsWith('/notifications');

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/notifications/:path*'],
}