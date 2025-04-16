import { auth } from '@clerk/nextjs/server';
import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

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
  return NextResponse.json(user);
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params; // Esperar a que params se resuelva
  const authData = await auth();
  const { userId } = authData;

  if (!userId) return new Response('No autenticado', { status: 401 });

  const requester = await prisma.user.findUnique({ where: { id: userId } });
  if (!requester || requester.role !== 'PROFESSOR') {
    return new Response('No autorizado', { status: 403 });
  }

  await prisma.user.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}