import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, company } = useAuth();

  const renderAuthLink = () => {
    if (user?.user_id) {
      return (
        <Link
          to={`/users/${user.user_id}`}
          className={cn('text-sm font-medium text-blue-600 hover:underline')}
        >
          {user.user_email ?? 'User'}
        </Link>
      );
    }

    if (company?.company_id) {
      return (
        <Link
          to={`/dashboard/${company.company_id}`}
          className={cn('text-sm font-medium text-blue-600 hover:underline')}
        >
          {company.company_email ?? 'Company'}
        </Link>
      );
    }

    return (
      <Link
        to="/auth"
        className={cn('text-sm font-medium text-blue-600 hover:underline')}
      >
        Login
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 h-[80px] z-50 flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      <Link to="/">
        <img
          src="/public/beavertrails_logo.png"
          alt="Beavertrails Logo"
          className="h-16 w-auto"
        />
      </Link>

      {renderAuthLink()}
    </nav>
  );
}
