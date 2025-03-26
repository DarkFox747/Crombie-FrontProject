"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

export default function Profile() {
  const { userId } = useAuth();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', dni: '', role: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    const res = await fetch(`/api/users/${userId}`);
    const data = await res.json();
    setUser(data);
    setFormData({ name: data.name, email: data.email, dni: data.dni, role: data.role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setMessage('Perfil actualizado');
      fetchUser();
    } else {
      setMessage('Error al actualizar');
    }
  };

  if (!userId) return <div className="p-4">Inicia sesión para ver tu perfil.</div>;
  if (!user) return <div className="p-4">Cargando...</div>;

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
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
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">DNI</label>
          <input
            type="text"
            value={formData.dni}
            onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Rol</label>
          <input
            type="text"
            value={formData.role}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Guardar
        </button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  );
}