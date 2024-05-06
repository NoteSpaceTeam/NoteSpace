import { useContext } from 'react';
import { ErrorContext } from '@domain/error/ErrorContext';

function useError() {
  return useContext(ErrorContext);
}

export default useError;
