<<<<<<< HEAD
import './globals.css'
=======
// app/layout.tsx

import './globals.css';
>>>>>>> 4a72aa36f2cb0937f820d920c3f39c41bf93f506
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navigation } from '@/components/navigation';
import { Toaster } from "@/components/ui/toaster";
import SessionProvider from './SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GeniusHumans - Full Stack Development Agency',
  description: 'Expert full-stack development teams for your digital projects',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}