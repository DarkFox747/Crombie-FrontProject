"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import RoutinesHeader from '../../components/RoutinesPageComponents/RoutinesHeader';
import RoutinesList from '../../components/RoutinesPageComponents/RoutinesList';

export default function Routines() {
  const [routines, setRoutines] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  useEffect(() => {
    fetchRoutines();
  }, [selectedUserId, filterStatus, searchTerm]);

  const fetchRoutines = async () => {
    const params = new URLSearchParams();
    if (selectedUserId) params.append('userId', selectedUserId);
    if (filterStatus) params.append('status', filterStatus);

    const res = await fetch(`/api/routines?${params.toString()}`);
    let data = await res.json();

    // Filtrar por nombre de usuario si hay un término de búsqueda y no hay usuario seleccionado
    if (searchTerm && !selectedUserId) {
      const filteredUserIds = users
        .filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((user) => user.id);
      data = data.filter((routine) => filteredUserIds.includes(routine.userId));
    }

    setRoutines(data);
  };

  const handleUserSelect = (userId, status = null) => {
    setSelectedUserId(userId);
    setFilterStatus(status);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setSelectedUserId(null); // Resetear selección al buscar manualmente
    setFilterStatus(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <Image
        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
        alt="Fondo Gimnasio"
        layout="fill"
        objectFit="cover"
        className="opacity-20 blur-md fixed"
      />
      <div className="relative z-10">
        <RoutinesHeader onUserSelect={handleUserSelect} onSearchChange={handleSearchChange} />
        <RoutinesList routines={routines} />
      </div>
    </div>
  );
}