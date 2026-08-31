'use client';

import React, { useEffect } from 'react';
import ErrorState from '@/components/shared/ErrorState';

export default function TeacherError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Teacher route error:', error);
  }, [error]);

  return <ErrorState reset={reset} title="Portal Error" message="An error occurred while loading this teacher page." />;
}
