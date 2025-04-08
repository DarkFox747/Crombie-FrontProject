"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="relative h-screen flex items-center justify-center">
      <Image
        src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop"
        alt="Gimnasio Hero"
        layout="fill"
        objectFit="cover"
        className="opacity-70"
      />
      <div className="absolute text-center z-10">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-5xl md:text-7xl font-bold mb-4"
        >
          ¡Transforma tu cuerpo hoy!
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl mb-6"
        >
          Únete al mejor gimnasio de la ciudad.
        </motion.p>
        <motion.button
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
          className="bg-red-600 text-white px-6 py-3 rounded-full text-lg hover:bg-red-700 transition-colors"
        >
          Empieza Ahora
        </motion.button>
      </div>
    </section>
  );
}