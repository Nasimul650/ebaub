import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const snPro = localFont({
  src: [
    {
      path: './fonts/sn-pro/sn-pro-latin-300-normal.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/sn-pro/sn-pro-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/sn-pro/sn-pro-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/sn-pro/sn-pro-latin-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/sn-pro/sn-pro-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/sn-pro/sn-pro-latin-800-normal.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/sn-pro/sn-pro-latin-900-normal.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-sn-pro',
  display: 'swap',
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
    <html lang="en" className={snPro.variable}>
      <body className="font-sans bg-campus-50 text-slate-900 antialiased selection:bg-campus-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
