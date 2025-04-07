"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import ProfileHeader from '../../components/ProfileHeader';
import ProfileForm from '../../components/ProfileForm';

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

  if (!userId) return <div className="p-4">Inicia sesión para ver tu perfil.</div>;
  if (!user) return <div className="p-4">Cargando...</div>;

  const isProfessor = user.role === 'PROFESSOR' || user.role === 'ADMIN';
  const isAdmin = user.role === 'ADMIN';

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Perfil</h1>
      <ProfileHeader user={user} onUpload={handleUpload} />
      <ProfileForm user={user} isProfessor={isProfessor} isAdmin={isAdmin} onSubmit={handleSubmit} />
      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </div>
  );
}