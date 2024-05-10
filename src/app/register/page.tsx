import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import Register from '@/components/Register';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Register page',
};

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session) {
    return redirect('/account');
  }

  return <Register />;
}
