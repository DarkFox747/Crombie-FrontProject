"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useParams } from 'next/navigation';

export default function EditRoutine() {
  const { userId } = useAuth();
  const { id } = useParams();
  const [routine, setRoutine] = useState(null);
  const [formData, setFormData] = useState({ userId: '', startDate: '', endDate: '', status: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) fetchRoutine();
  }, [id]);

  const fetchRoutine = async () => {
    const res = await fetch(`/api/routines/${id}`);
    const data = await res.json();
    setRoutine(data);
    setFormData({
      userId: data.userId,
      startDate: new Date(data.startDate).toISOString().split('T')[0],
      endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
      status: data.status,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/routines/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setMessage('Rutina actualizada');
      fetchRoutine();
    } else {
      setMessage('Error al actualizar');
    }
  };

  if (!userId) return <div className="p-4">Inicia sesión para editar.</div>;
  if (!routine) return <div className="p-4">Cargando...</div>;

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Editar Rutina</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium">Usuario ID</label>
          <input
            type="text"
            value={formData.userId}
            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Fecha de Inicio</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Fecha de Fin</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Estado</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="ACTIVE">Activa</option>
            <option value="COMPLETED">Completada</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Guardar
        </button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  );
}