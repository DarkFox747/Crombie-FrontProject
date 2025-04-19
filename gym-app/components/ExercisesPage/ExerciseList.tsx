'use client';
import { useState, useMemo } from 'react';
import ExerciseItem from './ExerciseItem';
import { Exercise } from '@prisma/client';

// Define las props del componente
interface ExerciseListProps {
  exercises: Exercise[]; // Un array de objetos de tipo Exercise
  onDelete: (id: string) => void; // Función que recibe un ID y no devuelve nada
  onEdit: (exercise: Exercise) => void; // Función que recibe un objeto Exercise y no devuelve nada
}

export default function ExerciseList({ exercises, onDelete, onEdit }: ExerciseListProps) {
  const [search, setSearch] = useState<string>(''); // Estado para la búsqueda
  const [currentPage, setCurrentPage] = useState<number>(1); // Estado para la página actual
  const itemsPerPage = 5;

  // Filtrar los ejercicios según la búsqueda
  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) =>
      ex.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, exercises]);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredExercises.length / itemsPerPage);

  // Obtener los ejercicios paginados
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
          setCurrentPage(1); // Reiniciar a la primera página al buscar
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
