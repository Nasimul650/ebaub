import type { Metadata } from 'next';
import { Roboto_Condensed, Noto_Sans_Bengali } from 'next/font/google';
import './globals.css';

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-roboto-condensed',
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-bangla',
});

export const metadata: Metadata = {
  title: 'EBAUB Digital Campus | EXIM Bank Agricultural University Bangladesh',
  description: 'Official digital campus web portal and modern headless CMS for EXIM Bank Agricultural University Bangladesh (EBAUB) CSE Department 2-Year Anniversary presentation.',
};

import CommandMenu from '@/components/CommandMenu';
import PublicAIFloatingWidget from '@/components/public/PublicAIFloatingWidget';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${robotoCondensed.variable} ${notoSansBengali.variable}`}>
      <body className="font-sans bg-campus-50 text-slate-900 antialiased selection:bg-campus-900 selection:text-white">
        <CommandMenu />
        {children}
        <PublicAIFloatingWidget />
      </body>
    </html>
  );
}
