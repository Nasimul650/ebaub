import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MeshBackground from '@/components/layout/MeshBackground';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative text-slate-900 selection:bg-emerald-600 selection:text-white">
      <MeshBackground />
      <Navbar />
      <main className="flex-1 py-8 sm:py-12 px-3 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
