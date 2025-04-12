import { auth } from '@clerk/nextjs/server';
import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const routine = await prisma.routineHistory.findUnique({
    where: { id: params.id },
    include: { routineExercises: { include: { exercise: true } } },
  });
  if (!routine) return new Response('Rutina no encontrada', { status: 404 });
  return NextResponse.json(routine);
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const authData = await auth();
  const { userId } = authData;

  if (!userId) return new Response('No autenticado', { status: 401 });

  const requester = await prisma.user.findUnique({ where: { id: userId } });
  if (!requester || requester.role !== 'PROFESSOR') {
    return new Response('No autorizado', { status: 403 });
  }

  const { startDate, endDate, status, routineExercises } = await req.json();

  const updatedRoutine = await prisma.routineHistory.update({
    where: { id: params.id },
    data: {
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      status,
      routineExercises: {
        deleteMany: {},
        create: routineExercises.map((re) => ({
          dayOfWeek: re.dayOfWeek,
          exerciseId: re.exerciseId,
          sets: re.sets,
          reps: re.reps,
          weight: re.weight || null, // Nuevo campo
        })),
      },
    },
    include: { routineExercises: { include: { exercise: true } } },
  });

  return NextResponse.json(updatedRoutine);
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const authData = await auth();
  const { userId } = authData;

  if (!userId) return new Response('No autenticado', { status: 401 });

  const requester = await prisma.user.findUnique({ where: { id: userId } });
  if (!requester || requester.role !== 'PROFESSOR') {
    return new Response('No autorizado', { status: 403 });
  }

  try {
    // Primero borramos los ejercicios relacionados
    await prisma.routineExercise.deleteMany({
      where: { routineId: params.id }
    });

    // Luego borramos la rutina
    await prisma.routineHistory.delete({
      where: { id: params.id }
    });

    return new Response('Rutina eliminada correctamente', { status: 200 });
  } catch (error) {
    console.error('Error eliminando rutina:', error);
    return new Response('Error interno del servidor', { status: 500 });
  }
}
