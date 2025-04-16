'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import ExerciseForm from '@/components/ExercisesPage/ExerciseForm';
import ExerciseList from '@/components/ExercisesPage/ExerciseList';
import EditExerciseModal from '@/components/ExercisesPage/EditExerciseModal';

export default function Exercises() {
  const { userId } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    const res = await fetch('/api/exercises');
    const data = await res.json();
    setExercises(data);
  };

  const handleSubmit = async (formData) => {
    const res = await fetch('/api/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setMessage('Ejercicio creado');
      fetchExercises();
    } else {
      setMessage('Error al crear');
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/exercises/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMessage('Ejercicio eliminado');
      fetchExercises();
    } else {
      setMessage('Error al eliminar');
    }
  };

  const handleEditSave = async (data) => {
    const res = await fetch(`/api/exercises/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setEditing(null);
      fetchExercises();
    } else {
      alert('Error al editar');
    }
  };

  if (!userId) return <div className="p-4 text-white">Inicia sesión para ver ejercicios.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">Gestión de Ejercicios</h1>
      <ExerciseForm onSubmit={handleSubmit} />
      {message && <p className="text-sm text-green-400 mt-2">{message}</p>}
      <ExerciseList exercises={exercises} onDelete={handleDelete} onEdit={setEditing} />
      <EditExerciseModal
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        exercise={editing}
        onSave={handleEditSave}
      />
    </div>
  );
}
