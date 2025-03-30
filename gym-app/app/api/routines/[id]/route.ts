import { auth } from '@clerk/nextjs/server';
import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';




export async function GET(req: Request, { params }: { params: { id: string } }) {
  const authData = await auth();
  const { userId } = authData;

  if (!userId) return new Response('No autenticado', { status: 401 });

  const requester = await prisma.user.findUnique({ where: { id: userId } });
  if (!requester || (requester.role !== 'PROFESSOR' && requester.role !== 'ADMIN')) {
    return new Response('No autorizado', { status: 403 });
  }

  const { id } = params;

  if (!id) return new Response('ID requerido', { status: 400 });

  const routine = await prisma.routineHistory.findUnique({
    where: { id },
  });

  if (!routine) return new Response('Rutina no encontrada', { status: 404 });

  return NextResponse.json(routine);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const authData = await auth();
  const { userId } = authData;

  if (!userId) return new Response('No autenticado', { status: 401 });

  const requester = await prisma.user.findUnique({ where: { id: userId } });
  if (!requester || (requester.role !== 'PROFESSOR' && requester.role !== 'ADMIN')) {
    return new Response('No autorizado', { status: 403 });
  }

  const { userId: targetUserId, startDate, endDate, status } = await req.json();
  const routine = await prisma.routineHistory.update({
    where: { id: params.id },
    data: {
      userId: targetUserId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : null,
      status,
    },
  });
  return NextResponse.json(routine);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const authData = await auth();
  const { userId } = authData;

  if (!userId) return new Response('No autenticado', { status: 401 });

  const requester = await prisma.user.findUnique({ where: { id: userId } });
  if (!requester || (requester.role !== 'PROFESSOR' && requester.role !== 'ADMIN')) {
    return new Response('No autorizado', { status: 403 });
  }

  await prisma.routineHistory.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}