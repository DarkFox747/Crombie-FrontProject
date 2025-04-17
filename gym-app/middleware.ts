import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/api/webhooks(.*)']);
const isProfessorRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/exercises(.*)',
  '/routines(.*)',
  '/api/routines(.*)',
  '/api/exercises(.*)',
  '/api/sync-users(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  console.log('Middleware - URL:', req.url, 'UserId:', userId);

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }


  if (isProfessorRoute(req) && (await auth()).sessionClaims?.metadata?.role !== 'admin') {
    console.log('Acceso no autorizado a ruta de profesor');
    const url = new URL('/', req.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/webhooks/user).*)', 
    '/(api|trpc)(?!/webhooks/user)(.*)', 
  ],
};

