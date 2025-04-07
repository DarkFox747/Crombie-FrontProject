    "use client";
import { useState } from 'react';

export default function ProfileForm({ user, isProfessor, isAdmin, onSubmit }) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    dni: user.dni || '',
    phone: user.phone || '',
    role: user.role,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
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
        <label className="block text-sm font-medium">Teléfono</label>
        <input
          type="text"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>
      {isProfessor && (
        <div>
          <label className="block text-sm font-medium">Rol</label>
          {isAdmin ? (
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="ALUMNO">Alumno</option>
              <option value="PROFESSOR">Profesor</option>
              <option value="ADMIN">Admin</option>
            </select>
          ) : (
            <input
              type="text"
              value={formData.role}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          )}
        </div>
      )}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Guardar
      </button>
    </form>
  );
}