import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import Admin from '@/components/Admin/Admin';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard page',
};

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect('/login');
  }

  return <Admin />;
}
