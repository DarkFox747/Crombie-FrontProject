import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { Roles } from '@/types/globals';

// Definir rutas públicas y de profesor
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/api/webhooks/clerk(.*)']);
const isProfessorRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/exercises(.*)',
  '/routines(.*)',
  '/api/routines(.*)',
  '/api/exercises(.*)',
  '/api/sync-users(.*)',
]);

// Interfaz para tipar los metadatos de Clerk
interface ClerkMetadata {
  role?: Roles;
  isProfessor?: boolean;
}

// Interfaz para tipar sessionClaims
interface SessionClaims {
  metadata?: ClerkMetadata;
}

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  console.log('Middleware - URL:', req.url, 'UserId:', userId, 'Metadata:', sessionClaims?.metadata);

  // Permitir acceso a rutas públicas
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Redirigir a sign-in si no hay usuario autenticado
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Verificar acceso a rutas de profesor
  if (isProfessorRoute(req)) {
    const metadata = (sessionClaims as SessionClaims)?.metadata;
    const role = metadata?.role;
    const isProfessor = metadata?.isProfessor;

    // Permitir acceso si el rol es 'admin' o 'professor', o si isProfessor es true
  
    if (role !== 'admin' && role !== 'professor' && !isProfessor) {
      console.log('Acceso no autorizado a ruta de profesor');
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Continuar con la solicitud si está autorizado
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};