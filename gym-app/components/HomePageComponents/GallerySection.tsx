// components/HomePageComponents/GallerySection.tsx
"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function GallerySection() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const galleryImages = [
    {
      src: 'https://storage.googleapis.com/gym-app-profile-pics/gimFondo.png?q=80&w=2070&auto=format&fit=crop',
      caption: 'Sesiones personalizadas'
    },
    {
      src: 'https://storage.googleapis.com/gym-app-profile-pics/bicis.jpg?q=80&w=2070&auto=format&fit=crop',
      caption: 'Entrenamiento en grupo'
    },
    {
      src: 'https://storage.googleapis.com/gym-app-profile-pics/gim3.jpg?q=80&w=2070&auto=format&fit=crop',
      caption: 'Instalaciones equipadas'
    },
    
  ];

  return (
    <section className="py-16 px-4 md:px-16 bg-gray-800" id="gallery">
      <h2 className="text-4xl font-bold text-center mb-12">Nuestro Espacio</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {galleryImages.map((img, index) => (
          <motion.div
            key={index}
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            whileHover={{ scale: 1.03 }}
            className="overflow-hidden rounded-lg bg-gray-700"
          >
            <div className="h-64 relative">
              <Image 
                src={img.src} 
                alt={img.caption} 
                layout="fill"
                objectFit="cover"
              />
            </div>
            <p className="p-4 text-center">{img.caption}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}