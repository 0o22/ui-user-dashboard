'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useErrorContext } from '@/contexts/Error/ErrorContext';
import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Error() {
  const { error, clearError } = useErrorContext();
  const [isOpened, setIsOpened] = useState(Boolean(error));

  const handleCloseError = useCallback(() => {
    setIsOpened(false);

    setTimeout(() => {
      clearError();
    }, 500);
  }, [clearError]);

  useEffect(() => {
    setIsOpened(Boolean(error));

    let timer = 0;

    timer = window.setTimeout(() => {
      handleCloseError();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [error, handleCloseError]);

  return (
    <Alert
      className={cn(
        `fixed bottom-8 left-1/2 z-[50] w-4/5 -translate-x-1/2
          bg-warning transition-opacity duration-500 sm:max-w-96`,
        isOpened ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div className="mb-2 flex justify-between">
        <AlertTitle className="mb-0 leading-4">Error</AlertTitle>

        <button type="button" onClick={handleCloseError}>
          <X width={20} height={20} aria-hidden />
        </button>
      </div>

      <AlertDescription>
        {error?.message || 'An error occurred'}
      </AlertDescription>
    </Alert>
  );
}
