import { PrismaClient, Role, RoutineStatus, DayOfWeek } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  // Limpiar la base de datos (opcional, para pruebas)
  await prisma.routineExercise.deleteMany();
  await prisma.routineHistory.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuarios
  const alumno = await prisma.user.create({
    data: {
      email: 'alumno@example.com',
      name: 'Juan Pérez',
      dni: '12345678',
      role: Role.ALUMNO,
    },
  });

  const profesor = await prisma.user.create({
    data: {
      email: 'profesor@example.com',
      name: 'Ana Gómez',
      dni: '87654321',
      role: Role.PROFESSOR,
    },
  });

  // Crear ejercicios
  const exercises = await prisma.exercise.createMany({
    data: [
      { name: 'Sentadilla', description: 'Ejercicio para piernas', createdBy: profesor.id },
      { name: 'Flexiones', description: 'Ejercicio de pecho', createdBy: profesor.id },
      { name: 'Plancha', description: 'Ejercicio de core', createdBy: profesor.id },
    ],
  });

  const exerciseList = await prisma.exercise.findMany();

  // Crear una rutina activa
  const activeRoutine = await prisma.routineHistory.create({
    data: {
      userId: alumno.id,
      createdBy: profesor.id,
      startDate: new Date('2025-03-20'),
      status: RoutineStatus.ACTIVE,
      routineExercises: {
        create: [
          {
            exerciseId: exerciseList[0].id, // Sentadilla
            dayOfWeek: DayOfWeek.MONDAY,
            sets: 3,
            reps: 12,
            notes: 'Mantener buena postura',
          },
          {
            exerciseId: exerciseList[1].id, // Flexiones
            dayOfWeek: DayOfWeek.WEDNESDAY,
            sets: 3,
            reps: 15,
          },
        ],
      },
    },
  });

  // Crear una rutina completada (historial)
  const completedRoutine = await prisma.routineHistory.create({
    data: {
      userId: alumno.id,
      createdBy: profesor.id,
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-02-28'),
      status: RoutineStatus.COMPLETED,
      routineExercises: {
        create: [
          {
            exerciseId: exerciseList[2].id, // Plancha
            dayOfWeek: DayOfWeek.FRIDAY,
            sets: 3,
            reps: 30,
            notes: '30 segundos por serie',
          },
        ],
      },
    },
  });

  console.log('Seeding completado!');
  console.log('Usuarios:', { alumno, profesor });
  console.log('Ejercicios:', exerciseList);
  console.log('Rutinas:', { activeRoutine, completedRoutine });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });