'use client';

import { ErrorContextProvider } from '@/contexts/Error/ErrorContext';
import { SessionProvider } from 'next-auth/react';

interface Props {
  children: React.ReactNode;
}

export default function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <ErrorContextProvider>{children}</ErrorContextProvider>
    </SessionProvider>
  );
}
