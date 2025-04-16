import { auth } from '@clerk/nextjs/server';
import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');

  const filters = {
    ...(userId ? { userId } : {}),
    ...(status ? { status } : {}),
  };

  const routines = await prisma.routineHistory.findMany({
    where: filters,
    include: { routineExercises: { include: { exercise: true } } },
  });
  return NextResponse.json(routines);
}

// Mantener POST como está
export async function POST(req: Request) {
  const authData = await auth();
  const { userId } = authData;

  if (!userId) return new Response('No autenticado', { status: 401 });

  const requester = await prisma.user.findUnique({ where: { id: userId } });
  if (!requester || requester.role !== 'PROFESSOR') {
    return new Response('No autorizado', { status: 403 });
  }

  const { userId: targetUserId, startDate, endDate, status } = await req.json();
  if (!targetUserId || !startDate) {
    return new Response('Datos incompletos', { status: 400 });
  }

  const routine = await prisma.routineHistory.create({
    data: {
      userId: targetUserId,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      status: status || 'ACTIVE',
    },
  });
  return NextResponse.json(routine, { status: 201 });
}