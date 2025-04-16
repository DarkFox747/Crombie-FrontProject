import { auth } from '@clerk/nextjs/server';
import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const routineExercises = await prisma.routineExercise.findMany({
    include: { exercise: true, routine: true },
  });
  return NextResponse.json(routineExercises);
}

export async function POST(req: Request) {
  const authData = await auth();
  const { userId } = authData;

  if (!userId) return new Response('No autenticado', { status: 401 });

  const requester = await prisma.user.findUnique({ where: { id: userId } });
  if (!requester || (requester.role !== 'PROFESSOR' && requester.role !== 'ADMIN')) {
    return new Response('No autorizado', { status: 403 });
  }

  const { routineId, exerciseId, dayOfWeek, sets, reps, notes } = await req.json();
  if (!routineId || !exerciseId || !dayOfWeek) {
    return new Response('Datos incompletos', { status: 400 });
  }

  const routineExercise = await prisma.routineExercise.create({
    data: { routineId, exerciseId, dayOfWeek, sets, reps, notes },
  });
  return NextResponse.json(routineExercise, { status: 201 });
}