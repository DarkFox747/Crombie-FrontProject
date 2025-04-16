'use client';
import { useEffect, useState } from 'react';
import UserForm from '@/components/Admin/UserForm';
import UserList from '@/components/Admin/UserList';
import SyncButton from '@/components/SyncButton';

export default function DashboardPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-6">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">Panel de Administración</h1>

      <SyncButton  />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <UserForm user={selectedUser} onSaved={() => {
          fetchUsers();
          setSelectedUser(null);
        }} />
        <UserList users={users} onEdit={setSelectedUser} onRefresh={fetchUsers} />
      </div>
    </div>
  );
}
