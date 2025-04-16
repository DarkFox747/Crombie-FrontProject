'use client';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import Link from 'next/link';
import { FaSearch, FaUserCircle, FaTimes } from 'react-icons/fa';
import Image from 'next/image';

export default function CreateRoutineModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => {
    setIsOpen(true);
    fetchUsers();
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <button
        onClick={openModal}
        className="fixed bottom-6 right-6 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-full shadow-lg transition-colors z-20 flex items-center gap-2"
      >
        <span className="text-xl">+</span>
        <span className="hidden sm:inline">Nueva Rutina</span>
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-30">
        <div className="fixed inset-0 bg-black bg-opacity-70" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative bg-gray-800 rounded-lg max-w-md w-full mx-auto p-6 border border-yellow-500">
            <div className="absolute top-4 right-4">
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <FaTimes size={24} />
              </button>
            </div>

            <Dialog.Title className="text-2xl font-bold text-yellow-400 mb-4">
              Crear Nueva Rutina
            </Dialog.Title>

            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar alumno por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <p className="text-gray-400 text-center py-4">
                  {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios disponibles'}
                </p>
              ) : (
                <ul className="space-y-2">
                  {filteredUsers.map((user) => (
                    <li key={user.id}>
                      <Link
                        href={{
                          pathname: '/routines/edit/new',
                          query: { userId: user.id },
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex-shrink-0">
                          {user.profilePictureUrl ? (
                            <Image
                              src={user.profilePictureUrl}
                              alt={user.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <FaUserCircle className="text-yellow-400 text-3xl" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
