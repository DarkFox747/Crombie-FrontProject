// app/api/alumno/routine/route.ts
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response('No autenticado', { status: 401 });

  const routine = await prisma.routineHistory.findFirst({
    where: {
      userId,
      status: { in: ['ACTIVE', 'PLANNED'] },
    },
    include: {
      routineExercises: {
        include: { exercise: true },
      },
    },
  });

  if (!routine) return new Response('No se encontró rutina activa', { status: 404 });

  return NextResponse.json(routine);
}
