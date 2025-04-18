// app/routines/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import RoutinesHeader from '../../components/RoutinesPageComponents/RoutinesHeader';
import RoutinesList from '../../components/RoutinesPageComponents/RoutinesList';
import CreateRoutineModal from '../../components/RoutinesPageComponents/CreateRoutineModal';
import { RoutineHistory, User } from '@prisma/client';

export default function Routines() {
  const [routines, setRoutines] = useState<RoutineHistory[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string|null>(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRoutines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId, filterStatus, searchTerm]);

  const fetchRoutines = async () => {
    const params = new URLSearchParams();
    if (selectedUserId) params.append('userId', selectedUserId);
    if (filterStatus) params.append('status', filterStatus);

    const res = await fetch(`/api/routines?${params.toString()}`);
    let data = await res.json();

    if (searchTerm && !selectedUserId) {
      // Primero buscamos usuarios que coincidan
      const usersRes = await fetch(`/api/users?search=${encodeURIComponent(searchTerm)}`);
      const users = await usersRes.json();
      const filteredUserIds = users.map((user:User) => user.id);
      data = data.filter((routine:RoutineHistory) => filteredUserIds.includes(routine.userId));
    }

    setRoutines(data);
  };

  const handleUserSelect = (userId:string, status = null) => {
    setSelectedUserId(userId);
    setFilterStatus(status);
  };

  const handleSearchChange = (term:string) => {
    setSearchTerm(term);
    setSelectedUserId(null);
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
      <div className="relative z-10 pb-20">
        <RoutinesHeader onUserSelect={handleUserSelect} onSearchChange={handleSearchChange} />
        <RoutinesList routines={routines} />
        <CreateRoutineModal />
      </div>
    </div>
  );
}