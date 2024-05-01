'use client';

import { type FC, type ReactNode, useCallback, useMemo, useState } from 'react';
import { createContext, useContext } from 'react';

/* eslint-disable no-unused-vars */
interface ErrorContextType {
  error: Error | null;
  setError: (error: Error | null) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType>({
  error: null,
  setError: () => {},
  clearError: () => {},
});

interface ErrorContextProviderProps {
  children: ReactNode;
}

export const ErrorContextProvider: FC<ErrorContextProviderProps> = ({
  children,
}) => {
  const [error, setError] = useState<Error | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: ErrorContextType = useMemo(
    () => ({
      error,
      setError,
      clearError,
    }),
    [error, clearError]
  );

  return (
    <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
  );
};

export const useErrorContext = () => useContext(ErrorContext);
