import { auth } from '@clerk/nextjs/server';
import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const authData = await auth();
  const { userId } = authData;

  if (!userId) return new Response('No autenticado', { status: 401 });

  const requester = await prisma.user.findUnique({ where: { id: userId } });
  if (!requester || (requester.role !== 'PROFESSOR' && requester.role !== 'ADMIN')) {
    return new Response('No autorizado', { status: 403 });
  }

  const { email, name, dni, role } = await req.json();
  if (!email || !name) return new Response('Datos incompletos', { status: 400 });

  const user = await prisma.user.create({
    data: { email, name, dni, role: role || 'ALUMNO' },
  });
  return NextResponse.json(user, { status: 201 });
}