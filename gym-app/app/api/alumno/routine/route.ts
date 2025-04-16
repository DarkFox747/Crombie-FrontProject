import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
      const authData = await auth();
      const { userId } = authData;
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

  // Cambiar de prisma.routine a prisma.routineHistory
  const routine = await prisma.routineHistory.findFirst({
    where: {
      userId,
      status: { in: ['ACTIVE', 'PLANNED'] },
    },
    include: {
      routineExercises: {
        include: {
          exercise: true,
          sets: true,
        },
        orderBy: {
          dayOfWeek: 'asc',
        },
      },
    },
  });

  if (!routine) {
    return NextResponse.json({ error: 'No se encontró rutina activa' }, { status: 404 });
  }

  return NextResponse.json(routine);
} catch (error) {
  console.error('Error fetching routine:', error);
  return NextResponse.json(
    { error: 'Error interno del servidor' },
    { status: 500 }
  );
}
}