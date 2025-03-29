import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from './lib/auth';

export function middleware(request: NextRequest) {
  // Verifica se é uma rota da API administrativa
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    // Permite a rota de login sem autenticação
    if (request.nextUrl.pathname === '/api/admin/login') {
      return NextResponse.next();
    }

    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader || '');

    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/admin/:path*',
}; 