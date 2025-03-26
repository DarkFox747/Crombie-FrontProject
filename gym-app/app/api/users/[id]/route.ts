import { auth } from '@clerk/nextjs/server';
import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const authData = await auth();
  const { userId } = authData;

  if (!userId) return new Response('No autenticado', { status: 401 });

  const requester = await prisma.user.findUnique({ where: { id: userId } });
  if (!requester || requester.role !== 'PROFESSOR') {
    return new Response('No autorizado', { status: 403 });
  }

  const { email, name, dni, role } = await req.json();
  const user = await prisma.user.update({
    where: { id: params.id },
    data: { email, name, dni, role },
  });
  return NextResponse.json(user);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
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