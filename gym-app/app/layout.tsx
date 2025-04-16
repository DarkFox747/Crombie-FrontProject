// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import Navbar from '@/components/Nabvar'; 
import FooterSection from '@/components/HomePageComponents/FooterSection';

export const metadata = {
  title: 'Gym App',
  description: 'Gestión de gimnasio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    console.log(process.env),
    <ClerkProvider>
      <html lang="es" className="scroll-smooth">
        <body className="flex flex-col min-h-screen bg-gray-900 text-white">
          {/* Navbar */}
          <header>
            <Navbar />
          </header>

          {/* Contenido principal */}
          <main className="flex-grow  animate-fade-in">
            {children}
          </main>

          {/* Footer */}
          <footer className="mt-auto">
            <FooterSection />
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
