import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { Clerk } from '@clerk/clerk-sdk-node';

const clerk = new Clerk({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function POST(req: Request) {
  const authData = await auth();
  const { userId } = authData;

  if (!userId) {
    return new Response('No autenticado', { status: 401 });
  }

  try {
    // Obtener todos los usuarios de Clerk
    const clerkUsers = await clerk.users.getUserList();
    console.log('API Sync - Respuesta completa de getUserList:', JSON.stringify(clerkUsers, null, 2));

    // Determinar el array de usuarios
    let usersArray;
    if (Array.isArray(clerkUsers)) {
      usersArray = clerkUsers; // Si es un array directo
    } else if (clerkUsers && Array.isArray(clerkUsers.data)) {
      usersArray = clerkUsers.data; // Si tiene propiedad data
    } else {
      throw new Error('Formato inesperado de respuesta de Clerk: ' + JSON.stringify(clerkUsers));
    }

    console.log('API Sync - Usuarios obtenidos de Clerk:', usersArray.length);

    // Iterar sobre los usuarios y sincronizar con Prisma
    for (const clerkUser of usersArray) {
      await prisma.user.upsert({
        where: { id: clerkUser.id },
        update: {
          email: clerkUser.emailAddresses[0]?.emailAddress || 'sin-email',
          name:
            `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
            'Usuario sin nombre',
        },
        create: {
          id: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || 'sin-email',
          name:
            `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
            'Usuario sin nombre',
          dni: `DNI-${clerkUser.id.slice(-8)}`,
          role: 'ALUMNO',
        },
      });
    }

    console.log('API Sync - Sincronización completada');
    return NextResponse.json({
      message: `${usersArray.length} usuarios sincronizados`,
    });
  } catch (error) {
    console.error('API Sync - Error al sincronizar usuarios:', error);
    return NextResponse.json(
      { error: 'Error al sincronizar usuarios', details: error.message },
      { status: 500 }
    );
  }
}