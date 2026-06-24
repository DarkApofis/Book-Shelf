import type { Metadata } from 'next';
import { Hanken_Grotesk, Schibsted_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const hanken = Hanken_Grotesk({
  variable: '--font-hanken',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const schibsted = Schibsted_Grotesk({
  variable: '--font-schibsted',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Folio — Your reading life, beautifully organized',
  description: 'Track books, set goals, and explore your reading year with Folio.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${schibsted.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
