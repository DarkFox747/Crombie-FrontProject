"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export default function DashboardContent() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      {isSignedIn ? (
        <div>
          <p>Bienvenido, {user?.fullName || user?.emailAddresses?.[0]?.emailAddress}</p>
          <UserButton />
        </div>
      ) : (
        <p>No estás autenticado</p>
      )}
    </div>
  );
}
