'use client';

import Link from 'next/link';
import {
  useUser,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useClerk,
} from '@clerk/nextjs';
import {
  FaHome,
  FaUser,
  FaList,
  FaChartLine,
  FaDumbbell,
  FaTimes,
  FaBars,
} from 'react-icons/fa';
import { useState } from 'react';

const Navbar = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const role = (user?.publicMetadata?.role as string | undefined)?.toUpperCase() || '';  
  const isProfessor = role === 'PROFESSOR' || role === 'ADMIN';

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-white text-xl font-bold">
            FitCoach
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex gap-6">
              <SignedIn>
                {isProfessor ? (
                  <>
                    <NavLink href="/dashboard" icon={<FaChartLine />}>
                      Dashboard
                    </NavLink>
                    <NavLink href="/exercises" icon={<FaDumbbell />}>
                      Exercises
                    </NavLink>
                    <NavLink href="/routines" icon={<FaList />}>
                      Routines
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink href="/" icon={<FaHome />}>
                      Home
                    </NavLink>
                    <NavLink href="/profile" icon={<FaUser />}>
                      Profile
                    </NavLink>
                    <NavLink href="/alumno" icon={<FaList />}>
                      Tus Rutinas
                    </NavLink>
                  </>
                )}
              </SignedIn>
              <SignedOut>
                <NavLink href="/" icon={<FaHome />}>
                  Home
                </NavLink>
              </SignedOut>
            </div>

            <div className="ml-4">
              <SignedIn>
                <button
                  onClick={() => signOut()}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Cerrar sesión
                </button>
              </SignedIn>
              <SignedOut>
                <div className="flex gap-4">
                  <SignInButton mode="modal">
                    <button className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      Iniciar Sesión
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                      Registrarse
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 pb-3">
          <div className="px-2 pt-2 space-y-1">
            <SignedIn>
              {isProfessor ? (
                <>
                  <MobileNavLink href="/dashboard" icon={<FaChartLine />}>
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink href="/exercises" icon={<FaDumbbell />}>
                    Exercises
                  </MobileNavLink>
                  <MobileNavLink href="/routines" icon={<FaList />}>
                    Routines
                  </MobileNavLink>
                </>
              ) : (
                <>
                  <MobileNavLink href="/" icon={<FaHome />}>
                    Home
                  </MobileNavLink>
                  <MobileNavLink href="/profile" icon={<FaUser />}>
                    Profile
                  </MobileNavLink>
                  <MobileNavLink href="/alumno" icon={<FaList />}>
                    Tus Rutinas
                  </MobileNavLink>
                </>
              )}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  signOut();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Cerrar sesión
              </button>
            </SignedIn>
            <SignedOut>
              <MobileNavLink href="/" icon={<FaHome />}>
                Home
              </MobileNavLink>
              <div className="px-2 mt-2 space-y-2">
                <SignInButton mode="modal">
                  <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">
                    Iniciar Sesión
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-green-600 text-white hover:bg-green-700">
                    Registrarse
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700 hover:text-white transition-colors duration-200"
  >
    <span className="mr-2">{icon}</span>
    {children}
  </Link>
);

const MobileNavLink = ({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
  >
    <span className="mr-2">{icon}</span>
    {children}
  </Link>
);

export default Navbar;
