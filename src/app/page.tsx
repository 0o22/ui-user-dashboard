import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Home from '@/components/Home/Home';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Home page',
};

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect('/login');
  }

  return <Home />;
}
