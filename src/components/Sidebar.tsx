'use client';

import { ChevronLeft, LogIn, LogOut, X } from 'lucide-react';
import { getSidebarLinks } from '@/helpers/getSidebarLinks';
import { useWindowSize } from '@/hooks/useWindowSize';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Link from 'next/link';

export default function Sidebar() {
  const { width } = useWindowSize();
  const [isOpened, setIsOpened] = useState(false);
  const { data: session, status } = useSession();

  const toggleSidebarVisibility = () =>
    setIsOpened((currentState) => !currentState);

  const router = useRouter();
  const pathname = usePathname();

  const [currentPath] = pathname.split('/').filter(Boolean);

  const handleLoginClick = () => {
    router.push('/login');
    toggleSidebarVisibility();
  };

  const handleLogoutClick = () => {
    signOut();
    toggleSidebarVisibility();
  };

  if (status === 'loading') {
    return null;
  }

  const links = getSidebarLinks(session);

  return (
    <>
      <aside
        className={cn(
          `fixed w-full sm:w-[320px] flex-1 h-screen flex justify-center items-center z-[50]
            bg-card transform transition-transform duration-300 ease-in-out`,
          isOpened ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="grid gap-2 sm:gap-0 w-full items-start text-sm font-medium px-4">
          {links.map(({ href, icon: Icon, text }) => (
            <Link
              key={text}
              className={cn(
                `flex gap-3 rounded-lg px-3 py-2 text-muted-foreground
                transition-all hover:text-primary sm:justify-start`,
                { 'bg-muted text-primary': href.includes(currentPath) }
              )}
              href={href}
              onClick={toggleSidebarVisibility}
            >
              <Icon className="h-4 aspect-square" />
              {text}
            </Link>
          ))}

          {session ? (
            <button
              className="flex gap-3 rounded-lg px-3 py-2 text-muted-foreground
                transition-all hover:text-primary sm:justify-start"
              type="button"
              onClick={handleLogoutClick}
            >
              <LogOut className="h-4 aspect-square" />
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-2 sm:gap-0">
              <button
                className={cn(
                  `flex gap-3 rounded-lg px-3 py-2 text-muted-foreground
                    transition-all hover:text-primary sm:justify-start`,
                  { 'bg-muted text-primary': currentPath.includes('login') }
                )}
                type="button"
                onClick={handleLoginClick}
              >
                <LogIn className="h-4 aspect-square" />
                Login
              </button>
            </div>
          )}
        </nav>

        {width < 640 && (
          <button
            className="absolute top-4 right-4 text-foreground"
            type="button"
            onClick={() => setIsOpened(false)}
          >
            <X size={24} />
          </button>
        )}

        <button
          className="py-4 pr-4 absolute top-1/2 -right-14 h-20 w-14"
          type="button"
          onClick={toggleSidebarVisibility}
        >
          <ChevronLeft
            className={cn(
              `transform w-full h-full transition-transform duration-300
                ease-in-out text-muted-foreground`,
              { 'rotate-180': !isOpened }
            )}
            color="currentColor"
            strokeWidth={3}
          />
        </button>
      </aside>

      <button
        className={cn(
          'fixed inset-0 z-[49] bg-transparent pointer-events-none transition-colors duration-300',
          { 'bg-black/60 pointer-events-auto': isOpened }
        )}
        type="button"
        onClick={toggleSidebarVisibility}
      />
    </>
  );
}
