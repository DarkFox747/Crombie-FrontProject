import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  try {
    const authData = await auth();
    const { userId } = authData;
    
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { routineSetId, weight } = await req.json();

    if (!routineSetId || weight === undefined) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    const numericWeight = parseFloat(weight);
    if (isNaN(numericWeight)) {
      return NextResponse.json(
        { error: 'El peso debe ser un número válido' },
        { status: 400 }
      );
    }

    // Verificar que el set pertenece al usuario
    const routineSet = await prisma.routineSet.findFirst({
      where: {
        id: routineSetId,
        routineExercise: {
          routine: {
            userId,
          },
        },
      },
    });

    if (!routineSet) {
      return NextResponse.json(
        { error: 'No autorizado para modificar este set' },
        { status: 403 }
      );
    }

    const updatedSet = await prisma.routineSet.update({
      where: { id: routineSetId },
      data: { weight: numericWeight },
    });

    return NextResponse.json(updatedSet);
  } catch (error) {
    console.error('Error updating weight:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}