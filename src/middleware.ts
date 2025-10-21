// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = request.nextUrl;
  const esRutaAPIProtegida = pathname.startsWith('/api/messages/') || 
                             pathname.startsWith('/api/responses/') || 
                             pathname.startsWith('/api/sockets/');
  

  if (esRutaAPIProtegida) {
    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado. Se requiere autenticación.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    '/api/messages/:path*',
    '/api/responses/:path*',
    '/api/sockets/:path*',
  ],
};