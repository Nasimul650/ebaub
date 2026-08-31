'use client';

import React, { useEffect } from 'react';
import ErrorState from '@/components/shared/ErrorState';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin route error:', error);
  }, [error]);

  return <ErrorState reset={reset} title="Dashboard Error" message="An error occurred while loading this administrative page." />;
}
