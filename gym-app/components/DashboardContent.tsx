"use client"; // Marca como Client Component

import { UserButton, useUser } from '@clerk/nextjs';

export default function DashboardContent() {
  const { user, isSignedIn } = useUser();

  return (
    <div>
      {isSignedIn ? (
        <div>
          <p>Bienvenido, {user?.fullName || user?.emailAddresses[0].emailAddress}</p>
          <UserButton />
        </div>
      ) : (
        <p>No estás autenticado</p>
      )}
    </div>
  );
}