import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/signin', '/signup', '/reset-password', '/error-404'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Rutas que siempre permiten acceso (assets, API, etc.)
  const allowedRoutes = ['/api', '/_next', '/favicon.ico', '/images', '/public'];
  const isAllowedRoute = allowedRoutes.some(route => pathname.startsWith(route)) || pathname === '/favicon.ico';
  
  // Si es una ruta permitida, continuar
  if (isAllowedRoute) {
    return NextResponse.next();
  }
  
  // Obtener el token de Firebase de las cookies
  const token = request.cookies.get('firebase-auth-token')?.value;
  
  // Si el usuario no está autenticado y no está en una ruta pública
  if (!token && !isPublicRoute) {
    // Redirigir al login con la URL actual como redirect
    const loginUrl = new URL('/signin', request.url);
    if (pathname !== '/') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }
  
  // Si el usuario está autenticado y está en una ruta pública, redirigir al dashboard
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|images).*)',
  ],
}; 