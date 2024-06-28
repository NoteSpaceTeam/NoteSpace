import * as React from 'react';
import { useState, createContext, useEffect, useCallback } from 'react';
import ErrorComponent from '@ui/components/error/Error';

const ERROR_TIMEOUT = 5000;

export type ErrorHandler = <T>(fn: () => T) => Promise<T>;

type ErrorContextType = {
  publishError: (error: Error) => void;
  errorHandler: ErrorHandler;
};

export const ErrorContext = createContext<ErrorContextType>({
  publishError: () => {},
  errorHandler: async fn => fn(),
});

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | undefined>();

  async function errorHandlerFunction<T>(fn: () => T): Promise<T> {
    try {
      return await fn();
    } catch (e) {
      setError(e as Error);
      throw e;
    }
  }

  const errorHandler = useCallback(errorHandlerFunction, []);

  useEffect(() => {
    if (!error) return;
    console.error(error);
    setTimeout(() => setError(undefined), ERROR_TIMEOUT);
  }, [error]);

  return (
    <ErrorContext.Provider value={{ publishError: setError, errorHandler }}>
      {error && <ErrorComponent error={error} />}
      {children}
    </ErrorContext.Provider>
  );
}
