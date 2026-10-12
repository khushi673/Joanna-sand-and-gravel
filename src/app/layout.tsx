import type { Metadata } from 'next';
import './globals.css';
import Prototype from '@/components/prototype';

export const metadata: Metadata = {
  title: 'Joanna Peruzzi-Schaeper Sand & Gravel',
  description: 'Quality materials. Reliable delivery. Serving Texas builders and communities.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Prototype>{children}</Prototype></body></html>;
}