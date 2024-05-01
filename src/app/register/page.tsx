import Register from '@/components/Register';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Register page',
};

export default async function Page() {
  const token = cookies().get('next-auth.session-token');

  if (token) {
    redirect('/account');
  }

  return <Register />;
}
