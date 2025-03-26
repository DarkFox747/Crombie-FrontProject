import { auth } from '@clerk/nextjs/server';
import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) {
    return new Response('No autenticado', { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== 'PROFESSOR') {
    return new Response('No autorizado', { status: 403 });
  }

  const { name, description } = await req.json();
  const exercise = await prisma.exercise.update({
    where: { id: params.id },
    data: { name, description },
  });

  return NextResponse.json(exercise);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) {
    return new Response('No autenticado', { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== 'PROFESSOR') {
    return new Response('No autorizado', { status: 403 });
  }

  await prisma.exercise.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}