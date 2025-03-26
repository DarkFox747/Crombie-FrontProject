"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

export default function Exercises() {
  const { userId } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    const res = await fetch('/api/exercises');
    const data = await res.json();
    setExercises(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setMessage('Ejercicio creado');
      setFormData({ name: '', description: '' });
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

  if (!userId) return <div className="p-4">Inicia sesión para ver ejercicios.</div>;

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Ejercicios</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mb-6">
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Descripción</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Crear Ejercicio
        </button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </form>

      <ul className="space-y-4">
        {exercises.map((exercise) => (
          <li key={exercise.id} className="border p-4 rounded flex justify-between">
            <div>
              <strong>{exercise.name}</strong>
              <p>{exercise.description}</p>
            </div>
            <button
              onClick={() => handleDelete(exercise.id)}
              className="text-red-500 hover:underline"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}