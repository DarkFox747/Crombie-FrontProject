// components/RoutinesPageComponents/RoutinesList.tsx
"use client";
import { useState, useEffect } from "react";
import RoutineCard from "./RoutineCard";
import { RoutineHistory, RoutineExercise, Exercise, User } from "@prisma/client";

// Define el tipo extendido para las rutinas
type RoutineWithExercises = RoutineHistory & {
  routineExercises: (RoutineExercise & {
    exercise: Exercise;
  })[];
};

// Define las props del componente
interface RoutinesListProps {
  routines: RoutineWithExercises[]; // Rutinas con relaciones extendidas
  pageSize?: number; // Tamaño de página opcional
}

export default function RoutinesList({ routines, pageSize = 6 }: RoutinesListProps) {
  const [users, setUsers] = useState<User[]>([]); // Estado para los usuarios
  const [currentPage, setCurrentPage] = useState<number>(1); // Estado para la página actual

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data: User[]) => setUsers(data));
  }, []);

  if (!routines || routines.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-yellow-400">No hay rutinas para mostrar.</p>
        <p className="text-gray-400 mt-2">Selecciona un alumno o crea una nueva rutina.</p>
      </div>
    );
  }

  const getUserName = (userId: string): string => {
    const user = users.find((u) => u.id === userId);
    return user?.name ?? "Usuario desconocido"; // Manejo seguro de valores opcionales
  };

  // Ordenar rutinas: activas primero, luego planificadas y finalmente completadas
  const sortedRoutines = [...routines].sort((a, b) => {
    if (a.status === "ACTIVE") return -1;
    if (b.status === "ACTIVE") return 1;
    if (a.status === "PLANNED") return -1;
    if (b.status === "PLANNED") return 1;
    return 0;
  });

  const totalPages = Math.ceil(sortedRoutines.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRoutines = sortedRoutines.slice(startIndex, startIndex + pageSize);

  const PaginationButtons = () => (
    <div className="flex justify-center space-x-4 mt-4">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg disabled:bg-gray-600 disabled:text-gray-400"
      >
        Anterior
      </button>
      <span className="text-yellow-400">
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg disabled:bg-gray-600 disabled:text-gray-400"
      >
        Siguiente
      </button>
    </div>
  );

  return (
    <div className="p-6">
      <PaginationButtons />
      <div className="space-y-4 mt-4">
        {paginatedRoutines.map((routine) => (
          <RoutineCard key={routine.id} routine={routine} userName={getUserName(routine.userId)} />
        ))}
      </div>
      <PaginationButtons />
    </div>
  );
}