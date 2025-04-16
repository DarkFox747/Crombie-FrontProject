'use client';
import { useState } from 'react';

export default function ExerciseForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    videoUrl: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', description: '', videoUrl: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-xl text-yellow-400 font-bold mb-4">Crear nuevo ejercicio</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white">Nombre</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white">Descripción</label>
          <input
            name="description"
            type="text"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white">Video (opcional)</label>
          <input
            name="videoUrl"
            type="url"
            value={formData.videoUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
          />
        </div>
        <button type="submit" className="w-full bg-yellow-500 text-gray-900 font-bold py-2 rounded hover:bg-yellow-400">
          Crear Ejercicio
        </button>
      </div>
    </form>
  );
}
