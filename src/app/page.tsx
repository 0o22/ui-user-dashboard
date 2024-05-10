import Home from '@/components/Home/Home';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Home page',
};

export default async function Page() {
  return <Home />;
}
