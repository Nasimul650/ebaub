import React from 'react';
import PortalRoleSelector from '@/components/auth/PortalRoleSelector';
import MeshBackground from '@/components/layout/MeshBackground';

export default function LoginPage() {
  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center px-4 py-16">
      <MeshBackground />
      <PortalRoleSelector />
    </div>
  );
}
