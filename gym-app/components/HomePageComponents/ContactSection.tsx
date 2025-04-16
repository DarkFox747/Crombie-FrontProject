// components/HomePageComponents/ContactSection.tsx
"use client";
import { motion } from 'framer-motion';
import { FaWhatsapp, FaInstagram, FaEnvelope, FaCopy } from 'react-icons/fa';
import { useState } from 'react';

export default function ContactSection() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const contacts = [
    {
      icon: <FaWhatsapp className="text-2xl" />,
      name: 'WhatsApp',
      link: 'https://wa.me/+5493455400530',
      text: '+54 9 3455 40-0530',
      copyText: '+5493455400530'
    },
    {
      icon: <FaInstagram className="text-2xl" />,
      name: 'Instagram',
      link: 'https://instagram.com/_ale_fernandez',
      text: '@_ale_fernandez',
      copyText: '@_ale_fernandez'
    },
    {
      icon: <FaEnvelope className="text-2xl" />,
      name: 'Email',
      link: 'mailto:contacto@alejandrofit.com',
      text: 'contacto@alejandrofit.com',
      copyText: 'contacto@alejandrofit.com'
    }
  ];

  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 px-4 md:px-16 bg-gray-700" id="contact">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        variants={fadeIn}
        className="max-w-4xl mx-auto" // Cambiado a max-w-4xl para mejor centrado
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Contacto</h2>
          <p className="text-xl max-w-2xl mx-auto">
            ¿Tienes dudas o consultas? Contáctanos por cualquiera de estos medios. 
            Estamos aquí para ayudarte en tu camino fitness.
          </p>
        </div>

        {/* Contenedor centrado con flex para los 3 elementos */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {contacts.map((contact, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center"
              style={{ width: '300px' }} // Ancho fijo para consistencia
            >
              <div className="text-yellow-400 mb-3">{contact.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{contact.name}</h3>
              
              <div className="mt-auto w-full">
                <a
                  href={contact.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-700 text-white px-4 py-2 rounded-md mb-3 hover:bg-green-700 transition-colors"
                >
                  Abrir en {contact.name}
                </a>
                
                <div className="flex items-center justify-center bg-gray-700 rounded-md p-2">
                  <span className="mr-2">{contact.text}</span>
                  <button 
                    onClick={() => copyToClipboard(contact.copyText)}
                    className="text-gray-400 hover:text-white"
                    aria-label="Copiar"
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-300 max-w-3xl mx-auto"
        >
          <p className="mb-2">
            Horario de atención: Lunes a Viernes de 8:00 a 21:00 | Sábados de 9:00 a 14:00
          </p>
          <p>
            Ubicación: Ituzaingó 2053, Santa Fe, Santa Fe 3000, Argentina
          </p>
        </motion.div>
        
        {copied && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md"
          >
            ¡Copiado al portapeles!
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}