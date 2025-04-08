"use client";
import Link from 'next/link';

export default function RoutineCard({ routine, userName }) {
  return (
    <div className="bg-gray-700 bg-opacity-80 backdrop-blur-md p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-yellow-400">Rutina para {userName}</h3>
          <p className="text-sm text-gray-300">
            Inicio: {new Date(routine.startDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-300">Estado: {routine.status}</p>
        </div>
        <Link
          href={`/routines/edit/${routine.id}`}
          className="text-yellow-400 hover:text-yellow-300 underline"
        >
          Editar
        </Link>
      </div>
      <ul className="mt-2 space-y-1 text-gray-200">
        {routine.routineExercises.map((re) => (
          <li key={re.id}>
            {re.exercise.name} ({re.dayOfWeek}): {re.sets} series x {re.reps} reps
          </li>
        ))}
      </ul>
    </div>
  );
}