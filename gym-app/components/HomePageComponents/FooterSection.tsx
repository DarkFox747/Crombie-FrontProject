"use client";
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function FooterSection() {
  return (
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
  );
}