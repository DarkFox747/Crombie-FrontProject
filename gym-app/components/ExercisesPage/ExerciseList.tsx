'use client';
import ExerciseItem from './ExerciseItem';

export default function ExerciseList({ exercises, onDelete }) {
  if (exercises.length === 0) {
    return <p className="text-gray-400 mt-4">No hay ejercicios cargados.</p>;
  }

  return (
    <ul className="space-y-3 mt-6">
      {exercises.map((exercise) => (
        <ExerciseItem key={exercise.id} exercise={exercise} onDelete={onDelete} />
      ))}
    </ul>
  );
}
