"use client";
import Image from 'next/image';
import { useRef } from 'react';

export default function ProfileHeader({ user, onUpload }) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click(); 
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
        <div className="mt-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors">
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