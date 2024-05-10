'use client';

import ChangePasswordTab from '@/components/Account/ChangePasswordTab';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountTab from '@/components/Account/AccountTab';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Account() {
  const router = useRouter();

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  if (!session) {
    return null;
  }

  return (
    <div className="flex justify-center px-4 pt-48 sm:pt-60">
      <Tabs defaultValue="account" className="w-full max-w-[500px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Change password</TabsTrigger>
        </TabsList>

        <AccountTab user={session.user} />
        <ChangePasswordTab user={session.user} />
      </Tabs>
    </div>
  );
}
