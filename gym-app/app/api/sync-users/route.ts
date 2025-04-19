import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { clerkClient } from '@clerk/clerk-sdk-node';

export async function POST() {
  const authData = await auth();
  const { userId } = authData;

  if (!userId) {
    return new Response('No autenticado', { status: 401 });
  }

  try {
    // Obtener todos los usuarios de Clerk
    const clerkUsers = await clerkClient.users.getUserList();
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
      // Mapear el rol de Clerk al rol de la base de datos
      let role: 'ALUMNO' | 'PROFESSOR' | 'ADMIN' = 'ALUMNO'; // Valor predeterminado

      if (clerkUser.publicMetadata?.role === 'professor') {
        role = 'PROFESSOR';
      } else if (clerkUser.publicMetadata?.role === 'admin') {
        role = 'ADMIN';
      }

      await prisma.user.upsert({
        where: { id: clerkUser.id },
        update: {
          email: clerkUser.emailAddresses[0]?.emailAddress || 'sin-email',
          name:
            `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
            'Usuario sin nombre',
          role, // Guardar el rol mapeado
        },
        create: {
          id: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || 'sin-email',
          name:
            `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
            'Usuario sin nombre',
          dni: `DNI-${clerkUser.id.slice(-8)}`,
          role, // Guardar el rol mapeado
        },
      });
    }

    console.log('API Sync - Sincronización completada');
    return NextResponse.json({
      message: `${usersArray.length} usuarios sincronizados`,
    });
  } 
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.error('API Sync - Error al sincronizar usuarios:', error);
    return NextResponse.json(
      { error: 'Error al sincronizar usuarios', details: error.message },
      { status: 500 }
    );
  }
}
