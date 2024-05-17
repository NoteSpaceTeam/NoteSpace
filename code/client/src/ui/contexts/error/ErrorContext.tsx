import * as React from 'react';
import { useState, createContext, useEffect } from 'react';
import ErrorComponent from '@ui/components/error/Error';

const ERROR_TIMEOUT = 5000;

export type ErrorContextType = {
  publishError: (error: Error) => void;
};

export const ErrorContext = createContext<ErrorContextType>({
  publishError: () => {},
});

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    if (!error) return;
    setTimeout(() => setError(undefined), ERROR_TIMEOUT);
  }, [error]);

  return (
    <ErrorContext.Provider value={{ publishError: setError }}>
      {error && <ErrorComponent error={error} />}
      {children}
    </ErrorContext.Provider>
  );
}
