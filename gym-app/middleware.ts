import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  console.log('Middleware - URL:', req.url, 'UserId:', userId);

  if (isPublicRoute(req)) {
    console.log('Ruta pública, permitiendo acceso');
    return NextResponse.next();
  }

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