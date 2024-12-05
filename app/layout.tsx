// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import SessionProvider from './SessionProvider';
import { cookies } from 'next/headers';
import { ThemeProvider } from '../components/theme-provider';
import { Navigation } from '../components/navigation';
import { Toaster } from '../components/ui/toaster';
import { validateRequest } from '../auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Codeeza - Full Stack Development Agency',
  description: 'Expert full-stack development teams for your digital projects',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const { user, session } = await validateRequest();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider user={user} session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navigation />
            <div className='mt-20'>
            {children}
            </div>
            <Toaster />
            
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}