'use client';

export default function UserList({ users, onEdit, onRefresh }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md overflow-auto">
      <h2 className="text-xl font-bold text-yellow-400 mb-4">Usuarios</h2>
      <table className="w-full text-sm text-left text-white">
        <thead>
          <tr className="text-yellow-300 border-b border-gray-600">
            <th className="p-2">Nombre</th>
            <th className="p-2">Email</th>
            <th className="p-2">DNI</th>
            <th className="p-2">Teléfono</th>
            <th className="p-2">Rol</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.dni}</td>
              <td className="p-2">{user.phone}</td>
              <td className="p-2">
                <span className="px-2 py-1 rounded bg-yellow-500 text-black text-xs font-bold">
                  {user.role}
                </span>
              </td>
              <td className="p-2">
                <button
                  onClick={() => onEdit(user)}
                  className="text-blue-400 hover:underline text-sm"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}