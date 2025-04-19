"use client";
import Image from "next/image";
import { useRef } from "react";
import { User } from "@prisma/client";

interface ProfileHeaderProps {
  user: User; // Usamos la interfaz User de Prisma
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void; // Función para manejar la carga de archivos
}

export default function ProfileHeader({ user, onUpload }: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref para el input de archivo

  const handleButtonClick = () => {
    fileInputRef.current?.click(); // Asegurarse de que el ref no sea null antes de llamar a click()
  };

  return (
    <div className="flex items-center space-x-4 mb-6">
      {user.profilePictureUrl ? (
        <Image
          src={user.profilePictureUrl}
          alt="Foto de perfil"
          width={100}
          height={100}
          className="rounded-full"
        />
      ) : (
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
          Sin foto
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <div className="mt-2">
          <button
            type="button"
            onClick={handleButtonClick}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Cargar Foto
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}