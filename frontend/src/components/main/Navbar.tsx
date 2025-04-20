import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavbarProps {
  userId: string | number;
}

export default function Navbar({ userId }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      <Link to="/">
        <img
          src="../../../public/beavertrails_logo.png"
          alt="Beavertrails Logo"
          className="h-16 w-auto"
        />
      </Link>
      <Link
        to={`/users/${userId}`}
        className={cn('text-sm font-medium text-blue-600 hover:underline')}
      >
        User
      </Link>
    </nav>
  );
}
