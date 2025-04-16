'use client';
import { useState, useMemo } from 'react';
import ExerciseItem from './ExerciseItem';

export default function ExerciseList({ exercises, onDelete, onEdit }) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) =>
      ex.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, exercises]);

  const totalPages = Math.ceil(filteredExercises.length / itemsPerPage);
  const paginated = filteredExercises.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mt-8 max-w-3xl mx-auto w-full">
      <input
        type="text"
        placeholder="Buscar ejercicio..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full mb-4 p-2 rounded bg-gray-700 border border-gray-600 text-white"
      />
      {paginated.length === 0 ? (
        <p className="text-gray-400">No se encontraron ejercicios.</p>
      ) : (
        <ul className="space-y-3">
          {paginated.map((ex) => (
            <ExerciseItem key={ex.id} exercise={ex} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                i + 1 === currentPage
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-600 text-white hover:bg-gray-500'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
