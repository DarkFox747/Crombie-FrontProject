import { ClerkProvider, SignedOut, SignInButton, SignedIn, UserButton } from '@clerk/nextjs';
import './globals.css';
import Navbar from '@/components/Nabvar';
import FooterSection from '../components/HomePageComponents/FooterSection';

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
    <ClerkProvider>
      <html lang="es">
        <body className="flex flex-col min-h-screen">
          <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <Navbar />
            <div>
              <SignedOut>
                <SignInButton mode="modal" />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <main className="flex-grow ">
            {children}
          </main>
          <FooterSection />
        </body>
      </html>
    </ClerkProvider>
  );
}