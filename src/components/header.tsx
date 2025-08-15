"use client";

import Link from 'next/link';
import { Logo } from '@/components/logo';

export function Header() {
  return (
    <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6 z-50">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base" aria-label="Home">
            <Logo />
        </Link>
    </header>
  );
}
