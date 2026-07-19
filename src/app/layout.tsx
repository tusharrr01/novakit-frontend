import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import NextAuthProvider from '@/src/components/providers/NextAuthProvider';
import ReduxProvider from '@/src/components/providers/ReduxProvider';
import DynamicSettingsProvider from '@/src/components/providers/DynamicSettingsProvider';
import { ThemeProvider } from 'next-themes';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
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
