// components/RoutinesEditComponents/RoutineEditor.tsx
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import RoutineGrid from './RoutineGrid';
import { RoutineHistory } from '@prisma/client';
import { Exercise } from '@prisma/client';
import { RoutineExercise } from '@prisma/client';

export default function RoutineEditor({ routineId }: { routineId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [routine, setRoutine] = useState<RoutineHistory &{routineExercises:RoutineExercise[]}|null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const exercisesRes = await fetch('/api/exercises');
        const exercisesData = await exercisesRes.json();
        setExercises(exercisesData);

        if (routineId === 'new') {
          setRoutine({
            id: 'new',
            userId: userId || '',
            startDate: new Date(),
            endDate: null,
            status: 'ACTIVE',
            routineExercises: [],
          });
        } else {
          const routineRes = await fetch(`/api/routines/${routineId}`);
          const routineData = await routineRes.json();
          setRoutine(routineData);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [routineId, userId]);

  const handleSave = async (routineExercises: RoutineExercise) => {
    try {
      const url = routineId === 'new' ? '/api/routines' : `/api/routines/${routineId}`;
      const method = routineId === 'new' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          startDate: routine!.startDate!,
          endDate: routine?.endDate || null,
          status: routine!.status || 'ACTIVE',
          routineExercises,
        }),
      });

      if (response.ok) {
        router.push('/routines');
      }
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleComplete = async () => {
    try {
      const response = await fetch(`/api/routines/${routineId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...routine,
          status: 'COMPLETED',
          routineExercises: routine?.routineExercises || [],
        }),
      });

      if (response.ok) {
        router.push('/routines');
      } else {
        console.error('No se pudo completar la rutina');
      }
    } catch (error) {
      console.error('Error al completar rutina:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <RoutineGrid routine={routine} exercises={exercises} onSave={handleSave} />
      {routine?.status !== 'COMPLETED' && (
        <div className="mt-6 text-right">
          <button
            onClick={handleComplete}
            className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded"
          >
            Marcar como completada
          </button>
        </div>
      )}
    </div>
  );
}
