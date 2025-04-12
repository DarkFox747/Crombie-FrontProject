"use client";
import Link from 'next/link';

export default function RoutineCard({ routine, userName }) {
  // Agrupar ejercicios únicos por día
  const exercisesByDay = routine.routineExercises.reduce((acc, exercise) => {
    const day = exercise.dayOfWeek;
    const exerciseName = exercise.exercise.name;

    if (!acc[day]) acc[day] = new Map();

    // Solo agregamos si aún no existe ese ejercicio por nombre
    if (!acc[day].has(exerciseName)) {
      acc[day].set(exerciseName, exercise);
    }

    return acc;
  }, {});

  const formatStatus = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'Activa';
      case 'COMPLETED':
        return 'Completada';
      case 'PLANNED':
        return 'Planificada';
      default:
        return status;
    }
  };

  return (
    <div className="bg-gray-700 bg-opacity-80 backdrop-blur-md p-4 rounded-lg mb-4 w-full max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-yellow-400">Rutina para {userName}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <p className="text-sm text-gray-300">
              Inicio: {new Date(routine.startDate).toLocaleDateString()}
            </p>
            {routine.endDate && (
              <p className="text-sm text-gray-300">
                Fin: {new Date(routine.endDate).toLocaleDateString()}
              </p>
            )}
            <p className="text-sm text-gray-300">
              Estado: <span className={
                routine.status === 'ACTIVE' ? 'text-green-400' :
                routine.status === 'COMPLETED' ? 'text-blue-400' :
                'text-yellow-400'
              }>
                {formatStatus(routine.status)}
              </span>
            </p>
          </div>
        </div>
        <Link
          href={`/routines/edit/${routine.id}`}
          className="text-yellow-400 hover:text-yellow-300 underline whitespace-nowrap"
        >
          Editar Rutina
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Object.entries(exercisesByDay).map(([day, exerciseMap]) => (
          <div key={day} className="bg-gray-600 bg-opacity-50 rounded-lg p-3">
            <h4 className="font-medium text-yellow-400 mb-2">{day}</h4>
            <ul className="space-y-2">
              {[...exerciseMap.values()].map((ex) => (
                <li key={ex.exercise.id} className="text-sm text-gray-200">
                  <p className="font-medium">{ex.exercise.name}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
