"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa';

export default function RoutinesHeader({ onUserSelect, onSearchChange }) {
  const { userId } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSearchTerm(user.name);
    onUserSelect(user.id);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    onSearchChange(term); // Notificar el cambio de búsqueda
  };

  if (!userId) return <div className="p-4 text-yellow-400">Inicia sesión para gestionar rutinas.</div>;

  return (
    <div className="p-6 bg-gray-800 bg-opacity-80 backdrop-blur-md">
      <h1 className="text-3xl font-bold text-yellow-400 mb-4">Gestión de Rutinas</h1>
      <div className="space-y-4">
        {/* Barra de búsqueda */}
        <div>
          <input
            type="text"
            placeholder="Buscar alumno por nombre o email..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Lista horizontal de usuarios */}
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity min-w-[100px]"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-600">
                {user.profilePictureUrl ? (
                  <Image
                    src={user.profilePictureUrl}
                    alt={user.name}
                    width={40}
                    height={40}
                    objectFit="cover" // Ajustar la imagen al contenedor
                  />
                ) : (
                  <FaUserCircle className="text-yellow-400 text-4xl" />
                )}
              </div>
              <p className="text-sm text-yellow-400 mt-1 text-center">{user.name}</p>
            </div>
          ))}
        </div>

        {/* Filtros por estado */}
        {selectedUser && (
          <div className="flex space-x-4">
            <button
              onClick={() => onUserSelect(selectedUser.id, 'ACTIVE')}
              className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Activas
            </button>
            <button
              onClick={() => onUserSelect(selectedUser.id, 'COMPLETED')}
              className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Completadas
            </button>
            <button
              onClick={() => onUserSelect(selectedUser.id, null)}
              className="bg-gray-700 text-yellow-400 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Todas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}