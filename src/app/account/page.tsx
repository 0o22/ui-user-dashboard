import Account from '@/components/Account/Account';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account',
  description: 'Account page',
};

export default async function Page() {
  const token = cookies().get('next-auth.session-token');

  if (!token) {
    redirect('/login');
  }

  return <Account />;
}
