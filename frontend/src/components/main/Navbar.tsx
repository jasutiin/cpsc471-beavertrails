import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavbarProps {
  userId: string | number;
}

export default function Navbar({ userId }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      <Link to="/" className="text-xl font-bold text-gray-800 hover:text-black">
        Beavertrails
      </Link>
      <Link
        to={`/users/1`}
        className={cn('text-sm font-medium text-blue-600 hover:underline')}
      >
        User
      </Link>
    </nav>
  );
}
