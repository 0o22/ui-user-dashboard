import SessionProvider from '@/components/SessionProvider/SessionProvider';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Inter } from 'next/font/google';
import Error from '@/components/Error';
import HolyLoader from 'holy-loader';
import type { Metadata } from 'next';
import Providers from './providers';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Main',
  description: 'Main page',
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<Props>) {
  return (
    <html className="dark scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <body
        className={cn(
          'relative flex min-h-screen w-screen flex-col bg-background',
          inter.className
        )}
      >
        <Providers>
          <SessionProvider>
            <HolyLoader color="#22c55e" showSpinner={false} />

            <main
              id="mainContent"
              className="container relative z-[1] flex flex-auto flex-col overflow-hidden"
            >
              {children}
            </main>

            <Sidebar />

            <Footer />

            <Error />
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
