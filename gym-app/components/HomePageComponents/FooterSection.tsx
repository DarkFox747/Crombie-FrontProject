"use client";
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';

export default function FooterSection() {
  return (
    <footer className="py-8 bg-gray-800 text-center">
      <div className="flex justify-center space-x-6 mb-4">
        <a href="https://instagram.com/_ale_fernandez" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="text-3xl hover:text-red-600 transition-colors" />
        </a>
        <a href="https://facebook.com/_ale_fernandez" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="text-3xl hover:text-red-600 transition-colors" />
        </a>
        <a href="https://wa.me/+5493455400530" target="_blank" rel="noopener noreferrer">
          <FaWhatsapp className="text-3xl hover:text-red-600 transition-colors" />
        </a>
      </div>
      <p className="text-sm">© 2025 Gym App. Todos los derechos reservados.</p>
    </footer>
  );
}