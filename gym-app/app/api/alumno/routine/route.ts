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

    // Obtener todas las rutinas del usuario, ordenadas por status
    const routines = await prisma.routineHistory.findMany({
      where: {
        userId,
        status: { in: ['ACTIVE', 'PLANNED', 'COMPLETED'] },
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
      orderBy: {
        // Ordenar por status (ACTIVE primero, luego PLANNED, luego COMPLETED)
        status: 'asc',
      },
    });

    if (routines.length === 0) {
      return NextResponse.json({ routines: [], hasRoutines: false }, { status: 200 });
    }

    return NextResponse.json({ routines, hasRoutines: true });
  } catch (error) {
    console.error('Error fetching routines:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}