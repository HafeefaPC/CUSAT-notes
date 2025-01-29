'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { ModeToggle } from './mode-toggle';

export function Navigation() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <Link href="/" className="flex items-center px-2 py-2 text-lg font-medium">
              Study Material Repository
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAdmin ? (
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            ) : (
              <Link href="/admin">
                <Button variant="outline">Admin Dashboard</Button>
              </Link>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
} 