import { getAuthToken, verifyAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/AdminDashboard';

export default async function AdminPage() {
  const token = await getAuthToken();
  const user = token ? await verifyAuth(token) : null;

  if (!user) {
    redirect('/login');
  }

  return <AdminDashboard />;
} 