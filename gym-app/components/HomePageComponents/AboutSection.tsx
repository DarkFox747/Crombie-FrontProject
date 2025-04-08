"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AboutSection() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-16 px-4 md:px-16 bg-gray-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <motion.div initial="hidden" whileInView="visible" variants={fadeIn} className="md:w-1/2">
          <Image
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"
            alt="Sobre Nosotros"
            width={500}
            height={300}
            className="rounded-lg"
          />
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          className="md:w-1/2 text-center md:text-left"
        >
          <h2 className="text-4xl font-bold mb-4">Sobre Nosotros</h2>
          <p className="text-lg">
            Somos más que un gimnasio: somos una comunidad dedicada a ayudarte a alcanzar tus metas
            de fitness. Con entrenadores expertos y equipos de última generación, te ofrecemos el
            ambiente perfecto para ponerte en forma.
          </p>
        </motion.div>
      </div>
    </section>
  );
}