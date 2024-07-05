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

  const [currentPath = '/'] = pathname.split('/').filter(Boolean);

  const isCurrentPath = (path: string) => {
    if (path === '/') {
      return currentPath === path;
    }

    const preparedPath = path.slice(1);

    return currentPath.startsWith(preparedPath);
  };

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
          `fixed z-[100] flex h-screen w-full flex-1 transform items-center justify-center
            bg-card transition-transform duration-300 ease-in-out sm:w-[320px]`,
          isOpened ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="grid w-full items-start gap-2 px-4 text-sm font-medium sm:gap-0">
          {links.map(({ href, icon: Icon, text }) => (
            <Link
              key={text}
              className={cn(
                `flex gap-3 rounded-lg px-3 py-2 text-muted-foreground
                  transition-all hover:text-primary sm:justify-start`,
                { 'bg-muted text-primary': isCurrentPath(href) }
              )}
              href={href}
              onClick={toggleSidebarVisibility}
            >
              <Icon className="aspect-square h-4" />
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
              <LogOut className="aspect-square h-4" />
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
                <LogIn className="aspect-square h-4" />
                Login
              </button>
            </div>
          )}
        </nav>

        {width < 640 && (
          <button
            className="absolute right-4 top-4 text-foreground"
            type="button"
            onClick={() => setIsOpened(false)}
          >
            <X size={24} />
          </button>
        )}

        <button
          className="absolute -right-14 top-1/2 h-20 w-14 py-4 pr-4"
          type="button"
          onClick={toggleSidebarVisibility}
        >
          <ChevronLeft
            className={cn(
              `h-full w-full transform text-muted-foreground transition-transform
                duration-300 ease-in-out`,
              { 'rotate-180': !isOpened }
            )}
            color="currentColor"
            strokeWidth={3}
          />
        </button>
      </aside>

      <button
        className={cn(
          'pointer-events-none fixed inset-0 z-[49] bg-transparent transition-colors duration-300',
          { 'pointer-events-auto bg-black/60': isOpened }
        )}
        type="button"
        onClick={toggleSidebarVisibility}
      />
    </>
  );
}
