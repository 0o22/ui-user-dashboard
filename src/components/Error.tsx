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
        `z-[50] fixed w-4/5 left-1/2 -translate-x-1/2 sm:max-w-96
          bottom-8 bg-warning transition-opacity duration-500`,
        isOpened ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div className="flex justify-between mb-2">
        <AlertTitle className="leading-4 mb-0">Error</AlertTitle>

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
