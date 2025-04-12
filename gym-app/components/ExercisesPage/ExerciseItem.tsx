'use client';
export default function ExerciseItem({ exercise, onDelete }) {
  return (
    <li className="bg-gray-700 p-4 rounded-lg shadow flex justify-between items-start text-white">
      <div>
        <p className="font-semibold text-yellow-400">{exercise.name}</p>
        {exercise.description && <p className="text-sm mt-1">{exercise.description}</p>}
        {exercise.videoUrl && (
          <a href={exercise.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm underline mt-1 block">
            Ver video
          </a>
        )}
      </div>
      <button
        onClick={() => onDelete(exercise.id)}
        className="text-red-400 hover:text-red-300 text-sm font-semibold"
      >
        Eliminar
      </button>
    </li>
  );
}
