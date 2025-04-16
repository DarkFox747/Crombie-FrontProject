import { auth } from '@clerk/nextjs/server';
import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const exercises = await prisma.exercise.findMany();
  return NextResponse.json(exercises);
}

export async function POST(req: Request) {
  const authData = await auth();
  const { userId } = authData;

  if (!userId) return new Response('No autenticado', { status: 401 });

  const requester = await prisma.user.findUnique({ where: { id: userId } });
  if (!requester || (requester.role !== 'PROFESSOR' && requester.role !== 'ADMIN')) {
    return new Response('No autorizado', { status: 403 });
  }

  const { name, description, videoUrl } = await req.json();

  if (!name) return new Response('Nombre requerido', { status: 400 });

  const exercise = await prisma.exercise.create({
    data: {
      name,
      description,
      videoUrl: videoUrl || null,
      createdBy: userId,
    },
  });

  return NextResponse.json(exercise, { status: 201 });
}
