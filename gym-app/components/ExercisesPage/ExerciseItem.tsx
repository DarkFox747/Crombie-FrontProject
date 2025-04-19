'use client';

import { Exercise } from '@prisma/client';

// Define las props del componente
interface ExerciseItemProps {
  exercise: Exercise; // Un objeto de tipo Exercise
  onDelete: (id: string) => void; // Función que recibe un ID y no devuelve nada
  onEdit: (exercise: Exercise) => void; // Función que recibe un objeto Exercise y no devuelve nada
}

export default function ExerciseItem({ exercise, onDelete, onEdit }: ExerciseItemProps) {
  return (
    <li className="bg-gray-700 p-4 rounded flex justify-between items-start text-white">
      <div>
        <p className="font-semibold text-yellow-400">{exercise.name}</p>
        {exercise.description && <p className="text-sm mt-1">{exercise.description}</p>}
        {exercise.videoUrl && (
          <a
            href={exercise.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-sm underline block mt-1"
          >
            Ver video
          </a>
        )}
      </div>
      <div className="flex flex-col gap-2 items-end">
        <button
          onClick={() => onEdit(exercise)}
          className="text-yellow-400 hover:text-yellow-300 text-sm"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(exercise.id)}
          className="text-red-400 hover:text-red-300 text-sm"
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}
