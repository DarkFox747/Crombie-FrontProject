"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
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

      {/* Sobre Nosotros */}
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

      {/* Servicios */}
      <section className="py-16 px-4 md:px-16 bg-gray-900">
        <h2 className="text-4xl font-bold text-center mb-12">Nuestros Servicios</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Entrenamiento Personal',
              img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
            },
            {
              title: 'Clases Grupales',
              img: 'https://images.unsplash.com/photo-1571736951392-d75c39b7f4e9?q=80&w=2070&auto=format&fit=crop',
            },
            {
              title: 'Área de Pesas',
              img: 'https://images.unsplash.com/photo-1605296866985-34b2f9c86b53?q=80&w=2070&auto=format&fit=crop',
            },
          ].map((service, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-700 rounded-lg overflow-hidden"
            >
              <Image src={service.img} alt={service.title} width={400} height={250} className="w-full" />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{service.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Galería */}
      <section className="py-16 px-4 md:px-16 bg-gray-800">
        <h2 className="text-4xl font-bold text-center mb-12">Galería</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1549060279-7e168f26a569?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
          ].map((img, index) => (
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

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-3xl hover:text-red-600 transition-colors" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="text-3xl hover:text-red-600 transition-colors" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-3xl hover:text-red-600 transition-colors" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <FaYoutube className="text-3xl hover:text-red-600 transition-colors" />
          </a>
        </div>
        <p className="text-sm">© 2025 Gym App. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}