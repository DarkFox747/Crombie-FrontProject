"use client";
import { useState, useEffect } from 'react';
import RoutineCard from './RoutineCard';

export default function RoutinesList({ routines }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  if (!routines || routines.length === 0) {
    return <p className="p-6 text-yellow-400">No hay rutinas para mostrar.</p>;
  }

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : 'Usuario desconocido';
  };

  return (
    <div className="p-6 space-y-4">
      {routines.map((routine) => (
        <RoutineCard key={routine.id} routine={routine} userName={getUserName(routine.userId)} />
      ))}
    </div>
  );
}