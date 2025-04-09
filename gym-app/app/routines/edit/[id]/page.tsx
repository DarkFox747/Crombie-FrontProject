"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import RoutineGrid from '../../../../components/RoutinesEditComponents/RoutineGrid';

export default function EditRoutine() {
  const { userId } = useAuth();
  const { id } = useParams();
  const [routine, setRoutine] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetchRoutine();
      fetchExercises();
    }
  }, [id]);

  const fetchRoutine = async () => {
    const res = await fetch(`/api/routines/${id}`);
    const data = await res.json();
    setRoutine(data);
  };

  const fetchExercises = async () => {
    const res = await fetch('/api/exercises');
    const data = await res.json();
    setExercises(data);
  };

  const handleSave = async (updatedRoutineExercises) => {
    const res = await fetch(`/api/routines/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate: routine.startDate,
        endDate: routine.endDate,
        status: routine.status,
        routineExercises: updatedRoutineExercises,
      }),
    });
    if (res.ok) {
      setMessage('Rutina actualizada');
      fetchRoutine();
    } else {
      setMessage('Error al actualizar');
    }
  };

  if (!userId) return <div className="p-4 text-yellow-400">Inicia sesión para editar.</div>;
  if (!routine) return <div className="p-4 text-yellow-400">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <Image
        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
        alt="Fondo Gimnasio"
        layout="fill"
        objectFit="cover"
        className="opacity-20 blur-md fixed"
      />
      <div className="relative z-10 p-6">
        <h1 className="text-3xl font-bold text-yellow-400 mb-4">Editar Rutina #{id}</h1>
        <RoutineGrid routine={routine} exercises={exercises} onSave={handleSave} />
        {message && <p className="mt-4 text-sm text-yellow-400">{message}</p>}
      </div>
    </div>
  );
}