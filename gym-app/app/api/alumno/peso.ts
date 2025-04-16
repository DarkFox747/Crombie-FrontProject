import { auth } from '@clerk/nextjs/server';
import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response('No autenticado', { status: 401 });

  const { routineExerciseId, weight } = await req.json();
  if (!routineExerciseId || weight === undefined) {
    return new Response('Datos incompletos', { status: 400 });
  }

  const exercise = await prisma.routineExercise.findUnique({
    where: { id: routineExerciseId },
    include: { routine: true },
  });

  if (!exercise || exercise.routine.userId !== userId) {
    return new Response('No autorizado para modificar este ejercicio', { status: 403 });
  }

  const updated = await prisma.routineExercise.update({
    where: { id: routineExerciseId },
    data: { weight: parseFloat(weight) },
  });

  return NextResponse.json(updated);
}
