'use client';

import React, { useEffect } from 'react';
import ErrorState from '@/components/shared/ErrorState';

export default function StudentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Student route error:', error);
  }, [error]);

  return <ErrorState reset={reset} title="Portal Error" message="An error occurred while loading this student page." />;
}
