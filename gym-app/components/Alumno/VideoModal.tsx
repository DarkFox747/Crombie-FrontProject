'use client';
import { Dialog } from '@headlessui/react';

export default function VideoModal({ open, onClose, videoUrl }) {
  if (!videoUrl) return null;

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-gray-900 p-4 rounded-lg max-w-lg w-full shadow-lg">
          <Dialog.Title className="text-yellow-400 font-bold mb-3 text-lg">Video de ejercicio</Dialog.Title>
          <div className="aspect-video w-full">
            <iframe
              src={videoUrl}
              title="Video de ejercicio"
              className="w-full h-full rounded"
              allowFullScreen
            />
          </div>
          <button onClick={onClose} className="mt-4 w-full bg-yellow-500 text-black font-semibold py-2 rounded hover:bg-yellow-400">
            Cerrar
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
