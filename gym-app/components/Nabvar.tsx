import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto">

        <div className="space-x-4">
            <Link href="/" className="text-white text-lg font-bold">
              Home
            </Link>
            <Link href="/dashboard" className="text-white hover:text-gray-300">
                Dashboard
            </Link>
            <Link href="/exercises" className="text-white hover:text-gray-300">
            Exercises
            </Link>
            <Link href="/profile" className="text-white hover:text-gray-300">
            Profile
            </Link>
            <Link href="/routines" className="text-white hover:text-gray-300">
            Routines
            </Link>
            
        </div>
      </div>
    </nav>
  );
}

export default Navbar;