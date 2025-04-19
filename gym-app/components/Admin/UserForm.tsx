'use client';
import { useState, useEffect } from 'react';
import { User } from '@prisma/client';

interface UserFormProps {
  user: User | null;
  onSaved: () => void;
}


export default function UserForm({ user, onSaved }: UserFormProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    dni: '',
    phone: '',
    role: 'ALUMNO',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        dni: user.dni || '',
        phone: user.phone || '',
        role: user.role || 'ALUMNO',
      });
    } else {
      setFormData({ name: '', email: '', dni: '', phone: '', role: 'ALUMNO' });
    }
  }, [user]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = user ? 'PUT' : 'POST';
    const endpoint = user ? `/api/users/${user.id}` : `/api/users`;

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) onSaved();
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-yellow-400 mb-4">
        {user ? 'Editar Usuario' : 'Crear Usuario'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {['name', 'email', 'dni', 'phone'].map((field) => (
          <div key={field}>
            <label className="block text-sm text-white mb-1">{field.toUpperCase()}</label>
            <input
              name={field}
              value={String(formData[field as keyof User] || '')} 
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            />
          </div>
        ))}
        <div>
          <label className="block text-sm text-white mb-1">ROL</label>
          <select
            name="role"
            value={formData.role || 'ALUMNO'} 
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
          >
            <option value="ALUMNO">ALUMNO</option>
            <option value="PROFESSOR">PROFESSOR</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded"
        >
          {user ? 'Guardar Cambios' : 'Crear Usuario'}
        </button>
      </form>
    </div>
  );
}
