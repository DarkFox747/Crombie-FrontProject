'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import RoutineViewer from '@/components/Alumno/RoutineViewer';

export default function AlumnoPage() {
  const { userId } = useAuth();
  const [routine, setRoutine] = useState(null);

  useEffect(() => {
    const fetchRoutine = async () => {
      const res = await fetch(`/api/alumno/routine`);
      const data = await res.json();
      setRoutine(data);
    };

    if (userId) fetchRoutine();
  }, [userId]);

  if (!userId) return <div className="text-white p-4">Iniciá sesión para ver tu rutina</div>;
  if (!routine) return <div className="text-white p-4">Cargando rutina...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6 text-center">Mi Rutina</h1>
      <RoutineViewer routine={routine} />
    </div>
  );
}
