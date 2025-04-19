'use client';
import { Dialog } from '@headlessui/react';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Exercise } from '@prisma/client';

interface EditExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Partial<Exercise> | null; // Puede ser un ejercicio parcial o null
  onSave: (exercise: Partial<Exercise>) => Promise<void>; // onSave recibe un ejercicio parcial y devuelve una promesa
}

export default function EditExerciseModal({
  isOpen,
  onClose,
  exercise,
  onSave,
}: EditExerciseModalProps) {
  const [form, setForm] = useState<Partial<Exercise>>(exercise || {});

  useEffect(() => {
    setForm(exercise || {});
  }, [exercise]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-yellow-400 text-lg font-semibold mb-4">Editar ejercicio</Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white text-sm">Nombre</label>
              <input
                name="name"
                value={form.name || ''}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              />
            </div>
            <div>
              <label className="text-white text-sm">Descripción</label>
              <input
                name="description"
                value={form.description || ''}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              />
            </div>
            <div>
              <label className="text-white text-sm">Video</label>
              <input
                name="videoUrl"
                value={form.videoUrl || ''}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              />
            </div>
            <div className="text-right">
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
