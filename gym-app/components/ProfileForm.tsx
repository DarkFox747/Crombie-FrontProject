'use client';
import { User } from '@prisma/client';
import { useState } from 'react';

export interface ProfileFormData {  
  name: string;
  email: string;
  dni: string;
  phone: string;
  role: string;
}

export default function ProfileForm({ user, isAdmin, isProfessor, onSubmit }:{user:User, isAdmin:boolean, isProfessor:boolean, onSubmit:(formData:ProfileFormData) => void}) {
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user.name || '',
    email: user.email || '',
    dni: user.dni || '',
    phone: user.phone || '',
    role: user.role || 'ALUMNO',
  });

  //eslint-disable-next-line
  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  //eslint-disable-next-line
  const handleSubmit = (e:any) => {
    e.preventDefault();    
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 text-white"
    >
      <div>
        <label className="block text-sm mb-1">Nombre</label>
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">DNI</label>
        <input
          name="dni"
          type="text"
          value={formData.dni}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Teléfono</label>
        <input
          name="phone"
          type="text"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Rol</label>
        {isAdmin || isProfessor ? (
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
          >
            <option value="ALUMNO">ALUMNO</option>
            <option value="PROFESSOR">PROFESSOR</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        ) : (
          <span className="inline-block px-3 py-1 bg-yellow-500 text-black font-semibold rounded">
            {formData.role}
          </span>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded"
        >
          Guardar cambios
        </button>
      </div>
    </form>
  );
}
