import { Home, type LucideIcon, Table2, UserRound } from 'lucide-react';
import type { Session } from 'next-auth';

interface SidebarLink {
  href: string;
  icon: LucideIcon;
  text: string;
}

export function getSidebarLinks(session: Session | null): SidebarLink[] {
  const links = [
    {
      href: '/',
      icon: Home,
      text: 'Home',
    },
    {
      href: '/account',
      icon: UserRound,
      text: 'Account',
    },
  ];

  const isAdmin = session && session.user.role === 'ADMIN';

  if (isAdmin) {
    links.push({
      href: '/admin',
      icon: Table2,
      text: 'Dashboard',
    });
  }

  return links;
}
