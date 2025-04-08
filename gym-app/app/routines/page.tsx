"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import RoutinesHeader from '../../components/RoutinesPageComponents/RoutinesHeader';
import RoutinesList from '../../components/RoutinesPageComponents/RoutinesList';

export default function Routines() {
  const [routines, setRoutines] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);

  useEffect(() => {
    fetchRoutines();
  }, [selectedUserId, filterStatus]);

  const fetchRoutines = async () => {
    const params = new URLSearchParams();
    if (selectedUserId) params.append('userId', selectedUserId);
    if (filterStatus) params.append('status', filterStatus);

    const res = await fetch(`/api/routines?${params.toString()}`);
    const data = await res.json();
    setRoutines(data);
  };

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    setFilterStatus(null); // Resetear filtro al cambiar usuario
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Fondo desenfocado */}
      <Image
        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
        alt="Fondo Gimnasio"
        layout="fill"
        objectFit="cover"
        className="opacity-20 blur-md fixed"
      />
      <div className="relative z-10">
        <RoutinesHeader onUserSelect={handleUserSelect} onFilterChange={handleFilterChange} />
        <RoutinesList routines={routines} />
      </div>
    </div>
  );
}