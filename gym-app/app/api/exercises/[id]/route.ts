import { auth } from '@clerk/nextjs/server';
import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const authData = await auth();
  const { userId } = authData;

  if (!userId) return new Response('No autenticado', { status: 401 });

  const requester = await prisma.user.findUnique({ where: { id: userId } });
  if (!requester || (requester.role !== 'PROFESSOR' && requester.role !== 'ADMIN')) {
    return new Response('No autorizado', { status: 403 });
  }

  const { name, description, videoUrl } = await req.json();

  const exercise = await prisma.exercise.update({
    where: { id: params.id },
    data: {
      name,
      description,
      videoUrl: videoUrl || null,
    },
  });

  return NextResponse.json(exercise);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const authData = await auth();
  const { userId } = authData;

  if (!userId) return new Response('No autenticado', { status: 401 });

  const requester = await prisma.user.findUnique({ where: { id: userId } });
  if (!requester || (requester.role !== 'PROFESSOR' && requester.role !== 'ADMIN')) {
    return new Response('No autorizado', { status: 403 });
  }

  await prisma.exercise.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}