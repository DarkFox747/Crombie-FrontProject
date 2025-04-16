'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import RoutineViewer from '@/components/Alumno/RoutineViewer';
import LoadingSpinner from '@/components/Alumno/LoadingSpinner';

export default function AlumnoPage() {
  const { isLoaded, userId } = useAuth();
  const [routine, setRoutine] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const res = await fetch(`/api/alumno/routine`);
        if (!res.ok) {
          throw new Error(res.status === 404 ? 'No tienes una rutina asignada' : 'Error al cargar la rutina');
        }
        const data = await res.json();
        setRoutine(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (isLoaded && userId) fetchRoutine();
  }, [isLoaded, userId]);

  if (!isLoaded) return <LoadingSpinner />;
  if (!userId) return <div className="text-white p-4 text-center">Iniciá sesión para ver tu rutina</div>;
  if (error) return <div className="text-white p-4 text-center ">{error}</div>;
  if (!routine) return <LoadingSpinner />;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-900 text-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-6 text-center">
          Mi Rutina Personalizada
        </h1>
        <RoutineViewer routine={routine} />
      </div>
    </div>
  );
}