'use client';

import React, { useEffect } from 'react';
import ErrorState from '@/components/shared/ErrorState';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error('Public route error:', error);
  }, [error]);

  return <ErrorState reset={reset} />;
}
