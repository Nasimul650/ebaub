'use client';

import React, { useEffect } from 'react';
import ErrorState from '@/components/shared/ErrorState';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Root error:', error);
  }, [error]);

  return <ErrorState reset={reset} fullScreen title="System Error" message="An unexpected system error occurred." />;
}
