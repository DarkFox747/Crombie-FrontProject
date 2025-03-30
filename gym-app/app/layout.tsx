import { ClerkProvider, SignedOut, SignInButton, SignedIn, UserButton } from '@clerk/nextjs';
import './globals.css';
import Navbar from '@/components/Nabvar';

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
          <main className="flex-grow p-4">
            {children}
          </main>
          <footer className="bg-gray-800 text-white p-4 text-center">
            <p>&copy; 2025 Gym App</p>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}