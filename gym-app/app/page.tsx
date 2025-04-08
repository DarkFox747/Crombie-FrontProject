"use client";
import HeroSection from '../components/HomePageComponents/HeroSection';
import AboutSection from '../components/HomePageComponents/AboutSection';
import ServicesSection from '../components/HomePageComponents/ServicesSection';
import GallerySection from '../components/HomePageComponents/GallerySection';
import FooterSection from '../components/HomePageComponents/FooterSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <GallerySection />
      <FooterSection />
    </div>
  );
}