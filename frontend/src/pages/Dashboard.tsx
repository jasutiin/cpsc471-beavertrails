import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ServiceTabs } from '@/components/dashboard/ServiceTabs';
import Stats from '@/components/dashboard/Stats';

export default function Dashboard() {
  const { company, logout } = useAuth();
  const navigate = useNavigate();
  console.log(company?.company_name);
  console.log(company?.company_id);
  console.log(company?.company_email);
  console.log(company?.company_phone_number);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!company?.company_id) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {company.company_name}'s Dashboard
        </h1>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="text-red-600 hover:bg-red-50"
        >
          Logout
        </Button>
      </div>
      <Stats />
      <ServiceTabs />
    </div>
  );
}
