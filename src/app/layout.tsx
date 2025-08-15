import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/context/auth-context';
import { Header } from '@/components/header';

export const metadata: Metadata = {
  title: {
    default: "HomeWise - Appliance Manager",
    template: "%s | HomeWise",
  },
  description: 'Manage your home appliances with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased h-full bg-background" suppressHydrationWarning>
        <AuthProvider>
            <div className="flex min-h-screen w-full flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
            </div>
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
