"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import ProfileForm from '../../components/ProfilePage/ProfileForm';
import Image from 'next/image';

export default function Profile() {
  const { userId } = useAuth();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (userId) fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    const res = await fetch(`/api/users/${userId}`);
    const data = await res.json();
    setUser(data);
  };

  const handleSubmit = async (formData) => {
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

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload-profile-pic', {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      setMessage('Foto subida');
      fetchUser();
    } else {
      setMessage('Error al subir foto');
    }
  };

  if (!userId) return <div className="p-4 text-white">Inicia sesión para ver tu perfil.</div>;
  if (!user) return <div className="p-4 text-white">Cargando...</div>;

  const isProfessor = user.role === 'PROFESSOR' || user.role === 'ADMIN';
  const isAdmin = user.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-start py-10 px-4">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">Mi Perfil</h1>

      {/* Imagen de perfil */}
      <div className="flex flex-col items-center mb-8">
        {user.profilePictureUrl ? (
          <Image
            src={user.profilePictureUrl}
            alt="Foto de perfil"
            width={120}
            height={120}
            className="rounded-full object-cover border-4 border-yellow-500"
          />
        ) : (
          <div className="w-28 h-28 bg-gray-700 rounded-full flex items-center justify-center border-4 border-yellow-500 text-4xl text-yellow-400 font-bold">
            {user.name?.charAt(0).toUpperCase() || "?"}
          </div>
        )}

        <label className="mt-4 text-sm font-medium cursor-pointer text-yellow-400 hover:underline">
          Cambiar foto
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Formulario de perfil */}
      <div className="w-full max-w-xl bg-gray-800 p-6 rounded-xl shadow">
        <ProfileForm
          user={user}
          isProfessor={isProfessor}
          isAdmin={isAdmin}
          onSubmit={handleSubmit}
        />
        {message && (
          <p className="mt-4 text-sm text-green-400 font-medium text-center">{message}</p>
        )}
      </div>
    </div>
  );
}
