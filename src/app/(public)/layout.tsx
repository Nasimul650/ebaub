import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getFacultiesWithDepartments, getAllPrograms } from '@/utils/supabase/queries';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  // Fetch data for the MegaMenu
  const [faculties, programs] = await Promise.all([
    getFacultiesWithDepartments(),
    getAllPrograms(5) // Only fetch top 5 for the megamenu
  ]);

  return (
    <div className="min-h-screen flex flex-col text-slate-900 selection:bg-campus-700 selection:text-white">
      <Navbar faculties={faculties} programs={programs} />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
