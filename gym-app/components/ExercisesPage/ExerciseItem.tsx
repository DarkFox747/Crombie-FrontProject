'use client';

export default function ExerciseItem({ exercise, onDelete, onEdit }) {
  return (
    <li className="bg-gray-700 p-4 rounded flex justify-between items-start text-white">
      <div>
        <p className="font-semibold text-yellow-400">{exercise.name}</p>
        {exercise.description && <p className="text-sm mt-1">{exercise.description}</p>}
        {exercise.videoUrl && (
          <a href={exercise.videoUrl} target="_blank" className="text-blue-400 text-sm underline block mt-1">
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
