const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Crear usuarios
  const admin = await prisma.user.create({
    data: {
      email: 'admin@crombiegym.com',
      name: 'Administrador',
      dni: '10000001',
      phone: '3415001000',
      role: 'ADMIN',
    },
  });

  const professor = await prisma.user.create({
    data: {
      email: 'profesor@example.com',
      name: 'Profesor Fit',
      dni: '10000002',
      phone: '3415001001',
      role: 'PROFESSOR',
    },
  });

  const alumno1 = await prisma.user.create({
    data: {
      email: 'alumno@example.com',
      name: 'Juan Pérez',
      dni: '10000003',
      phone: '3415001002',
      role: 'ALUMNO',
    },
  });

  const alumno2 = await prisma.user.create({
    data: {
      email: 'carla.entrena@crombiegym.com',
      name: 'Carla Giménez',
      dni: '10000004',
      phone: '3415001003',
      role: 'ALUMNO',
    },
  });

  // Crear ejercicios
  const [sentadillas, pressBanca, pesoMuerto, dominadas] = await Promise.all([
    prisma.exercise.create({
      data: {
        name: 'Sentadillas',
        description: 'Ejercicio compuesto para piernas',
        videoUrl: 'https://www.youtube.com/watch?v=video1',
        createdBy: professor.id,
      },
    }),
    prisma.exercise.create({
      data: {
        name: 'Press de Banca',
        description: 'Ejercicio de pecho y tríceps',
        videoUrl: 'https://www.youtube.com/watch?v=video2',
        createdBy: professor.id,
      },
    }),
    prisma.exercise.create({
      data: {
        name: 'Peso Muerto',
        description: 'Ejercicio para espalda y glúteos',
        videoUrl: 'https://www.youtube.com/watch?v=video3',
        createdBy: professor.id,
      },
    }),
    prisma.exercise.create({
      data: {
        name: 'Dominadas',
        description: 'Ejercicio de tracción vertical',
        videoUrl: 'https://www.youtube.com/watch?v=video4',
        createdBy: professor.id,
      },
    }),
  ]);

  // Crear rutina para alumno1
  const rutina = await prisma.routineHistory.create({
    data: {
      userId: alumno1.id,
      startDate: new Date(),
      status: 'ACTIVE',
    },
  });

  const rutinaSentadillas = await prisma.routineExercise.create({
    data: {
      routineId: rutina.id,
      exerciseId: sentadillas.id,
      dayOfWeek: 'Lunes',
    },
  });

  const rutinaPress = await prisma.routineExercise.create({
    data: {
      routineId: rutina.id,
      exerciseId: pressBanca.id,
      dayOfWeek: 'Miércoles',
    },
  });

  await prisma.routineSet.createMany({
    data: [
      {
        routineExerciseId: rutinaSentadillas.id,
        sets: 4,
        reps: 10,
        weight: 60,
      },
      {
        routineExerciseId: rutinaPress.id,
        sets: 3,
        reps: 8,
        weight: 50,
      },
    ],
  });

  console.log('✅ Seed completada con profesor@example.com y alumno@example.com');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
