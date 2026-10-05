import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/');
  const isLoginRoute = request.nextUrl.pathname.startsWith('/api/auth/login');

  // Protegemos todas las rutas /api/ excepto la del login
  if (isApiRoute && !isLoginRoute) {
    if (!token) {
      return NextResponse.json({ error: 'No autorizado. Se requiere token JWT.' }, { status: 401 });
    }
    // En un entorno de producción, aquí verificaríamos la firma del token con jose o similar,
    // ya que en Edge Runtime de Next.js el módulo nativo jsonwebtoken no funciona directamente.
    // Por el MVP, la existencia de la cookie HttpOnly es una barrera inicial.
  }

  return NextResponse.next();
}

// Configuración de a qué rutas aplica este middleware
export const config = {
  matcher: ['/api/:path*'],
};
