import { auth } from '@clerk/nextjs/server';
import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

interface ExercisesGrouped{
  exerciseId: string;
  dayOfWeek: string;
  setsData: {
    sets: number;
    reps: number;
    weight?: number | null;
  }[];
}

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const routine = await prisma.routineHistory.findUnique({
    where: { id: params.id },
    include: {
      routineExercises: {
        include: {
          sets: true,
          exercise: true,
        }
      },
    },
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

  try {
    const { startDate, endDate, status, routineExercises } = await req.json();

    // 1. Validación de datos básicos
    if (!startDate || !Array.isArray(routineExercises)) {
      return new Response('Datos de rutina inválidos', { status: 400 });
    }

    // 2. Obtener rutina existente
    const existingRoutine = await prisma.routineHistory.findUnique({
      where: { id: params.id },
      include: {
        routineExercises: {
          include: {
            sets: true
          }
        }
      }
    });

    if (!existingRoutine) {
      return new Response('Rutina no encontrada', { status: 404 });
    }

    // 3. Actualizar datos básicos de la rutina
    await prisma.routineHistory.update({
      where: { id: params.id },
      data: {
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'ACTIVE',
      }
    });

    // 5. Agrupar ejercicios por día y tipo (para manejar múltiples sets)
    const exercisesGrouped = routineExercises.reduce((acc, curr) => {
      if (!curr.exerciseId || !curr.dayOfWeek || !Array.isArray(curr.sets)) return acc;
    
      const key = `${curr.exerciseId}-${curr.dayOfWeek}`;
      if (!acc[key]) {
        acc[key] = {
          exerciseId: curr.exerciseId,
          dayOfWeek: curr.dayOfWeek,
          setsData: []
        };
      }
    
      for (const s of curr.sets) {
        if (typeof s.sets !== 'number' || typeof s.reps !== 'number') continue;
        acc[key].setsData.push({
          sets: s.sets,
          reps: s.reps,
          weight: s.weight ?? null
        });
      }
    
      return acc;
    }, {});

    // 6. Eliminar ejercicios existentes (simplificado para este ejemplo)
    await prisma.routineSet.deleteMany({
      where: {
        routineExercise: {
          routineId: params.id
        }
      }
    });

    await prisma.routineExercise.deleteMany({
      where: {
        routineId: params.id
      }
    });

    // 7. Crear nuevos ejercicios con sus sets
    for await (const group of Object.values(exercisesGrouped) as ExercisesGrouped[]) {
       await prisma.routineExercise.create({
        data: {
          routineId: params.id,
          exerciseId: group.exerciseId,
          dayOfWeek: group.dayOfWeek,
          sets: {
            createMany: {
              data: group.setsData.map(set => ({
                sets: set.sets,
                reps: set.reps,
                weight: set.weight
              }))
            }
          }
        }
      });
    }

    // 8. Devolver rutina actualizada
    const updatedRoutine = await prisma.routineHistory.findUnique({
      where: { id: params.id },
      include: {
        routineExercises: {
          include: {
            exercise: true,
            sets: true
          }
        }
      }
    });

    return NextResponse.json(updatedRoutine);

  } catch (error) {
    console.error('Error al actualizar rutina:', error);
    return new Response('Error interno del servidor', { status: 500 });
  }
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