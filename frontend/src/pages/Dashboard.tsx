import { ServiceTabs } from '@/components/dashboard/ServiceTabs';
import Stats from '@/components/dashboard/Stats';

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Stats />
      <ServiceTabs />
    </div>
  );
}
