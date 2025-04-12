// app/routines/edit/[id]/page.tsx
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import RoutineGrid from '@/components/RoutinesEditComponents/RoutineGrid';

export default function RoutineEditor({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [routine, setRoutine] = useState<any>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Usamos use() para unwrap params
  
  const routineId = params.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar ejercicios
        const exercisesRes = await fetch('/api/exercises');
        const exercisesData = await exercisesRes.json();
        setExercises(exercisesData);

        if (routineId === 'new') {
          setRoutine({
            id: 'new',
            userId,
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
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
  }, [routineId, userId]); // Usamos routineId en lugar de params.id

  const handleSave = async (routineExercises: any) => {
    try {
      const url = routineId === 'new' ? '/api/routines' : `/api/routines/${routineId}`;
      const method = routineId === 'new' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          startDate: routine.startDate,
          endDate: routine.endDate || null,
          status: routine.status || 'ACTIVE',
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <RoutineGrid 
        routine={routine} 
        exercises={exercises} 
        onSave={handleSave} 
      />
    </div>
  );
}