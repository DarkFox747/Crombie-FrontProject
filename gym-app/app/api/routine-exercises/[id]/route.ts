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

  const { routineId, exerciseId, dayOfWeek, sets, reps, notes } = await req.json();
  const routineExercise = await prisma.routineExercise.update({
    where: { id: params.id },
    data: { routineId, exerciseId, dayOfWeek, sets, reps, notes },
  });
  return NextResponse.json(routineExercise);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const authData = await auth();
  const { userId } = authData;

  if (!userId) return new Response('No autenticado', { status: 401 });

  const requester = await prisma.user.findUnique({ where: { id: userId } });
  if (!requester || (requester.role !== 'PROFESSOR' && requester.role !== 'ADMIN')) {
    return new Response('No autorizado', { status: 403 });
  }

  await prisma.routineExercise.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}