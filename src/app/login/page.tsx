import { authOptions } from '../api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Login from '@/components/Login';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login page',
};

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session) {
    return redirect('/account');
  }

  return <Login />;
}
