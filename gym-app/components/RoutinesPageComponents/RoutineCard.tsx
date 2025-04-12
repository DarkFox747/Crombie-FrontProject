// components/RoutinesPageComponents/RoutineCard.tsx
"use client";
import Link from 'next/link';

// Eliminamos el array daysOfWeek estático ya que usaremos los valores de la DB

export default function RoutineCard({ routine, userName }) {
  // Agrupar ejercicios por día manteniendo el formato de dayOfWeek de la DB
  const exercisesByDay = routine.routineExercises.reduce((acc, exercise) => {
    if (!acc[exercise.dayOfWeek]) {
      acc[exercise.dayOfWeek] = [];
    }
    acc[exercise.dayOfWeek].push(exercise);
    return acc;
  }, {});

  // Función para formatear el estado de la rutina según el enum
  const formatStatus = (status) => {
    switch(status) {
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
        {Object.entries(exercisesByDay).map(([day, exercises]) => (
          <div key={day} className="bg-gray-600 bg-opacity-50 rounded-lg p-3">
            <h4 className="font-medium text-yellow-400 mb-2">
              {day} {/* Mostramos directamente el valor de dayOfWeek de la DB */}
            </h4>
            <ul className="space-y-2">
              {exercises.map((ex) => (
                <li key={ex.id} className="text-sm text-gray-200">
                  <p className="font-medium">{ex.exercise.name}</p>
                  <p>{ex.sets} series x {ex.reps} reps</p>
                  {ex.weight && <p>Peso: {ex.weight} kg</p>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}