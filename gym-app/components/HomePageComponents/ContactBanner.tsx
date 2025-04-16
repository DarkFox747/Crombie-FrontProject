// components/HomePageComponents/ContactBanner.tsx
"use client";
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

export default function ContactBanner() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-12 px-4 bg-green-700">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          className="flex flex-col items-center"
        >
          <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar tu transformación?</h2>
          <p className="text-xl mb-6 max-w-2xl">Contáctanos por WhatsApp y reserva tu primera sesión</p>
          <a
            href="https://wa.me/TUNUMERODEWHATSAPP"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-green-700 px-8 py-3 rounded-full text-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <FaWhatsapp className="text-xl" /> Contactar a Alejandro
          </a>
        </motion.div>
      </div>
    </section>
  );
}