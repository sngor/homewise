import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Header } from '@/components/header';
import { Inter } from 'next/font/google'

export const metadata: Metadata = {
  title: {
    default: "HomeWise - Appliance Manager",
    template: "%s | HomeWise",
  },
  description: 'Manage your home appliances with ease.',
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full`} suppressHydrationWarning>
      <body className="antialiased h-full bg-background" suppressHydrationWarning>
            <div className="flex min-h-screen w-full flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
            </div>
            <Toaster />
      </body>
    </html>
  );
}
