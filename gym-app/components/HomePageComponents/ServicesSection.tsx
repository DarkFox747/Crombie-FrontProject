// components/HomePageComponents/ServicesSection.tsx
"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ServicesSection() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const services = [
    {
      title: 'Entrenamiento Personalizado',
      description: 'Sesiones 1 a 1 diseñadas específicamente para tus necesidades y objetivos. Alejandro creará un plan adaptado a tu condición física, metas y disponibilidad.',
      img: 'https://storage.googleapis.com/gym-app-profile-pics/personaltrainer.jpg?q=80&w=2070&auto=format&fit=crop',
    },
    {
      title: 'Entrenamiento en Grupo',
      description: 'Clases dinámicas en grupos reducidos para maximizar resultados y motivación. Perfecto para quienes disfrutan del entrenamiento social y el trabajo en equipo.',
      img: 'https://storage.googleapis.com/gym-app-profile-pics/grupales.jpg?q=80&w=2070&auto=format&fit=crop',
    },
    {
      title: 'Rutinas Personalizadas',
      description: 'Programas de entrenamiento diseñados para que puedas entrenar por tu cuenta. Ideal para quienes necesitan flexibilidad horaria pero quieren un plan profesional.',
      img: 'https://storage.googleapis.com/gym-app-profile-pics/rutinafoto.jpeg?q=80&w=2070&auto=format&fit=crop',
    },
  ];

  return (
    <section className="py-16 px-4 md:px-16 bg-gray-900" id="services">
      <h2 className="text-4xl font-bold text-center mb-12">Nuestros Servicios</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            whileHover={{ scale: 1.03 }}
            className="bg-gray-700 rounded-lg overflow-hidden flex flex-col"
          >
            <div className="h-48 relative">
              <Image 
                src={service.img} 
                alt={service.title} 
                layout="fill"
                objectFit="cover"
                className="hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6 flex-grow">
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="mb-4">{service.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}