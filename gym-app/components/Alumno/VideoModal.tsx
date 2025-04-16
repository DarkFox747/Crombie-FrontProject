'use client';
import { Dialog } from '@headlessui/react';

function getEmbedUrl(url: string) {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }

  const shortMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  return url;
}

export default function VideoModal({
  open,
  onClose,
  videoUrl,
}: {
  open: boolean;
  onClose: () => void;
  videoUrl: string;
}) {
  if (!videoUrl) return null;

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-gray-900 p-4 rounded-lg w-full max-w-2xl shadow-lg">
          <Dialog.Title className="text-yellow-400 font-bold mb-3 text-lg text-center">
            Video de ejercicio
          </Dialog.Title>

          {/* Aspect-ratio 16:9 */}
          <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-lg">
            <iframe
              src={embedUrl}
              title="Video de ejercicio"
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <button
            onClick={onClose}
            className="mt-4 w-full bg-yellow-500 text-black font-semibold py-2 rounded hover:bg-yellow-400"
          >
            Cerrar
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
