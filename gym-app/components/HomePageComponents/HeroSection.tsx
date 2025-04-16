'use client';
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
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
  <Image
    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop"
    alt="Personal Trainer Alejandro Fernandez"
    fill
    className="object-cover object-center opacity-70"
    priority
    sizes="100vw"
  />

  <div className="absolute text-center z-10 px-4 sm:px-6 md:px-12 max-w-[90%]">
    <motion.h1
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-md"
    >
      Transforma tu cuerpo con Alejandro Fernandez
    </motion.h1>
    <motion.p
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ delay: 0.2 }}
      className="text-base sm:text-lg md:text-2xl mb-8 max-w-2xl mx-auto text-white drop-shadow-sm"
    >
      Entrenamiento personalizado y en grupo para alcanzar tus metas fitness
    </motion.p>
    <motion.button
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ delay: 0.4 }}
      onClick={scrollToContact}
      className="bg-yellow-500 text-gray-900 px-6 py-2 sm:px-8 sm:py-3 rounded-full text-sm sm:text-lg font-semibold hover:bg-yellow-400 transition-colors flex items-center gap-2 mx-auto"
    >
      <span>Contáctanos</span>
      <FaArrowDown />
    </motion.button>
  </div>
</section>

  );
}
