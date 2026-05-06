import { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nextcloud Unduh Monitor',
};

import { cookies } from 'next/headers';
import Sidebar from '@/app/components/Sidebar';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has('session');

  return (
    <html lang="id">
      <body className="bg-gray-50">
        <div className="flex min-h-screen relative">
          {isAuthenticated && <Sidebar />}

          {/* Main Content */}
          <main className={`flex-1 min-w-0 overflow-x-hidden ${isAuthenticated ? 'md:pl-0 pt-16 md:pt-0' : ''}`}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
