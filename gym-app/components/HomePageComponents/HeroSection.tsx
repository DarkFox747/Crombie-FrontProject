// components/HomePageComponents/HeroSection.tsx
"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa';

export default function HeroSection() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center">
      <Image
        src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop"
        alt="Personal Trainer Alejandro Fernandez"
        layout="fill"
        objectFit="cover"
        className="opacity-70"
      />
      <div className="absolute text-center z-10 px-4">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-5xl md:text-7xl font-bold mb-4"
        >
          Transforma tu cuerpo con Alejandro Fernandez
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
        >
          Entrenamiento personalizado y en grupo para alcanzar tus metas fitness
        </motion.p>
        <motion.button
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
          onClick={scrollToContact}
          className="bg-yellow-500 text-gray-900 px-8 py-3 rounded-full text-lg font-semibold hover:bg-yellow-400 transition-colors flex items-center gap-2 mx-auto"
        >
          <span>Contáctanos</span>
          <FaArrowDown />
        </motion.button>
      </div>
    </section>
  );
}