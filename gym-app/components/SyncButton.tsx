"use client";
import { useState } from 'react';
import { clerkClient } from '@clerk/nextjs/server';


export default function SyncButton() {
  const [status, setStatus] = useState<string>('');

  const handleSync = async () => {
    setStatus('Sincronizando...');
    try {
      // Llamar a una API personalizada para realizar la sincronización
      const response = await fetch('/api/sync-users', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Error al sincronizar usuarios');
      }

      const result = await response.json();
      setStatus(`Sincronización completada: ${result.message}`);
    } catch (error) {
      console.error('Error en SyncButton:', error);
      setStatus('Error al sincronizar');
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={handleSync}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Sincronizar Usuarios
      </button>
      {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}
    </div>
  );
}