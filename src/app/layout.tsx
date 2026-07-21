import { Space_Grotesk, DM_Sans } from 'next/font/google';
import './globals.css';
import NextAuthProvider from '@/src/components/providers/NextAuthProvider';
import ReduxProvider from '@/src/components/providers/ReduxProvider';
import DynamicSettingsProvider from '@/src/components/providers/DynamicSettingsProvider';
import { ThemeProvider } from 'next-themes';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
});

const dmSans = DM_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
});

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NovaKit',
  description: 'Premium component marketplace and template sharing platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning // Prevents class mismatch warnings during hydration when changing themes
      className={`${spaceGrotesk.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <NextAuthProvider>
          <ReduxProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <DynamicSettingsProvider>
                {children}
              </DynamicSettingsProvider>
            </ThemeProvider>
          </ReduxProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
