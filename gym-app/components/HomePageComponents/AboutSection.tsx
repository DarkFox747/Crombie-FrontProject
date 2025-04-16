// components/HomePageComponents/AboutSection.tsx
"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

export default function AboutSection() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-16 px-4 md:px-16 bg-gray-800" id="about">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <motion.div initial="hidden" whileInView="visible" variants={fadeIn} className="md:w-1/2">
          <Image
            src="https://storage.googleapis.com/gym-app-profile-pics/user_2uuNWRDtO6Pq2aTy84fLUQi6Uj5-1744745857658.png"
            alt="Alejandro Fernandes - Personal Trainer"
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
          <h2 className="text-4xl font-bold mb-4">Sobre Alejandro Fernandez</h2>
          <p className="text-lg mb-6">
            Con más de 10 años de experiencia en el mundo del fitness, Alejandro se especializa en 
            entrenamiento personalizado y en grupo. Su enfoque holístico combina nutrición, 
            entrenamiento funcional y disciplina mental para ayudarte a alcanzar tus metas.
          </p>
          <a
            href="https://wa.me/+5493455400530"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-6 py-3 rounded-full text-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
          >
            <FaWhatsapp /> Consulta por disponibilidad
          </a>
        </motion.div>
      </div>
    </section>
  );
}