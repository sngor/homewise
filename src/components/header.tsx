"use client";

import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6 z-50">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base" aria-label="Home">
            <Logo />
        </Link>
        {!loading && user && (
            <Button variant="outline" onClick={handleSignOut}>
                Sign Out
            </Button>
        )}
    </header>
  );
}
