'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import RoutineViewer from '@/components/Alumno/RoutineViewer';
import LoadingSpinner from '@/components/Alumno/LoadingSpinner';

export default function AlumnoPage() {
  const { isLoaded, userId } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [hasRoutines, setHasRoutines] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/alumno/routine`);
        if (!res.ok) {
          throw new Error('Error al cargar las rutinas');
        }
        const data = await res.json();
        setRoutines(data.routines || []);
        setHasRoutines(data.hasRoutines);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && userId) fetchRoutines();
  }, [isLoaded, userId]);

  if (!isLoaded || loading) return <LoadingSpinner />;
  if (!userId) return <div className="text-white p-4 text-center">Iniciá sesión para ver tu rutina</div>;
  if (error) return <div className="text-white p-4 text-center ">{error}</div>;
  
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-900 text-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-6 text-center">
          Mi Rutina Personalizada
        </h1>
        
        {!hasRoutines ? (
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-3">No tienes ninguna rutina asignada</h2>
            <p className="text-gray-300">Contacta con tu profesor para que te asigne una rutina personalizada.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {routines.map((routine, index) => (
              <div key={routine.id} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    {routine.status === 'ACTIVE' ? 'Rutina Activa' : 
                     routine.status === 'PLANNED' ? 'Rutina Planificada' : 
                     'Rutina Completada'}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${routine.status === 'ACTIVE' ? 'bg-green-500 text-white' : 
                      routine.status === 'PLANNED' ? 'bg-blue-500 text-white' : 
                      'bg-gray-500 text-white'}`}>
                    {routine.status === 'ACTIVE' ? 'Activa' : 
                     routine.status === 'PLANNED' ? 'Planificada' : 
                     'Completada'}
                  </span>
                </div>
                <RoutineViewer 
                  routine={routine} 
                  isEditable={routine.status === 'ACTIVE'} 
                />
                {index < routines.length - 1 && <hr className="border-gray-700 my-8" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}