import { auth } from '@clerk/nextjs/server';
import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const exercises = await prisma.exercise.findMany();
  return NextResponse.json(exercises);
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new Response('No autenticado', { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== 'PROFESSOR') {
    return new Response('No autorizado', { status: 403 });
  }

  const { name, description } = await req.json();
  if (!name) {
    return new Response('Nombre requerido', { status: 400 });
  }

  const exercise = await prisma.exercise.create({
    data: {
      name,
      description,
      createdBy: userId,
    },
  });

  return NextResponse.json(exercise, { status: 201 });
}