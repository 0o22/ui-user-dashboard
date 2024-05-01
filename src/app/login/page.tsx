import { redirect } from 'next/navigation';
import Login from '@/components/Login';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login page',
};

export default async function Page() {
  const token = cookies().get('next-auth.session-token');

  if (token) {
    redirect('/account');
  }

  return <Login />;
}
