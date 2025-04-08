"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function GallerySection() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const galleryImages = [
    'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1549060279-7e168f26a569?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
  ];

  return (
    <section className="py-16 px-4 md:px-16 bg-gray-800">
      <h2 className="text-4xl font-bold text-center mb-12">Galería</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {galleryImages.map((img, index) => (
          <motion.div
            key={index}
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            whileHover={{ scale: 1.1 }}
            className="overflow-hidden rounded-lg"
          >
            <Image src={img} alt={`Galería ${index + 1}`} width={400} height={300} className="w-full" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}