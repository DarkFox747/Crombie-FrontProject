"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';

export default function Routines() {
  const { userId } = useAuth();
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    const res = await fetch('/api/routines');
    const data = await res.json();
    setRoutines(data);
  };

  if (!userId) return <div className="p-4">Inicia sesión para ver las rutinas.</div>;

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Rutinas</h1>
      {routines.length === 0 ? (
        <p>No hay rutinas disponibles.</p>
      ) : (
        <ul className="space-y-4">
          {routines.map((routine) => (
            <li key={routine.id} className="border p-4 rounded">
              <div className="flex justify-between">
                <div>
                  <strong>Usuario ID: {routine.userId}</strong>
                  <p>Inicio: {new Date(routine.startDate).toLocaleDateString()}</p>
                  <p>Estado: {routine.status}</p>
                </div>
                <Link href={`/routines/edit/${routine.id}`} className="text-blue-500 hover:underline">
                  Editar
                </Link>
              </div>
              <ul className="mt-2 space-y-1">
                {routine.routineExercises.map((re) => (
                  <li key={re.id}>
                    {re.exercise.name} ({re.dayOfWeek}): {re.sets} series x {re.reps} reps
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}