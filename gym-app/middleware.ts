import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Definir rutas públicas
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware((auth, req) => {
  // Obtener el estado de autenticación
  const { userId } = auth();

  // Si no está autenticado y no es una ruta pública, redirigir a /sign-in
  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Si está autenticado y va a sign-in o sign-up, redirigir a /dashboard
  const url = new URL(req.url);
  if (userId && (url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up'))) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Continuar con la solicitud
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Aplicar a todas las rutas excepto archivos estáticos y Next.js internals
    '/((?!_next/static|_next/image|favicon.ico).*)',
    // Incluir rutas API si las usás
    '/(api|trpc)(.*)',
  ],
};