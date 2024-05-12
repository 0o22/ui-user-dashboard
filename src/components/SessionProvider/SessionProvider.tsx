'use client';

import NewPasswordDialog from '@/components/SessionProvider/NewPasswordDialog';
import { useSession } from 'next-auth/react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function SessionProvider({ children }: Props) {
  const { data: session } = useSession();

  console.log(session);

  return (
    <>
      {children}

      {session?.user && !session.user.hasPassword && (
        <NewPasswordDialog user={session.user} />
      )}
    </>
  );
}
