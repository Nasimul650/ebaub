import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const neoGrotesque = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-neo-grotesque',
});

export const metadata: Metadata = {
  title: 'EBAUB Digital Campus | Eastern Bank Agricultural University',
  description: 'Official digital campus web portal and modern headless CMS for Eastern Bank Agricultural University (EBAUB) CSE Department 2-Year Anniversary presentation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={neoGrotesque.variable}>
      <body className="font-sans bg-slate-100 text-slate-900 antialiased selection:bg-emerald-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
