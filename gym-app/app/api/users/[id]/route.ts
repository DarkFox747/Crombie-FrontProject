import { auth } from '@clerk/nextjs/server';
import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/clerk-sdk-node';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params; // Esperar a que params se resuelva
  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user) return new Response('Usuario no encontrado', { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params; // Esperar a que params se resuelva
  const authData = await auth();
  const { userId } = authData;

  if (!userId) return new Response('No autenticado', { status: 401 });

  const requester = await prisma.user.findUnique({ where: { id: userId } });
  if (!requester) return new Response('Solicitante no encontrado', { status: 403 });

  const { name, email, dni, role, phone, profilePictureUrl } = await req.json();

  // Solo ADMIN puede editar el rol
  const canEditRole = requester.role === 'ADMIN';
  const dataToUpdate = {
    name,
    email,
    dni,
    phone,
    profilePictureUrl,
    ...(canEditRole && role ? { role } : {}),
  };

  const user = await prisma.user.update({
    where: { id: params.id },
    data: dataToUpdate,
  });

  // Si el rol fue actualizado y el solicitante es ADMIN, sincronizar con Clerk
  if (canEditRole && role) {
    try {
      await clerkClient.users.updateUser(params.id, {
        publicMetadata: {
          role: role.toLowerCase(), // Asegurar que el rol esté en minúsculas
        },
      });
    } catch (error) {
      console.error('Error al actualizar el rol en Clerk:', error);
      return new Response('Error al sincronizar el rol en Clerk', { status: 500 });
    }
  }

  return NextResponse.json(user);
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params; // Esperar a que params se resuelva
  const authData = await auth();
  const { userId } = authData;

  if (!userId) return new Response('No autenticado', { status: 401 });

  const requester = await prisma.user.findUnique({ where: { id: userId } });
  if (!requester || requester.role !== 'ADMIN') {
    return new Response('No autorizado', { status: 403 });
  }

  try {
    // Eliminar el usuario de la base de datos
    await prisma.user.delete({ where: { id: params.id } });

    // Eliminar el usuario de Clerk
    await clerkClient.users.deleteUser(params.id);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    return new Response('Error interno del servidor', { status: 500 });
  }
}