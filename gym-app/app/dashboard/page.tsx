import { auth } from '@clerk/nextjs/server';
import prisma from '../../lib/prisma';
import SyncButton from '../../components/SyncButton';

export default async function Dashboard() {
  const authData = await auth(); // Esperar la resolución de auth()
  const { userId } = authData;

  if (!userId) {
    return (
      <div className="min-h-screen p-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p>No estás autenticado. Por favor, inicia sesión.</p>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  // Si el usuario no está sincronizado aún, mostrar mensaje
  if (!user) {
    return (
      <div className="min-h-screen p-4">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p>Usuario no encontrado en la base de datos. Sincroniza los usuarios primero.</p>
        <SyncButton />
      </div>
    );
  }

  const routines = await prisma.routineHistory.findMany({
    where: { userId: user.id },
    include: {
      routineExercises: {
        include: {
          exercise: true,
        },
      },
    },
    orderBy: { startDate: 'desc' },
  });

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-lg mb-4">Bienvenido, {user.name}</p>
      <SyncButton />

      <h2 className="text-2xl font-semibold mb-2">Tus Rutinas</h2>
      {routines.length === 0 ? (
        <p>No hay rutinas asignadas aún.</p>
      ) : (
        <ul className="space-y-4">
          {routines.map((routine) => (
            <li key={routine.id} className="border p-4 rounded-lg">
              <strong>
                Rutina ({routine.status}) - Inicio:{' '}
                {new Date(routine.startDate).toLocaleDateString()}
              </strong>
              <ul className="mt-2 space-y-1">
                {routine.routineExercises.map((re) => (
                  <li key={re.id}>
                    {re.exercise.name} ({re.dayOfWeek}): {re.sets} series x{' '}
                    {re.reps} reps {re.notes && `- ${re.notes}`}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}