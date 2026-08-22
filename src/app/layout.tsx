import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 antialiased selection:bg-emerald-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
