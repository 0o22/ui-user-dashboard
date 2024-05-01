import Admin from '@/components/Admin/Admin';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard page',
};

export default async function Page() {
  const token = cookies().get('next-auth.session-token');

  if (!token) {
    redirect('/login');
  }

  return <Admin />;
}
