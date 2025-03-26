import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const authData = await auth(); // Esperar la resolución de auth()
  const { userId } = authData;
  console.log('Middleware - URL:', req.url, 'UserId:', userId);

  // Si es una ruta pública, permitir acceso
  if (isPublicRoute(req)) {
    console.log('Ruta pública, permitiendo acceso');
    return NextResponse.next();
  }

  // Si no hay usuario autenticado, redirigir a /sign-in
  if (!userId) {
    console.log('No autenticado, redirigiendo a /sign-in');
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  console.log('Autenticado, permitiendo acceso');
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/(api|trpc)(.*)',
  ],
};